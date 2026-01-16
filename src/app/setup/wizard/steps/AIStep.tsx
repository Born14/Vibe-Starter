"use client";

import { useState } from "react";

interface SessionData {
  hasAi: boolean;
}

interface StepProps {
  sessionId: string;
  session: SessionData | null;
  onNext: () => void;
  onRefresh: () => void;
}

export default function AIStep({ sessionId, session, onNext, onRefresh }: StepProps) {
  const [aiProvider, setAiProvider] = useState<"claude" | "gemini" | "openai">("claude");
  const [aiKey, setAiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isConnected = session?.hasAi;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate key format based on provider
      if (aiProvider === "claude" && !aiKey.startsWith("sk-ant-")) {
        throw new Error("Claude API key should start with sk-ant-");
      }
      if (aiProvider === "gemini" && !aiKey.startsWith("AIza")) {
        throw new Error("Gemini API key should start with AIza");
      }
      if (aiProvider === "openai" && !aiKey.startsWith("sk-")) {
        throw new Error("OpenAI API key should start with sk-");
      }

      // Save provider
      const res1 = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "aiProvider", value: aiProvider }),
      });
      if (!res1.ok) throw new Error("Failed to save AI provider");

      // Save key
      const res2 = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "aiKey", value: aiKey }),
      });
      if (!res2.ok) throw new Error("Failed to save API key");

      onRefresh();
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setError("");
    setLoading(true);

    try {
      // Use special skipAi field to advance step without setting keys
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, field: "skipAi", value: true }),
      });
      if (!res.ok) throw new Error("Failed to skip AI setup");

      onRefresh();
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openClaude = () => {
    window.open("https://console.anthropic.com/", "_blank");
  };

  const openGemini = () => {
    window.open("https://aistudio.google.com/apikey", "_blank");
  };

  const openOpenAI = () => {
    window.open("https://platform.openai.com/api-keys", "_blank");
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🤖</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Set Up AI</h2>
        <p className="text-white/60">
          Connect an AI to power your app&apos;s intelligent features.
        </p>
      </div>

      {isConnected ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-orange-400/20 text-orange-400 px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">AI Connected</span>
          </div>

          <button
            onClick={onNext}
            className="block w-full max-w-sm mx-auto bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-orange-400 transition-colors"
          >
            Continue →
          </button>
        </div>
      ) : (
        <>
          {/* Provider Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setAiProvider("claude")}
              className={`p-4 rounded-xl border-2 transition-all ${
                aiProvider === "claude"
                  ? "border-orange-400 bg-orange-400/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-semibold">Claude</div>
              <div className="text-xs text-white/50">Recommended</div>
            </button>
            <button
              type="button"
              onClick={() => setAiProvider("gemini")}
              className={`p-4 rounded-xl border-2 transition-all ${
                aiProvider === "gemini"
                  ? "border-blue-400 bg-blue-400/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="text-2xl mb-2">✨</div>
              <div className="font-semibold">Gemini</div>
              <div className="text-xs text-white/50">Google AI</div>
            </button>
            <button
              type="button"
              onClick={() => setAiProvider("openai")}
              className={`p-4 rounded-xl border-2 transition-all ${
                aiProvider === "openai"
                  ? "border-green-400 bg-green-400/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold">OpenAI</div>
              <div className="text-xs text-white/50">ChatGPT API</div>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <h4 className="font-semibold mb-3">
              Get your {aiProvider === "claude" ? "Claude" : aiProvider === "gemini" ? "Gemini" : "OpenAI"} API Key:
            </h4>
            <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
              {aiProvider === "claude" ? (
                <>
                  <li>Click &quot;Open Anthropic Console&quot; below</li>
                  <li>Sign in or create an account</li>
                  <li>Go to API Keys and create a new key</li>
                  <li>Copy and paste it below</li>
                </>
              ) : aiProvider === "gemini" ? (
                <>
                  <li>Click &quot;Open Google AI Studio&quot; below</li>
                  <li>Sign in with your Google account</li>
                  <li>Click &quot;Create API Key&quot;</li>
                  <li>Copy and paste it below</li>
                </>
              ) : (
                <>
                  <li>Click &quot;Open OpenAI Platform&quot; below</li>
                  <li>Sign in or create an account</li>
                  <li>Go to API Keys and create a new key</li>
                  <li>Copy and paste it below</li>
                </>
              )}
            </ol>
          </div>

          <button
            onClick={aiProvider === "claude" ? openClaude : aiProvider === "gemini" ? openGemini : openOpenAI}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors mb-6 ${
              aiProvider === "claude"
                ? "bg-orange-600 hover:bg-orange-500 text-white"
                : aiProvider === "gemini"
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            Open {aiProvider === "claude" ? "Anthropic Console" : aiProvider === "gemini" ? "Google AI Studio" : "OpenAI Platform"} →
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                API Key
              </label>
              <input
                type="password"
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                placeholder={aiProvider === "claude" ? "sk-ant-..." : aiProvider === "gemini" ? "AIza..." : "sk-..."}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-white/40 font-mono text-sm"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !aiKey}
              className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save & Continue →"}
            </button>
          </form>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip for now - Add AI later
          </button>
        </>
      )}

      {/* Note about Claude Max */}
      <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-white/60 text-sm">
          <strong>Have Claude Max?</strong> You can still use the API for your app.
          Your Claude subscription is for chatting; the API is for building features.
        </p>
      </div>
    </div>
  );
}
