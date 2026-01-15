import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { licenseKeys, wizardSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isValidLicenseKeyFormat } from "@/lib/license";

export async function POST(request: NextRequest) {
  try {
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

    // Check if already used
    if (license.used) {
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

    return NextResponse.json({
      valid: true,
      sessionId: session.id,
      email: license.email,
    });
  } catch (error) {
    console.error("License validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
