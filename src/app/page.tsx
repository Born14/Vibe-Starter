import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            vibe<span className="text-orange-400">starter</span>
          </div>
          <Link
            href="#get-started"
            className="bg-orange-400 text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-300 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-orange-400/20 text-orange-400 text-sm font-semibold px-4 py-2 rounded-full mb-8">
            Built with Claude • For Claude Developers
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Build Full-Stack Apps
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
              From Your Phone
            </span>
            <br />
            With Claude
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            I built this from my phone using Claude. One-click deploy from GitHub to production.
            Real database. Real auth. Real apps. This wasn&apos;t possible before. Now it is.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#get-started"
              className="w-full sm:w-auto bg-orange-400 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-300 transition-all hover:scale-105"
            >
              Get Started — Free
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto border border-white/20 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-colors"
            >
              See the Workflow
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/50">
            No payment. No subscription. Just email for a license key.
          </p>
        </div>
      </section>

      {/* The Breakthrough */}
      <section className="py-20 px-6 bg-gradient-to-b from-orange-500/5 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">
            A new era of building
          </h2>
          <p className="text-white/70 text-center mb-16 text-lg max-w-2xl mx-auto">
            Ship production code from anywhere. Coffee shop. Couch. Waiting in line.
            AI writes the code. You describe what you want. It deploys automatically.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-orange-500/20 rounded-2xl p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">Claude on Mobile</h3>
              <p className="text-white/70">
                Open Claude on your phone. Describe what you want. Claude writes the code, tests it, commits it.
              </p>
            </div>

            <div className="bg-white/5 border border-orange-500/20 rounded-2xl p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">One-Click Deploy</h3>
              <p className="text-white/70">
                Push to GitHub. Vercel deploys automatically. Database migrations run. Live in 60 seconds.
              </p>
            </div>

            <div className="bg-white/5 border border-orange-500/20 rounded-2xl p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Real Full-Stack</h3>
              <p className="text-white/70">
                Not toy apps. Authentication. Postgres database. API routes. Everything a real app needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The workflow
          </h2>
          <p className="text-white/60 text-center mb-16 text-lg">
            This is how I build now. From anywhere.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold text-orange-400 flex-shrink-0">01</div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2">Get your foundation set up</h3>
                <p className="text-white/70 mb-4">
                  Run the wizard. It connects GitHub, Vercel, Clerk (auth), and Neon (database).
                  Takes 20 minutes. You own all the accounts.
                </p>
                <p className="text-white/50 text-sm">
                  The wizard creates your repo, wires up environment variables, deploys your starter app.
                  Database migrations run automatically on every deploy.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold text-orange-400 flex-shrink-0">02</div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2">Open Claude anywhere</h3>
                <p className="text-white/70 mb-4">
                  Claude Android app. Claude on your laptop. Claude in the browser. Doesn&apos;t matter.
                  Your repo is connected to your Claude account.
                </p>
                <p className="text-white/50 text-sm">
                  Claude sees your full codebase. It understands Next.js, Clerk, Neon, the whole stack.
                  Just describe what you want to build.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold text-orange-400 flex-shrink-0">03</div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2">Build and ship</h3>
                <p className="text-white/70 mb-4">
                  &quot;Add a blog. Users can create posts and comment.&quot; Claude writes the code,
                  creates the database schema, builds the UI, commits it, pushes to GitHub.
                </p>
                <p className="text-white/50 text-sm">
                  GitHub triggers Vercel. Build runs. Migrations apply. 60 seconds later your feature is live.
                  All from your phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Claude */}
      <section className="py-20 px-6 bg-gradient-to-b from-orange-500/5 to-transparent">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Why Claude makes this work
          </h2>
          <p className="text-white/70 text-center mb-12 text-lg">
            Claude isn&apos;t just an AI that writes code. It&apos;s your complete development environment.
          </p>

          <div className="space-y-6">
            <div className="bg-white/5 border border-orange-500/20 rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-orange-400">Understands full context</h3>
              <p className="text-white/70">
                Claude reads your entire codebase. It knows how your auth works, how your database is structured,
                how your API routes are organized. Changes are consistent with your existing code.
              </p>
            </div>

            <div className="bg-white/5 border border-orange-500/20 rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-orange-400">Writes production-ready code</h3>
              <p className="text-white/70">
                Not just code snippets. Complete features with error handling, TypeScript types, proper security.
                Code that actually works when you deploy it.
              </p>
            </div>

            <div className="bg-white/5 border border-orange-500/20 rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-orange-400">Handles the whole workflow</h3>
              <p className="text-white/70">
                Claude can read files, edit code, run tests, commit changes, push to GitHub.
                On mobile, it&apos;s your complete development environment.
              </p>
            </div>
          </div>

          <div className="mt-10 p-6 bg-black border border-white/10 rounded-xl text-center">
            <p className="text-white/60 text-sm">
              This is a community project built WITH Claude. Not affiliated with or endorsed by Anthropic.
              Just a developer who loves building with Claude and wanted to share the workflow.
            </p>
          </div>
        </div>
      </section>

      {/* The Stack */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The stack that makes it work
          </h2>
          <p className="text-white/60 text-center mb-12 text-lg">
            My favorite stack. Cheap. Generous. Plays perfectly with Claude.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { name: "Next.js 15", role: "Framework", color: "bg-white/10" },
              { name: "Vercel", role: "Hosting + Deploy", color: "bg-white/10" },
              { name: "Clerk", role: "Authentication", color: "bg-purple-500/20" },
              { name: "Neon", role: "Postgres Database", color: "bg-emerald-500/20" },
              { name: "Claude API", role: "AI Features", color: "bg-orange-500/20" },
              { name: "Tailwind", role: "Styling", color: "bg-cyan-500/20" },
            ].map((item, i) => (
              <div key={i} className={`${item.color} border border-white/10 rounded-xl p-5`}>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-white/60">{item.role}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Why this specific combination?
            </h3>
            <div className="space-y-4 text-white/80">
              <div className="flex items-start gap-3">
                <span className="text-orange-400 text-xl flex-shrink-0">→</span>
                <div>
                  <strong className="text-white">Free to start.</strong> All these services have generous free tiers.
                  Build and deploy real apps without spending a dollar until you have users.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 text-xl flex-shrink-0">→</span>
                <div>
                  <strong className="text-white">Claude knows this stack.</strong> These are popular, well-documented tools.
                  Claude has seen thousands of examples and writes confident, correct code.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 text-xl flex-shrink-0">→</span>
                <div>
                  <strong className="text-white">One-click deploys.</strong> GitHub → Vercel integration is seamless.
                  Push code, Vercel builds and deploys automatically. Perfect for mobile workflow.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 text-xl flex-shrink-0">→</span>
                <div>
                  <strong className="text-white">Production-grade.</strong> This isn&apos;t a toy stack.
                  It scales. You can build real businesses on this foundation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section id="get-started" className="py-20 px-6 bg-gradient-to-b from-orange-500/5 to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let&apos;s build something
          </h2>
          <p className="text-white/70 mb-12 text-lg">
            Free. Email for a license key and get started.
          </p>

          <div className="bg-white/5 border border-orange-500/20 rounded-2xl p-8">
            <div className="text-6xl font-bold mb-3 text-orange-400">Free</div>
            <p className="text-white/60 mb-8">Use it. Build from anywhere. Have fun.</p>

            <ul className="text-left space-y-3 mb-8">
              {[
                "Complete setup wizard (~20 min)",
                "Next.js 15 starter with full stack",
                "Auth, database, AI API ready",
                "One-click GitHub → Vercel deploys",
                "Auto-migrations on every deploy",
                "Build from phone, laptop, anywhere",
                "All accounts in your name",
                "Use it forever",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <span className="text-orange-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="mailto:vibestarter26@outlook.com?subject=License Key Request"
              className="block w-full bg-orange-400 text-black py-4 rounded-full font-semibold text-lg hover:bg-orange-300 transition-all hover:scale-105"
            >
              Email for License Key
            </a>

            <p className="mt-6 text-sm text-white/50">
              I&apos;ll send you a license key. Usually within a few hours.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Your stuff. Your accounts. Your code.
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-white/70 mb-6 leading-relaxed text-center">
              The wizard helps you create and connect YOUR OWN accounts.
              GitHub, Vercel, Clerk, Neon - all in your name. All your control.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-orange-400">What the wizard does:</h3>
                <ul className="text-sm text-white/70 space-y-2">
                  <li>→ Guides you through account creation</li>
                  <li>→ Creates your GitHub repo</li>
                  <li>→ Connects your services</li>
                  <li>→ Deploys your starter app</li>
                </ul>
              </div>
              <div className="bg-black/40 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-emerald-400">What I never see:</h3>
                <ul className="text-sm text-white/70 space-y-2">
                  <li>→ Your API keys</li>
                  <li>→ Your database data</li>
                  <li>→ Your repo code</li>
                  <li>→ Your user information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Do I need coding experience?",
                a: "Not really. You describe what you want to Claude. Claude writes the code. You can learn as you go by reading what Claude creates.",
              },
              {
                q: "Does this only work on mobile?",
                a: "No. It works everywhere. Phone, laptop, browser. The point is that it CAN work from your phone. That's what's new.",
              },
              {
                q: "Do I have to use Claude?",
                a: "The starter app supports Claude, OpenAI, or Gemini APIs. But I built this workflow for Claude because that's what I use and love.",
              },
              {
                q: "What about my API keys and data?",
                a: "You create your own accounts. The wizard helps you connect them. Everything stays in your accounts - GitHub, Vercel, Clerk, Neon. Your keys, your data, your control.",
              },
              {
                q: "Are there monthly costs?",
                a: "Not from me. The services all have free tiers: Vercel (free for hobby), Clerk (10k users free), Neon (0.5GB free). Most projects stay free.",
              },
              {
                q: "Is this open source?",
                a: "Not right now. But it's free to use and you own everything you build with it.",
              },
              {
                q: "What if I need help?",
                a: "Email me. I'll help you. I want this to work for people.",
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-white/10 pb-6">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-white/60">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Build anywhere.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
              Deploy automatically.
            </span>
            <br />
            Ship real apps.
          </h2>
          <p className="text-xl text-white/60 mb-10">
            Email for a license key. Start building.
          </p>
          <a
            href="mailto:vibestarter26@outlook.com?subject=License Key Request"
            className="inline-block bg-orange-400 text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-orange-300 transition-all hover:scale-105"
          >
            Email for License Key — Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/40">
            © 2026 Vibe Starter. Built with Claude. From mobile.
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="/education" className="hover:text-white transition-colors">
              Education
            </a>
            <a href="mailto:vibestarter26@outlook.com" className="hover:text-white transition-colors">
              Support
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
