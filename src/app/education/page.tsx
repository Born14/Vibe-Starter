"use client";

import { useState } from "react";
import Link from "next/link";

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white hover:text-white/80 transition">
            Vibe Starter
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/#pricing" className="text-sm text-white/70 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/setup" className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Build Anything. From Anywhere.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              We&apos;ll Teach You How.
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Learn to build software with AI, debug from your phone, and understand your stack.
            Education is how we deliver on the freedom guarantee.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-24">

          {/* Section 1: Before You Start */}
          <Section title="Before You Start" id="before-you-start">

            <Subsection title="The New Way of Building">
              <div className="space-y-4 text-white/80">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="text-sm text-white/50 mb-2">Traditional</div>
                    <div className="font-mono text-sm">
                      Learn to code → Build
                    </div>
                    <div className="text-sm text-white/60 mt-3">
                      Months/years of learning before you can ship anything
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                    <div className="text-sm text-purple-300 mb-2">Now</div>
                    <div className="font-mono text-sm">
                      Describe → AI builds → Test & refine
                    </div>
                    <div className="text-sm text-white/60 mt-3">
                      Ship features in minutes, learn as you go
                    </div>
                  </div>
                </div>
                <p className="mt-4">
                  This isn&apos;t cheating—this is how modern development works. Professional developers use this workflow too.
                </p>
              </div>
            </Subsection>

            <Subsection title="What You'll Learn">
              <div className="space-y-3">
                {[
                  { icon: "✓", text: "How to describe features clearly (communication, not coding)", positive: true },
                  { icon: "✓", text: "The build → deploy → test → debug loop", positive: true },
                  { icon: "✓", text: "Mobile debugging workflow (copy logs → paste to AI → fix)", positive: true },
                  { icon: "✓", text: "Understanding your stack (what each piece does)", positive: true },
                  { icon: "✓", text: "Working with AI as your coding partner", positive: true },
                  { icon: "✗", text: "Traditional programming (that's optional, not required)", positive: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`text-xl flex-shrink-0 ${item.positive ? 'text-emerald-400' : 'text-white/30'}`}>
                      {item.icon}
                    </span>
                    <span className={item.positive ? 'text-white/80' : 'text-white/40'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </Subsection>

            <Subsection title="No Experience Required">
              <div className="space-y-3 text-white/80">
                <p className="flex items-start gap-3">
                  <span className="text-purple-400 text-xl flex-shrink-0">→</span>
                  <span>If you can <strong className="text-white">describe what you want</strong>, you can build it</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-purple-400 text-xl flex-shrink-0">→</span>
                  <span>If you can <strong className="text-white">copy/paste</strong>, you can debug it</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-purple-400 text-xl flex-shrink-0">→</span>
                  <span>If you can <strong className="text-white">follow steps</strong>, you can deploy it</span>
                </p>
                <p className="mt-6 text-lg text-white">
                  The learning curve is <strong>hours/days</strong>, not months/years.
                </p>
              </div>
            </Subsection>

          </Section>

          {/* Section 2: Getting Started */}
          <Section title="Getting Started" id="getting-started">

            <Subsection title="After the Wizard: Your First 5 Minutes">
              <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6">
                <ol className="space-y-4">
                  {[
                    { num: "1", text: "Verify your app is live", action: "Visit your-app.vercel.app" },
                    { num: "2", text: "Sign in to your app", action: "Test authentication" },
                    { num: "3", text: "Bookmark important links", action: "Your app URL, GitHub repo, Vercel project, Clerk dashboard, Neon database" },
                    { num: "4", text: "Choose your building method", action: "From phone: Claude mobile | From laptop: Cursor/VS Code | From anywhere: GitHub web editor" },
                    { num: "5", text: "Build your first feature", action: "See guide below ↓" },
                  ].map((step) => (
                    <li key={step.num} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-semibold">
                        {step.num}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{step.text}</div>
                        <div className="text-sm text-white/60 mt-1">{step.action}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Subsection>

            <Subsection title="Understanding Your Accounts">
              <p className="text-white/70 mb-6">
                Quick reference to what each service does and where to access it:
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
                      { service: "Vercel", role: "Hosts your app on the internet", link: "vercel.com" },
                      { service: "Clerk", role: "Manages user sign-up/sign-in", link: "clerk.com" },
                      { service: "Neon", role: "Stores your database", link: "neon.tech" },
                      { service: "AI API", role: "Powers AI features (Claude/Gemini/OpenAI)", link: "[respective console]" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-3 px-4 font-semibold text-white">{row.service}</td>
                        <td className="py-3 px-4">{row.role}</td>
                        <td className="py-3 px-4 text-purple-400">{row.link}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-sm text-white/70">
                <strong className="text-white">Why you own all of these:</strong> No lock-in to Vibe Starter. You control costs and scaling. Can migrate or change providers. Full access to all settings and data.
              </div>
            </Subsection>

            <Subsection title="Your First Feature: Add a Notes Page">
              <p className="text-white/70 mb-6">
                Step-by-step guide to build something immediately:
              </p>

              <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4">
                <ol className="space-y-3 text-white/80">
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">1.</span>
                    <span>Open your AI (Claude mobile, Gemini, or ChatGPT)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">2.</span>
                    <span>Connect to your GitHub repo: [your-app-name]</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">3.</span>
                    <span>Copy/paste your PROMPT.md for context</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">4.</span>
                    <span>Say: &quot;Add a page at /notes where users can create, view, and delete notes&quot;</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">5.</span>
                    <span>AI will generate code and create a PR</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">6.</span>
                    <span>Review the changes (AI will explain them)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">7.</span>
                    <span>Merge the PR</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">8.</span>
                    <span>Wait 1-2 minutes for auto-deploy</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">9.</span>
                    <span>Visit your-app.vercel.app/notes</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-400 font-semibold">10.</span>
                    <span>Test your new feature!</span>
                  </li>
                </ol>
              </div>

              <div className="mt-6 space-y-3 text-sm text-white/60">
                <p className="text-white font-semibold">What just happened:</p>
                <ul className="space-y-2 ml-4">
                  <li>• AI read your project structure (from PROMPT.md)</li>
                  <li>• AI created a new page component</li>
                  <li>• AI added a database table for notes</li>
                  <li>• AI created API routes to save/load notes</li>
                  <li>• Database schema auto-synced during deployment</li>
                  <li>• Everything went live automatically</li>
                </ul>
              </div>

              <div className="mt-8 text-center">
                <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl px-8 py-4">
                  <p className="text-xl font-semibold text-white">
                    You just shipped a feature. From your phone. In 5 minutes.
                  </p>
                </div>
              </div>
            </Subsection>

          </Section>

          {/* Section 3: Building Features */}
          <Section title="Building Features" id="building-features">

            <Subsection title="The Core Workflow">
              <p className="text-white/70 mb-6">
                This is how you build everything:
              </p>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-xl p-8">
                <div className="space-y-4">
                  {[
                    "1. Describe what you want",
                    "2. AI generates code",
                    "3. Review the changes",
                    "4. Approve/merge",
                    "5. Auto-deploys (1-2 min)",
                    "6. Test in production",
                    "7. Iterate or move to next feature",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="text-white font-mono">{step}</div>
                      {i < 6 && <div className="text-purple-400">↓</div>}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-6 text-white/70 italic">
                <strong className="text-white">The secret:</strong> Professional developers use this exact workflow now. You&apos;re not learning a toy—you&apos;re learning the modern way.
              </p>
            </Subsection>

            <Subsection title="Mobile vs. Laptop Building">
              <p className="text-white/70 mb-6">
                When to use each:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Mobile */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">📱 Mobile (Claude/Gemini/ChatGPT app)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white/70">Quick feature additions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white/70">Bug fixes and tweaks</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white/70">Building in spare moments</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white/70">When you don&apos;t have laptop access</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white/70">Reviewing and merging PRs</span>
                    </div>
                    <div className="flex items-start gap-2 mt-4">
                      <span className="text-white/30">✗</span>
                      <span className="text-white/40">Complex multi-file refactors</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-white/30">✗</span>
                      <span className="text-white/40">Heavy debugging sessions</span>
                    </div>
                  </div>
                </div>

                {/* Laptop */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">💻 Laptop (Cursor/VS Code/GitHub.dev)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white/70">Complex features spanning many files</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white/70">Deep debugging sessions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white/70">Large refactors</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-white/70">Better code review (bigger screen)</span>
                    </div>
                    <div className="flex items-start gap-2 mt-4">
                      <span className="text-white/30">✗</span>
                      <span className="text-white/40">Requires being at laptop</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-white/30">✗</span>
                      <span className="text-white/40">More setup (if running locally)</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-white/70">
                <strong className="text-white">The reality:</strong> Most users do 80% on mobile, 20% on laptop.
              </p>
            </Subsection>

            <Subsection title="Working with AI: Prompting Guide">
              <p className="text-white/70 mb-6">
                How to describe features effectively:
              </p>

              <div className="space-y-6">
                {/* Good Prompts */}
                <div>
                  <h4 className="text-white font-semibold mb-3">✓ Good prompts:</h4>
                  <div className="space-y-2">
                    {[
                      "Add a page where users can upload profile photos",
                      "Create a form to collect user feedback and save it to the database",
                      "Make the homepage show the 5 most recent items from the database",
                    ].map((prompt, i) => (
                      <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-white/80">
                        {prompt}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/50 mt-2">Specific about UI and behavior</p>
                </div>

                {/* Vague Prompts */}
                <div>
                  <h4 className="text-white/50 font-semibold mb-3">✗ Vague prompts:</h4>
                  <div className="space-y-2">
                    {[
                      "Make the app better",
                      "Add some features",
                      "Fix the design",
                    ].map((prompt, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/40 line-through">
                        {prompt}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/50 mt-2">No clear outcome specified</p>
                </div>

                {/* Template */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-3">Template for effective prompts:</h4>
                  <CodeBlock language="text" code={`[Action] + [What] + [Where] + [Behavior]

Examples:
- Add a profile page that shows user's uploaded items
- Create a settings page where users can update their email
- Make the dashboard show total count of items for this user`} />
                </div>
              </div>
            </Subsection>

            <Subsection title="Using PROMPT.md Effectively">
              <div className="space-y-4 text-white/70">
                <div>
                  <h4 className="text-white font-semibold mb-2">What PROMPT.md is:</h4>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• A file in your repo that explains your project to AI</li>
                    <li>• Contains stack info, structure, current database schema</li>
                    <li>• Updated automatically as your project grows</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">How to use it:</h4>
                  <ol className="space-y-2 ml-4 text-sm">
                    <li>1. Always paste PROMPT.md at the start of a new AI conversation</li>
                    <li>2. This gives AI context about your project</li>
                    <li>3. AI will reference it when building features</li>
                    <li>4. No need to re-explain your stack each time</li>
                  </ol>
                </div>

                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-3">Example conversation:</h4>
                  <div className="space-y-3 font-mono text-sm">
                    <div>
                      <span className="text-purple-400">You:</span>
                      <span className="text-white/60"> [paste PROMPT.md]</span>
                    </div>
                    <div>
                      <span className="text-purple-400">You:</span>
                      <span className="text-white/80"> Add a page where users can save favorite items</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <span className="text-blue-400">AI:</span>
                      <span className="text-white/60"> [reads PROMPT.md, understands your stack]</span>
                    </div>
                    <div>
                      <span className="text-blue-400">AI:</span>
                      <span className="text-white/80"> I&apos;ll create /favorites page using your existing items table...</span>
                    </div>
                  </div>
                </div>
              </div>
            </Subsection>

          </Section>

          {/* Section 4: When Things Break */}
          <Section title="When Things Break 🔧" id="debugging">

            <Subsection title="The Debugging Workflow">
              <p className="text-white/70 mb-6">
                When something breaks (and it will):
              </p>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 mb-6">
                <p className="text-white font-semibold text-lg mb-4">Don&apos;t panic. Here&apos;s the loop:</p>
                <div className="space-y-3 text-white/80">
                  {[
                    "1. Something breaks (error page, feature doesn't work)",
                    "2. Open Vercel (mobile app or web)",
                    "3. Find your project → Deployments → Latest → Logs",
                    "4. Copy the error section (long press on mobile)",
                    "5. Paste to AI: \"Here's the error, what's wrong?\"",
                    "6. AI diagnoses and pushes a fix",
                    "7. Wait 1-2 min for redeploy",
                    "8. Test again",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div>{step}</div>
                      {i < 7 && <div className="text-orange-400">↓</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <p className="text-white">
                  <strong>The key insight:</strong> You don&apos;t need to understand the error. Your AI understands it.
                </p>
              </div>
            </Subsection>

            <Subsection title="Mobile Debugging: Step-by-Step">
              <p className="text-white/70 mb-6">
                Accessing Vercel logs on your phone:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Option 1 */}
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-4">Option 1: Vercel App (Recommended)</h4>
                  <ol className="space-y-2 text-sm text-white/70">
                    <li>1. Install Vercel app (iOS/Android)</li>
                    <li>2. Sign in</li>
                    <li>3. Tap your project</li>
                    <li>4. Tap &quot;Deployments&quot;</li>
                    <li>5. Tap latest deployment</li>
                    <li>6. Scroll to &quot;Logs&quot;</li>
                    <li>7. Long press to select error text</li>
                    <li>8. Tap &quot;Copy&quot;</li>
                  </ol>
                </div>

                {/* Option 2 */}
                <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-4">Option 2: Mobile Browser</h4>
                  <ol className="space-y-2 text-sm text-white/70">
                    <li>1. Open vercel.com on phone</li>
                    <li>2. Navigate to your project</li>
                    <li>3. Click &quot;Deployments&quot; tab</li>
                    <li>4. Click latest deployment</li>
                    <li>5. Scroll to logs</li>
                    <li>6. Select and copy error</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-sm">
                  <strong className="text-white">Pro tip:</strong>
                  <span className="text-white/70"> Bookmark your Vercel project URL for quick access.</span>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">What to copy:</h4>
                  <ul className="space-y-2 text-sm text-white/70 ml-4">
                    <li>• The error message (usually in red)</li>
                    <li>• 5-10 lines before it (for context)</li>
                    <li>• File name and line number if shown</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">What to say to AI:</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/50 mb-2">Template 1 (Simple):</p>
                      <CodeBlock language="text" code={`Here's an error from Vercel. What's wrong and how do we fix it?

[paste error]`} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-2">Template 2 (With context):</p>
                      <CodeBlock language="text" code={`I tried to [what you did] and now [what broke].

Here are the logs:
[paste error]

What's the issue?`} />
                    </div>
                  </div>
                </div>
              </div>
            </Subsection>

            <Subsection title="Common Errors (Quick Reference)">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-white font-semibold">Error Type</th>
                      <th className="py-3 px-4 text-white font-semibold">What It Means</th>
                      <th className="py-3 px-4 text-white font-semibold">What to Say</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/70">
                    {[
                      { type: "Module not found", meaning: "Missing dependency", say: '"Missing module error: [paste]"' },
                      { type: "500 Internal Server Error", meaning: "API route crashed", say: '"API route error: [paste logs]"' },
                      { type: "Database error", meaning: "Can't connect to Neon", say: '"Database connection issue: [paste]"' },
                      { type: "API key invalid", meaning: "Wrong/expired API key", say: '"API auth error: [paste]"' },
                      { type: "Type error", meaning: "TypeScript issue", say: '"Type error in build: [paste]"' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-3 px-4 font-mono text-xs text-orange-400">{row.type}</td>
                        <td className="py-3 px-4">{row.meaning}</td>
                        <td className="py-3 px-4 font-mono text-xs">{row.say}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <Link
                  href="/docs/TROUBLESHOOTING.md"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
                >
                  <span>View Full Troubleshooting Guide</span>
                  <span>→</span>
                </Link>
              </div>
            </Subsection>

          </Section>

          {/* Section 5: Understanding Your Stack */}
          <Section title="Understanding Your Stack" id="stack">

            <Subsection title="How the Pieces Connect">
              <p className="text-white/70 mb-6">
                Your app has three main parts:
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Frontend</h4>
                  <p className="text-sm text-white/60 mb-3">What Users See</p>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Pages, forms, buttons - the UI</li>
                    <li>• Runs in the user&apos;s browser</li>
                    <li>• Built with React + Next.js</li>
                    <li>• Hosted on Vercel</li>
                  </ul>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Backend</h4>
                  <p className="text-sm text-white/60 mb-3">Business Logic</p>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• API routes that handle requests</li>
                    <li>• Processes data, checks permissions</li>
                    <li>• Runs on Vercel&apos;s servers (serverless)</li>
                    <li>• Connects frontend to database</li>
                  </ul>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Database</h4>
                  <p className="text-sm text-white/60 mb-3">Data Storage</p>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Stores user data permanently</li>
                    <li>• Postgres database on Neon</li>
                    <li>• Accessed via Drizzle ORM</li>
                    <li>• Auto-syncs schema on deploy</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4">The flow when a user interacts:</h4>
                <div className="space-y-2 text-sm text-white/70 font-mono">
                  {[
                    "User clicks button",
                    "Frontend sends request to backend API",
                    "Backend checks auth (Clerk)",
                    "Backend queries database (Neon)",
                    "Database returns data",
                    "Backend processes and responds",
                    "Frontend displays result to user",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span>{step}</span>
                      {i < 6 && <span className="text-purple-400">↓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </Subsection>

            <Subsection title="What Each Service Does">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    name: "GitHub",
                    subtitle: "Code Repository",
                    points: [
                      "Stores all your code",
                      "Tracks changes (version control)",
                      "Enables collaboration",
                      "Triggers deployments when you push",
                    ],
                  },
                  {
                    name: "Vercel",
                    subtitle: "Hosting + Deployment",
                    points: [
                      "Hosts your app globally",
                      "Automatically builds on git push",
                      "Handles scaling (10 users or 10 million)",
                      "Provides HTTPS, CDN, edge functions",
                    ],
                  },
                  {
                    name: "Clerk",
                    subtitle: "Authentication",
                    points: [
                      "Manages user sign-up/sign-in",
                      "Pre-built UI components",
                      "Handles passwords, sessions, security",
                      "Provides user management dashboard",
                    ],
                  },
                  {
                    name: "Neon",
                    subtitle: "Database",
                    points: [
                      "Serverless Postgres database",
                      "Scales automatically",
                      "Built-in connection pooling",
                      "Generous free tier",
                    ],
                  },
                  {
                    name: "AI API",
                    subtitle: "Claude/Gemini/OpenAI",
                    points: [
                      "Powers AI features in your app",
                      "Pay per use (very cheap)",
                      "You bring your own key",
                      "Can switch providers anytime",
                    ],
                  },
                ].map((service, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h4 className="text-white font-semibold text-lg">{service.name}</h4>
                    <p className="text-sm text-white/50 mb-3">{service.subtitle}</p>
                    <ul className="space-y-1 text-sm text-white/70">
                      {service.points.map((point, j) => (
                        <li key={j}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Subsection>

            <Subsection title="Why This Stack">
              <p className="text-white/70 mb-6">
                Three reasons this stack is special:
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "1. Production-Ready",
                    points: [
                      "Powers companies from startups to Fortune 500",
                      "Not a toy stack - this is what professionals use",
                      "Handles real traffic and real users",
                      "Battle-tested for security and performance",
                    ],
                  },
                  {
                    title: "2. Scales With You",
                    points: [
                      "Free tier handles 1-1000 users",
                      "Same stack scales to millions",
                      "No rewrite needed as you grow",
                      "Pay only for what you use",
                    ],
                  },
                  {
                    title: "3. No Lock-In",
                    points: [
                      "You own all accounts",
                      "Can migrate away anytime",
                      "Standard tech, not proprietary",
                      "Providers are replaceable",
                    ],
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                    <h4 className="text-white font-semibold text-lg mb-3">{item.title}</h4>
                    <ul className="space-y-2 text-white/70">
                      {item.points.map((point, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-purple-400">→</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Subsection>

            <Subsection title="Environment Variables Explained">
              <div className="space-y-4 text-white/70">
                <div>
                  <h4 className="text-white font-semibold mb-2">What they are:</h4>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Secret values your app needs (API keys, database URLs)</li>
                    <li>• Stored securely in Vercel</li>
                    <li>• Never committed to git (for security)</li>
                    <li>• Available to your app at runtime</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">The ones Vibe Starter sets:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-2 px-3 text-white">Variable</th>
                          <th className="py-2 px-3 text-white">What It Does</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { var: "CLERK_SECRET_KEY", does: "Authenticates with Clerk" },
                          { var: "DATABASE_URL", does: "Connects to Neon database" },
                          { var: "ANTHROPIC_API_KEY (or similar)", does: "Powers AI features" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-2 px-3 font-mono text-xs text-purple-400">{row.var}</td>
                            <td className="py-2 px-3 text-white/70">{row.does}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm">
                  <p>
                    <strong className="text-white">You can see/edit these in Vercel:</strong>
                    <br />
                    Go to your project on Vercel → Settings → Environment Variables
                  </p>
                </div>
              </div>
            </Subsection>

          </Section>

        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Build?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Get your production-ready app deployed in 20 minutes, then start building with AI from anywhere.
            </p>
            <Link
              href="/setup"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition text-lg"
            >
              Start Building Now → $39
            </Link>
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

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1 text-xs text-white transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="bg-slate-950 border border-white/10 rounded-xl p-4 overflow-x-auto">
        <code className="text-sm text-white/80 font-mono">{code}</code>
      </pre>
    </div>
  );
}
