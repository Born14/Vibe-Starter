"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

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
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">💾</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Set Up Neon</h2>
        <p className="text-gray-500">
          Neon is your database — where your app&apos;s data gets saved.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
            <Check className="w-5 h-5" />
            <span className="font-medium">Database Connected</span>
          </div>

          <button
            onClick={onNext}
            className="block w-full max-w-sm mx-auto bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
            <h4 className="font-semibold mb-3">Quick Steps:</h4>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
              <li>Click &quot;Open Neon&quot; below</li>
              <li>Sign up with GitHub (one click!)</li>
              <li>Click &quot;Create Project&quot;</li>
              <li>Find the &quot;Connect to your database&quot; box and click &quot;Connect&quot;</li>
              <li>Copy the connection string and paste it below — we&apos;ll handle the formatting!</li>
            </ol>
          </div>

          <button
            onClick={openNeon}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-500 transition-colors mb-6"
          >
            Open Neon Console
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Connection String
              </label>
              <input
                type="text"
                value={databaseUrl}
                onChange={(e) => setDatabaseUrl(e.target.value)}
                placeholder="Paste your Neon connection string here..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400 font-mono text-sm"
              />
              <p className="mt-2 text-xs text-gray-400">
                Paste the full psql command or just the postgresql:// URL — both work!
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !databaseUrl}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save & Continue
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </>
      )}

      {/* Help */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-blue-700 text-sm">
          <strong>Tip:</strong> On your Neon project dashboard, look for the big &quot;Connect to your database&quot; box.
          Click the &quot;Connect&quot; button, then make sure &quot;Pooled connection&quot; is selected.
          You can paste the entire <code className="px-1 py-0.5 bg-blue-100 rounded">psql</code> command
          or just the connection string — we&apos;ll clean it up automatically!
        </p>
      </div>
    </div>
  );
}
