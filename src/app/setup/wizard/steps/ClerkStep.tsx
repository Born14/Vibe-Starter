"use client";

import { useState } from "react";

interface SessionData {
  hasClerk: boolean;
  skippedClerk: boolean;
}

interface StepProps {
  sessionId: string;
  session: SessionData | null;
  onNext: () => void;
  onRefresh: () => void;
}

export default function ClerkStep({ sessionId, session, onNext, onRefresh }: StepProps) {
  const [publishableKey, setPublishableKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  const isConnected = session?.hasClerk;
  const isSkipped = session?.skippedClerk;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate formats
      if (!publishableKey.startsWith("pk_test_") && !publishableKey.startsWith("pk_live_")) {
        throw new Error("Publishable key should start with pk_test_ or pk_live_");
      }
      if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
        throw new Error("Secret key should start with sk_test_ or sk_live_");
      }

      // Save publishable key
      const res1 = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "clerkPublishable", value: publishableKey }),
      });
      if (!res1.ok) throw new Error("Failed to save publishable key");

      // Save secret key
      const res2 = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "clerkSecret", value: secretKey }),
      });
      if (!res2.ok) throw new Error("Failed to save secret key");

      onRefresh();
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "skipClerk", value: true }),
      });

      if (!res.ok) throw new Error("Failed to skip step");

      onRefresh();
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openClerk = () => {
    window.open("https://dashboard.clerk.com", "_blank");
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔐</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Authentication (Optional)</h2>
        <p className="text-white/60">
          Clerk handles user sign-up and sign-in for your app.
        </p>
      </div>

      {isConnected || isSkipped ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-400 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">
              {isSkipped ? "Authentication Skipped" : "Clerk Keys Saved"}
            </span>
          </div>

          {isSkipped && (
            <p className="text-white/60 text-sm mb-6">
              Your app will deploy without user authentication. You can add it later if needed.
            </p>
          )}

          <button
            onClick={onNext}
            className="block w-full max-w-sm mx-auto bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-emerald-400 transition-colors"
          >
            Continue →
          </button>
        </div>
      ) : !showSetup ? (
        <>
          {/* Educational Content */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4">Do you need user authentication?</h3>

            <div className="space-y-4 text-sm text-white/70">
              <div>
                <div className="font-medium text-white mb-2">✅ You&apos;ll need authentication if:</div>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Users create accounts and log in</li>
                  <li>You&apos;re building a SaaS product</li>
                  <li>You have user-specific data or dashboards</li>
                  <li>You need to identify who&apos;s using your app</li>
                </ul>
              </div>

              <div>
                <div className="font-medium text-white mb-2">⏭️ Skip authentication if:</div>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>You&apos;re building a landing page or marketing site</li>
                  <li>Your app doesn&apos;t need user accounts</li>
                  <li>You want a public tool anyone can use</li>
                  <li>You&apos;ll add auth later when needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-6">
            <p className="text-blue-400 text-sm">
              <strong>💡 You can always add authentication later.</strong> If you&apos;re not sure,
              skip for now and deploy your app. You can add Clerk anytime using the dashboard.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleSkip}
              disabled={loading}
              className="px-6 py-4 bg-white/10 border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Skipping..." : "Skip for now"}
            </button>

            <button
              onClick={() => setShowSetup(true)}
              disabled={loading}
              className="px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set up Clerk
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </>
      ) : (
        <>
          {/* Setup Instructions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <h4 className="font-semibold mb-3">Getting your Clerk keys:</h4>
            <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
              <li>Click &quot;Open Clerk&quot; below to create an account</li>
              <li>Click <strong>&quot;Create Application&quot;</strong> and name it (e.g., &quot;My App&quot;)</li>
              <li>Click <strong>&quot;Configure&quot;</strong> at the top of the page</li>
              <li>Scroll down to find <strong>&quot;API Keys&quot;</strong></li>
              <li>Copy your <strong>Publishable Key</strong> and <strong>Secret Key</strong></li>
              <li>Paste them below</li>
            </ol>
          </div>

          <a
            href="https://dashboard.clerk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-500 transition-colors mb-6 block text-center"
          >
            Open Clerk Dashboard →
          </a>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Publishable Key
              </label>
              <input
                type="text"
                value={publishableKey}
                onChange={(e) => setPublishableKey(e.target.value)}
                placeholder="pk_test_..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-white/40 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sk_test_..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-white/40 font-mono text-sm"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !publishableKey || !secretKey}
              className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save & Continue →"}
            </button>
          </form>
        </>
      )}

      {/* Help */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400 text-sm">
          <strong>Can&apos;t find the keys?</strong> After creating your app, click
          &quot;Configure&quot; at the top, then scroll down to the &quot;API Keys&quot; section.
        </p>
      </div>
    </div>
  );
}
