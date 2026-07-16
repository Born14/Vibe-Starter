'use client';

import { useState, useEffect } from 'react';
import { Anton } from 'next/font/google';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { ArrowRight, Smartphone } from 'lucide-react';

const taglines = [
  "Own your stack.\nBuild with AI.\nShip from anywhere.",
  "Your site.\nYour audience.\nYours.",
  "Stop building\non rented\nland.",
  "Your phone\nbuilds websites\nnow.",
  "A real website.\nLive in\n20 minutes.",
  "Own your\ncorner of\nthe internet.",
  "Describe it.\nIt exists.",
  "Your audience.\nYour list.\nYour site.",
  "No laptop.\nNo code.\nNo fees.",
  "From idea\nto URL.\nThat fast.",
  "Not a profile.\nA property.",
  "Your name.\nYour domain.\nYour rules.",
  "One URL.\nYours forever.",
  "Build equity\nin yourself,\nnot a platform.",
  "Your brand\ndeserves\na home.",
  "Send your ads\nsomewhere\nyou own.",
  "Open source.\nRead the code\nbefore you buy.",
];

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % taglines.length);
        setIsVisible(true);
      }, 300);

    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`min-h-screen bg-white text-black ${inter.className}`}>
      {/* Centered container - mobile narrow, desktop wider */}
      <div className="mx-auto w-full max-w-md md:max-w-2xl lg:max-w-4xl min-h-screen flex flex-col">

        {/* Nav */}
        <nav className="flex items-center justify-between px-4 py-4">
          <div className="h-5 w-5 bg-black rounded-full" />
          <Link
            href="/setup"
            className="text-xs font-medium text-gray-500 hover:text-black transition-colors"
          >
            Have a key?
          </Link>
        </nav>

        {/* Main content - vertically centered */}
        <main className="flex-1 flex flex-col justify-center px-2">

          {/* THE MASSIVE HEADER - wheatpaste poster style */}
          <h1
            className={`${anton.className} text-[12vw] md:text-[9vw] leading-none tracking-tighter text-center select-none whitespace-nowrap`}
          >
            VIBE STARTER
          </h1>

          {/* Rotating taglines - extreme scale contrast */}
          <div className="mt-6 h-[84px] flex items-center justify-center px-4">
            <p
              className={`text-center text-xl md:text-2xl font-bold leading-tight tracking-tight text-gray-900 whitespace-pre-line transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {taglines[currentIndex]}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-3 px-6">
            <Link
              href="#launch"
              className="flex items-center justify-center w-full bg-black text-white h-12 rounded-lg font-bold text-base hover:bg-gray-800 transition-colors"
            >
              Launch — Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="#how-it-works"
              className="flex items-center justify-center w-full bg-gray-100 text-black h-12 rounded-lg font-semibold text-base hover:bg-gray-200 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          {/* Trust lines */}
          <div className="mt-8 flex flex-col items-center gap-2 text-xs font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>Launch in 20 mins from your phone</span>
            </div>
            <span>Free to run. Pay only if it grows.</span>
            <span>100% open source. Read the code first.</span>
          </div>

        </main>

        {/* Bottom breathing room */}
        <div className="h-8" />

      </div>
    </section>
  );
}
