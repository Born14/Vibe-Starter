import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { licenseKeys, wizardSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isValidLicenseKeyFormat } from "@/lib/license";
import {
  rateLimiters,
  getClientIp,
  acquireLock,
  releaseLock,
} from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 attempts per 10 minutes per IP
    const ip = getClientIp(request);
    const { success, reset } = await rateLimiters.validateLicense.limit(ip);

    if (!success) {
      const resetDate = new Date(reset);
      return NextResponse.json(
        {
          valid: false,
          error: `Too many validation attempts. Try again after ${resetDate.toLocaleTimeString()}`,
        },
        { status: 429 }
      );
    }

    const { key } = await request.json();

    // Validate format
    if (!key || !isValidLicenseKeyFormat(key)) {
      return NextResponse.json(
        { valid: false, error: "Invalid license key format" },
        { status: 400 }
      );
    }

    // Check if key exists
    const [license] = await db
      .select()
      .from(licenseKeys)
      .where(eq(licenseKeys.key, key))
      .limit(1);

    if (!license) {
      return NextResponse.json(
        { valid: false, error: "License key not found" },
        { status: 404 }
      );
    }

    // Acquire distributed lock to prevent race condition
    const lockKey = `license:${license.id}`;
    const lockAcquired = await acquireLock(lockKey, 5000);

    if (!lockAcquired) {
      return NextResponse.json(
        {
          valid: false,
          error: "This license key is currently being validated. Please try again in a few seconds.",
        },
        { status: 409 }
      );
    }

    try {
      // Re-check if already used (within lock)
      const [currentLicense] = await db
        .select()
        .from(licenseKeys)
        .where(eq(licenseKeys.key, key))
        .limit(1);

      if (currentLicense.used) {
        await releaseLock(lockKey);
        return NextResponse.json(
          { valid: false, error: "License key has already been used" },
          { status: 400 }
        );
      }

      // Create wizard session (expires in 24 hours)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const [session] = await db
        .insert(wizardSessions)
        .values({
          licenseKeyId: license.id,
          expiresAt,
        })
        .returning();

      // Release lock
      await releaseLock(lockKey);

      return NextResponse.json({
        valid: true,
        sessionId: session.id,
        email: license.email,
      });
    } catch (error) {
      // Make sure to release lock on error
      await releaseLock(lockKey);
      throw error;
    }
  } catch (error) {
    console.error("License validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
