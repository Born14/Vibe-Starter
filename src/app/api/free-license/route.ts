import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { licenseKeys } from "@/lib/db/schema";
import { rateLimiters, getClientIp } from "@/lib/redis";
import { captureAPIError } from "@/lib/error-tracking";
import { randomBytes } from "crypto";

// Generate license key in format: VS-XXXX-XXXX-XXXX (hex only, cryptographically secure)
function generateLicenseKey(): string {
  const bytes = randomBytes(6); // 6 bytes = 12 hex chars
  const hex = bytes.toString("hex").toUpperCase();
  return `VS-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 keys per 10 minutes per IP
    const ip = getClientIp(request);
    const { success, reset } = await rateLimiters.freeLicense.limit(ip);

    if (!success) {
      const resetDate = new Date(reset);
      return NextResponse.json(
        {
          error: `Too many requests. Try again after ${resetDate.toLocaleTimeString()}`,
        },
        { status: 429 }
      );
    }

    const [license] = await db
      .insert(licenseKeys)
      .values({
        key: generateLicenseKey(),
        email: "free@vibestarter.net",
      })
      .returning();

    return NextResponse.json({ key: license.key });
  } catch (error) {
    console.error("Free license generation error:", error);

    captureAPIError(error, {
      endpoint: "/api/free-license",
      method: "POST",
      statusCode: 500,
    });

    return NextResponse.json(
      { error: "Could not generate a license key. Please try again." },
      { status: 500 }
    );
  }
}
