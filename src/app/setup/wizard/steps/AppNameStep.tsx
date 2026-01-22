"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { apiPost } from "@/lib/api-client";

interface SessionData {
  appName: string | null;
}

interface StepProps {
  sessionId: string;
  session: SessionData | null;
  onNext: () => void;
  onRefresh: () => void;
}

export default function AppNameStep({ sessionId, session, onNext, onRefresh }: StepProps) {
  const [appName, setAppName] = useState(session?.appName || "");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [preview, setPreview] = useState("");

  // Debounced availability check
  useEffect(() => {
    if (!appName || appName.length < 3) {
      setIsAvailable(null);
      setPreview("");
      return;
    }

    // Validate format
    if (!/^[a-z0-9-]+$/.test(appName)) {
      setError("Only lowercase letters, numbers, and hyphens allowed");
      setIsAvailable(false);
      return;
    }

    if (appName.length > 50) {
      setError("Maximum 50 characters");
      setIsAvailable(false);
      return;
    }

    setError("");
    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch("/api/check-app-name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, appName }),
        });
        const data = await res.json();

        if (data.available) {
          setIsAvailable(true);
          setPreview(data.preview);
          setError("");
        } else {
          setIsAvailable(false);
          setError(data.error || "Name not available");
        }
      } catch {
        setError("Could not check availability");
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [appName, sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable) return;

    setLoading(true);
    try {
      const res = await apiPost("/api/session", {
        sessionId,
        field: "appName",
        value: appName,
      });

      if (!res.ok) throw new Error("Failed to save app name");

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
        <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✨</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Name Your App</h2>
        <p className="text-gray-500">
          Choose a unique name for your app. This will be your URL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            App Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value.toLowerCase())}
              placeholder="my-awesome-app"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400 text-lg"
              autoFocus
            />
            {checking && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!checking && isAvailable === true && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600">
                <Check className="w-6 h-6" />
              </div>
            )}
            {!checking && isAvailable === false && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                <X className="w-6 h-6" />
              </div>
            )}
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}

          {isAvailable && preview && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 text-sm mb-1">Available!</p>
              <p className="text-black font-medium">
                Your app will be at: <span className="text-green-700">{preview}</span>
              </p>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-400">
          <p>Requirements:</p>
          <ul className="list-disc list-inside mt-1">
            <li>3-50 characters</li>
            <li>Lowercase letters, numbers, and hyphens only</li>
            <li>Must be unique on Vercel</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || !isAvailable}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Continue to Deploy
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
