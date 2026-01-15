import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            vibe<span className="text-emerald-400">starter</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/setup"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Have a license key?
            </Link>
            <Link
              href="#waitlist"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-400 transition-colors"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Own your stack.
            </span>
            <br />
            Build with AI. Ship from anywhere.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              From Prompt To Production.
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            We help you build your creative foundation—GitHub, hosting, database, auth—all connected and working. Then build features with AI from your phone, laptop, or browser. Push to GitHub, site updates automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#waitlist"
              className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-400 transition-all hover:scale-105"
            >
              Join Waitlist
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto border border-white/20 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/40">
            Launching soon · One-time payment · No subscription
          </p>

          <p className="mt-3 text-sm text-white/50">
            Already have a license key?{" "}
            <Link href="/setup" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
              Click here to get started
            </Link>
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The gap nobody talks about
          </h2>
          <p className="text-white/60 text-center mb-12 text-lg">
            AI builders generate code. They don&apos;t set up the system.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
              <div className="text-red-400 text-sm font-semibold mb-3">WITHOUT VIBE STARTER</div>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>&quot;How do users sign up?&quot;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>&quot;Where does my data go?&quot;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>&quot;How do I put this on the internet?&quot;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>&quot;What are environment variables?&quot;</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <div className="text-emerald-400 text-sm font-semibold mb-3">WITH VIBE STARTER</div>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Working auth — users can sign up</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Working database — data persists</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Live URL — your-app.vercel.app</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Push-to-deploy — code once, ship everywhere</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How it works
          </h2>
          <p className="text-white/60 text-center mb-16 text-lg">
            20 minutes. No terminal. No config files. Just clicks.
          </p>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Connect your accounts",
                description: "We guide you through GitHub, Vercel, Clerk, and Neon. You create the accounts — you own them forever.",
              },
              {
                step: "02",
                title: "Name your app",
                description: "Pick a name. We check if it's available. Your app will be live at your-app.vercel.app.",
              },
              {
                step: "03",
                title: "Click deploy",
                description: "We create your repo, push the code, wire up the database, set the environment variables, and deploy. 2 minutes.",
              },
              {
                step: "04",
                title: "Start building",
                description: "Open your AI (Claude, Gemini, or ChatGPT). Describe what you want. Push to GitHub. Site updates. Build from your phone, browser, anywhere.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="text-4xl font-bold text-white/20">{item.step}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Ownership */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            &quot;Why would I trust a stranger with my API keys?&quot;
          </h2>
          <p className="text-white/60 text-center mb-12 text-lg">
            You don&apos;t. That&apos;s the whole point. 🔒
          </p>

          {/* Visual Architecture Diagram */}
          <div className="bg-black border border-emerald-500/30 rounded-2xl p-8 mb-12 font-mono text-sm">
            <div className="text-emerald-400 font-semibold mb-6 text-center">YOUR ARCHITECTURE (YOU OWN EVERYTHING)</div>
            <div className="space-y-6 text-white/70">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="border border-white/20 rounded px-4 py-2 text-center min-w-[140px]">
                  <div className="text-emerald-400 text-xs mb-1">YOUR ACCOUNT</div>
                  <div>GitHub</div>
                </div>
                <span className="text-white/40">→</span>
                <div className="border border-white/20 rounded px-4 py-2 text-center min-w-[140px]">
                  <div className="text-emerald-400 text-xs mb-1">YOUR ACCOUNT</div>
                  <div>Vercel</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="border border-white/20 rounded px-4 py-2 text-center min-w-[140px]">
                  <div className="text-emerald-400 text-xs mb-1">YOUR ACCOUNT</div>
                  <div>Clerk</div>
                </div>
                <span className="text-white/40">→</span>
                <div className="border border-white/20 rounded px-4 py-2 text-center min-w-[140px]">
                  <div className="text-emerald-400 text-xs mb-1">YOUR ACCOUNT</div>
                  <div>Neon</div>
                </div>
              </div>

              <div className="text-center text-white/40 text-xs pt-4">
                ↑ Vibe Starter wizard helps connect these (one time) ↑
              </div>
            </div>
          </div>

          {/* Explanation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-emerald-400">✓ What Vibe Starter Does</h3>
              <ul className="space-y-3 text-white/70 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  <span>Guides you through official OAuth flows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  <span>Clicks buttons in YOUR accounts for you</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  <span>Connects your services together (one time)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-0.5">→</span>
                  <span>Then disappears — you own everything</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400">✗ What Vibe Starter NEVER Does</h3>
              <ul className="space-y-3 text-white/70 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">→</span>
                  <span>Store your API keys or credentials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">→</span>
                  <span>Access your accounts after setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">→</span>
                  <span>Host your code or database</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">→</span>
                  <span>Charge you monthly subscription fees</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2 text-sm">
              <div className="p-4 border-b border-white/10 font-semibold">
                Platforms like Bolt, v0, Replit
              </div>
              <div className="p-4 border-b border-white/10 font-semibold bg-emerald-500/10">
                Vibe Starter
              </div>

              <div className="p-4 border-b border-r border-white/10 text-white/60">
                <span className="text-red-400">✗</span> Code lives on their servers
              </div>
              <div className="p-4 border-b border-white/10 bg-emerald-500/5">
                <span className="text-emerald-400">✓</span> Code on YOUR GitHub
              </div>

              <div className="p-4 border-b border-r border-white/10 text-white/60">
                <span className="text-red-400">✗</span> Database on their infrastructure
              </div>
              <div className="p-4 border-b border-white/10 bg-emerald-500/5">
                <span className="text-emerald-400">✓</span> Database on YOUR Neon account
              </div>

              <div className="p-4 border-b border-r border-white/10 text-white/60">
                <span className="text-red-400">✗</span> Locked into their platform
              </div>
              <div className="p-4 border-b border-white/10 bg-emerald-500/5">
                <span className="text-emerald-400">✓</span> Delete our wizard, keep building
              </div>

              <div className="p-4 border-r border-white/10 text-white/60">
                <span className="text-red-400">✗</span> Monthly fees forever
              </div>
              <div className="p-4 bg-emerald-500/5">
                <span className="text-emerald-400">✓</span> One-time $39, build forever
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-lg mb-2">
              Think of Vibe Starter as a <strong>setup guide that clicks buttons for you.</strong>
            </p>
            <p className="text-white/60">
              After setup, we literally can&apos;t access your stuff even if we wanted to. You own the accounts, you have the keys.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What you get
          </h2>
          <p className="text-white/60 text-center mb-12 text-lg">
            A complete system, not just code
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🚀", title: "Live App", desc: "Deployed at your-app.vercel.app" },
              { icon: "🔐", title: "Auth Ready", desc: "Sign up, sign in, protected routes" },
              { icon: "💾", title: "Database", desc: "Postgres with Neon, data persists" },
              { icon: "🤖", title: "AI Wired", desc: "Claude, Gemini, or OpenAI API ready" },
              { icon: "📱", title: "Mobile Workflow", desc: "Build from your phone" },
              { icon: "🔑", title: "You Own It", desc: "All accounts are yours, forever" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Stack */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The stack
          </h2>
          <p className="text-white/60 text-center mb-12 text-lg">
            Industry standard. Free tiers. No lock-in.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Next.js 15", role: "Framework", color: "bg-white/10" },
              { name: "Vercel", role: "Hosting", color: "bg-white/10" },
              { name: "Clerk", role: "Authentication", color: "bg-purple-500/20" },
              { name: "Neon", role: "Database", color: "bg-emerald-500/20" },
              { name: "AI APIs", role: "Claude/Gemini/OpenAI", color: "bg-orange-500/20" },
              { name: "Tailwind", role: "Styling", color: "bg-cyan-500/20" },
            ].map((item, i) => (
              <div key={i} className={`${item.color} border border-white/10 rounded-xl p-5`}>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-white/60">{item.role}</div>
              </div>
            ))}
          </div>

          {/* Why This Stack */}
          <div className="mt-12 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Why this stack?
            </h3>
            <div className="space-y-4 text-white/80">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 text-xl flex-shrink-0">→</span>
                <div>
                  <strong className="text-white">Production-ready from day one.</strong> These aren't beginner tools—they power real companies at scale.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 text-xl flex-shrink-0">→</span>
                <div>
                  <strong className="text-white">No rewrites as you grow.</strong> Start with 10 users, scale to 100K+ on the same infrastructure.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 text-xl flex-shrink-0">→</span>
                <div>
                  <strong className="text-white">Free to start, fair to scale.</strong> Generous free tiers mean you build and test without costs.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 text-xl flex-shrink-0">→</span>
                <div>
                  <strong className="text-white">No lock-in.</strong> Open standards. You can migrate anytime—but you won't need to.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your app. Your accounts. Your data.
          </h2>
          <p className="text-white/60 mb-12 text-lg">
            We help you set up. Then we disappear.
          </p>

          <div className="bg-black border border-white/10 rounded-2xl p-8 text-left">
            <div className="text-sm font-semibold text-white/40 mb-4">WE NEVER:</div>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                <span>Read your other repos or private code</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                <span>Deploy anything without your explicit click</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                <span>Store your keys after setup completes</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-emerald-400">✓</span>
                <span>Access your app once setup is finished</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Waitlist / Pricing */}
      <section id="waitlist" className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 text-center">
            <div className="inline-block bg-emerald-400/20 text-emerald-400 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              LAUNCHING SOON
            </div>

            <div className="text-6xl font-bold mb-2">$39</div>
            <p className="text-white/60 mb-8">One-time payment · Everything you need to go live</p>

            <ul className="text-left space-y-3 mb-8">
              {[
                "Complete wizard setup (~20 min)",
                "Next.js 15 app with auth & database",
                "Live deployment on Vercel",
                "Push-to-deploy workflow",
                "PROMPT.md for AI coding",
                "All accounts in your name",
                "No monthly fees",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <span className="text-emerald-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mb-6">
              <WaitlistForm
                variant="button"
                buttonText="Join Waitlist"
                buttonClassName="w-full bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-emerald-400 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              />
            </div>

            <p className="mt-4 text-sm text-white/40">
              Get notified when we launch · Early giveaways happening now on social media
            </p>

            <p className="mt-3 text-sm text-white/50">
              Already have a license key?{" "}
              <Link href="/setup" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                Start setup here
              </Link>
            </p>
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
                q: "Why should I trust you with my API keys and credentials?",
                a: "You shouldn't — and you don't have to. You create accounts at GitHub, Vercel, Clerk, and Neon. You own them all. The wizard walks you through connecting YOUR accounts using THEIR official OAuth flows. We never see your keys. They never touch our servers. After setup, we literally can't access your accounts even if we wanted to. Compare this to platforms like Bolt or v0 where your code and database live on their infrastructure.",
              },
              {
                q: "Do I need to know how to code?",
                a: "No. You need to click buttons, copy/paste, and describe what you want to your AI (Claude, Gemini, or ChatGPT). That's it.",
              },
              {
                q: "What if I already have a GitHub account?",
                a: "Perfect. We'll use it. Same for Vercel. We guide you through creating accounts only if you don't have them.",
              },
              {
                q: "Are there monthly fees?",
                a: "Not from us. The services we connect (Vercel, Clerk, Neon) all have generous free tiers. Most apps run free forever.",
              },
              {
                q: "Can I build from my phone?",
                a: "Yes. That's the point. Open your AI, describe your feature, push to GitHub, site updates. No laptop required.",
              },
              {
                q: "What if I get stuck?",
                a: "Every step has a video walkthrough. Plus AI help chat built in. And you can always email us.",
              },
              {
                q: "What's the refund policy?",
                a: "If you can't complete setup within 7 days, we'll refund you. No questions.",
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
            Stop generating code.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Start shipping apps.
            </span>
          </h2>
          <p className="text-xl text-white/60 mb-10">
            20 minutes from now, you could have a live app.
          </p>
          <Link
            href="#waitlist"
            className="inline-block bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-emerald-400 transition-all hover:scale-105"
          >
            Join Waitlist
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/40">
            © 2025 Vibe Starter. Built with the stack we give you.
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
