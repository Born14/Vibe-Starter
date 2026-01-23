"use client";

import { useState } from "react";
import { ExternalLink, Check } from "lucide-react";
import { apiPost } from "@/lib/api-client";

interface SessionData {
  appName: string | null;
}

interface StepProps {
  sessionId: string;
  session: SessionData | null;
}

const DEPLOY_STEPS = [
  { id: 1, label: "Creating GitHub repository" },
  { id: 2, label: "Adding your app's code" },
  { id: 3, label: "Connecting to Vercel" },
  { id: 4, label: "Setting up environment variables" },
  { id: 5, label: "Triggering deployment" },
  { id: 6, label: "Building your app", sublabel: "This takes 3-5 minutes..." },
  { id: 7, label: "Going live!" },
];

export default function DeployStep({ sessionId, session }: StepProps) {
  const [deploying, setDeploying] = useState(false);
  const [currentDeployStep, setCurrentDeployStep] = useState(0);
  const [deployComplete, setDeployComplete] = useState(false);
  const [deployError, setDeployError] = useState("");
  const [deployResult, setDeployResult] = useState<{
    appUrl: string;
    repoUrl: string;
  } | null>(null);

  const startDeploy = async () => {
    setDeploying(true);
    setDeployError("");

    try {
      // Start deploy
      const response = await apiPost("/api/deploy", { sessionId });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Deploy failed");
      }

      const { deploymentId } = await response.json();

      // Poll for status
      let attempts = 0;
      const maxAttempts = 180; // 6 minutes max (Vercel builds can take 3-5 minutes, especially under load)

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusRes = await fetch(`/api/deploy/status/${deploymentId}`);
        const status = await statusRes.json();

        if (status.step) {
          setCurrentDeployStep(status.step);
        }

        if (status.status === "success") {
          setCurrentDeployStep(7);
          setDeployComplete(true);
          setDeployResult({
            appUrl: status.appUrl,
            repoUrl: status.repoUrl,
          });
          break;
        }

        if (status.status === "failed") {
          throw new Error(status.error || "Deploy failed");
        }

        // Handle "building" status - Vercel is building the app
        if (status.status === "building") {
          setCurrentDeployStep(6);
        }

        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error("Deploy is taking longer than expected. Check your Vercel dashboard - the build may still complete!");
      }
    } catch (err) {
      setDeployError(err instanceof Error ? err.message : "Deploy failed");
      setDeploying(false);
    }
  };

  if (deployComplete && deployResult) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>

        <h2 className="text-4xl font-bold mb-4">Your App is Live!</h2>

        <a
          href={deployResult.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-2xl text-green-700 font-medium hover:underline mb-8"
        >
          {deployResult.appUrl.replace("https://", "")}
        </a>

        {/* Ownership Checklist */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-semibold mb-4 text-center">You own everything:</h3>
          <ul className="space-y-3">
            {[
              "Repository in YOUR GitHub",
              "Hosting in YOUR Vercel",
              "Auth in YOUR Clerk",
              "Database in YOUR Neon",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700">
                <span className="text-black">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Your Stack Explained */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-semibold mb-4 text-center">Your Full Stack:</h3>
          <div className="space-y-4 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-black">🎨</span>
                <span className="font-medium text-black">Frontend (UI)</span>
              </div>
              <p className="text-gray-500 ml-6">
                What users see and click → Hosted on <strong>Vercel</strong>
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-black">⚙️</span>
                <span className="font-medium text-black">Backend (Logic)</span>
              </div>
              <p className="text-gray-500 ml-6">
                Handles requests and business logic → Runs on <strong>Vercel</strong>
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-black">🗄️</span>
                <span className="font-medium text-black">Database (Storage)</span>
              </div>
              <p className="text-gray-500 ml-6">
                Stores user data permanently → Lives in <strong>Neon</strong>
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              This is your complete full-stack app - everything you need to build features
            </p>
            <p className="text-xs text-gray-400 text-center mt-2">
              Database tables automatically sync when you push code - no manual setup needed
            </p>
          </div>
        </div>

        {/* Why This Stack? */}
        <div className="bg-black text-white rounded-xl p-5 mb-8 text-left max-w-md mx-auto">
          <h3 className="text-sm font-semibold mb-3 text-center">
            Why This Stack?
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <span className="text-white mt-0.5">→</span>
              <span><strong className="text-white">Production-ready:</strong> Powers companies from startups to Fortune 500s</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white mt-0.5">→</span>
              <span><strong className="text-white">Scales with you:</strong> Handle 100 users or 1M+ without rebuilding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white mt-0.5">→</span>
              <span><strong className="text-white">Cost-effective:</strong> Generous free tiers, pay only as you grow</span>
            </li>
          </ul>
        </div>

        {/* Security Confirmation + Revoke Access */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 max-w-md mx-auto">
          <p className="text-green-700 text-sm mb-3">
            <strong>✓ All temporary credentials deleted</strong>
            <br />
            Your API keys were used only during setup. We no longer have access.
          </p>
          <div className="flex gap-4 justify-center pt-2 border-t border-green-200">
            <a
              href="https://github.com/settings/connections/applications"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:text-green-700 underline"
            >
              Revoke GitHub
            </a>
            <a
              href="https://vercel.com/dashboard/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:text-green-700 underline"
            >
              Revoke Vercel
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a
            href={deployResult.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2"
          >
            Open Your App
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={deployResult.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            View on GitHub
          </a>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left max-w-lg mx-auto">
          <h3 className="font-semibold mb-4 text-center">Start Building Features</h3>

          <p className="text-gray-600 mb-3 text-center text-sm">
            Your app has user login and a database. Now you can add features by talking to your AI (Claude, Gemini, or ChatGPT) - from your phone, laptop, or anywhere.
          </p>

          <p className="text-gray-400 mb-4 text-center text-xs italic">
            Build features → Deploy to production → Test on your live site
          </p>

          {/* Example features they can build */}
          <div className="space-y-2 mb-4">
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="text-xs text-gray-400 mb-1">Try saying to your AI:</div>
              <div className="text-black text-sm font-medium">&quot;Add a page where users can save notes&quot;</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="text-xs text-gray-400 mb-1">Or:</div>
              <div className="text-black text-sm font-medium">&quot;Create a form to collect user feedback&quot;</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="text-xs text-gray-400 mb-1">Or:</div>
              <div className="text-black text-sm font-medium">&quot;Add a page where users can upload photos&quot;</div>
            </div>
          </div>

          {/* How to get started */}
          <div className="bg-black text-white rounded-xl p-4 mb-4">
            <p className="font-medium mb-3 text-sm">Quick Start Guide:</p>
            <ol className="space-y-2 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="text-white font-bold">1.</span>
                <span>Open your AI (Claude, Gemini, ChatGPT - mobile app, Cursor, or web)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-white font-bold">2.</span>
                <span>Connect to your GitHub repo: <strong className="text-white">{session?.appName}</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="text-white font-bold">3.</span>
                <span>Open and copy the <code className="bg-white/10 px-1 rounded">PROMPT.md</code> file for project context</span>
              </li>
              <li className="flex gap-2">
                <span className="text-white font-bold">4.</span>
                <span>Describe what you want to build</span>
              </li>
              <li className="flex gap-2">
                <span className="text-white font-bold">5.</span>
                <span>Build with AI → commit → your site updates!</span>
              </li>
            </ol>
          </div>

          {/* PROMPT.md link */}
          <a
            href={`${deployResult.repoUrl}/blob/main/PROMPT.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors mb-3"
          >
            View PROMPT.md
          </a>

          <a
            href="/education"
            className="block w-full text-center border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors mb-3"
          >
            Learn How to Build Features
          </a>

          <p className="text-xs text-gray-400 text-center">
            Works with Claude, Gemini, ChatGPT - mobile apps, Cursor, or any AI coding tool
          </p>

          {/* Optional: Laptop workflow */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-black text-center">
              Prefer to work from your laptop? Click here
            </summary>
            <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200 space-y-2 text-sm text-gray-600">
              <p>1. Install <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-medium">Cursor</a> or <a href="https://code.visualstudio.com" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-medium">VS Code</a></p>
              <p>2. Clone your repo locally</p>
              <p>3. Use your AI (Claude/Gemini/ChatGPT) directly in your editor</p>
              <p className="pt-2 text-xs text-gray-400">Or use <a href={`https://github.dev/${deployResult.repoUrl.replace('https://github.com/', '')}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-medium">github.dev</a> to edit in your browser (no install needed)</p>
            </div>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🚀</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Deploy Your App</h2>
        <p className="text-gray-500">
          Ready to launch <strong className="text-black">{session?.appName}</strong>
        </p>
      </div>

      {!deploying ? (
        <>
          {/* Pre-deploy checklist */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold mb-4">Ready to deploy:</h3>
            <ul className="space-y-2">
              {[
                "GitHub connected",
                "Vercel connected",
                "Clerk keys saved",
                "Neon database connected",
                "AI key saved",
                `App name: ${session?.appName}`,
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <Check className="h-5 w-5 text-black" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {deployError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {deployError}
            </div>
          )}

          <button
            onClick={startDeploy}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
          >
            Deploy My App 🚀
          </button>

          <p className="mt-4 text-center text-sm text-gray-400">
            This takes about 2 minutes. Don&apos;t close this window.
          </p>
        </>
      ) : (
        <>
          {/* Deploy Progress */}
          <div className="space-y-3">
            {DEPLOY_STEPS.map((step) => {
              const isComplete = step.id < currentDeployStep || (step.id === 7 && deployComplete);
              const isCurrent = step.id === currentDeployStep && !deployComplete;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    isComplete
                      ? "bg-green-50"
                      : isCurrent
                      ? "bg-gray-100"
                      : "bg-gray-50"
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-gray-300 ml-0.5">○</span>
                  )}
                  <div className="flex-1">
                    <span
                      className={
                        isComplete || isCurrent ? "text-black" : "text-gray-400"
                      }
                    >
                      {step.label}
                    </span>
                    {isCurrent && "sublabel" in step && (
                      <p className="text-sm text-gray-500 mt-0.5">{step.sublabel}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Building animation when on step 6 */}
          {currentDeployStep === 6 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <p className="text-black font-medium">Vercel is building your app</p>
                  <p className="text-sm text-gray-500">Installing dependencies, compiling code...</p>
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            Please wait... Don&apos;t close this window.
          </p>
        </>
      )}
    </div>
  );
}
