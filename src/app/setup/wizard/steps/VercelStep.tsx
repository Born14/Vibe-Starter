"use client";

import { useState } from "react";

interface SessionData {
  hasVercel: boolean;
}

interface StepProps {
  sessionId: string;
  session: SessionData | null;
  onNext: () => void;
  onRefresh: () => void;
}

export default function VercelStep({ sessionId, session, onNext, onRefresh }: StepProps) {
  const [appUrl, setAppUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"deploy" | "confirm">("deploy");

  const isConnected = session?.hasVercel;

  const openVercelImport = () => {
    // Direct link to import from GitHub
    window.open("https://vercel.com/new", "_blank");
    setStep("confirm");
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Basic URL validation
      if (!appUrl.includes("vercel.app")) {
        throw new Error("Please enter your Vercel app URL (ends with .vercel.app)");
      }

      // Extract app name from URL
      const cleanUrl = appUrl.replace("https://", "").replace("http://", "").replace(".vercel.app", "").split("/")[0];

      // Save as "connected" - we just need to know they deployed
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "vercelToken", value: `deployed:${cleanUrl}` }),
      });

      if (!res.ok) throw new Error("Failed to save");

      onRefresh();
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" viewBox="0 0 76 65" fill="currentColor">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2">Deploy to Vercel</h2>
        <p className="text-white/60">
          Vercel puts your app on the internet. One click.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-400 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Deployed to Vercel</span>
          </div>

          <button
            onClick={onNext}
            className="block w-full max-w-sm mx-auto bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-emerald-400 transition-colors"
          >
            Continue →
          </button>
        </div>
      ) : step === "deploy" ? (
        <>
          {/* Simple instructions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <h4 className="font-semibold mb-3">What to do:</h4>
            <ol className="space-y-3 text-white/70">
              <li className="flex gap-3">
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                <span>Click the button below to open Vercel</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                <span>Sign up with GitHub (one click)</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                <span>Find your repo and click <strong>Import</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
                <span>Click <strong>Deploy</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">5</span>
                <span>Come back here when it&apos;s done!</span>
              </li>
            </ol>
          </div>

          <button
            onClick={openVercelImport}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 76 65" fill="currentColor">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            Open Vercel →
          </button>
        </>
      ) : (
        <>
          {/* Confirm deployment */}
          <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-xl p-5 mb-6">
            <p className="text-emerald-400">
              <strong>Did Vercel finish deploying?</strong> Paste your app URL below.
            </p>
          </div>

          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Vercel App URL
              </label>
              <input
                type="text"
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                placeholder="my-app.vercel.app"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-white/40"
                autoFocus
              />
              <p className="mt-2 text-xs text-white/40">
                Copy this from your browser after Vercel finishes deploying
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !appUrl}
              className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Continue →"}
            </button>

            <button
              type="button"
              onClick={() => setStep("deploy")}
              className="w-full text-white/60 py-2 text-sm hover:text-white"
            >
              ← Go back to instructions
            </button>
          </form>
        </>
      )}

      {/* What Vercel does */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-8">
        <h4 className="text-sm font-semibold text-white/60 mb-3">WHAT VERCEL DOES:</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>Free hosting for your app</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>Auto-updates when you push to GitHub</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>Your URL: your-app.vercel.app</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
