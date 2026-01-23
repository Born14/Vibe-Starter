import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { licenseKeys, wizardSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  rateLimiters,
  getClientIp,
  acquireLock,
  releaseLock,
} from "@/lib/redis";
import { generateCsrfToken, setCsrfCookie } from "@/lib/csrf";
import { captureAPIError } from "@/lib/error-tracking";
import { licenseKeySchema, validateInput } from "@/lib/validation";

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

    // Validate and sanitize input using Zod schema
    const validation = validateInput(licenseKeySchema, key);
    if (!validation.success) {
      return NextResponse.json(
        { valid: false, error: validation.error },
        { status: 400 }
      );
    }

    const sanitizedKey = validation.data;

    // Check if key exists
    const [license] = await db
      .select()
      .from(licenseKeys)
      .where(eq(licenseKeys.key, sanitizedKey))
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
        .where(eq(licenseKeys.key, sanitizedKey))
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

      // Generate CSRF token for this session
      const csrfToken = generateCsrfToken();

      // Create response with CSRF cookie
      const response = NextResponse.json({
        valid: true,
        sessionId: session.id,
        email: license.email,
        csrfToken, // Send token to client so they can include it in headers
      });

      // Set CSRF token in httpOnly cookie
      return setCsrfCookie(response, csrfToken);
    } catch (error) {
      // Make sure to release lock on error
      await releaseLock(lockKey);
      throw error;
    }
  } catch (error) {
    console.error("License validation error:", error);

    // Track error in Sentry
    captureAPIError(error, {
      endpoint: '/api/validate-license',
      method: 'POST',
      statusCode: 500,
    });

    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
