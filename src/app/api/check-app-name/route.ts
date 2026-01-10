import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { appName } = await request.json();

    if (!appName) {
      return NextResponse.json({ error: "Missing app name" }, { status: 400 });
    }

    // Validate app name format
    if (!/^[a-z0-9-]{3,50}$/.test(appName)) {
      return NextResponse.json({
        available: false,
        error: "App name must be 3-50 characters, lowercase letters, numbers, and hyphens only",
      });
    }

    // Since we use manual Vercel deployment, we can't check availability via API
    // Just validate the format and let the user proceed
    return NextResponse.json({
      available: true,
      preview: `${appName}.vercel.app`,
    });
  } catch (error) {
    console.error("App name check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
