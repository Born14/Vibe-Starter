"use client";

import { useState } from "react";

interface SessionData {
  hasNeon: boolean;
  skippedNeon: boolean;
}

interface StepProps {
  sessionId: string;
  session: SessionData | null;
  onNext: () => void;
  onRefresh: () => void;
}

export default function NeonStep({ sessionId, session, onNext, onRefresh }: StepProps) {
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  const isConnected = session?.hasNeon;
  const isSkipped = session?.skippedNeon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Clean up the URL - remove quotes and whitespace
      const cleanUrl = databaseUrl.trim().replace(/^['"]|['"]$/g, '');

      // Validate format
      if (!cleanUrl.startsWith("postgresql://") || !cleanUrl.includes("neon.tech")) {
        throw new Error("Connection string should start with postgresql:// and contain neon.tech");
      }

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "databaseUrl", value: cleanUrl }),
      });

      if (!res.ok) throw new Error("Failed to save connection string");

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
        body: JSON.stringify({ sessionId, field: "skipNeon", value: true }),
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

  const openNeon = () => {
    window.open("https://console.neon.tech/signup", "_blank");
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">💾</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Database (Optional)</h2>
        <p className="text-white/60">
          Neon is your database — where your app&apos;s data gets saved.
        </p>
      </div>

      {isConnected || isSkipped ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-400 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">
              {isSkipped ? "Database Skipped" : "Database Connected"}
            </span>
          </div>

          {isSkipped && (
            <p className="text-white/60 text-sm mb-6">
              Your app will deploy without a database. You can add one later if you need to store data.
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
            <h3 className="font-semibold mb-4">Do you need a database?</h3>

            <div className="space-y-4 text-sm text-white/70">
              <div>
                <div className="font-medium text-white mb-2">✅ You&apos;ll need a database if:</div>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>You&apos;re storing user data or content</li>
                  <li>You have forms that save information</li>
                  <li>You need to remember things between visits</li>
                  <li>You&apos;re building a todo app, blog, or CRUD app</li>
                </ul>
              </div>

              <div>
                <div className="font-medium text-white mb-2">⏭️ Skip database if:</div>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>You&apos;re building a static landing page</li>
                  <li>Your app doesn&apos;t store any data</li>
                  <li>You&apos;re just showing information (no forms)</li>
                  <li>You&apos;ll add a database later when needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-6">
            <p className="text-blue-400 text-sm">
              <strong>💡 You can always add a database later.</strong> If you&apos;re not sure,
              skip for now. You can add Neon anytime using the dashboard when you need to store data.
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
              className="px-6 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set up Neon
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
            <h4 className="font-semibold mb-3">Getting your Neon database:</h4>
            <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
              <li>Click &quot;Open Neon&quot; below</li>
              <li>Sign up with GitHub (one click!)</li>
              <li>Click &quot;Create Project&quot;</li>
              <li>Copy the connection string (starts with postgresql://)</li>
              <li>Paste it below</li>
            </ol>
          </div>

          <button
            onClick={openNeon}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-500 transition-colors mb-6"
          >
            Open Neon Console →
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Connection String
              </label>
              <input
                type="text"
                value={databaseUrl}
                onChange={(e) => setDatabaseUrl(e.target.value)}
                placeholder="postgresql://user:pass@...neon.tech/neondb"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-white/40 font-mono text-sm"
              />
              <p className="mt-2 text-xs text-white/40">
                Found on your Neon dashboard after creating a project
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !databaseUrl}
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
          <strong>Tip:</strong> In Neon, click your project, then find
          &quot;Connection string&quot; on the dashboard. Make sure to select &quot;Pooled&quot; connection.
        </p>
      </div>
    </div>
  );
}
