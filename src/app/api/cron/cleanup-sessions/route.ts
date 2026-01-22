import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardSessions } from "@/lib/db/schema";
import { lt } from "drizzle-orm";

// This endpoint cleans up expired wizard sessions
// Call it via Vercel Cron or manually
// Expired sessions have tokens that are no longer usable but still in the database

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // In production, require CRON_SECRET to be set
  if (!cronSecret) {
    console.error("CRON_SECRET not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete all sessions that have expired
    const result = await db
      .delete(wizardSessions)
      .where(lt(wizardSessions.expiresAt, new Date()))
      .returning({ id: wizardSessions.id });

    const deletedCount = result.length;

    console.log(`Cleanup: Deleted ${deletedCount} expired wizard sessions`);

    return NextResponse.json({
      success: true,
      deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Session cleanup error:", error);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
