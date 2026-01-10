"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function SetupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyFromUrl = searchParams.get("key") || "";

  const [licenseKey, setLicenseKey] = useState(keyFromUrl);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/validate-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: licenseKey.trim().toUpperCase() }),
      });

      const data = await response.json();

      if (data.valid) {
        // Store session ID and redirect to wizard
        sessionStorage.setItem("wizardSessionId", data.sessionId);
        sessionStorage.setItem("userEmail", data.email);
        router.push("/setup/wizard");
      } else {
        setError(data.error || "Invalid license key");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold tracking-tight mb-2">
            vibe<span className="text-emerald-400">starter</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-white/60">
            Enter your license key to start setup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="key" className="block text-sm font-medium mb-2">
              License Key
            </label>
            <input
              type="text"
              id="key"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="VS-XXXX-XXXX-XXXX"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder-white/40 uppercase tracking-widest text-center font-mono"
              autoComplete="off"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !licenseKey.trim()}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Validating..." : "Start Setup"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/40">
            Don&apos;t have a license key?{" "}
            <a href="/#pricing" className="text-emerald-400 hover:underline">
              Get one here
            </a>
          </p>
        </div>

        <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="text-sm text-white/60">
            <p className="font-medium text-white mb-2">What happens next:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Connect GitHub (for your code)</li>
              <li>Set up Vercel (free hosting)</li>
              <li>Set up Clerk (user sign-in)</li>
              <li>Set up Neon (database)</li>
              <li>Add AI key (Claude or Gemini)</li>
              <li>Name your app & deploy</li>
            </ul>
            <p className="mt-3 text-white/40">Total time: ~20 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      }
    >
      <SetupForm />
    </Suspense>
  );
}
