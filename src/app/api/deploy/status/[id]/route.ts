import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deployments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [deployment] = await db
      .select()
      .from(deployments)
      .where(eq(deployments.id, id))
      .limit(1);

    if (!deployment) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
    }

    // Parse step from error field (temporary hack)
    let step = 0;
    if (deployment.error?.startsWith("step:")) {
      step = parseInt(deployment.error.split(":")[1], 10);
    }

    const response: {
      status: string;
      step: number;
      appUrl?: string;
      repoUrl?: string;
      error?: string;
    } = {
      status: deployment.status,
      step,
    };

    if (deployment.status === "success") {
      response.appUrl = `https://${deployment.appName}.vercel.app`;
      response.repoUrl = `https://github.com/${deployment.githubRepo}`;
    }

    if (deployment.status === "failed" && deployment.error && !deployment.error.startsWith("step:")) {
      response.error = deployment.error;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
