"use client";

import { useState } from "react";
import Link from "next/link";

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white hover:text-white/80 transition">
            <span>vibe</span><span className="text-orange-400">starter</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/#get-started" className="text-sm text-white/70 hover:text-white transition">
              Get Started
            </Link>
            <Link href="/" className="text-sm bg-orange-400 text-black px-4 py-2 rounded-full font-semibold hover:bg-orange-300 transition">
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <div className="inline-block bg-orange-400/20 text-orange-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            For Claude Developers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Building with Claude.
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              From Anywhere.
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Claude is your complete development environment. Here&apos;s how to use it to build and ship real apps.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-24">

          {/* Section 1: The Simple Way */}
          <Section title="Start Building (The Simple Way)" id="getting-started">

            <div className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                The 5-Step Loop
              </h3>
              <div className="space-y-4">
                {[
                  { num: "1", text: "Open Claude Code mobile app", detail: "Download from App Store or Play Store" },
                  { num: "2", text: "Connect to your GitHub repo", detail: "The one created by the wizard" },
                  { num: "3", text: "Say what you want", detail: '"Add a page where users can save notes"' },
                  { num: "4", text: "Claude creates a pull request", detail: "Review the changes on GitHub" },
                  { num: "5", text: "Merge the PR", detail: "Your site updates automatically (1-2 min)" },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/30 border border-orange-500/50 flex items-center justify-center text-orange-300 font-bold text-lg">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg">{step.text}</div>
                      <div className="text-sm text-white/60 mt-1">{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-8 py-4">
                <p className="text-xl font-semibold text-white">
                  That&apos;s it. Repeat this loop to build your entire app.
                </p>
              </div>
            </div>

            <Subsection title="Your First Feature: Try This Right Now">
              <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                <p className="text-white/70 mb-4">
                  After your wizard completes, try building this:
                </p>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-white/50 mb-2">Say to Claude:</p>
                  <p className="text-white font-medium">
                    &quot;Add a /notes page where users can create, view, and delete their notes. Save them to the database.&quot;
                  </p>
                </div>
                <p className="text-white/70 text-sm">
                  Claude will create the page, add database tables, wire up the backend, and create a PR.
                  You just merge it. Feature ships in 2 minutes.
                </p>
              </div>
            </Subsection>

            <Subsection title="What You Can Build">
              <p className="text-white/70 mb-6">
                Examples of features you can add by just describing them:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "User profiles with photo upload",
                  "Dashboard showing user stats",
                  "Feedback form that emails you",
                  "Search functionality",
                  "Admin panel to view all users",
                  "Payment integration (Stripe)",
                  "Email notifications",
                  "File upload and storage",
                ].map((feature, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start gap-3">
                    <span className="text-orange-400">✓</span>
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-white/60 text-sm italic">
                You describe it. Claude builds it. You merge it. It goes live.
              </p>
            </Subsection>

          </Section>

          {/* Section 2: When Things Break */}
          <Section title="When Something Breaks" id="debugging">

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 mb-8">
              <p className="text-white font-semibold text-lg mb-4">The debugging loop is just as simple:</p>
              <div className="space-y-3 text-white/80">
                {[
                  "1. Something breaks (error page, feature doesn't work)",
                  "2. Open Vercel app on your phone",
                  "3. Find your project → Deployments → Latest → Logs",
                  "4. Copy the error (long press to select)",
                  "5. Paste to Claude Code mobile: \"Here's the error, fix it\"",
                  "6. Claude fixes it and creates a PR",
                  "7. Merge the PR",
                  "8. Fixed (1-2 min later)",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div>{step}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
              <p className="text-white">
                <strong>You don&apos;t need to understand the error.</strong> Just copy it and paste it to Claude.
                Claude understands it and fixes it.
              </p>
            </div>

            <Subsection title="Getting Vercel Logs on Your Phone">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Vercel App */}
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-4">Option 1: Vercel App (Easiest)</h4>
                  <ol className="space-y-2 text-sm text-white/70">
                    <li>1. Download Vercel app (iOS/Android)</li>
                    <li>2. Sign in with your Vercel account</li>
                    <li>3. Tap your project</li>
                    <li>4. Tap &quot;Deployments&quot; tab</li>
                    <li>5. Tap latest deployment</li>
                    <li>6. Scroll to logs section</li>
                    <li>7. Long press on error text → Copy</li>
                  </ol>
                </div>

                {/* Browser */}
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-4">Option 2: Mobile Browser</h4>
                  <ol className="space-y-2 text-sm text-white/70">
                    <li>1. Open vercel.com in browser</li>
                    <li>2. Sign in</li>
                    <li>3. Go to your project</li>
                    <li>4. Click &quot;Deployments&quot;</li>
                    <li>5. Click latest one</li>
                    <li>6. Scroll to logs</li>
                    <li>7. Select and copy error</li>
                  </ol>
                </div>
              </div>

              <div className="mt-6 bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-sm">
                <strong className="text-white">Pro tip:</strong>
                <span className="text-white/70"> Bookmark your Vercel project URL for quick access when debugging.</span>
              </div>
            </Subsection>

          </Section>

          {/* Section 3: Understanding Your Setup */}
          <Section title="Understanding Your Setup" id="understanding">

            <Subsection title="What You Own">
              <p className="text-white/70 mb-6">
                The wizard created these accounts in YOUR name:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white font-semibold">Service</th>
                      <th className="py-3 px-4 text-white font-semibold">What It Does</th>
                      <th className="py-3 px-4 text-white font-semibold">Dashboard</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {[
                      { service: "GitHub", role: "Stores your code", link: "github.com" },
                      { service: "Vercel", role: "Hosts your app", link: "vercel.com" },
                      { service: "Clerk", role: "Handles user login", link: "clerk.com" },
                      { service: "Neon", role: "Stores your data", link: "neon.tech" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-3 px-4 font-semibold text-white">{row.service}</td>
                        <td className="py-3 px-4">{row.role}</td>
                        <td className="py-3 px-4 text-orange-400">{row.link}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-sm text-white/70">
                <strong className="text-white">Why this matters:</strong> You own everything. No lock-in. You can export your code and move to different services anytime.
              </div>
            </Subsection>

            <Subsection title="How It All Connects">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Frontend</h4>
                  <p className="text-sm text-white/60 mb-3">What users see</p>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Pages, buttons, forms</li>
                    <li>• Runs in browser</li>
                    <li>• Built with React</li>
                    <li>• Hosted on Vercel</li>
                  </ul>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Backend</h4>
                  <p className="text-sm text-white/60 mb-3">Business logic</p>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Handles requests</li>
                    <li>• Checks permissions</li>
                    <li>• Processes data</li>
                    <li>• Runs on Vercel</li>
                  </ul>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Database</h4>
                  <p className="text-sm text-white/60 mb-3">Data storage</p>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Saves user data</li>
                    <li>• Postgres on Neon</li>
                    <li>• Auto-updates schema</li>
                    <li>• Scales automatically</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4">What happens when you merge a PR:</h4>
                <div className="space-y-2 text-sm text-white/70 font-mono">
                  {[
                    "1. Code pushed to GitHub",
                    "2. Vercel detects the change",
                    "3. Vercel builds your app",
                    "4. Database schema auto-updates",
                    "5. New version goes live",
                    "6. Your site is updated (1-2 min total)",
                  ].map((step, i) => (
                    <div key={i}>{step}</div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-white/60">
                  All of this happens automatically when you click &quot;Merge&quot; on GitHub.
                </p>
              </div>
            </Subsection>

            <Subsection title="Why This Stack?">
              <div className="space-y-4">
                {[
                  {
                    title: "Production-Ready",
                    desc: "These tools power real companies. Not toys. Your app can scale from 10 users to 10 million without changing anything.",
                  },
                  {
                    title: "Cost-Effective",
                    desc: "Free to start. Most apps run free forever. You only pay when you have real traffic.",
                  },
                  {
                    title: "No Lock-In",
                    desc: "You own all the accounts. Export your code anytime. Switch services if you want. Full control.",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold text-lg mb-2">{item.title}</h4>
                    <p className="text-white/70">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Subsection>

          </Section>

          {/* Section 4: Alternative Tools */}
          <Section title="Using Other AI Tools" id="alternatives">

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
              <p className="text-white/80">
                <strong className="text-white">The simple path above assumes you&apos;re using Claude Code mobile.</strong>
                <br className="mb-2" />
                If you prefer ChatGPT, Gemini, or other tools, here&apos;s what changes:
              </p>
            </div>

            <Subsection title="Using ChatGPT or Gemini (Web)">
              <div className="space-y-4 text-white/70">
                <p>
                  These tools don&apos;t connect directly to GitHub, so you need to give them context about your project:
                </p>
                <ol className="space-y-3 ml-4">
                  <li className="flex gap-3">
                    <span className="text-orange-400 font-semibold">1.</span>
                    <span>Open your GitHub repo</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-400 font-semibold">2.</span>
                    <span>Find and open <code className="bg-white/10 px-2 py-0.5 rounded">PROMPT.md</code></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-400 font-semibold">3.</span>
                    <span>Copy the entire contents</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-400 font-semibold">4.</span>
                    <span>Paste it into ChatGPT/Gemini</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-400 font-semibold">5.</span>
                    <span>Then ask for what you want to build</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-400 font-semibold">6.</span>
                    <span>Copy the generated code back to your repo</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-orange-400 font-semibold">7.</span>
                    <span>Commit and push</span>
                  </li>
                </ol>
                <p className="mt-4 text-sm italic">
                  This works, but it&apos;s more manual. Claude Code mobile is simpler because it can directly create PRs.
                </p>
              </div>
            </Subsection>

            <Subsection title="Using Cursor (Desktop)">
              <div className="space-y-3 text-white/70 text-sm">
                <p>
                  Cursor is a desktop code editor with AI built in. Good for complex multi-file changes:
                </p>
                <ol className="space-y-2 ml-4">
                  <li>1. Install Cursor (cursor.sh)</li>
                  <li>2. Clone your repo locally</li>
                  <li>3. Open project in Cursor</li>
                  <li>4. Use CMD+K to ask Cursor to build features</li>
                  <li>5. Review changes</li>
                  <li>6. Commit and push</li>
                </ol>
                <p className="mt-4 italic">
                  Cursor is powerful but requires a laptop. Most users prefer Claude Code mobile for simplicity.
                </p>
              </div>
            </Subsection>

            <Subsection title="What is PROMPT.md?">
              <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                <p className="text-white/70 mb-4">
                  <code className="bg-white/10 px-2 py-0.5 rounded">PROMPT.md</code> is a file in your repo that explains your project to AI tools.
                </p>
                <p className="text-white/70 mb-4">
                  It contains:
                </p>
                <ul className="space-y-2 text-white/70 ml-4">
                  <li>• Your tech stack (Next.js, Clerk, Neon, etc.)</li>
                  <li>• Current database schema</li>
                  <li>• File structure</li>
                  <li>• How to build features</li>
                </ul>
                <div className="mt-6 bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <p className="text-white text-sm">
                    <strong>With Claude Code mobile:</strong> You don&apos;t need to copy PROMPT.md. Claude reads your repo directly.
                  </p>
                  <p className="text-white/60 text-sm mt-2">
                    <strong>With ChatGPT/Gemini:</strong> You paste PROMPT.md to give them context.
                  </p>
                </div>
              </div>
            </Subsection>

          </Section>

          {/* Section 5: Tips & Tricks */}
          <Section title="Tips & Tricks" id="tips">

            <Subsection title="How to Describe Features Clearly">
              <div className="space-y-6">
                {/* Good Examples */}
                <div>
                  <h4 className="text-white font-semibold mb-3">✓ Good prompts:</h4>
                  <div className="space-y-2">
                    {[
                      "Add a page where users can upload a profile photo",
                      "Create a feedback form that saves to the database and emails me",
                      "Add a dashboard that shows the user's 5 most recent items",
                    ].map((prompt, i) => (
                      <div key={i} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-sm text-white/80">
                        {prompt}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/50 mt-2">Clear about what you want and where it should go</p>
                </div>

                {/* Bad Examples */}
                <div>
                  <h4 className="text-white/50 font-semibold mb-3">✗ Vague prompts:</h4>
                  <div className="space-y-2">
                    {[
                      "Make it better",
                      "Add some features",
                      "Improve the design",
                    ].map((prompt, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/40 line-through">
                        {prompt}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/50 mt-2">Too vague - AI doesn&apos;t know what you want</p>
                </div>
              </div>
            </Subsection>

            <Subsection title="Common Mistakes">
              <div className="space-y-4">
                {[
                  {
                    mistake: "Asking for too much at once",
                    fix: 'Instead of "build a marketplace with payments and messaging", break it down: First "add a page to list items", then "add a way to message sellers", then "add payment"',
                  },
                  {
                    mistake: "Not testing before asking for more",
                    fix: "Build one feature. Test it. Make sure it works. Then build the next one.",
                  },
                  {
                    mistake: "Closing the window during deployment",
                    fix: "When you merge a PR, wait 1-2 minutes for Vercel to deploy before testing.",
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="text-red-400 font-semibold mb-2">✗ {item.mistake}</div>
                    <div className="text-orange-400 text-sm">✓ {item.fix}</div>
                  </div>
                ))}
              </div>
            </Subsection>

            <Subsection title="Mobile vs Laptop: When to Use Each">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Mobile */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">📱 Use Mobile When:</h4>
                  <div className="space-y-2 text-sm text-white/70">
                    <div>• Adding simple features</div>
                    <div>• Quick bug fixes</div>
                    <div>• Building during downtime</div>
                    <div>• You don&apos;t have your laptop</div>
                    <div>• Reviewing and merging PRs</div>
                  </div>
                  <p className="mt-4 text-xs text-white/50 italic">
                    80% of users do everything from mobile
                  </p>
                </div>

                {/* Laptop */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">💻 Use Laptop When:</h4>
                  <div className="space-y-2 text-sm text-white/70">
                    <div>• Complex multi-file changes</div>
                    <div>• Deep debugging sessions</div>
                    <div>• Large refactors</div>
                    <div>• You want a bigger screen for reviewing code</div>
                  </div>
                  <p className="mt-4 text-xs text-white/50 italic">
                    Nice to have, but not required
                  </p>
                </div>
              </div>
            </Subsection>

          </Section>

        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to build with Claude?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Get your full-stack starter in 20 minutes. Then ship features from anywhere.
            </p>
            <a
              href="mailto:vibestarter26@outlook.com?subject=License Key Request"
              className="inline-block bg-orange-400 text-black px-8 py-4 rounded-full font-semibold hover:bg-orange-300 transition text-lg"
            >
              Email for License Key — Free
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">
        {title}
      </h2>
      <div className="space-y-12">
        {children}
      </div>
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
        {title}
      </h3>
      <div>
        {children}
      </div>
    </div>
  );
}
