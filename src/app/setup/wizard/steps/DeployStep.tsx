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
  { id: 5, label: "Setting up database tables" },
  { id: 6, label: "Deploying to the internet" },
  { id: 7, label: "Running final checks" },
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
      const maxAttempts = 60; // 2 minutes max

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusRes = await fetch(`/api/deploy/status/${deploymentId}`);
        const status = await statusRes.json();

        if (status.step) {
          setCurrentDeployStep(status.step);
        }

        if (status.status === "success") {
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

        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error("Deploy timed out");
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
          <h3 className="font-semibold mb-4">What&apos;s Next?</h3>
          <div className="space-y-4 text-sm text-white/70">
            <div>
              <p className="text-white font-medium mb-1">From your laptop:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Download VS Code or Cursor</li>
                <li>Clone your repo</li>
                <li>Open PROMPT.md and paste it into Claude</li>
                <li>Start building!</li>
              </ol>
            </div>
            <div>
              <p className="text-white font-medium mb-1">From your phone:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open Claude app</li>
                <li>Paste PROMPT.md contents</li>
                <li>Describe what you want to build</li>
                <li>Push to GitHub — site updates!</li>
              </ol>
            </div>
          </div>
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
            {DEPLOY_STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.id < currentDeployStep
                    ? "bg-emerald-400/10"
                    : step.id === currentDeployStep
                    ? "bg-white/10"
                    : "bg-white/5"
                }`}
              >
                {step.id < currentDeployStep ? (
                  <span className="text-emerald-400">✓</span>
                ) : step.id === currentDeployStep ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="text-white/30">○</span>
                )}
                <span
                  className={
                    step.id <= currentDeployStep ? "text-white" : "text-white/40"
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-white/40">
            Please wait... Don&apos;t close this window.
          </p>
        </>
      )}
    </div>
  );
}
