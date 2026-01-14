import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            vibe<span className="text-emerald-400">starter</span>
          </div>
          <Link
            href="#pricing"
            className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-400 transition-colors"
          >
            Get Started
          </Link>
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
            From Prompt To Production.
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            We help you build your creative foundation—GitHub, hosting, database, auth—all connected and working. Then build features with AI from your phone, laptop, or browser. Push to GitHub, site updates automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#pricing"
              className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-400 transition-all hover:scale-105"
            >
              Get Started — $39
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto border border-white/20 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/40">
            One-time payment. No subscription. You own everything.
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

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 text-center">
            <div className="inline-block bg-emerald-400/20 text-emerald-400 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              ONE-TIME PAYMENT
            </div>

            <div className="text-6xl font-bold mb-2">$39</div>
            <p className="text-white/60 mb-8">Everything you need to go live</p>

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

            <a
              href="https://gumroad.com/l/vibestarter"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-emerald-400 transition-all hover:scale-105"
            >
              Get Started Now
            </a>

            <p className="mt-4 text-sm text-white/40">
              Secure payment via Gumroad
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
            href="#pricing"
            className="inline-block bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-emerald-400 transition-all hover:scale-105"
          >
            Get Started — $39
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
            <a href="mailto:support@vibestarter.app" className="hover:text-white transition-colors">
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
