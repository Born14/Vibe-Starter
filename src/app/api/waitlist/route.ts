import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { waitlist } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email format
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await db.query.waitlist.findFirst({
      where: (w, { eq }) => eq(w.email, normalizedEmail),
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You're already on the waitlist!",
      });
    }

    // Add to waitlist
    await db.insert(waitlist).values({
      email: normalizedEmail,
    });

    return NextResponse.json({
      success: true,
      message: "Thanks! We'll notify you when we launch.",
    });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
