import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deployments, wizardSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";

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

    // If status is "building", poll Vercel to check if deployment is ready
    if (deployment.status === "building" && deployment.vercelProject) {
      // Get the session to access the Vercel token
      const [session] = await db
        .select()
        .from(wizardSessions)
        .where(eq(wizardSessions.licenseKeyId, deployment.licenseKeyId))
        .limit(1);

      if (session?.vercelToken) {
        try {
          const vercelToken = decrypt(session.vercelToken);

          const deploymentsRes = await fetch(
            `https://api.vercel.com/v6/deployments?projectId=${deployment.vercelProject}&limit=1`,
            {
              headers: { Authorization: `Bearer ${vercelToken}` },
            }
          );

          if (deploymentsRes.ok) {
            const deploymentsData = await deploymentsRes.json();
            const latestDeployment = deploymentsData.deployments?.[0];

            // Check both readyState and state fields - Vercel API may return either
            const isReady = latestDeployment?.readyState === "READY" || latestDeployment?.state === "READY";
            const isError = latestDeployment?.readyState === "ERROR" || latestDeployment?.state === "ERROR";

            if (isReady) {
              // Get the production domain from alias array (e.g., artios-ten.vercel.app)
              // The 'url' field is deployment-specific (includes hash), 'alias' has clean domains
              // Pick the shortest alias ending in .vercel.app (usually the production domain)
              const vercelAliases = (latestDeployment.alias || []).filter(
                (a: string) => a.endsWith('.vercel.app')
              );
              const productionAlias = vercelAliases.length > 0
                ? vercelAliases.reduce((shortest: string, current: string) =>
                    current.length < shortest.length ? current : shortest
                  )
                : `${deployment.appName}.vercel.app`;
              const actualUrl = `https://${productionAlias}`;

              // Deployment is complete! Update DB and clean up
              await db
                .update(deployments)
                .set({
                  status: "success",
                  appUrl: actualUrl,
                  completedAt: new Date(),
                })
                .where(eq(deployments.id, id));

              // Clean up wizard session completely - no longer needed
              await db
                .delete(wizardSessions)
                .where(eq(wizardSessions.id, session.id));

              return NextResponse.json({
                status: "success",
                step: 7,
                appUrl: actualUrl,
                repoUrl: `https://github.com/${deployment.githubRepo}`,
              });
            } else if (isError) {
              // Deployment failed
              await db
                .update(deployments)
                .set({
                  status: "failed",
                  error: "Vercel deployment failed",
                  completedAt: new Date(),
                })
                .where(eq(deployments.id, id));

              return NextResponse.json({
                status: "failed",
                step: 6,
                error: "Vercel deployment failed. Check Vercel dashboard for details.",
              });
            } else {
              // Still building - return step 6 (deploying)
              return NextResponse.json({
                status: "building",
                step: 6,
              });
            }
          }
        } catch (pollError) {
          console.error("Error polling Vercel:", pollError);
          // Continue with normal response if polling fails
        }
      }
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
      // Use stored appUrl if available, fallback to constructed URL
      response.appUrl = deployment.appUrl || `https://${deployment.appName}.vercel.app`;
      response.repoUrl = `https://github.com/${deployment.githubRepo}`;
      response.step = 7; // Ensure step 7 is returned for success state
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
