'use client';

import { Inter } from 'next/font/google';
import { Github, Eye, Shield, Package } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const trustPoints = [
  {
    icon: Eye,
    title: "Fully open source",
    description: "Every line of code is public. Nothing hidden.",
  },
  {
    icon: Shield,
    title: "We never see your keys",
    description: "You connect your own accounts. We can't access them.",
  },
  {
    icon: Package,
    title: "You own everything",
    description: "Code, data, accounts — all in your name.",
  },
];

export default function Trust() {
  return (
    <section className={`py-16 px-4 bg-white ${inter.className}`}>
      <div className="mx-auto max-w-md">

        {/* Section header */}
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          Don't trust us. Read the code.
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          Everything is public. That's the point.
        </p>

        {/* Trust points */}
        <div className="space-y-4 mb-8">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <point.icon className="h-5 w-5 text-black flex-shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <div className="font-semibold text-sm text-black">
                  {point.title}
                </div>
                <div className="text-xs text-gray-500">
                  {point.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <a
          href="https://github.com/Born14/vibe-starter"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-black text-white h-12 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          <Github className="h-5 w-5" />
          View on GitHub
        </a>

        {/* Extra reassurance */}
        <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
          After launch, we literally can't access your stuff — even if we wanted to. You have the accounts. You have the keys.
        </p>

        {/* Ownership anchor */}
        <p className="mt-4 text-sm font-medium text-black text-center">
          Your home base on the internet. No landlord.
        </p>

      </div>
    </section>
  );
}
