'use client';

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const faqs = [
  {
    q: "Do I need to know how to code?",
    a: "No. You describe what you want. AI writes the code. You don't touch it.",
  },
  {
    q: "What accounts do I need?",
    a: "Free accounts on GitHub, Vercel, Neon, and Clerk. For your app's AI features, pick any provider (Anthropic, Google, or OpenAI). To build from your phone, you need Claude Pro or Max.",
  },
  {
    q: "Can I really build from my phone?",
    a: "Yes. You need Claude Pro or Max ($20/mo) for GitHub integration. Open Claude, describe a change, it pushes to your site. No laptop needed.",
  },
  {
    q: "What if I get stuck?",
    a: "Ask the AI. That's what it's there for. You can also email us — we actually reply.",
  },
  {
    q: "Is there a monthly fee?",
    a: "Not from us. The services are free to run. You only pay them if your site gets popular.",
  },
  {
    q: "How many sites can I launch?",
    a: "As many as you want. Most people create lots of small projects and never pay anything.",
  },
  {
    q: "What if I want my own domain?",
    a: "Buy one anywhere ($10-15/year). Point it at your site. Takes 2 minutes. Now it's yourname.com.",
  },
  {
    q: "What if Vercel or Neon disappears?",
    a: "Your code is on GitHub. Your data is in your database. You can move everything and redeploy anywhere.",
  },
  {
    q: "Why should I trust you?",
    a: "You shouldn't have to. Unlike most starter kits that hide code until you pay, ours is 100% public on GitHub. Read every line. Have a developer audit it. Fork it. Everything deploys to your own accounts, so there's nothing we could hold hostage even if we wanted to.",
  },
  {
    q: "What's the catch? Why is it free?",
    a: "There isn't one. Vibe Starter used to cost $39, but the guided wizard is now completely free — generate a license key on the setup page and go. The code has always been open source, and everything still deploys to your own accounts.",
  },
];

export default function FAQ() {
  return (
    <section className={`py-16 px-4 bg-gray-50 ${inter.className}`}>
      <div className="mx-auto max-w-md">

        {/* Section header */}
        <h2 className="text-2xl font-bold text-center text-black mb-10">
          Questions
        </h2>

        {/* FAQ list */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-5">
              <h3 className="font-semibold text-black mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
