import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { licenseKeys } from "@/lib/db/schema";
import { generateLicenseKey } from "@/lib/license";

// Gumroad sends a POST request when a sale is made
// https://gumroad.com/ping
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Gumroad sends data as form-urlencoded
    const email = formData.get("email") as string;
    const productId = formData.get("product_id") as string;
    const saleId = formData.get("sale_id") as string;
    const sellerEmail = formData.get("seller_id") as string;

    // Basic validation
    if (!email || !saleId) {
      console.error("Missing required fields from Gumroad webhook");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique license key
    let licenseKey = generateLicenseKey();

    // Ensure uniqueness (unlikely collision but good practice)
    let attempts = 0;
    while (attempts < 5) {
      const existing = await db.query.licenseKeys.findFirst({
        where: (keys, { eq }) => eq(keys.key, licenseKey),
      });
      if (!existing) break;
      licenseKey = generateLicenseKey();
      attempts++;
    }

    // Store license key
    await db.insert(licenseKeys).values({
      key: licenseKey,
      email: email.toLowerCase(),
    });

    console.log(`License key created for ${email}: ${licenseKey}`);

    // Gumroad expects a 200 response
    // The license key will be sent to the user via Gumroad's email
    // (configure this in Gumroad product settings using {license_key})
    return NextResponse.json({
      success: true,
      license_key: licenseKey,
    });
  } catch (error) {
    console.error("Gumroad webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Gumroad may send a GET request to verify endpoint
export async function GET() {
  return NextResponse.json({ status: "Gumroad webhook endpoint active" });
}
