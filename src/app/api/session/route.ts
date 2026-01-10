import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardSessions } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

// Get session status
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("id");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  try {
    const [session] = await db
      .select({
        id: wizardSessions.id,
        currentStep: wizardSessions.currentStep,
        hasGithub: wizardSessions.githubToken,
        hasVercel: wizardSessions.vercelToken,
        hasClerk: wizardSessions.clerkPublishable,
        hasNeon: wizardSessions.databaseUrl,
        hasAi: wizardSessions.aiKey,
        appName: wizardSessions.appName,
        expiresAt: wizardSessions.expiresAt,
      })
      .from(wizardSessions)
      .where(
        and(
          eq(wizardSessions.id, sessionId),
          gt(wizardSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!session) {
      return NextResponse.json({ error: "Session not found or expired" }, { status: 404 });
    }

    return NextResponse.json({
      id: session.id,
      currentStep: session.currentStep,
      hasGithub: !!session.hasGithub,
      hasVercel: !!session.hasVercel,
      hasClerk: !!session.hasClerk,
      hasNeon: !!session.hasNeon,
      hasAi: !!session.hasAi,
      appName: session.appName,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update session (for manual key entry steps)
export async function POST(request: NextRequest) {
  try {
    const { sessionId, field, value } = await request.json();

    if (!sessionId || !field) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Import encrypt dynamically to avoid issues
    const { encrypt } = await import("@/lib/encryption");

    // Map field names to database columns and validation
    const fieldMap: Record<string, { column: keyof typeof wizardSessions.$inferInsert; validate?: (v: string) => boolean }> = {
      vercelToken: {
        column: "vercelToken",
        validate: (v) => v.length > 10, // Vercel tokens are long strings
      },
      clerkPublishable: {
        column: "clerkPublishable",
        validate: (v) => v.startsWith("pk_test_") || v.startsWith("pk_live_"),
      },
      clerkSecret: {
        column: "clerkSecret",
        validate: (v) => v.startsWith("sk_test_") || v.startsWith("sk_live_"),
      },
      databaseUrl: {
        column: "databaseUrl",
        validate: (v) => v.startsWith("postgresql://") && v.includes("neon.tech"),
      },
      aiKey: {
        column: "aiKey",
        validate: (v) => v.startsWith("sk-ant-") || v.startsWith("AIza"), // Claude or Gemini
      },
      aiProvider: {
        column: "aiProvider",
        validate: (v) => ["claude", "gemini", "openai"].includes(v),
      },
      appName: {
        column: "appName",
        validate: (v) => /^[a-z0-9-]{3,50}$/.test(v),
      },
    };

    const fieldConfig = fieldMap[field];
    if (!fieldConfig) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    // Validate if validator exists
    if (fieldConfig.validate && !fieldConfig.validate(value)) {
      return NextResponse.json({ error: `Invalid ${field} format` }, { status: 400 });
    }

    // Encrypt sensitive fields
    const sensitiveFields = ["vercelToken", "clerkPublishable", "clerkSecret", "databaseUrl", "aiKey"];
    const finalValue = sensitiveFields.includes(field) ? encrypt(value) : value;

    // Update the session
    await db
      .update(wizardSessions)
      .set({ [fieldConfig.column]: finalValue })
      .where(eq(wizardSessions.id, sessionId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
