"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface SessionData {
  hasClerk: boolean;
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

  const isConnected = session?.hasClerk;

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

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔐</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Set Up Clerk</h2>
        <p className="text-gray-500">
          Clerk handles user sign-up and sign-in for your app.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
            <Check className="w-5 h-5" />
            <span className="font-medium">Clerk Keys Saved</span>
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
              <li>Click &quot;Open Clerk&quot; below to create an account (if needed)</li>
              <li><strong>Create a new application</strong> - Click <strong>&quot;+ Create Application&quot;</strong> and give it a name (e.g., &quot;My App&quot;)</li>
              <li>Once created, click <strong>&quot;Configure&quot;</strong> in the top navigation</li>
              <li>Select <strong>&quot;User & Authentication&quot;</strong> from the left sidebar</li>
              <li>Click <strong>&quot;API Keys&quot;</strong> in the submenu</li>
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
            Open Clerk Dashboard
          </a>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Publishable Key
              </label>
              <input
                type="text"
                value={publishableKey}
                onChange={(e) => setPublishableKey(e.target.value)}
                placeholder="pk_test_..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Secret Key
              </label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sk_test_..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400 font-mono text-sm"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !publishableKey || !secretKey}
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
          <strong>Can&apos;t find the keys?</strong> After creating your application, navigate to:
          Configure → User & Authentication → API Keys
        </p>
      </div>
    </div>
  );
}
