'use client';

import { Inter } from 'next/font/google';
import { Home } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function YourHome() {
  return (
    <section className={`py-20 px-4 bg-white ${inter.className}`}>
      <div className="mx-auto max-w-md">

        {/* Section header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Home className="h-5 w-5 text-black" strokeWidth={2} />
          <h2 className="text-2xl font-bold text-center text-black">
            Your Home on the Internet
          </h2>
        </div>

        {/* Main content block */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">

          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Social platforms are great for discovery. They're not ownership.
          </p>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            A profile can be throttled. A feed can disappear. An algorithm decides who sees you.
          </p>

          <p className="text-black text-sm leading-relaxed font-medium mb-4">
            On your own site: you own the content, the audience, the data. You control what exists.
          </p>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-gray-600 text-sm leading-relaxed italic">
              Use platforms to send people here. Let your site be where things actually live.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
