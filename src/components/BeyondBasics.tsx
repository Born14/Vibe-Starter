'use client';

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function BeyondBasics() {
  return (
    <section className={`py-20 px-4 bg-gray-50 ${inter.className}`}>
      <div className="mx-auto max-w-md">

        {/* Section header */}
        <h2 className="text-2xl font-bold text-center text-black mb-3">
          More powerful than it looks
        </h2>

        <p className="text-center text-gray-600 mb-10 text-sm">
          Start simple. Grow bigger.
        </p>

        {/* Two columns: Start with / Grow into */}
        <div className="grid grid-cols-2 gap-4 mb-10">

          {/* Left column - what beginners build */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
              Start with
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Landing pages</li>
              <li>• Email collection</li>
              <li>• Simple forms</li>
              <li>• Personal sites</li>
              <li>• Small tools</li>
            </ul>
          </div>

          {/* Right column - what's possible */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
              Grow into
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Communities</li>
              <li>• Member areas</li>
              <li>• Interactive tools</li>
              <li>• Small games</li>
              <li>• Data dashboards</li>
            </ul>
          </div>

        </div>

        {/* Honest disclaimer */}
        <div className="bg-black text-white rounded-xl p-5">
          <p className="text-sm leading-relaxed">
            This is a real web stack — the same foundation used by startups and
            production apps. What you build is limited only by imagination and
            what AI can help create.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Most people start small. Some build far more than they expected.
          </p>
        </div>

      </div>
    </section>
  );
}
