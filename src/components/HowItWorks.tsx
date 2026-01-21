'use client';

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const steps = [
  {
    number: "01",
    title: "Connect your accounts",
    description: "We walk you through GitHub, Vercel, and Neon. You create them — you own them forever.",
  },
  {
    number: "02",
    title: "Name your site",
    description: "Pick a name. We check if it's available. Your site will be live at yourname.vercel.app.",
  },
  {
    number: "03",
    title: "Hit launch",
    description: "We create your repo, set up the database, wire everything together, and deploy. Takes 2 minutes.",
  },
  {
    number: "04",
    title: "Build with AI",
    description: "Open your AI. Describe what you want. It pushes to GitHub. Your site updates automatically.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={`py-16 px-4 bg-gray-50 ${inter.className}`}>
      <div className="mx-auto max-w-md">

        {/* Section header */}
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          How it works
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          20 minutes. No code. Just clicks.
        </p>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="text-3xl font-bold text-gray-200">
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The loop */}
        <div className="mt-10 bg-black text-white rounded-xl p-5">
          <p className="text-sm font-semibold mb-2">
            After launch, the loop is simple:
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Describe → AI builds → Site updates.
            <br />
            From your phone. From anywhere.
          </p>
        </div>

      </div>
    </section>
  );
}
