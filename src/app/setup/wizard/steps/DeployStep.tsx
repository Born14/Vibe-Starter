"use client";

import { useState } from "react";

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
  { id: 6, label: "Building your app", sublabel: "This takes 1-2 minutes..." },
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
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Deploy failed");
      }

      const { deploymentId } = await response.json();

      // Poll for status
      let attempts = 0;
      const maxAttempts = 90; // 3 minutes max (Vercel builds can take a while)

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
        <div className="w-20 h-20 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>

        <h2 className="text-4xl font-bold mb-4">Your App is Live!</h2>

        <a
          href={deployResult.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-2xl text-emerald-400 font-medium hover:underline mb-8"
        >
          {deployResult.appUrl.replace("https://", "")}
        </a>

        {/* Ownership Checklist */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-semibold mb-4 text-center">You own everything:</h3>
          <ul className="space-y-3">
            {[
              "Repository in YOUR GitHub",
              "Hosting in YOUR Vercel",
              "Auth in YOUR Clerk",
              "Database in YOUR Neon",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <span className="text-emerald-400">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security Confirmation */}
        <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-xl p-4 mb-8 max-w-md mx-auto">
          <p className="text-emerald-400 text-sm">
            <strong>✓ All temporary credentials deleted</strong>
            <br />
            Your API keys were used only during setup. We no longer have access.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a
            href={deployResult.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-emerald-400 transition-colors"
          >
            Open Your App →
          </a>
          <a
            href={deployResult.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
          >
            View on GitHub
          </a>
        </div>

        {/* Next Steps */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left max-w-lg mx-auto">
          <h3 className="font-semibold mb-4 text-center">Start Building Features</h3>

          <p className="text-white/70 mb-4 text-center text-sm">
            Your app has user login and a database. Now you can add features by talking to Claude - from your phone, laptop, or anywhere.
          </p>

          {/* Example features they can build */}
          <div className="space-y-2 mb-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/50 mb-1">Try saying to Claude:</div>
              <div className="text-white text-sm font-medium">&quot;Add a page where users can save notes&quot;</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/50 mb-1">Or:</div>
              <div className="text-white text-sm font-medium">&quot;Create a form to collect user feedback&quot;</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-white/50 mb-1">Or:</div>
              <div className="text-white text-sm font-medium">&quot;Add a page where users can upload photos&quot;</div>
            </div>
          </div>

          {/* How to get started */}
          <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-xl p-4 mb-4">
            <p className="font-medium mb-3 text-sm">Quick Start Guide:</p>
            <ol className="space-y-2 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">1.</span>
                <span>Open Claude (mobile app, Cursor, or web)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">2.</span>
                <span>Connect to your GitHub repo: <strong className="text-white">{session?.appName}</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">3.</span>
                <span>Open and copy the <code className="bg-white/10 px-1 rounded">PROMPT.md</code> file for project context</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">4.</span>
                <span>Describe what you want to build</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">5.</span>
                <span>Claude writes and commits the code → your site updates! 🎉</span>
              </li>
            </ol>
          </div>

          {/* PROMPT.md link */}
          <a
            href={`${deployResult.repoUrl}/blob/main/PROMPT.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-emerald-400 text-black py-3 rounded-lg font-semibold hover:bg-emerald-300 transition-colors mb-3"
          >
            View PROMPT.md →
          </a>

          <p className="text-xs text-white/50 text-center">
            💡 Works great with Claude mobile, Cursor, or any AI coding tool
          </p>

          {/* Optional: Laptop workflow */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-white/60 hover:text-white text-center">
              Prefer to work from your laptop? Click here →
            </summary>
            <div className="mt-3 p-3 bg-white/5 rounded-lg space-y-2 text-sm text-white/70">
              <p>1. Install <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Cursor</a> or <a href="https://code.visualstudio.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">VS Code</a></p>
              <p>2. Clone your repo locally</p>
              <p>3. Use Claude/AI directly in your editor</p>
              <p className="pt-2 text-xs text-white/50">Or use <a href={`https://github.dev/${deployResult.repoUrl.replace('https://github.com/', '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">github.dev</a> to edit in your browser (no install needed)</p>
            </div>
          </details>
        </div>

        {/* Revoke Access */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/40 mb-2">
            Recommended: Revoke our access now that setup is complete
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="https://github.com/settings/applications"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white underline"
            >
              Revoke GitHub Access
            </a>
            <a
              href="https://vercel.com/account/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white underline"
            >
              Revoke Vercel Access
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🚀</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Deploy Your App</h2>
        <p className="text-white/60">
          Ready to launch <strong className="text-white">{session?.appName}</strong>
        </p>
      </div>

      {!deploying ? (
        <>
          {/* Pre-deploy checklist */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
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
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <span className="text-emerald-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {deployError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {deployError}
            </div>
          )}

          <button
            onClick={startDeploy}
            className="w-full bg-emerald-400 text-black py-4 rounded-xl font-semibold text-lg hover:bg-emerald-300 transition-colors"
          >
            Deploy My App 🚀
          </button>

          <p className="mt-4 text-center text-sm text-white/40">
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
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isComplete
                      ? "bg-emerald-400/10"
                      : isCurrent
                      ? "bg-white/10"
                      : "bg-white/5"
                  }`}
                >
                  {isComplete ? (
                    <span className="text-emerald-400">✓</span>
                  ) : isCurrent ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-white/30">○</span>
                  )}
                  <div className="flex-1">
                    <span
                      className={
                        isComplete || isCurrent ? "text-white" : "text-white/40"
                      }
                    >
                      {step.label}
                    </span>
                    {isCurrent && "sublabel" in step && (
                      <p className="text-sm text-white/50 mt-0.5">{step.sublabel}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Building animation when on step 6 */}
          {currentDeployStep === 6 && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <p className="text-white font-medium">Vercel is building your app</p>
                  <p className="text-sm text-white/50">Installing dependencies, compiling code...</p>
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-white/40">
            Please wait... Don&apos;t close this window.
          </p>
        </>
      )}
    </div>
  );
}
