import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, appName } = await request.json();

    if (!sessionId || !appName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate app name format
    if (!/^[a-z0-9-]{3,50}$/.test(appName)) {
      return NextResponse.json({
        available: false,
        error: "App name must be 3-50 characters, lowercase letters, numbers, and hyphens only",
      });
    }

    // Get session to retrieve Vercel token
    const [session] = await db
      .select()
      .from(wizardSessions)
      .where(eq(wizardSessions.id, sessionId))
      .limit(1);

    if (!session || !session.vercelToken) {
      return NextResponse.json({ error: "Session not found or Vercel not connected" }, { status: 400 });
    }

    // Decrypt Vercel token
    const vercelToken = decrypt(session.vercelToken);

    // Check if project name is available on Vercel
    const checkResponse = await fetch(`https://api.vercel.com/v9/projects/${appName}`, {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    });

    // 404 means the name is available
    if (checkResponse.status === 404) {
      return NextResponse.json({
        available: true,
        preview: `${appName}.vercel.app`,
      });
    }

    // If we get the project, it already exists
    if (checkResponse.ok) {
      return NextResponse.json({
        available: false,
        error: "This app name is already taken on your Vercel account",
      });
    }

    // Other errors
    return NextResponse.json({
      available: false,
      error: "Could not verify app name availability",
    });
  } catch (error) {
    console.error("App name check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
