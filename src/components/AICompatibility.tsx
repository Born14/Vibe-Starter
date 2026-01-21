'use client';

import { Inter } from 'next/font/google';
import { GitBranch, Eye, GitCommit, Rocket } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const capabilities = [
  {
    icon: Eye,
    text: "See your repository",
  },
  {
    icon: GitBranch,
    text: "Generate changes",
  },
  {
    icon: GitCommit,
    text: "Create commits or pull requests",
  },
  {
    icon: Rocket,
    text: "Trigger automatic deployment",
  },
];

export default function AICompatibility() {
  return (
    <section className={`py-16 px-4 bg-white ${inter.className}`}>
      <div className="mx-auto max-w-md">

        {/* Section header */}
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          AI Compatibility
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          How building from your phone works
        </p>

        {/* Main explanation */}
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed mb-8">
          <p>
            Any AI can help you write code.
          </p>
          <p>
            But to build entirely from your phone — where the AI can push real changes directly to your site — you need an AI that can connect to GitHub and create commits.
          </p>
          <p className="font-medium text-black">
            Today, Claude offers the most seamless mobile workflow for this.
          </p>
          <p className="text-xs text-gray-500">
            (Requires Claude Pro or Max subscription for GitHub integration)
          </p>
        </div>

        {/* Capabilities */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6">
          <p className="text-sm font-semibold text-black mb-4">It can:</p>
          <div className="space-y-3">
            {capabilities.map((cap, index) => (
              <div key={index} className="flex items-center gap-3">
                <cap.icon className="h-4 w-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
                <span className="text-sm text-gray-600">{cap.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to connect */}
        <div className="bg-black text-white rounded-xl p-5 mb-6">
          <p className="text-sm font-semibold mb-3">How to connect (after launch):</p>
          <ol className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="text-white font-semibold">1.</span>
              <span>Download the Claude app (iOS/Android)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-white font-semibold">2.</span>
              <span>Tap the <span className="text-white font-medium">Code</span> icon</span>
            </li>
            <li className="flex gap-2">
              <span className="text-white font-semibold">3.</span>
              <span>Connect your GitHub account</span>
            </li>
            <li className="flex gap-2">
              <span className="text-white font-semibold">4.</span>
              <span>Select your repository</span>
            </li>
          </ol>
          <p className="mt-3 text-xs text-gray-400">
            Now describe what you want → Claude builds it → Your site updates
          </p>
        </div>

        {/* The loop explanation */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          That's what makes the "describe → build → live" loop possible.
        </p>

        {/* No lock-in message */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">
            If another AI adds the same capabilities in the future, it will work too. You're not locked into any model — this is about what's technically possible right now.
          </p>
        </div>

        {/* Summary */}
        <p className="mt-8 text-xs text-gray-400 text-center leading-relaxed">
          Vibe Starter works with any AI — but if you want to build from your phone, you'll want one that can push code to GitHub. Today, Claude does this best.
        </p>

      </div>
    </section>
  );
}
