import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { licenseKeys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { randomBytes } from "crypto";

// Lazy initialization to avoid errors during build when env vars aren't available
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
  });
}

function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql);
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

async function sendLicenseKeyEmail(to: string, licenseKey: string) {
  const resend = getResend();
  try {
    await resend.emails.send({
      from: "Vibe Starter <noreply@vibestarter.net>",
      to: to,
      subject: "Your Vibe Starter License Key",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">You're in!</h1>
          <p style="color: #666; margin-bottom: 24px;">Here's your Vibe Starter license key. Keep it safe.</p>
          <div style="background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 12px; color: #888; text-transform: uppercase; margin-bottom: 8px;">Your License Key</p>
            <code style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${licenseKey}</code>
          </div>
          <a href="https://vibestarter.net/setup" style="display: block; background: black; color: white; text-align: center; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: bold;">Continue to Setup</a>
          <p style="color: #888; font-size: 12px; margin-top: 24px; text-align: center;">Lost your key? Just reply to this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    // Don't throw - email failure shouldn't block the flow
  }
}

// Generate license key in format: VS-XXXX-XXXX-XXXX (hex only, cryptographically secure)
function generateLicenseKey(): string {
  const bytes = randomBytes(6); // 6 bytes = 12 hex chars
  const hex = bytes.toString("hex").toUpperCase();
  return `VS-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const db = getDb();

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

    // Send license key via email
    if (email !== "unknown@example.com") {
      await sendLicenseKeyEmail(email, key);
    }

    return NextResponse.json({
      success: true,
      licenseKey: key,
      email: email,
      emailSent: email !== "unknown@example.com",
    });
  } catch (error) {
    console.error("Stripe session error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
