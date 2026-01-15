"use client";

import { useState } from "react";

interface SessionData {
  hasNeon: boolean;
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

  const isConnected = session?.hasNeon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Clean up the URL - handle multiple common paste formats
      let cleanUrl = databaseUrl.trim();

      // Remove 'psql' command prefix if present (e.g., "psql 'postgresql://...")
      cleanUrl = cleanUrl.replace(/^psql\s+/, '');

      // Remove leading and trailing quotes (single or double)
      cleanUrl = cleanUrl.replace(/^['"]|['"]$/g, '');

      // Remove any remaining whitespace
      cleanUrl = cleanUrl.trim();

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

  const openNeon = () => {
    window.open("https://console.neon.tech/signup", "_blank");
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">💾</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Set Up Neon</h2>
        <p className="text-white/60">
          Neon is your database — where your app&apos;s data gets saved.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-400 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Database Connected</span>
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
              <li>Click &quot;Open Neon&quot; below</li>
              <li>Sign up with GitHub (one click!)</li>
              <li>Click &quot;Create Project&quot;</li>
              <li>Copy the connection string from your Neon dashboard</li>
              <li>Paste it below — we&apos;ll handle any extra formatting!</li>
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
                placeholder="Paste your Neon connection string here..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-white/40 font-mono text-sm"
              />
              <p className="mt-2 text-xs text-white/40">
                Paste the full psql command or just the postgresql:// URL — both work!
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
          You can paste the entire <code className="px-1 py-0.5 bg-blue-500/20 rounded">psql</code> command
          or just the connection string — we&apos;ll clean it up automatically!
        </p>
      </div>
    </div>
  );
}
