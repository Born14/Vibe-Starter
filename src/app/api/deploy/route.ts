import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardSessions, deployments, licenseKeys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";
import { rateLimiters, getClientIp } from "@/lib/redis";

// Reduced timeout since we return early and let frontend poll Vercel
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 deploys per hour per IP
    const ip = getClientIp(request);
    const { success, reset } = await rateLimiters.deploy.limit(ip);

    if (!success) {
      const resetDate = new Date(reset);
      return NextResponse.json(
        {
          error: `Deployment rate limit exceeded. You can deploy again after ${resetDate.toLocaleTimeString()}`,
        },
        { status: 429 }
      );
    }

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

    console.log("Session retrieved for deployment:", {
      hasGithubToken: !!session.githubToken,
      hasVercelToken: !!session.vercelToken,
      hasClerkPublishable: !!session.clerkPublishable,
      hasClerkSecret: !!session.clerkSecret,
      hasDatabaseUrl: !!session.databaseUrl,
      hasAiKey: !!session.aiKey,
      aiProvider: session.aiProvider, // Show actual value
      appName: session.appName,
      currentStep: session.currentStep,
    });

    // Verify all required fields (AI is optional)
    if (
      !session.githubToken ||
      !session.vercelToken ||
      !session.clerkPublishable ||
      !session.clerkSecret ||
      !session.databaseUrl ||
      !session.appName
    ) {
      console.error("Missing session fields:", {
        hasGithubToken: !!session.githubToken,
        hasVercelToken: !!session.vercelToken,
        hasClerkPublishable: !!session.clerkPublishable,
        hasClerkSecret: !!session.clerkSecret,
        hasDatabaseUrl: !!session.databaseUrl,
        hasAiKey: !!session.aiKey,
        aiProvider: session.aiProvider,
        hasAppName: !!session.appName,
      });
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

    // Run deployment and wait for it (maxDuration=60s covers this)
    // We must await or Vercel will kill the function after returning
    await startDeployment(deployment.id, session);

    // Get final status
    const [finalDeployment] = await db
      .select()
      .from(deployments)
      .where(eq(deployments.id, deployment.id))
      .limit(1);

    return NextResponse.json({
      deploymentId: deployment.id,
      status: finalDeployment?.status || "deploying",
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

    // AI is optional - only decrypt if provided
    const aiKey = session.aiKey ? decrypt(session.aiKey) : null;
    const aiProvider = session.aiProvider || "claude";

    console.log(`Starting deployment - Session AI data:`, {
      sessionAiProvider: session.aiProvider,
      resolvedAiProvider: aiProvider,
      hasAiKey: !!session.aiKey,
      aiKeyLength: aiKey?.length || 0,
    });

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

    const repoData = await repoResponse.json();

    if (!repoResponse.ok && repoResponse.status !== 422) {
      console.error("GitHub repo creation failed:", repoData);
      throw new Error("Failed to create GitHub repository");
    }

    // Get GitHub username to construct repo full name
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const userData = await userResponse.json();
    const repoFullName = repoData.full_name || `${userData.login}/${session.appName}`;
    const repoId = repoData.id; // Numeric GitHub repo ID needed for Vercel API

    console.log("Repo full name:", repoFullName, "Repo ID:", repoId);

    // Update deployment with repo info
    await db
      .update(deployments)
      .set({ githubRepo: repoFullName })
      .where(eq(deployments.id, deploymentId));

    // Step 2: Push template code
    await updateDeploymentStep(deploymentId, 2);

    await pushTemplateCode(githubToken, repoFullName, session.appName!, aiProvider, !!aiKey);

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

    // Explicitly set production branch to 'main' for auto-deployment
    // This ensures all pushes to main trigger production deployments
    try {
      await fetch(`https://api.vercel.com/v9/projects/${vercelProject.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productionBranch: "main",
          autoExposeSystemEnvs: true, // Expose VERCEL_* env vars
        }),
      });
    } catch (error) {
      console.error("Failed to set production branch (non-fatal):", error);
      // Don't throw - the project still works, just log the error
    }

    // Step 4: Set environment variables
    await updateDeploymentStep(deploymentId, 4);

    const envVars = [
      { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", value: clerkPublishable },
      { key: "CLERK_SECRET_KEY", value: clerkSecret },
      { key: "NEXT_PUBLIC_CLERK_SIGN_IN_URL", value: "/sign-in" },
      { key: "NEXT_PUBLIC_CLERK_SIGN_UP_URL", value: "/sign-up" },
      { key: "DATABASE_URL", value: databaseUrl },
      { key: "VERCEL_PROJECT_ID", value: vercelProject.id },
      { key: "VERCEL_TOKEN", value: vercelToken },
    ];

    // Add AI env var only if configured
    if (aiKey) {
      const aiKeyName =
        aiProvider === "gemini" ? "GOOGLE_GENERATIVE_AI_API_KEY" :
        aiProvider === "openai" ? "OPENAI_API_KEY" :
        "ANTHROPIC_API_KEY";

      console.log(`Setting AI provider: ${aiProvider}, key name: ${aiKeyName}`);
      envVars.push({ key: aiKeyName, value: aiKey });
    } else {
      console.log("AI was skipped - no AI env vars will be set");
    }

    for (const envVar of envVars) {
      if (!envVar.value) {
        console.error(`Skipping env var ${envVar.key} - value is empty`);
        continue;
      }

      console.log(`Setting env var: ${envVar.key}`);
      const envRes = await fetch(`https://api.vercel.com/v10/projects/${vercelProject.id}/env`, {
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

      if (!envRes.ok) {
        const errorData = await envRes.json();
        console.error(`Failed to set env var ${envVar.key}:`, errorData);
        // Don't throw - continue with other vars, but log the error
      } else {
        console.log(`Successfully set env var: ${envVar.key}`);
      }
    }

    // Step 5: Trigger deployment explicitly
    await updateDeploymentStep(deploymentId, 5);

    // Trigger a deployment from the GitHub repo
    // The gitRepository link doesn't always auto-trigger the first build
    const deployTriggerRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: session.appName,
        project: vercelProject.id,
        gitSource: {
          type: "github",
          repoId: repoId, // Numeric repo ID required by Vercel API
          ref: "main",
        },
        target: "production",
      }),
    });

    if (!deployTriggerRes.ok) {
      const errorData = await deployTriggerRes.json();
      console.error("Failed to trigger deployment:", errorData);
      // Don't throw - the webhook might still trigger it
    } else {
      console.log("Deployment triggered successfully");
    }

    // Store that we're now waiting for Vercel to build
    // The frontend will poll the status endpoint which checks Vercel directly
    await db
      .update(deployments)
      .set({
        status: "building",
        // Store vercel project ID for status polling
        vercelProject: vercelProject.id,
      })
      .where(eq(deployments.id, deploymentId));

    // Mark license as used now (deployment is essentially complete on our end)
    await db
      .update(licenseKeys)
      .set({
        used: true,
        usedAt: new Date(),
      })
      .where(eq(licenseKeys.id, session.licenseKeyId));

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
  await db
    .update(deployments)
    .set({ error: `step:${step}` })
    .where(eq(deployments.id, deploymentId));
}

function getTemplateFiles(appName: string, aiProvider: string, hasAI: boolean, repoFullName: string): { path: string; content: string }[] {
  const aiKeyName = aiProvider === "gemini" ? "GOOGLE_GENERATIVE_AI_API_KEY" : aiProvider === "openai" ? "OPENAI_API_KEY" : "ANTHROPIC_API_KEY";

  return [
    // package.json
    {
      path: "package.json",
      content: JSON.stringify({
        name: appName,
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "drizzle-kit push && next build",
          start: "next start",
          lint: "next lint",
          "db:push": "drizzle-kit push",
          "db:studio": "drizzle-kit studio",
        },
        dependencies: {
          "@clerk/nextjs": "^5.7.0",
          "@neondatabase/serverless": "^0.10.0",
          "drizzle-orm": "^0.36.0",
          next: "15.2.8",
          react: "^18.3.1",
          "react-dom": "^18.3.1",
        },
        devDependencies: {
          "@types/node": "^22.0.0",
          "@types/react": "^18.3.0",
          "@types/react-dom": "^18.3.0",
          "drizzle-kit": "^0.28.0",
          postcss: "^8.4.49",
          tailwindcss: "^3.4.15",
          typescript: "^5.6.0",
        },
      }, null, 2),
    },

    // tsconfig.json
    {
      path: "tsconfig.json",
      content: JSON.stringify({
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./src/*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      }, null, 2),
    },

    // next.config.ts
    {
      path: "next.config.ts",
      content: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add config options here
};

export default nextConfig;
`,
    },

    // tailwind.config.ts
    {
      path: "tailwind.config.ts",
      content: `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
`,
    },

    // postcss.config.mjs
    {
      path: "postcss.config.mjs",
      content: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
`,
    },

    // drizzle.config.ts
    {
      path: "drizzle.config.ts",
      content: `import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
`,
    },

    // .env.example
    {
      path: ".env.example",
      content: `# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (Neon Postgres)
DATABASE_URL=postgresql://...
${hasAI ? `
# AI (Claude, Gemini, or OpenAI)
${aiKeyName}=${aiProvider === "gemini" ? "AIza..." : "sk-..."}` : `
# AI (Optional - Add when needed)
# ${aiKeyName}=your-key-here`}
`,
    },

    // .gitignore
    {
      path: ".gitignore",
      content: `# Dependencies
node_modules
.pnpm-store

# Next.js
.next
out

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode
.idea

# Debug
npm-debug.log*

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
`,
    },

    // src/app/globals.css
    {
      path: "src/app/globals.css",
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, sans-serif;
}
`,
    },

    // src/app/layout.tsx
    {
      path: "src/app/layout.tsx",
      content: `import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "${appName}",
  description: "Built with Vibe Starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-50">{children}</body>
      </html>
    </ClerkProvider>
  );
}
`,
    },

    // src/app/page.tsx (Landing page)
    {
      path: "src/app/page.tsx",
      content: `import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to ${appName}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your app is live! Sign in to get started.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-in"
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
`,
    },

    // src/app/sign-in/[[...sign-in]]/page.tsx
    {
      path: "src/app/sign-in/[[...sign-in]]/page.tsx",
      content: `import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">Sign in to ${appName}</h1>
      <SignIn
        appearance={{
          elements: {
            headerTitle: { display: "none" },
            headerSubtitle: { display: "none" },
          },
        }}
      />
    </main>
  );
}
`,
    },

    // src/app/sign-up/[[...sign-up]]/page.tsx
    {
      path: "src/app/sign-up/[[...sign-up]]/page.tsx",
      content: `import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">Sign up for ${appName}</h1>
      <SignUp
        appearance={{
          elements: {
            headerTitle: { display: "none" },
            headerSubtitle: { display: "none" },
          },
        }}
      />
    </main>
  );
}
`,
    },

    // src/components/QuickWinIdeas.tsx
    {
      path: "src/components/QuickWinIdeas.tsx",
      content: `"use client";

export function QuickWinIdeas() {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
        What do you want to build?
      </h3>
      <p className="text-gray-600 mb-6 text-center">
        Open Claude and describe your idea. It knows your stack.
      </p>
      <div className="text-center">
        <a
          href="https://claude.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full sm:w-auto px-8 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          Start Building →
        </a>
        <p className="text-xs text-gray-500 mt-3">
          Your app has: Database • Auth • AI • Auto-deployment
        </p>
      </div>
    </div>
  );
}
`,
    },

    // src/app/dashboard/page.tsx
    {
      path: "src/app/dashboard/page.tsx",
      content: `import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { QuickWinIdeas } from "@/components/QuickWinIdeas";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">${appName}</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Welcome to ${appName}
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Your app is live. You're logged in.
          </p>
        </div>

        {/* What to Build - Now a Client Component */}
        <QuickWinIdeas />

        {/* Setup Status Check */}
        <div className="bg-green-50 rounded-xl p-6 mb-8 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
            <span className="text-xl">✓</span> Everything is Ready
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-lg">✓</span>
              <div>
                <div className="font-medium text-gray-900">Authentication</div>
                <div className="text-xs text-gray-600">Clerk • You're logged in!</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-lg">✓</span>
              <div>
                <div className="font-medium text-gray-900">Database</div>
                <div className="text-xs text-gray-600">Neon Postgres • Connected</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-lg">✓</span>
              <div>
                <div className="font-medium text-gray-900">Hosting</div>
                <div className="text-xs text-gray-600">Vercel • Auto-deploys on push</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="${hasAI ? 'text-green-600' : 'text-gray-400'} text-lg">${hasAI ? '✓' : '○'}</span>
              <div>
                <div className="font-medium text-gray-900">AI ${hasAI ? 'Ready' : '(Optional)'}</div>
                <div className="text-xs text-gray-600">${hasAI ? `${aiProvider === "gemini" ? "Gemini" : aiProvider === "openai" ? "OpenAI" : "Claude"} • API configured` : 'Add via Vercel env vars when needed'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <span className="text-green-600 text-lg">✓</span>
              <div className="flex-1 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-medium text-gray-900">Deployment Logs</div>
                  <div className="text-xs text-gray-600">Build & runtime logs available</div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="/logs?tab=build"
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Build Logs
                  </a>
                  <a
                    href="/logs?tab=runtime"
                    className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Runtime Logs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Domain Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 mb-8 border border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🌐</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Want Your Own Domain?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your site is live at <code className="bg-white px-2 py-0.5 rounded text-xs">${appName}.vercel.app</code>
                <br />
                Add a custom domain like <strong>yoursite.com</strong> in 5 minutes.
              </p>
              <a
                href="https://vercel.com/docs/projects/domains/add-a-domain"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Add Custom Domain →
              </a>
              <p className="text-xs text-gray-500 mt-3">
                💡 Buy from Vercel or connect one you already own (GoDaddy, Namecheap, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Your Tech Stack */}
        <div className="bg-white rounded-xl border p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">Your Tech Stack</h3>
          <div className="space-y-4 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span>🎨</span>
                <span className="font-medium text-gray-900">Frontend</span>
              </div>
              <p className="text-gray-600 ml-6">
                Next.js UI components → Instantly deployed via Vercel
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span>⚙️</span>
                <span className="font-medium text-gray-900">Backend</span>
              </div>
              <p className="text-gray-600 ml-6">
                API routes + business logic → Serverless functions on Vercel
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span>🗄️</span>
                <span className="font-medium text-gray-900">Database</span>
              </div>
              <p className="text-gray-600 ml-6">
                Postgres with Drizzle ORM → Neon serverless database
              </p>
            </div>
          </div>
        </div>

        {/* What This Means */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 mb-8 border border-blue-100">
          <h3 className="text-sm font-semibold mb-3 text-gray-900 text-center">
            What This Means for You
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">→</span>
              <span><strong className="text-gray-900">Build real products:</strong> Not a toy - this powers actual businesses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">→</span>
              <span><strong className="text-gray-900">No rewrites later:</strong> Start with 10 users, scale to 100K on the same stack</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">→</span>
              <span><strong className="text-gray-900">Free until you profit:</strong> Build and launch without server costs</span>
            </li>
          </ul>
        </div>

        {/* Ready to customize */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
          <p className="text-sm text-gray-700 text-center">
            <strong>Tip:</strong> This dashboard is optional. Replace <code className="bg-white px-2 py-1 rounded text-xs border">src/app/dashboard/page.tsx</code> when you're ready to build your own UI.
          </p>
        </div>

        {/* Building Options */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* Phone Option */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">📱</span> Build from Your Phone
            </h3>
            <p className="text-xs text-gray-600 mb-4 italic">
              Build features → Deploy to production → Test on your live site
            </p>
            <ol className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex gap-2">
                <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
                <span>Open Claude mobile app</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
                <span>Tap Code → Select your repo</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
                <span>Describe what you want</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
                <span>Merge PR → Goes live</span>
              </li>
            </ol>
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Open Claude App →
            </a>
            <p className="text-xs text-gray-500 mt-3 text-center">
              💡 Database features work automatically - tables sync when you push code
            </p>
          </div>

          {/* Laptop Option */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">💻</span> Build from Your Laptop
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Click to open your repo in an editor:
            </p>
            <div className="space-y-2">
              <a
                href="vscode://vscode.dev/clone?url=https://github.com/${repoFullName}"
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Open in VS Code
              </a>
              <a
                href="https://github.dev/${repoFullName}"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
              >
                Open in Browser IDE
              </a>
              <a
                href="antigravity://vscode.dev/clone?url=https://github.com/${repoFullName}"
                className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Open in Antigravity IDE
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              No setup needed • Installs editor if missing
            </p>
          </div>
        </div>

        {/* Proof of Ownership - Minimal */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Your App</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Users</span>
              <span className="font-mono font-semibold text-gray-900">1 (you!)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="font-mono font-semibold text-gray-900">Ready</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Auto-deploys from</span>
              <a
                href="\${process.env.NEXT_PUBLIC_GITHUB_REPO ? \`https://github.com/\${process.env.NEXT_PUBLIC_GITHUB_REPO}\` : '#'}"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                GitHub →
              </a>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-gray-500">
            <a href="https://clerk.com" target="_blank" className="hover:text-gray-700">Manage users</a>
            {" • "}
            <a href="https://neon.tech" target="_blank" className="hover:text-gray-700">View database</a>
            {" • "}
            <a href="/logs" className="hover:text-gray-700">View logs</a>
          </p>
        </div>
      </div>
    </main>
  );
}
`,
    },

    // src/app/api/logs/build/route.ts
    {
      path: "src/app/api/logs/build/route.ts",
      content: `import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = process.env.VERCEL_PROJECT_ID;
  const token = process.env.VERCEL_TOKEN;

  if (!projectId || !token) {
    return NextResponse.json({
      error: "Vercel credentials not configured"
    }, { status: 500 });
  }

  try {
    // Get latest deployment for this project
    const deploymentsRes = await fetch(
      \`https://api.vercel.com/v6/deployments?projectId=\${projectId}&limit=1\`,
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      }
    );

    if (!deploymentsRes.ok) {
      throw new Error("Failed to fetch deployments");
    }

    const deploymentsData = await deploymentsRes.json();

    if (!deploymentsData.deployments || deploymentsData.deployments.length === 0) {
      return NextResponse.json({ logs: "No deployments found" });
    }

    const latestDeployment = deploymentsData.deployments[0];

    // Get build logs using deployment events endpoint
    const logsRes = await fetch(
      \`https://api.vercel.com/v3/deployments/\${latestDeployment.uid}/events\`,
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      }
    );

    if (!logsRes.ok) {
      throw new Error("Failed to fetch build logs");
    }

    const logsData = await logsRes.json();

    // Format logs as text
    const logs = logsData
      .map((event: any) => {
        const timestamp = new Date(event.created).toISOString();
        return \`[\${timestamp}] \${event.text || event.payload?.text || JSON.stringify(event)}\`;
      })
      .join("\\n");

    return NextResponse.json({
      logs: logs || "No build logs available",
      deployment: {
        id: latestDeployment.uid,
        url: latestDeployment.url,
        state: latestDeployment.state,
        createdAt: latestDeployment.created,
      }
    });
  } catch (error) {
    console.error("Build logs error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to fetch build logs"
    }, { status: 500 });
  }
}
`,
    },

    // src/app/api/logs/runtime/route.ts
    {
      path: "src/app/api/logs/runtime/route.ts",
      content: `import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = process.env.VERCEL_PROJECT_ID;
  const token = process.env.VERCEL_TOKEN;

  if (!projectId || !token) {
    return NextResponse.json({
      error: "Vercel credentials not configured"
    }, { status: 500 });
  }

  try {
    // Get latest production deployment
    const deploymentsRes = await fetch(
      \`https://api.vercel.com/v6/deployments?projectId=\${projectId}&target=production&limit=1\`,
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      }
    );

    if (!deploymentsRes.ok) {
      throw new Error("Failed to fetch deployments");
    }

    const deploymentsData = await deploymentsRes.json();

    if (!deploymentsData.deployments || deploymentsData.deployments.length === 0) {
      return NextResponse.json({ logs: "No production deployments found" });
    }

    const latestDeployment = deploymentsData.deployments[0];

    // Runtime logs are only available for up to 1 hour
    // Use correct runtime-logs endpoint for function execution logs (console.log, etc.)
    const logsRes = await fetch(
      \`https://api.vercel.com/v1/projects/\${projectId}/deployments/\${latestDeployment.uid}/runtime-logs\`,
      {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      }
    );

    if (!logsRes.ok) {
      const errorText = await logsRes.text();
      console.error("Runtime logs fetch failed:", errorText);

      // Check if it's a 403 permission error
      if (logsRes.status === 403) {
        // Provide direct link to Vercel logs instead
        const vercelLogsUrl = \`https://vercel.com/logs?deploymentId=\${latestDeployment.uid}\`;
        return NextResponse.json({
          logs: \`Runtime logs are not accessible via API on the free plan.\\n\\nView runtime logs directly on Vercel:\\n\${vercelLogsUrl}\\n\\nClick the "Open in Vercel" button below to view and copy logs.\`,
          vercelLogsUrl: vercelLogsUrl,
          deployment: {
            id: latestDeployment.uid,
            url: latestDeployment.url,
            state: latestDeployment.state,
            createdAt: latestDeployment.created,
          }
        });
      }

      return NextResponse.json({
        logs: \`Runtime logs API error (\${logsRes.status}): \${errorText}\\n\\nNote: Runtime logs are only stored for 1 hour by Vercel. For longer retention, configure Log Drains.\`,
        deployment: {
          id: latestDeployment.uid,
          url: latestDeployment.url,
          state: latestDeployment.state,
          createdAt: latestDeployment.created,
        }
      });
    }

    // Runtime logs come as newline-delimited JSON stream
    const logsText = await logsRes.text();
    const logLines = logsText.trim().split("\\n").filter(line => line);

    // Parse each JSON line and format
    const logs = logLines
      .map((line: string) => {
        try {
          const log = JSON.parse(line);
          const timestamp = new Date(log.timestampInMs || Date.now()).toISOString();
          const level = log.level || "info";
          const message = log.message || JSON.stringify(log);
          return \`[\${timestamp}] [\${level.toUpperCase()}] \${message}\`;
        } catch {
          return line; // If parsing fails, return raw line
        }
      })
      .join("\\n");

    return NextResponse.json({
      logs: logs || "No runtime logs available (logs are only kept for 1 hour)",
      deployment: {
        id: latestDeployment.uid,
        url: latestDeployment.url,
        state: latestDeployment.state,
        createdAt: latestDeployment.created,
      }
    });
  } catch (error) {
    console.error("Runtime logs error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to fetch runtime logs"
    }, { status: 500 });
  }
}
`,
    },

    // src/app/logs/page.tsx
    {
      path: "src/app/logs/page.tsx",
      content: `"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

type LogType = "build" | "runtime";

interface LogData {
  logs: string;
  vercelLogsUrl?: string;
  deployment?: {
    id: string;
    url: string;
    state: string;
    createdAt: number;
  };
  error?: string;
}

export default function LogsPage() {
  // Read initial tab from URL params (e.g., /logs?tab=runtime)
  const [activeTab, setActiveTab] = useState<LogType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      return tab === 'runtime' ? 'runtime' : 'build';
    }
    return 'build';
  });
  const [buildLogs, setBuildLogs] = useState<LogData | null>(null);
  const [runtimeLogs, setRuntimeLogs] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchLogs = async (type: LogType) => {
    setLoading(true);
    try {
      const res = await fetch(\`/api/logs/\${type}\`);
      const data = await res.json();

      if (type === "build") {
        setBuildLogs(data);
      } else {
        setRuntimeLogs(data);
      }
    } catch (error) {
      console.error(\`Failed to fetch \${type} logs:\`, error);
      if (type === "build") {
        setBuildLogs({ logs: "Failed to load logs", error: String(error) });
      } else {
        setRuntimeLogs({ logs: "Failed to load logs", error: String(error) });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(activeTab);
  }, [activeTab]);

  const currentLogs = activeTab === "build" ? buildLogs : runtimeLogs;

  const copyToClipboard = async () => {
    if (currentLogs?.logs) {
      await navigator.clipboard.writeText(currentLogs.logs);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Deployment Logs</h1>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("build")}
              className={\`flex-1 px-6 py-4 text-sm font-medium transition-colors \${
                activeTab === "build"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }\`}
            >
              Build Logs
            </button>
            <button
              onClick={() => setActiveTab("runtime")}
              className={\`flex-1 px-6 py-4 text-sm font-medium transition-colors \${
                activeTab === "runtime"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }\`}
            >
              Runtime Logs
            </button>
          </div>

          {/* Deployment Info */}
          {currentLogs?.deployment && (
            <div className="px-6 py-4 bg-gray-50 border-b text-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-gray-600">Status: </span>
                    <span className="font-medium text-gray-900">
                      {currentLogs.deployment.state}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Deployed: </span>
                    <span className="font-medium text-gray-900">
                      {new Date(currentLogs.deployment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <a
                  href={\`https://\${currentLogs.deployment.url}\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Deployment →
                </a>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 py-3 bg-white border-b flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-gray-600">
              {activeTab === "build" ? "Latest build output" : "Runtime logs (last 1 hour)"}
            </div>
            <div className="flex gap-2">
              {currentLogs?.vercelLogsUrl && (
                <a
                  href={currentLogs.vercelLogsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Open in Vercel →
                </a>
              )}
              <button
                onClick={copyToClipboard}
                disabled={!currentLogs?.logs || loading}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy Logs"}
              </button>
            </div>
          </div>

          {/* Logs Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-600">Loading logs...</div>
              </div>
            ) : currentLogs?.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                <strong>Error:</strong> {currentLogs.error}
              </div>
            ) : (
              <>
                <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap break-words max-h-[600px] overflow-y-auto">
                  {currentLogs?.logs || "No logs available"}
                </pre>
                {currentLogs?.vercelLogsUrl && (
                  <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-900 mb-3">
                      <strong>📱 Mobile-friendly tip:</strong> Tap the button above to open Vercel's logs page where you can easily select and copy runtime logs for debugging.
                    </p>
                    <a
                      href={currentLogs.vercelLogsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full sm:w-auto text-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Open Vercel Logs →
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <strong className="block mb-2">💡 Tip:</strong>
          <ul className="space-y-1 ml-4 list-disc">
            <li><strong>Build logs</strong> show the deployment process (npm install, build, etc.)</li>
            <li><strong>Runtime logs</strong> show API route executions and server-side activity (stored for 1 hour only)</li>
            <li>For longer log retention, configure Log Drains in your Vercel project settings</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
`,
    },

    // src/middleware.ts
    {
      path: "src/middleware.ts",
      content: `import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
`,
    },

    // src/lib/db/index.ts
    {
      path: "src/lib/db/index.ts",
      content: `import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
`,
    },

    // src/lib/db/schema.ts
    {
      path: "src/lib/db/schema.ts",
      content: `import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Example table - customize this for your app
export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add more tables here as you build features
`,
    },

    // PROMPT.md
    {
      path: "PROMPT.md",
      content: `# ${appName}

This is your AI coding assistant context. Paste this into Claude when building features.

## Stack
- **Framework:** Next.js 15 (App Router)
- **Auth:** Clerk (users can sign up/sign in)
- **Database:** Neon Postgres + Drizzle ORM
- **Styling:** Tailwind CSS${hasAI ? `
- **AI:** ${aiProvider === "gemini" ? "Gemini" : aiProvider === "openai" ? "OpenAI" : "Claude"} API ready` : `
- **AI:** Not configured yet (add via Vercel env vars when needed)`}

## Project Structure
\`\`\`
src/
├── app/
│   ├── api/              # API routes (add /api/[name]/route.ts)
│   ├── dashboard/        # Protected pages (user must be logged in)
│   ├── sign-in/          # Clerk sign-in page
│   ├── sign-up/          # Clerk sign-up page
│   ├── layout.tsx        # Root layout with Clerk provider
│   ├── page.tsx          # Landing page (redirects to dashboard if logged in)
│   └── globals.css       # Global styles
├── components/           # React components (create this folder)
├── lib/
│   └── db/
│       ├── index.ts      # Database connection
│       └── schema.ts     # Database tables (edit this to add tables)
└── middleware.ts         # Protects routes (dashboard, api, etc.)
\`\`\`

## How to Add Features

### Add a new page
Create a file at \`src/app/[page-name]/page.tsx\`
- For protected pages, add the path to middleware.ts
- Use \`"use client"\` at top if you need interactivity (buttons, forms)

### Add a database table
1. Edit \`src/lib/db/schema.ts\` to add your table
2. Commit and push to GitHub
3. Tables automatically sync to Neon during Vercel deployment
   - No manual migration commands needed
   - Works from mobile/web - just push the code

### Add an API route
Create \`src/app/api/[route-name]/route.ts\`
\`\`\`typescript
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Your logic here
  return NextResponse.json({ data: "..." });
}
\`\`\`

## Customizing the Dashboard

The default \`/dashboard\` page is just a starting point to help you understand your stack.

**To replace it:**
- Edit \`src/app/dashboard/page.tsx\` with your own content
- Or delete it entirely and build your landing page at \`src/app/page.tsx\`

This is your app - the dashboard is optional scaffolding.

## Current Database Schema

\`\`\`typescript
// Items table (example - customize for your app)
items: {
  id: uuid (primary key)
  userId: text (the Clerk user ID)
  title: text
  content: text (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
\`\`\`

## Rules for AI
- Use TypeScript for all files
- Use Tailwind CSS for styling (no CSS modules)
- Use server components by default, add "use client" only when needed
- Always check auth with \`auth()\` from @clerk/nextjs/server in API routes
- Use the \`db\` object from @/lib/db for database queries
- Keep it simple - don't over-engineer

## Example Requests to Claude

- "Add a page where I can save notes"
- "Create a form to add new items"
- "Add a delete button to each item"
- "Make the dashboard show all my items"
- "Add a search bar to filter items"
`,
    },

    // README.md
    {
      path: "README.md",
      content: `# ${appName}

Created with [Vibe Starter](https://vibestarter.net)

## Your app is live!

Visit: https://${appName}.vercel.app

## Getting Started (Local Development)

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Build from Your Phone

1. Open Claude on your phone
2. Paste the contents of PROMPT.md
3. Describe what you want to build
4. Claude writes the code
5. Push to GitHub (via web or app)
6. Site updates automatically!

## Tech Stack

- **Next.js 15** - React framework
- **Clerk** - Authentication
- **Neon** - Postgres database
- **Drizzle** - Database ORM
- **Tailwind CSS** - Styling
- **Vercel** - Hosting

## Useful Commands

\`\`\`bash
npm run dev        # Start development server
npm run build      # Build for production
npm run db:push    # Sync database schema
npm run db:studio  # Open database UI
\`\`\`
`,
    },
  ];
}

async function pushTemplateCode(githubToken: string, repoFullName: string, appName: string, aiProvider: string, hasAI: boolean) {
  const files = getTemplateFiles(appName, aiProvider, hasAI, repoFullName);

  // For empty repos, we need to use the Contents API to create the first file
  // This initializes the repo with a commit, then we can use Git Data API for the rest

  // First, create README.md to initialize the repo
  const readmeFile = files.find(f => f.path === "README.md")!;
  const initRes = await fetch(`https://api.github.com/repos/${repoFullName}/contents/README.md`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Initial commit from Vibe Starter",
      content: Buffer.from(readmeFile.content).toString("base64"),
    }),
  });

  if (!initRes.ok) {
    const error = await initRes.json();
    console.error("Failed to initialize repo:", error);
    throw new Error("Failed to initialize repository");
  }

  // Now get the commit SHA we just created
  const refRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/ref/heads/main`, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!refRes.ok) {
    const error = await refRes.json();
    console.error("Failed to get ref:", error);
    throw new Error("Failed to get main branch reference");
  }

  const refData = await refRes.json();
  const baseCommitSha = refData.object.sha;

  // Get the tree SHA from the commit
  const commitInfoRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits/${baseCommitSha}`, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!commitInfoRes.ok) {
    throw new Error("Failed to get commit info");
  }

  const commitInfo = await commitInfoRes.json();
  const baseTreeSha = commitInfo.tree.sha;

  // Now create blobs for all other files (excluding README which we already created)
  const otherFiles = files.filter(f => f.path !== "README.md");

  const blobs = await Promise.all(
    otherFiles.map(async (file) => {
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

      if (!blobRes.ok) {
        const error = await blobRes.json();
        console.error(`Failed to create blob for ${file.path}:`, error);
        throw new Error(`Failed to create blob for ${file.path}`);
      }

      const blobData = await blobRes.json();
      return { path: file.path, sha: blobData.sha };
    })
  );

  // Create tree with base_tree to preserve README
  const treeRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: blobs.map((blob) => ({
        path: blob.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      })),
    }),
  });

  if (!treeRes.ok) {
    const error = await treeRes.json();
    console.error("Failed to create tree:", error);
    throw new Error("Failed to create git tree");
  }

  const treeData = await treeRes.json();

  // Create commit with parent
  const newCommitRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Add starter template files",
      tree: treeData.sha,
      parents: [baseCommitSha],
    }),
  });

  if (!newCommitRes.ok) {
    const error = await newCommitRes.json();
    console.error("Failed to create commit:", error);
    throw new Error("Failed to create git commit");
  }

  const newCommitData = await newCommitRes.json();

  // Update the main branch reference
  const updateRefRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/main`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sha: newCommitData.sha,
    }),
  });

  if (!updateRefRes.ok) {
    const error = await updateRefRes.json();
    console.error("Failed to update ref:", error);
    throw new Error("Failed to update main branch");
  }
}
