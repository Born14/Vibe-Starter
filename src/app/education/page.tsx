"use client";

import Link from "next/link";
import { Anton } from "next/font/google";
import { Inter } from "next/font/google";
import { ArrowRight, Smartphone, Monitor, MessageSquare, GitBranch, RefreshCw, AlertCircle } from "lucide-react";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function EducationPage() {
  return (
    <div className={`min-h-screen bg-white text-black ${inter.className}`}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            VIBE STARTER
          </Link>
          <Link
            href="/setup"
            className="text-sm bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Launch
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl text-center">
          <h1 className={`${anton.className} text-[10vw] md:text-[6vw] leading-none tracking-tighter mb-6`}>
            HOW TO BUILD
          </h1>
          <p className="text-xl font-bold text-gray-900 mb-4">
            After launch, building is simple.
            <br />
            Describe what you want. AI builds it.
          </p>
          <p className="text-gray-500 text-sm">
            No code. No laptop required. Just your phone.
          </p>
        </div>
      </section>

      {/* The Loop */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-2">The Loop</h2>
          <p className="text-center text-gray-500 text-sm mb-10">
            This is all you do. Repeat forever.
          </p>

          <div className="space-y-4">
            {[
              { num: "1", text: "Open Claude on your phone", detail: "Or any AI with GitHub access" },
              { num: "2", text: "Connect to your repo", detail: "The one created during launch" },
              { num: "3", text: "Describe what you want", detail: '"Add a page where users can save notes"' },
              { num: "4", text: "AI creates a pull request", detail: "Review the changes on GitHub" },
              { num: "5", text: "Merge it", detail: "Your site updates automatically" },
            ].map((step) => (
              <div key={step.num} className="flex gap-4 items-start bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-black">{step.text}</div>
                  <div className="text-sm text-gray-500 mt-1">{step.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-black text-white rounded-xl p-5 text-center">
            <p className="font-semibold">That's it. Repeat this loop to build your entire site.</p>
          </div>
        </div>
      </section>

      {/* Connect Claude to GitHub */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-2">Connect Claude to Your Repo</h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            One-time setup. Takes 2 minutes.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <p className="font-semibold text-black mb-4">Before you can build from your phone:</p>
            <div className="space-y-4">
              {[
                { step: "1", title: "Get Claude Pro or Max", detail: "The free tier doesn't include GitHub access. You need a Claude subscription ($20/month)." },
                { step: "2", title: "Download the Claude app", detail: "iOS App Store or Google Play. Sign in with your account." },
                { step: "3", title: "Tap the Code icon", detail: "Bottom of the screen. This is where Claude connects to repos." },
                { step: "4", title: "Connect GitHub", detail: "Tap 'Connect GitHub' and authorize Claude to access your repositories." },
                { step: "5", title: "Select your repo", detail: "Find the repo created during launch (your app name). Tap to select it." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-black">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black text-white rounded-xl p-5">
            <p className="font-semibold mb-2">Now Claude can see your code and push changes.</p>
            <p className="text-sm text-gray-300">
              When you describe a feature, Claude writes the code, creates a pull request, and you merge it. Your site updates automatically.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Don't have Claude Pro? You can still build from a laptop using any AI — just push code manually via GitHub.
          </p>
        </div>
      </section>

      {/* Try This Now */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-2">Try This Right Now</h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Your first feature. Takes 5 minutes.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Say this to Claude:</p>
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <p className="font-medium text-black">
                "Add a /notes page where users can create, view, and delete their notes. Save them to the database."
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Claude creates the page, adds database tables, wires up the backend, and makes a PR.
              You merge it. Feature ships in 2 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* What You Can Build */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-2">What You Can Build</h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Just describe it. AI figures out the rest.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              "User profiles",
              "Dashboard with stats",
              "Contact forms",
              "Search functionality",
              "Admin panel",
              "Email notifications",
              "File uploads",
              "Payment integration",
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2">
                <span className="text-black">✓</span>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When Things Break */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-2">When Something Breaks</h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Same loop. Just paste the error.
          </p>

          <div className="space-y-4 mb-8">
            {[
              "Something breaks",
              "Open Vercel app → find error in logs",
              "Copy the error",
              'Paste to Claude: "Fix this"',
              "Claude fixes it, creates PR",
              "Merge it. Fixed.",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                  {i + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <p className="font-semibold text-black mb-2">You don't need to understand the error.</p>
            <p className="text-sm text-gray-600">
              Just copy it and paste it to Claude. Claude understands it and fixes it.
            </p>
          </div>
        </div>
      </section>

      {/* What You Own */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-2">What You Own</h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            All of this is in your name. Not ours.
          </p>

          <div className="space-y-3">
            {[
              { service: "GitHub", role: "Your code", link: "github.com" },
              { service: "Vercel", role: "Your hosting", link: "vercel.com" },
              { service: "Clerk", role: "Your user logins", link: "clerk.com" },
              { service: "Neon", role: "Your database", link: "neon.tech" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                <div>
                  <div className="font-semibold text-black">{item.service}</div>
                  <div className="text-sm text-gray-500">{item.role}</div>
                </div>
                <div className="text-sm text-gray-400">{item.link}</div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            You own everything. No lock-in. Export and move anytime.
          </p>
        </div>
      </section>

      {/* Mobile vs Laptop */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">When to Use What</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Mobile */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="h-5 w-5" />
                <span className="font-semibold">Phone</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Adding features</li>
                <li>• Quick fixes</li>
                <li>• Building during downtime</li>
                <li>• Merging PRs</li>
              </ul>
              <p className="mt-4 text-xs text-gray-400">
                Most people do everything from mobile
              </p>
            </div>

            {/* Laptop */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="h-5 w-5" />
                <span className="font-semibold">Laptop</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Complex multi-file changes</li>
                <li>• Deep debugging</li>
                <li>• Large refactors</li>
                <li>• Reviewing lots of code</li>
              </ul>
              <p className="mt-4 text-xs text-gray-400">
                Nice to have, not required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">Tips</h2>

          <div className="space-y-4">
            {/* Good prompts */}
            <div>
              <p className="font-semibold text-black mb-3">Good prompts:</p>
              <div className="space-y-2">
                {[
                  "Add a page where users can upload a profile photo",
                  "Create a feedback form that saves to the database",
                  "Add a dashboard that shows the user's recent items",
                ].map((prompt, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-gray-200 text-sm text-gray-700">
                    "{prompt}"
                  </div>
                ))}
              </div>
            </div>

            {/* Bad prompts */}
            <div className="mt-6">
              <p className="font-semibold text-gray-400 mb-3">Vague prompts (avoid):</p>
              <div className="space-y-2">
                {[
                  "Make it better",
                  "Add some features",
                  "Improve the design",
                ].map((prompt, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-3 text-sm text-gray-400 line-through">
                    "{prompt}"
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-black text-white rounded-xl p-5">
            <p className="font-semibold mb-2">One feature at a time.</p>
            <p className="text-sm text-gray-300">
              Build one thing. Test it. Make sure it works. Then build the next.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl text-center">
          <h2 className={`${anton.className} text-[8vw] md:text-[5vw] leading-none tracking-tighter mb-6`}>
            READY?
          </h2>
          <p className="text-gray-600 mb-8">
            Launch in 20 minutes. Then start building from your phone.
          </p>
          <Link
            href="/setup"
            className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors"
          >
            Launch – $39
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-black text-white">
        <div className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl text-center">
          <div className="text-lg font-bold tracking-tight mb-4">VIBE STARTER</div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <a
              href="https://github.com/Born14/vibe-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a href="mailto:vibestarter26@outlook.com" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
          <p className="text-xs text-gray-600">© 2026 Vibe Starter</p>
        </div>
      </footer>
    </div>
  );
}
