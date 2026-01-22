'use client';

import { Inter } from 'next/font/google';
import {
  Mail,
  Users,
  Lock,
  Smartphone,
  Globe,
  Database
} from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const creatorUseCases = [
  {
    icon: Mail,
    title: "Collect emails",
    description: "Your list. Not Mailchimp's.",
  },
  {
    icon: Users,
    title: "Build a community",
    description: "Members who sign up to your site.",
  },
  {
    icon: Lock,
    title: "Members-only areas",
    description: "Content for people who log in.",
  },
  {
    icon: Database,
    title: "Store anything",
    description: "Posts, profiles, submissions.",
  },
  {
    icon: Smartphone,
    title: "Update from your phone",
    description: "No laptop. No code editor.",
  },
  {
    icon: Globe,
    title: "Own it forever",
    description: "Platforms change. This won't.",
  },
];

export default function ForCreators() {
  return (
    <section className={`py-16 px-4 bg-white ${inter.className}`}>
      <div className="mx-auto max-w-md">

        {/* Section header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            For creators
          </p>
          <h2 className="text-2xl font-bold text-black mb-3">
            Your own corner of the internet
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Not Instagram. Not Substack. Not someone else&apos;s platform.
            A real website that you control, updated from your phone.
          </p>
        </div>

        {/* Use cases grid */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {creatorUseCases.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <item.icon className="h-5 w-5 text-black mb-2" strokeWidth={2} />
              <div className="font-semibold text-sm text-black mb-1">
                {item.title}
              </div>
              <div className="text-xs text-gray-500">
                {item.description}
              </div>
            </div>
          ))}
        </div>

        {/* The real talk */}
        <div className="bg-black text-white rounded-xl p-5">
          <p className="text-sm font-semibold mb-2">
            Why this matters
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Platforms can ban you. Algorithms can bury you. Terms of service
            can change overnight. When you own your site and your data,
            none of that matters.
          </p>
        </div>

        {/* Portable infrastructure note */}
        <p className="mt-6 text-xs text-gray-400 text-center">
          Your code lives on GitHub. Your data lives in your database.
          If any service disappears, you take everything and move.
        </p>

      </div>
    </section>
  );
}
