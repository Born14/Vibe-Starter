import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { licenseKeys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Generate license key in format: VS-XXXX-XXXX-XXXX (hex only)
function generateLicenseKey(): string {
  const seg1 = Math.random().toString(16).substring(2, 6).toUpperCase();
  const seg2 = Math.random().toString(16).substring(2, 6).toUpperCase();
  const seg3 = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `VS-${seg1}-${seg2}-${seg3}`;
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const email = session.customer_details?.email || "unknown@example.com";

    // Check if we already created a key for this session (prevent duplicates)
    const existingKeys = await db
      .select()
      .from(licenseKeys)
      .where(eq(licenseKeys.email, `stripe:${sessionId}`));

    if (existingKeys.length > 0) {
      // Already processed this session, return existing key
      return NextResponse.json({
        success: true,
        licenseKey: existingKeys[0].key,
        email: email,
      });
    }

    // Generate new license key
    const key = generateLicenseKey();

    // Store in database with session ID to prevent duplicates
    // We store the actual email but use session ID for duplicate check
    await db.insert(licenseKeys).values({
      key: key,
      email: email,
      used: false,
    });

    // Also store a marker with session ID to prevent reprocessing
    await db.insert(licenseKeys).values({
      key: `MARKER-${sessionId.substring(0, 20)}`,
      email: `stripe:${sessionId}`,
      used: true,
    });

    return NextResponse.json({
      success: true,
      licenseKey: key,
      email: email,
    });
  } catch (error) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
