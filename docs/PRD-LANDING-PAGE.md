# PRD: Vibe Starter Landing Page

**Document Version:** 1.0
**Date:** January 2026
**Purpose:** Define the structure, content, and functional requirements for the Vibe Starter landing page.

---

## 1. Objective

Create a clear, simple landing page that explains:

- What Vibe Starter does
- What the user gets
- How it works
- Why it exists
- How much it costs
- Why it can be trusted

The page must communicate value without hype and without requiring technical knowledge.

---

## 2. Target User

### Primary Audience

Non-technical or lightly technical people who want:

- Their own website
- A real database
- The ability to build from their phone
- Ownership instead of platform lock-in

### User Goals

Visitors should leave the page knowing:

- They can get a real website online quickly
- It will be free to host
- It will belong to them
- They can update it from their phone
- The $39 fee is for setup convenience

---

## 3. Page-Level Requirements

### Core Requirements

The landing page must:

- Clearly state the outcome in plain language
- Avoid developer jargon
- Present pricing transparently
- Address trust concerns (open source, credential handling)
- Convert visitors to "Get Started"
- Provide a secondary path to GitHub

### Tone Requirements

- Neutral and practical
- No grand claims
- No promises of income, growth, or success
- Focus on capability, not identity

---

## 4. Page Structure

The page will contain the following sections in order:

1. Hero
2. What This Sets Up
3. How It Works
4. Why This Stack
5. What's Possible After Setup
6. AI Compatibility
7. Pricing
8. Open Source & Trust
9. FAQ
10. Footer

---

## Section Specifications

---

### 4.1 HERO SECTION

**Purpose:** Immediately answer what this is, what the user gets, and why they should care.

**Headline:**
A real website. Free. Live in 20 minutes.

**Subheadline:**
Get hosting, a database, and optional logins connected in one setup. Then build and update it directly from your phone.

**Primary CTA:**
Button text: Get Started - $39

**Secondary CTA:**
Button text: View on GitHub

**Trust Line (small text under buttons):**
Open source. No monthly fees. Everything lands in your accounts.

**Optional micro-line beneath subheadline:**
Build directly from your phone using AI tools that support GitHub.

**Functional Requirements:**

- CTA must link to wizard start flow
- GitHub button must link to repository
- Responsive layout for mobile-first viewing

---

### 4.2 WHAT THIS SETS UP

**Purpose:** Explain concretely what the user receives after running the wizard.

**Title:**
What This Sets Up

**Required Content (checklist-style list):**

- GitHub repository - your code
- Vercel project - free hosting
- Neon database - free storage
- Clerk authentication - optional, free tier
- Auto-deploy on every update

**Supporting Text:**
After setup, the site is live and ready to build on.

**Requirements:**

- Icons or checkmarks for clarity
- No technical jargon
- Must be skimmable

---

### 4.3 HOW IT WORKS

**Purpose:** Show the simple flow from setup to building.

**Title:**
How It Works

**Steps (numbered list):**

1. Run the setup wizard (about 20 minutes)
2. A new site is created in your accounts
3. Open an AI tool with GitHub access
4. Describe changes or features
5. The AI pushes updates to your repository
6. Vercel auto-deploys
7. See updates live immediately

**Visual Requirement:**
Include a simple diagram or text flow showing:
Phone → AI → GitHub → Auto-Deploy → Live Site

**Supporting Note (required):**
Full automation requires an AI tool that can connect to GitHub. Currently, Claude offers the smoothest mobile workflow.

**Functional Requirements:**

- Must render clearly on mobile
- Must not imply all AI tools can push code
- Keep steps short and concrete

---

### 4.4 WHY THIS STACK

**Purpose:** Preempt the question: "Why these specific services?"

**Title:**
Why These Services

**Required Copy:**
This setup uses GitHub, Vercel, Neon, and Clerk because they work well together, have generous free tiers, and connect easily to mobile AI tools. It's not the only way - just a simple combination that works.

**Alternatives Note:**
Prefer different providers? The open source version can be modified to use others.

**Requirements:**

- Do not claim exclusivity
- Emphasize practicality over ideology

---

### 4.5 WHAT'S POSSIBLE AFTER SETUP

**Purpose:** Translate technical setup into human outcomes.

**Title:**
What You Can Build

**Required Examples (bullet list):**

- A landing page that collects email addresses
- A simple app that stores data
- A members-only section
- Forms connected to a real database
- AI features using any API key

**Key Clarifying Line:**
Not a template. A working foundation you control.

**Requirements:**

- Use relatable examples
- Avoid developer terminology

---

### 4.6 AI COMPATIBILITY

**Purpose:** Set correct expectations about how "build from your phone" actually works.

**Title:**
AI Compatibility

**Required Copy:**
This setup works with any AI tool that can generate code.

For the fully automated workflow - where an AI can push updates directly to GitHub from a phone - an AI tool must support GitHub integration.

Currently, Claude provides the most complete mobile experience for this workflow.

**Editing Options Subsection:**

After setup, there are two ways to update the site:

**Automated (Recommended)**
- Use an AI tool with GitHub integration
- Describe changes
- AI pushes updates
- Site auto-deploys

**Manual (Any AI Tool)**
- Generate code with any AI
- Copy and paste changes
- Commit through GitHub app or web

Both methods work. Automation is simply faster.

**Clarifying Lines:**

- The wizard does not require Claude
- Automated mobile editing does
- Without Claude, changes can still be made manually

**Requirements:**

- This section must appear before Pricing
- Must be short and non-technical
- Must not present Claude as a dependency of the wizard itself

---

### 4.7 PRICING

**Purpose:** Be completely transparent about costs.

**Title:**
Pricing

**Required Breakdown:**

- Setup Wizard: $39 one time
- Hosting: Free (Vercel hobby tier)
- Database: Free (Neon hobby tier)
- Authentication: Free (Clerk free tier)

**Additional Line:**
No subscription. No platform lock-in.

**CTA:**
Repeat primary button: Get Started - $39

**Requirements:**

- No hidden fees
- Must be extremely clear that $39 is one-time

---

### 4.8 OPEN SOURCE & TRUST

**Purpose:** Address security and trust concerns directly.

**Title:**
Open Source

**Required Copy:**
This tool asks for OAuth access to create projects in your accounts. The entire codebase is public so it can be audited and self-hosted.

**Required Links:**

- View Source on GitHub
- Security & Credential Handling Documentation

**Functional Requirements:**

- Direct link to security documentation
- Clear path for self-hosters

---

### 4.9 FAQ SECTION

**Purpose:** Answer predictable questions without support contact.

**Title:**
Common Questions

**Required Questions & Answers:**

**Do I need to know how to code?**
No. After setup, AI tools can generate and update the code.

**Do I need a computer?**
No. Changes can be made from a phone.

**Is anything hosted here?**
No. Everything lives in your own GitHub, Vercel, and database accounts.

**Can I self-host the wizard?**
Yes. The open source version is free to run yourself.

**Which AI tools work with this?**
Any AI can generate code for your project. For the full "talk and push" mobile workflow, you need an AI with GitHub integration. Claude currently offers the best experience for this.

**Requirements:**

- Expandable FAQ format preferred
- Must remain short and direct

---

### 4.10 FOOTER

**Required Elements:**

Links:
- GitHub
- Documentation
- Security
- Support

Copyright line:
2026 Vibe Starter

---

## 5. Technical Requirements

### Performance

- Mobile-first responsive design
- Page load under 2 seconds
- Minimal JavaScript where possible
- Optimized images and assets

### Accessibility

- WCAG AA compliance
- Keyboard-navigable
- Screen reader friendly
- High-contrast text

### Analytics

- Optional, privacy-respecting analytics only
- No tracking of sensitive data

### SEO

- Clear meta title and description
- Structured headings
- Fast crawlable content

---

## 6. Conversion Requirements

### Primary Conversion

Click "Get Started - $39"

### Secondary Conversions

- View GitHub repository
- Read documentation

### Success Metrics

- Hero CTA click-through rate
- Scroll depth
- Conversion rate to wizard start
- Bounce rate

---

## 7. Out of Scope

The landing page will NOT:

- Include user testimonials at launch
- Promise business results
- Act as a tutorial
- Replace full documentation

---

## 8. Future Enhancements (Not v1)

Potential later additions:

- Short demo video
- Live example site
- Interactive preview
- Choose-your-own-stack configurator

---

## 9. Acceptance Criteria

The landing page is considered complete when:

- All sections above are implemented
- Mobile display is clean and readable
- CTAs route correctly
- Pricing is unambiguous
- GitHub links function
- Page clearly communicates value in under 60 seconds

The page must clearly communicate:

- Automated mobile editing depends on AI tools with GitHub access
- Claude is currently the primary option for this workflow
- The wizard itself does not require Claude
- Manual editing remains possible with any AI

---

## 10. AI Ecosystem Context (Internal Reference)

This section documents the current landscape for internal reference - not for display on the landing page.

### Current State (January 2026)

**Tier 1 - Full Mobile Workflow:**
Claude + GitHub + Vercel auto-deploy - the smoothest mobile-first experience

**Tier 2 - Developer Tools:**
GitHub Copilot, Cursor, IDE agents - powerful but desktop-focused

**Tier 3 - General AI Tools:**
ChatGPT, Gemini, etc. - great at code but no direct repo control from mobile

### What This Means

The wizard is valuable regardless of AI provider because it still delivers:
- A real site
- A database
- Authentication
- Free hosting

The difference is only in how convenient the editing loop is.

### GitHub's Native AI Tools

GitHub Copilot and Copilot Workspace exist but are:
- Developer-first assistants
- Desktop-focused
- Not simple mobile chat agents

They do NOT replace the Claude-style "phone chat to push code" workflow.

### Why This Is Still Relevant

We are not teaching "Use Claude specifically." We are teaching:

"Here is a workflow that makes building websites from a phone actually possible."

That concept is 100% relevant. Claude just happens to be the easiest door into that world right now.

---

## 11. Competitive Landscape (Internal Reference)

This section maps adjacent offerings for positioning clarity - not for display on the landing page.

### Category 1: Cloud IDEs with AI (Replit, CodeSandbox)

**What they do:** All-in-one browser dev environments with AI agents that can plan, write, and deploy apps.

**Trade-off:** Platform lock-in. Code lives inside their workspace, not user's GitHub unless manually exported.

**Best for:** Users who want an all-in-browser experience without juggling multiple services.

**Our difference:** We set up owned infrastructure, then get out of the way.

### Category 2: AI App Generators (Lovable, Bolt, v0)

**What they do:** Turn natural language into full codebases - UI, logic, database wiring.

**Trade-off:** Often heavy platforms with subscription pricing. Can own the experience.

**Best for:** Founders who want full app generation faster than manual prompts.

**Our difference:** We're infrastructure setup + workflow education, not app generation.

### Category 3: AI Code Assistants (Copilot, Cursor)

**What they do:** Deep code reasoning, refactoring, PR generation inside development environments.

**Trade-off:** Desktop-focused. Not oriented at beginners or non-technical builders.

**Best for:** Experienced developers who want AI to accelerate coding within IDEs.

**Our difference:** We target the setup phase, not the coding phase.

### Category 4: No-Code Builders (Glide, Adalo, Softr)

**What they do:** Turn data sources into apps visually with optional AI assistance.

**Trade-off:** Not real code you can own and extend. More "platform app" than "deployable codebase."

**Best for:** Non-technical users who never want to touch a code editor or Git.

**Our difference:** Real code, real infrastructure, full ownership.

### Category 5: Enterprise Workflow Platforms (ToolJet, Superblocks)

**What they do:** Internal tool builders with governance, visual editors, enterprise features.

**Trade-off:** Not built around mobile conversational dev. Enterprise oriented.

**Best for:** Teams building internal dashboards and operational tools.

**Our difference:** Individual creators, not enterprise teams.

### Category 6: GitHub Spark

**What it does:** GitHub's announced no-code app builder.

**Trade-off:** Still evolving. Workflow details unclear.

**Best for:** TBD - backed by GitHub's ecosystem, potentially huge reach.

**Our difference:** Available now, workflow proven, education included.

### Where Vibe Starter Is Unique

The combination that's rare in the market:

- Owned infrastructure (not platform lock-in)
- Real database + auth + deploy pipeline
- Mobile-capable AI workflow
- Fast setup (20 minutes)
- Education built in
- Open source (auditable, self-hostable)
- One-time payment (no subscription)

Most alternatives trade off ownership, mobile workflow, or beginner accessibility for other strengths.

### How to Communicate Relative Value

**No-code platforms:** Easier but don't give real code you own

**Cloud IDEs (Replit, CodeSandbox):** Great for development, not focused on setup + ownership

**AI code assistants (Copilot, Cursor):** Help generate code, not deploy infrastructure

**AI app generators (Lovable, Bolt):** Build apps, but often inside their ecosystem

Vibe Starter sits at the intersection of: owned infrastructure + AI-assisted iteration + mobile-capable workflow + fast setup.

---

## 12. Quick Pitch Variations (Internal Reference)

These are distilled versions for different contexts - not polished copy, just the core ideas.

### 10-Second Pitch

Your own website. Free hosting. Real database. Live in 20 minutes. Then build it from your phone.

### 5-Second Version

A real website in 20 minutes. Owned by you. Updated from your phone.

### The Problem It Fixes

Getting a real website online normally means creating 4 accounts, finding API keys, wiring services, hours of confusion. This does it for you in one flow.

### The Offer

$39 one time. No subscription. Free hosting forever.

### Why It's Different

Not a platform. Not a builder. Not lock-in. Just a foundation you control.

### Who It's For

People with ideas, not much time, no dev experience, a phone in their pocket.

### The Core Promise

Open phone. Describe change. Site updates.

### Trust Hook

Open source. Nothing hosted here. Everything lives in your accounts.

### The Final One-Liner

Get a real website online today. Own it. Build it from your phone.

---

## 13. Public-Facing Philosophy (Creator Positioning)

This section defines how the person behind Vibe Starter shows up publicly - not as marketing strategy, but as grounding for authentic presence.

### What You Are NOT

Do not position yourself as:

- "The AI guru"
- "The infrastructure expert"
- "The next big tech influencer"
- "The guy who invented something revolutionary"

Any of these would feel forced and inauthentic.

### What You Actually Are

Based on how this project came together:

- A practical builder
- Someone who likes experimenting
- Someone who figured out a workflow that made building easier
- Someone who wants to show other regular people what's possible

Not a theorist. Not a futurist. Not a platform. Just a person who found a useful path and wants to share it.

### The Cleanest Positioning

"A guide to practical, everyday AI-powered building."

Not: "Look how smart I am"
But: "Here's a workflow that works."

### The Three Natural Roles

**1. The Practical Experimenter**
"I try things and show what actually works."
Real-world, day-to-day: building, failing, shipping, iterating.

**2. The Translator**
Take confusing tech ideas and turn them into simple steps, understandable language, and concrete demos.
Not "AI futurism" - just "here's how to do this useful thing."

**3. The On-Ramp**
The role is not "become a developer."
The role is "get people past the scary first step."

### How to Talk About Yourself Publicly

**Simple Version:**
"I show people how to build real websites using AI and a phone."

**Slightly Longer Version:**
"I help non-technical people get a real site online quickly and show them how to build on it from anywhere."

What this avoids:
- No claims about being an expert
- No grand promises
- No ego

Just practical help.

### Positioning Relative to Vibe Starter

You are NOT: "The founder of a tech platform"
You ARE: "The person showing a simple workflow and providing a helpful tool to make it easier."

Publicly:
- You demonstrate the workflow
- The product supports the workflow
- You don't need to be the star

### Content Tone

Not: "Buy my product"
But: "Here's something cool you can do right now."

Consistent positioning lines:
- "Practical AI building, no hype."
- "Build real things from your phone."
- "Simple workflows for regular people."
- "AI as a tool, not a lifestyle."

### Long-Term Identity

The smartest long-term positioning is: **Workflow Educator**

Not tied to Claude. Not tied to one tool. Not tied to one platform.

Teaching a mindset and method:
- Connect tools
- Own your stuff
- Experiment freely
- Build from anywhere

This means you never get trapped if Claude changes, OpenAI adds integrations, GitHub releases new agents, or the ecosystem shifts. Because you're not selling a specific tech stack - you're selling practical empowerment.

### Simple Bio

For social profiles:

"Showing regular people how to build real websites with AI and a phone."

Honest, clear, and grounded.

### The Strongest Version

Not a salesman. Not a guru. Not a founder-first personality.

Just: **A normal builder showing other normal people what's now possible.**

---

## 14. Summary

This landing page must communicate one simple idea:

**A person can get a real website online, for free, in about 20 minutes - and then build on it from their phone.**

Everything else supports that message.

The honest promise:

- The wizard creates a real website with free infrastructure
- Automated "build from your phone" workflows are possible today using Claude and GitHub auto-deploys
- Anyone could set up auto-deploys themselves - this tool simply gets them there faster

The honest positioning:

- You are the guide, not the product
- The workflow is the star
- Demonstrate, don't sell
- Stay grounded as tools evolve
