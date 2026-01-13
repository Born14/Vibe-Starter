import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wizardSessions, deployments, licenseKeys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";

// Reduced timeout since we return early and let frontend poll Vercel
export const maxDuration = 30;

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
    const aiKey = decrypt(session.aiKey!);
    const aiProvider = session.aiProvider || "claude";

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

    await pushTemplateCode(githubToken, repoFullName, session.appName!, aiProvider);

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

    const aiKeyName = aiProvider === "gemini" ? "GOOGLE_GENERATIVE_AI_API_KEY" : "ANTHROPIC_API_KEY";

    const envVars = [
      { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", value: clerkPublishable },
      { key: "CLERK_SECRET_KEY", value: clerkSecret },
      { key: "NEXT_PUBLIC_CLERK_SIGN_IN_URL", value: "/sign-in" },
      { key: "NEXT_PUBLIC_CLERK_SIGN_UP_URL", value: "/sign-up" },
      { key: "DATABASE_URL", value: databaseUrl },
      { key: aiKeyName, value: aiKey },
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

function getTemplateFiles(appName: string, aiProvider: string): { path: string; content: string }[] {
  const aiKeyName = aiProvider === "gemini" ? "GOOGLE_GENERATIVE_AI_API_KEY" : "ANTHROPIC_API_KEY";

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
          build: "next build",
          start: "next start",
          lint: "next lint",
          "db:push": "drizzle-kit push",
          "db:studio": "drizzle-kit studio",
        },
        dependencies: {
          "@clerk/nextjs": "^5.7.0",
          "@neondatabase/serverless": "^0.10.0",
          "drizzle-orm": "^0.36.0",
          next: "15.2.6",
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

# AI (Claude or Gemini)
${aiKeyName}=sk-ant-...
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
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
        Try one of these
      </h3>
      <div className="grid sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            navigator.clipboard.writeText("Add a notes page where I can save personal thoughts");
          }}
          className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-black transition-all text-left active:scale-95"
        >
          <div className="text-2xl mb-2">💬</div>
          <div className="text-sm font-medium text-gray-900 mb-1">
            Notes Page
          </div>
          <div className="text-xs text-gray-500">
            Save personal thoughts
          </div>
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText("Create a user profile page with avatar upload");
          }}
          className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-black transition-all text-left active:scale-95"
        >
          <div className="text-2xl mb-2">👤</div>
          <div className="text-sm font-medium text-gray-900 mb-1">
            Profile Page
          </div>
          <div className="text-xs text-gray-500">
            With avatar upload
          </div>
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText("Add a feedback form so users can contact me");
          }}
          className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-black transition-all text-left active:scale-95"
        >
          <div className="text-2xl mb-2">📝</div>
          <div className="text-sm font-medium text-gray-900 mb-1">
            Feedback Form
          </div>
          <div className="text-xs text-gray-500">
            Let users contact you
          </div>
        </button>
      </div>
      <p className="text-xs text-gray-500 text-center mt-3">
        Click to copy • Paste into Claude • Watch it build
      </p>
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
        {/* Hero CTA */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Welcome to ${appName}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your app is live. You're logged in. Let's build something.
          </p>

          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto px-8 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Add Your First Feature
          </a>
        </div>

        {/* Quick Win Ideas - Now a Client Component */}
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
              <span className="text-green-600 text-lg">✓</span>
              <div>
                <div className="font-medium text-gray-900">AI Ready</div>
                <div className="text-xs text-gray-600">${aiProvider === "gemini" ? "Gemini" : "Claude"} • API configured</div>
              </div>
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

        {/* Building Options */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* Phone Option */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">📱</span> Build from Your Phone
            </h3>
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
                href="\${process.env.NEXT_PUBLIC_GITHUB_REPO ? \`vscode://vscode.git/clone?url=https://github.com/\${process.env.NEXT_PUBLIC_GITHUB_REPO}.git\` : '#'}"
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Open in VS Code
              </a>
              <a
                href="\${process.env.NEXT_PUBLIC_GITHUB_REPO ? \`cursor://clone?url=https://github.com/\${process.env.NEXT_PUBLIC_GITHUB_REPO}.git\` : '#'}"
                className="block w-full text-center bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Open in Cursor
              </a>
              <a
                href="\${process.env.NEXT_PUBLIC_GITHUB_REPO ? \`https://github.dev/\${process.env.NEXT_PUBLIC_GITHUB_REPO}\` : '#'}"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
              >
                Open in Browser IDE
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
            <a href="https://vercel.com" target="_blank" className="hover:text-gray-700">Deployment logs</a>
          </p>
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
- **Styling:** Tailwind CSS
- **AI:** ${aiProvider === "gemini" ? "Gemini" : "Claude"} API ready

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
1. Edit \`src/lib/db/schema.ts\`
2. Run \`npm run db:push\` to sync

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

Created with [Vibe Starter](https://vibestarter.app)

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

async function pushTemplateCode(githubToken: string, repoFullName: string, appName: string, aiProvider: string) {
  const files = getTemplateFiles(appName, aiProvider);

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
