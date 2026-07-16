'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Smartphone } from 'lucide-react';
import Link from 'next/link';

const heroTags = [
  { line1: "Your site.", line2: "Your audience.", line3: "Yours." },
  { line1: "Stop building", line2: "on rented", line3: "land." },
  { line1: "Your phone", line2: "builds websites", line3: "now." },
  { line1: "A real website.", line2: "Live in", line3: "20 minutes." },
  { line1: "Own your", line2: "corner of", line3: "the internet." },
  { line1: "Describe it.", line2: "It", line3: "exists." },
  { line1: "Your audience.", line2: "Your list.", line3: "Your site." },
  { line1: "No laptop.", line2: "No code.", line3: "No fees." },
  { line1: "From idea", line2: "to URL.", line3: "That fast." },
  { line1: "Create from", line2: "anywhere. Own it", line3: "forever." },
];

const VibeStarterHero = () => {
  const [currentTagIndex, setCurrentTagIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Rotate every 4 seconds with fade transition
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentTagIndex((prev) => (prev + 1) % heroTags.length);
        setIsVisible(true);
      }, 300); // Wait for fade out before changing

    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentTag = heroTags[currentTagIndex];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Mobile-focused container */}
      <div className="mx-auto max-w-md bg-white min-h-[800px] border-x border-gray-100 relative overflow-hidden flex flex-col">

        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-6">
          <div className="h-6 w-6 bg-black rounded-full" />
          <Link
            href="/setup"
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            Have a key?
          </Link>
        </nav>

        {/* Main Hero Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">

          {/* 1. THE MASSIVE STATIC HEADER */}
          <h1 className="w-full text-center font-black tracking-tighter leading-[0.85] text-7xl sm:text-8xl md:text-9xl mb-8">
            VIBE
            <br />
            STARTER
          </h1>

          {/* 2. THE ROTATING SUB-HERO */}
          <div className="h-[100px] flex items-center justify-center mb-8">
            <p
              className={`max-w-[300px] text-center text-xl font-bold leading-tight tracking-tight text-gray-900 transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {currentTag.line1}
              <br />
              {currentTag.line2}
              <br />
              {currentTag.line3}
            </p>
          </div>

          {/* 3. CTA BUTTONS */}
          <div className="flex flex-col w-full max-w-[300px] gap-3">
            <Link
              href="/setup"
              className="flex items-center justify-center w-full bg-black text-white h-12 rounded-lg font-bold text-base hover:bg-gray-800 transition-colors"
            >
              Launch Your Site — Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="#how-it-works"
              className="flex items-center justify-center w-full bg-gray-100 text-black h-12 rounded-lg font-semibold text-base hover:bg-gray-200 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          {/* Trust indicator */}
          <div className="mt-12 flex items-center gap-2 text-xs font-medium text-gray-500">
            <Smartphone className="h-4 w-4" />
            <span>Build from your phone in 20 mins</span>
          </div>

          {/* Subtle rotation indicator */}
          <div className="mt-6 flex gap-1">
            {heroTags.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                  index === currentTagIndex ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default VibeStarterHero;
