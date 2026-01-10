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
  const [vercelToken, setVercelToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isConnected = session?.hasVercel;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate token by making a test API call
      const testRes = await fetch("/api/verify-vercel-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: vercelToken }),
      });

      const testData = await testRes.json();

      if (!testRes.ok || !testData.valid) {
        throw new Error(testData.error || "Invalid Vercel token");
      }

      // Save the token
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "vercelToken", value: vercelToken }),
      });

      if (!res.ok) throw new Error("Failed to save token");

      onRefresh();
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openVercel = () => {
    window.open("https://vercel.com/account/tokens", "_blank");
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" viewBox="0 0 76 65" fill="currentColor">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2">Connect Vercel</h2>
        <p className="text-white/60">
          Vercel puts your app on the internet. Push code, site updates automatically.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-400 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Vercel Connected</span>
          </div>

          <button
            onClick={onNext}
            className="block w-full max-w-sm mx-auto bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-emerald-400 transition-colors"
          >
            Continue →
          </button>
        </div>
      ) : (
        <>
          {/* Instructions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <h4 className="font-semibold mb-3">Quick Steps:</h4>
            <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
              <li>Click &quot;Open Vercel&quot; below</li>
              <li>Sign up with GitHub if you don&apos;t have an account</li>
              <li>Click &quot;Create&quot; to create a new token</li>
              <li>Name it &quot;Vibe Starter&quot; and click &quot;Create Token&quot;</li>
              <li>Copy the token and paste it below</li>
            </ol>
          </div>

          <button
            onClick={openVercel}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 76 65" fill="currentColor">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            Open Vercel Tokens Page →
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Access Token
              </label>
              <input
                type="password"
                value={vercelToken}
                onChange={(e) => setVercelToken(e.target.value)}
                placeholder="Paste your Vercel token here..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-white/40 font-mono text-sm"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !vercelToken}
              className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Save & Continue →"}
            </button>
          </form>
        </>
      )}

      {/* Trust Box */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-8">
        <h4 className="text-sm font-semibold text-white/60 mb-3">WHAT VERCEL DOES:</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">→</span>
            <span>Hosts your app for free (generous free tier)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">→</span>
            <span>Auto-deploys when you push to GitHub</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">→</span>
            <span>Gives you a URL like your-app.vercel.app</span>
          </li>
        </ul>
      </div>

      {/* Security Note */}
      <div className="mt-4 p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
        <p className="text-emerald-400 text-sm">
          <strong>Your token is encrypted</strong> and deleted after setup completes.
          We only use it to create your project.
        </p>
      </div>
    </div>
  );
}
