"use client";

import { useState } from "react";

interface WaitlistFormProps {
  variant?: "inline" | "button";
  buttonText?: string;
  buttonClassName?: string;
}

export function WaitlistForm({
  variant = "inline",
  buttonText = "Join Waitlist",
  buttonClassName = ""
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (variant === "button") {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        {status === "success" ? (
          <div className="text-center">
            <div className={buttonClassName}>
              ✓ {message}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === "loading"}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className={buttonClassName}
              >
                {status === "loading" ? "Joining..." : buttonText}
              </button>
            </div>
            {status === "error" && (
              <p className="text-red-400 text-sm text-center">{message}</p>
            )}
          </>
        )}
      </form>
    );
  }

  // Inline variant (simple inline form)
  return (
    <div className="w-full max-w-md mx-auto">
      {status === "success" ? (
        <div className="text-center bg-emerald-500/20 border border-emerald-500/40 rounded-lg p-4 text-emerald-300">
          ✓ {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Joining..." : "Notify Me"}
            </button>
          </div>
          {status === "error" && (
            <p className="text-red-400 text-sm">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
