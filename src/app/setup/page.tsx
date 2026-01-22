"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Anton } from "next/font/google";
import { Inter } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { storeCsrfToken } from "@/lib/api-client";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
        // Store session ID, CSRF token, and redirect to wizard
        sessionStorage.setItem("wizardSessionId", data.sessionId);
        sessionStorage.setItem("userEmail", data.email);
        if (data.csrfToken) {
          storeCsrfToken(data.csrfToken);
        }
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
    <div className={`min-h-screen bg-white text-black ${inter.className}`}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            VIBE STARTER
          </Link>
          <Link
            href="/education"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            How to Build
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 py-16">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className={`${anton.className} text-[12vw] md:text-[6vw] leading-none tracking-tighter mb-4`}>
              LAUNCH
            </h1>
            <p className="text-gray-500">
              Enter your license key to start
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="key" className="block text-sm font-semibold mb-2">
                License Key
              </label>
              <input
                type="text"
                id="key"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="VS-XXXX-XXXX-XXXX"
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400 uppercase tracking-widest text-center font-mono text-lg"
                autoComplete="off"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !licenseKey.trim()}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  Start Launch
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* No key link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have a license key?{" "}
              <Link href="/#pricing" className="text-black font-medium hover:underline">
                Get one here
              </Link>
            </p>
          </div>

          {/* Before you begin */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="font-semibold text-black mb-4">Before you begin:</p>
            <p className="text-sm text-gray-600 mb-4">
              Create free accounts on these platforms (all have free tiers):
            </p>
            <div className="space-y-2">
              {[
                { name: "GitHub", url: "https://github.com/signup", desc: "stores your code" },
                { name: "Vercel", url: "https://vercel.com/signup", desc: "hosts your site" },
                { name: "Neon", url: "https://neon.tech", desc: "your database" },
                { name: "Clerk", url: "https://clerk.com", desc: "user sign-in" },
                { name: "AI Provider", url: null, desc: "Anthropic, Google AI, or OpenAI" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">•</span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black font-medium hover:underline"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <span className="text-black font-medium">{item.name}</span>
                  )}
                  <span className="text-gray-500">– {item.desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Takes ~10 minutes to set up all accounts
            </p>
          </div>

          {/* What happens next */}
          <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="font-semibold text-black mb-4">What happens next:</p>
            <div className="space-y-3">
              {[
                "Connect GitHub (for your code)",
                "Set up Vercel (free hosting)",
                "Set up Clerk (user sign-in)",
                "Set up Neon (database)",
                "Add AI key (Claude, Gemini, or OpenAI)",
                "Name your site & deploy",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-600">{step}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-gray-400 text-center">
              Total time: ~20 minutes
            </p>
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
        <div className={`min-h-screen bg-white text-black flex items-center justify-center ${inter.className}`}>
          <div className="text-gray-400">Loading...</div>
        </div>
      }
    >
      <SetupForm />
    </Suspense>
  );
}
