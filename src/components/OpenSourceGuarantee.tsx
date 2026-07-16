'use client';

import { Inter } from 'next/font/google';
import { Github, Code, Users, GitFork } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const stats = [
  { icon: Code, label: "Every line public", value: "100%" },
  { icon: GitFork, label: "Fork it yourself", value: "Free" },
  { icon: Users, label: "Community contributions", value: "Welcome" },
];

export default function OpenSourceGuarantee() {
  return (
    <section className={`py-12 px-4 bg-black text-white ${inter.className}`}>
      <div className="mx-auto max-w-md text-center">

        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
          <Github className="h-4 w-4" />
          <span className="text-xs font-medium">MIT Licensed</span>
        </div>

        <h2 className="text-xl font-bold mb-2">
          Most starter kits hide their code until you pay.
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          We publish everything. Read it. Fork it. Have a developer review it.
          And it&apos;s completely free.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-1 text-gray-400" />
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
