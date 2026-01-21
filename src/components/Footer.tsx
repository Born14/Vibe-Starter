'use client';

import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function Footer() {
  return (
    <footer className={`py-10 px-4 bg-black text-white ${inter.className}`}>
      <div className="mx-auto max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-lg font-bold tracking-tight">
            VIBE STARTER
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-8">
          <a
            href="https://github.com/Born14/vibe-starter"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <Link href="/education" className="hover:text-white transition-colors">
            Learn
          </Link>
          <a
            href="mailto:vibestarter26@outlook.com"
            className="hover:text-white transition-colors"
          >
            Support
          </a>
        </div>

        {/* Tagline */}
        <p className="text-center text-xs text-gray-500 mb-4">
          Your site. Your audience. Your phone. Free.
        </p>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-600">
          © 2026 Vibe Starter
        </p>

      </div>
    </footer>
  );
}
