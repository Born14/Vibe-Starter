'use client';

import Link from 'next/link';
import { Inter } from 'next/font/google';
import { ArrowRight, Check } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const included = [
  "Live site in 20 minutes",
  "Real database that stores data",
  "User signups and logins",
  "Auto-deploy when you push",
  "Build from your phone",
  "All accounts in your name",
  "Open source — inspect every line",
];

export default function Pricing() {
  return (
    <section id="launch" className={`py-16 px-4 bg-white ${inter.className}`}>
      <div className="mx-auto max-w-md">

        {/* The card */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">

          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-black">Free</div>
            <p className="text-gray-500 text-sm mt-1">No payment. No subscription.</p>
          </div>

          {/* What's included */}
          <ul className="space-y-3 mb-8">
            {included.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-black flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/setup"
            className="flex items-center justify-center w-full bg-black text-white h-12 rounded-lg font-bold text-base hover:bg-gray-800 transition-colors"
          >
            Launch Your Site
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          {/* Reassurance */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Grab a free license key and go — no account needed
          </p>

        </div>

        {/* Free tier explanation */}
        <div className="mt-6 text-center">
          <p className="text-sm font-semibold text-black mb-1">
            And it&apos;s free to run
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            The services have generous free tiers. You&apos;ll only pay them if your site actually gets popular — and by then, you&apos;ll want to.
          </p>
        </div>

      </div>
    </section>
  );
}
