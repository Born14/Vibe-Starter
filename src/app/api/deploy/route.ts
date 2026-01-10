import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardSessions, deployments, licenseKeys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Get session with all required data
    const [session] = await db
      .select()
      .from(wizardSessions)
      .where(eq(wizardSessions.id, sessionId))
      .limit(1);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify all required fields
    if (
      !session.githubToken ||
      !session.vercelToken ||
      !session.clerkPublishable ||
      !session.clerkSecret ||
      !session.databaseUrl ||
      !session.aiKey ||
      !session.appName
    ) {
      return NextResponse.json(
        { error: "Missing required configuration. Please complete all steps." },
        { status: 400 }
      );
    }

    // Create deployment record
    const [deployment] = await db
      .insert(deployments)
      .values({
        licenseKeyId: session.licenseKeyId,
        appName: session.appName,
        status: "deploying",
      })
      .returning();

    // Start async deployment (non-blocking)
    startDeployment(deployment.id, session);

    return NextResponse.json({
      deploymentId: deployment.id,
      status: "deploying",
    });
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function startDeployment(deploymentId: string, session: typeof wizardSessions.$inferSelect) {
  try {
    // Decrypt tokens
    const githubToken = decrypt(session.githubToken!);
    const vercelToken = decrypt(session.vercelToken!);
    const clerkPublishable = decrypt(session.clerkPublishable!);
    const clerkSecret = decrypt(session.clerkSecret!);
    const databaseUrl = decrypt(session.databaseUrl!);
    const aiKey = decrypt(session.aiKey!);

    // Step 1: Create GitHub repo
    await updateDeploymentStep(deploymentId, 1);

    const repoResponse = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: session.appName,
        description: "Created with Vibe Starter",
        private: false,
        auto_init: false,
      }),
    });

    if (!repoResponse.ok && repoResponse.status !== 422) {
      // 422 means repo exists
      throw new Error("Failed to create GitHub repository");
    }

    const repoData = await repoResponse.json();
    const repoFullName = repoData.full_name || `${repoData.owner?.login}/${session.appName}`;
    const repoUrl = repoData.html_url || `https://github.com/${repoFullName}`;

    // Update deployment with repo info
    await db
      .update(deployments)
      .set({ githubRepo: repoFullName })
      .where(eq(deployments.id, deploymentId));

    // Step 2: Push template code
    await updateDeploymentStep(deploymentId, 2);

    // Get the template files and push them
    // For now, we'll create a minimal starter - in production, this would clone from a template repo
    await pushTemplateCode(githubToken, repoFullName, session.appName!);

    // Step 3: Create Vercel project
    await updateDeploymentStep(deploymentId, 3);

    const vercelProjectResponse = await fetch("https://api.vercel.com/v9/projects", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: session.appName,
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: repoFullName,
        },
      }),
    });

    if (!vercelProjectResponse.ok) {
      const errorData = await vercelProjectResponse.json();
      console.error("Vercel project creation failed:", errorData);
      throw new Error("Failed to create Vercel project");
    }

    const vercelProject = await vercelProjectResponse.json();

    // Update deployment with Vercel info
    await db
      .update(deployments)
      .set({ vercelProject: vercelProject.id })
      .where(eq(deployments.id, deploymentId));

    // Step 4: Set environment variables
    await updateDeploymentStep(deploymentId, 4);

    const envVars = [
      { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", value: clerkPublishable },
      { key: "CLERK_SECRET_KEY", value: clerkSecret },
      { key: "DATABASE_URL", value: databaseUrl },
      { key: `${session.aiProvider?.toUpperCase() || "CLAUDE"}_API_KEY`, value: aiKey },
    ];

    for (const envVar of envVars) {
      await fetch(`https://api.vercel.com/v10/projects/${vercelProject.id}/env`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: envVar.key,
          value: envVar.value,
          type: "encrypted",
          target: ["production", "preview", "development"],
        }),
      });
    }

    // Step 5: Setup database tables (trigger via first deploy)
    await updateDeploymentStep(deploymentId, 5);

    // Step 6: Trigger deploy
    await updateDeploymentStep(deploymentId, 6);

    // Deploy is triggered automatically by Vercel when connected to GitHub
    // Wait for it to complete
    let deploymentComplete = false;
    let attempts = 0;

    while (!deploymentComplete && attempts < 30) {
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const deploymentsRes = await fetch(
        `https://api.vercel.com/v6/deployments?projectId=${vercelProject.id}&limit=1`,
        {
          headers: { Authorization: `Bearer ${vercelToken}` },
        }
      );

      const deploymentsData = await deploymentsRes.json();
      const latestDeployment = deploymentsData.deployments?.[0];

      if (latestDeployment?.readyState === "READY") {
        deploymentComplete = true;
      } else if (latestDeployment?.readyState === "ERROR") {
        throw new Error("Vercel deployment failed");
      }

      attempts++;
    }

    // Step 7: Final checks
    await updateDeploymentStep(deploymentId, 7);

    const appUrl = `https://${session.appName}.vercel.app`;

    // Verify app is accessible
    const verifyResponse = await fetch(appUrl);
    if (!verifyResponse.ok) {
      console.warn("App verification returned non-200, but continuing...");
    }

    // Mark deployment as successful
    await db
      .update(deployments)
      .set({
        status: "success",
        completedAt: new Date(),
      })
      .where(eq(deployments.id, deploymentId));

    // Mark license as used
    await db
      .update(licenseKeys)
      .set({
        used: true,
        usedAt: new Date(),
      })
      .where(eq(licenseKeys.id, session.licenseKeyId));

    // Delete sensitive session data
    await db
      .update(wizardSessions)
      .set({
        githubToken: null,
        vercelToken: null,
        clerkPublishable: null,
        clerkSecret: null,
        databaseUrl: null,
        aiKey: null,
      })
      .where(eq(wizardSessions.id, session.id));

  } catch (error) {
    console.error("Deployment failed:", error);
    await db
      .update(deployments)
      .set({
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      })
      .where(eq(deployments.id, deploymentId));
  }
}

async function updateDeploymentStep(deploymentId: string, step: number) {
  // Store current step in deployment for status polling
  // We'll use a simple approach - store in the error field temporarily
  // In production, add a dedicated step column
  await db
    .update(deployments)
    .set({ error: `step:${step}` })
    .where(eq(deployments.id, deploymentId));
}

async function pushTemplateCode(githubToken: string, repoFullName: string, appName: string) {
  // Template files to push (simplified starter)
  const files = [
    {
      path: "package.json",
      content: JSON.stringify({
        name: appName,
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
          "db:push": "drizzle-kit push",
        },
        dependencies: {
          "@clerk/nextjs": "^5.0.0",
          "@neondatabase/serverless": "^0.9.0",
          "drizzle-orm": "^0.30.0",
          next: "15.0.0",
          react: "^18.3.0",
          "react-dom": "^18.3.0",
        },
        devDependencies: {
          "@tailwindcss/postcss": "^4.0.0",
          "@types/node": "^20.0.0",
          "@types/react": "^18.3.0",
          "@types/react-dom": "^18.3.0",
          "drizzle-kit": "^0.21.0",
          tailwindcss: "^4.0.0",
          typescript: "^5.0.0",
        },
      }, null, 2),
    },
    {
      path: "PROMPT.md",
      content: `# ${appName}

## Stack
- Framework: Next.js 15 (App Router)
- Auth: Clerk
- Database: Neon Postgres + Drizzle ORM
- Styling: Tailwind CSS

## Project Structure
\`\`\`
src/
├── app/
│   ├── api/          # API routes
│   ├── dashboard/    # Protected pages
│   ├── sign-in/      # Auth pages
│   ├── sign-up/
│   ├── layout.tsx    # Root layout with Clerk
│   └── page.tsx      # Landing page
├── components/       # React components
└── lib/
    └── db/           # Database schema
\`\`\`

## How to Add Features

### Add a new page
Create a new file at \`src/app/[page-name]/page.tsx\`

### Add a database table
Edit \`src/lib/db/schema.ts\` and run \`npm run db:push\`

### Add an API route
Create a new file at \`src/app/api/[route-name]/route.ts\`

## Current Database Schema
Check \`src/lib/db/schema.ts\` for current tables.

## Rules
- Always use server components unless you need interactivity
- Use \`"use client"\` directive for interactive components
- Protect routes with Clerk middleware
- Use Tailwind for styling
`,
    },
    {
      path: "README.md",
      content: `# ${appName}

Created with [Vibe Starter](https://vibestarter.app)

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Build from Your Phone

1. Open Claude on your phone
2. Paste the contents of PROMPT.md
3. Describe what you want to build
4. Push to GitHub
5. Site updates automatically!
`,
    },
  ];

  // Create initial commit with all files
  // First, get the default branch
  const repoRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  // Create blobs for each file
  const blobs = await Promise.all(
    files.map(async (file) => {
      const blobRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/blobs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: Buffer.from(file.content).toString("base64"),
          encoding: "base64",
        }),
      });
      const blobData = await blobRes.json();
      return { path: file.path, sha: blobData.sha };
    })
  );

  // Create tree
  const treeRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tree: blobs.map((blob) => ({
        path: blob.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      })),
    }),
  });
  const treeData = await treeRes.json();

  // Create commit
  const commitRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Initial commit from Vibe Starter",
      tree: treeData.sha,
    }),
  });
  const commitData = await commitRes.json();

  // Update main branch reference
  await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/main`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: "refs/heads/main",
      sha: commitData.sha,
    }),
  });
}
