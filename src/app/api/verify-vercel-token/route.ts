import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token required" }, { status: 400 });
    }

    // Test the token by fetching user info
    const response = await fetch("https://api.vercel.com/v2/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 400 });
    }

    const userData = await response.json();

    return NextResponse.json({
      valid: true,
      username: userData.user?.username || userData.user?.name || "connected",
    });
  } catch (error) {
    console.error("Vercel token verification error:", error);
    return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 500 });
  }
}
