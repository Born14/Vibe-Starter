"use client";

import { ArrowRight } from "lucide-react";

interface StepProps {
  sessionId: string;
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: StepProps) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">🚀</span>
      </div>

      <h1 className="text-4xl font-bold mb-4">
        Welcome to Vibe Starter
      </h1>

      <p className="text-xl text-gray-500 mb-8 max-w-lg mx-auto">
        In about 20 minutes, you&apos;ll have a live app with authentication,
        a database, and AI — all in accounts you own.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
        <h3 className="font-semibold mb-4">What we&apos;ll set up:</h3>
        <ul className="space-y-3">
          {[
            { icon: "📁", label: "GitHub", desc: "Where your code lives" },
            { icon: "🌐", label: "Vercel", desc: "Puts your app on the internet" },
            { icon: "🔐", label: "Clerk", desc: "User sign-up and sign-in" },
            { icon: "💾", label: "Neon", desc: "Database for your data" },
            { icon: "🤖", label: "AI", desc: "Claude, Gemini, or OpenAI to help you build" },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <span className="font-medium">{item.label}</span>
                <span className="text-gray-500 ml-2">— {item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-black text-white rounded-xl p-4 mb-8 max-w-md mx-auto">
        <p className="text-sm">
          <strong>You own everything.</strong> These are your accounts.
          We just help you set them up.
        </p>
      </div>

      <button
        onClick={onNext}
        className="bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
      >
        Let&apos;s do this
        <ArrowRight className="h-5 w-5" />
      </button>

      <p className="mt-6 text-sm text-gray-400">
        Estimated time: 20 minutes
      </p>
    </div>
  );
}
