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
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasAccount, setHasAccount] = useState(false);

  const isConnected = session?.hasVercel;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate token format
      if (!token.trim()) {
        throw new Error("Please enter your Vercel token");
      }

      // Verify token works by making a test API call
      const verifyRes = await fetch("https://api.vercel.com/v2/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!verifyRes.ok) {
        throw new Error("Invalid token. Please check and try again.");
      }

      // Save the token
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "vercelToken", value: token }),
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
        <h2 className="text-3xl font-bold mb-2">Connect Vercel</h2>
        <p className="text-white/60">
          Vercel puts your app on the internet — for free.
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
      ) : !hasAccount ? (
        <>
          {/* Step 1: Create Account */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-400 text-black rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <h4 className="font-semibold">Create a free Vercel account</h4>
            </div>
            <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside ml-11">
              <li>Click the button below to open Vercel</li>
              <li>Click <strong>&quot;Sign Up&quot;</strong></li>
              <li>Choose <strong>&quot;Continue with GitHub&quot;</strong> (easiest!)</li>
              <li>Authorize Vercel to access your GitHub</li>
            </ol>
          </div>

          <a
            href="https://vercel.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-emerald-400 transition-colors mb-6 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 76 65" fill="currentColor">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            Create Vercel Account →
          </a>

          <button
            onClick={() => setHasAccount(true)}
            className="w-full border border-white/20 text-white py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
          >
            I have a Vercel account →
          </button>

          {/* What is Vercel? */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">
              <strong>What is Vercel?</strong> It&apos;s free web hosting that automatically
              updates your site whenever you push code to GitHub. No server setup needed.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Step 2: Get Token */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-400 text-black rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <h4 className="font-semibold">Create an access token</h4>
            </div>
            <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside ml-11">
              <li>Click the button below to open your tokens page</li>
              <li>Click <strong>&quot;Create&quot;</strong></li>
              <li>Name it anything (e.g., &quot;Vibe Starter&quot;)</li>
              <li>For Scope, select <strong>your account name</strong> (not &quot;Full Account&quot;)</li>
              <li>Leave Expiration as &quot;No Expiration&quot; or choose any</li>
              <li>Click <strong>&quot;Create Token&quot;</strong></li>
              <li>Copy the token and paste it below</li>
            </ol>
          </div>

          <a
            href="https://vercel.com/account/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-black border border-white/20 text-white py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors mb-6 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 76 65" fill="currentColor">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            Open Vercel Tokens Page →
          </a>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Vercel Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your token here..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-white/40 font-mono text-sm"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Save & Continue →"}
            </button>
          </form>

          <button
            onClick={() => setHasAccount(false)}
            className="w-full text-white/60 py-3 text-sm hover:text-white transition-colors mt-4"
          >
            ← Back to account creation
          </button>
        </>
      )}

      {/* Security note */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-8">
        <h4 className="text-sm font-semibold text-white/60 mb-3">SECURITY:</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>Your token is encrypted and stored securely</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>Used only to deploy YOUR app to YOUR account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-0.5">✓</span>
            <span>Deleted immediately after setup completes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
