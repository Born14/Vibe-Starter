# PRD: Education Hub

**Product:** Vibe Starter Education Page
**Version:** 1.0
**Date:** January 2026
**Status:** Draft
**Owner:** Product

---

## Executive Summary

Create a dedicated education page (`/education`) that serves as the central learning hub for Vibe Starter users. This page teaches users how to build with AI, debug from mobile, and understand their stack - fulfilling our promise that education is how we deliver on the freedom guarantee.

**The Mission:** Enable anyone to build software from anywhere by teaching them the AI-assisted development workflow.

---

## Context & Strategic Alignment

### The Opportunity

We're at the cusp of an explosion of people breaking into building visions that would have been impossible without years of education and experience. Most people don't realize how accessible this already is.

**The gap:** Between technological capability (which exists now) and public awareness (which doesn't).

### Why This Matters

From PRODUCT-VISION.md:
> "Education isn't a feature. Education is how we deliver on the freedom promise."
>
> "Everyone else hides complexity to maintain dependency. Vibe Starter teaches complexity to enable independence. **This is not a feature. This is the moat.**"

### Current State

**What we have:**
- Wizard with brief in-step explanations
- PROMPT.md in deployed repos
- TROUBLESHOOTING.md (docs folder)
- Stack explanations scattered across wizard success screen

**What's missing:**
- Central hub for all educational content
- Progressive learning path
- Mobile debugging workflow documentation
- Video content home (for future)
- Pre-purchase education (trust building)

### Success Criteria

1. **Primary:** Users can self-serve answers to "how do I..." questions
2. **Secondary:** Reduces support burden by 40%+
3. **Tertiary:** Becomes SEO driver for discovery ("how to build from phone," etc.)
4. **Brand:** Reinforces education-first positioning vs. competitors

---

## User Stories

### Pre-Purchase User (Evaluating)

> "I want to understand what I'll actually learn so I can decide if this is right for me."

- See what skills I'll gain
- Understand the workflow before committing
- Gauge complexity level
- Build trust that education is real

### New User (Just Deployed)

> "I just deployed my app through the wizard. What do I do now?"

- Understand what was created
- Learn first steps for building features
- Know where to go when stuck
- Feel confident moving forward

### Active Builder (Building Features)

> "I'm trying to build something and need to know how to..."

- Find specific how-to guides
- Learn the mobile debugging workflow
- Understand AI prompting patterns
- Get unstuck quickly

### Experienced User (Going Deeper)

> "I want to customize beyond the template and really understand my stack."

- Deep dive into how pieces connect
- Learn to run locally
- Understand migration paths
- Master advanced patterns

---

## Content Structure

### Information Architecture

```
/education
│
├── Hero
│   └── "Build Anything. From Anywhere. We'll Teach You How."
│
├── Before You Start
│   ├── The New Way of Building (paradigm shift)
│   ├── What You'll Learn
│   └── No Experience Required (but here's what helps)
│
├── Getting Started
│   ├── After the Wizard (immediate next steps)
│   ├── Understanding Your Accounts
│   └── Your First Feature (step-by-step)
│
├── Building Features
│   ├── The Core Workflow (describe → generate → test → deploy)
│   ├── Mobile vs. Laptop Building
│   ├── Working with AI (prompting guide)
│   └── Using PROMPT.md Effectively
│
├── When Things Break 🔧
│   ├── The Debugging Workflow (logs as communication)
│   ├── Mobile Debugging Guide (Vercel logs from phone)
│   ├── Common Errors & Solutions
│   └── Link to full TROUBLESHOOTING.md
│
├── Understanding Your Stack
│   ├── How the Pieces Connect (frontend/backend/database)
│   ├── What Each Service Does
│   ├── Why This Stack (production-ready, scalable, free-tier)
│   └── Environment Variables Explained
│
├── Going Deeper
│   ├── Running Locally (for those who want it)
│   ├── Customizing Beyond the Template
│   ├── Advanced Patterns
│   └── How to Migrate Away (proving ownership)
│
└── Video Library (Future)
    ├── Wizard Walkthroughs
    ├── Build-Along Series
    ├── Stack Deep Dives
    └── "Built from My Phone" Series
```

---

## Detailed Content Breakdown

### Section 1: Before You Start

**Purpose:** Set expectations, build trust, explain paradigm shift

**The New Way of Building**
- Traditional: Learn to code → Build
- Now: Describe what you want → AI builds → You test and refine
- This isn't cheating - this is how modern development works
- Professional developers use this workflow too

**What You'll Learn**
- ✓ How to describe features clearly (communication, not coding)
- ✓ The build → deploy → test → debug loop
- ✓ Mobile debugging workflow (copy logs → paste to AI → fix)
- ✓ Understanding your stack (what each piece does)
- ✓ Working with AI as your coding partner
- ✗ Traditional programming (that's optional, not required)

**No Experience Required**
- If you can describe what you want, you can build it
- If you can copy/paste, you can debug it
- If you can follow steps, you can deploy it
- The learning curve is hours/days, not months/years

---

### Section 2: Getting Started

**Purpose:** Immediate post-wizard guidance, first success

**After the Wizard: Your First 5 Minutes**

1. **Verify your app is live** → Visit your-app.vercel.app
2. **Sign in to your app** → Test authentication
3. **Bookmark important links:**
   - Your app URL
   - GitHub repo
   - Vercel project
   - Clerk dashboard
   - Neon database

4. **Choose your building method:**
   - From phone: Open Claude mobile app
   - From laptop: Install Cursor or VS Code
   - From anywhere: Use GitHub web editor

5. **Build your first feature** → (Link to "Your First Feature" guide)

**Understanding Your Accounts**

*Quick reference table:*

| Service | What It Does | Your Dashboard Link |
|---------|-------------|---------------------|
| **GitHub** | Stores your code | github.com |
| **Vercel** | Hosts your app on the internet | vercel.com |
| **Clerk** | Manages user sign-up/sign-in | clerk.com |
| **Neon** | Stores your database | neon.tech |
| **AI API** | Powers AI features (Claude/Gemini/OpenAI) | [respective console] |

*Why you own all of these:*
- No lock-in to Vibe Starter
- You control costs and scaling
- Can migrate or change providers
- Full access to all settings and data

**Your First Feature: Add a Notes Page**

*Step-by-step guide to build something immediately:*

1. Open your AI (Claude mobile, Gemini, or ChatGPT)
2. Connect to your GitHub repo: [your-app-name]
3. Copy/paste your PROMPT.md for context
4. Say: "Add a page at /notes where users can create, view, and delete notes"
5. AI will generate code and create a PR
6. Review the changes (AI will explain them)
7. Merge the PR
8. Wait 1-2 minutes for auto-deploy
9. Visit your-app.vercel.app/notes
10. Test your new feature!

*What just happened:*
- AI read your project structure (from PROMPT.md)
- AI created a new page component
- AI added a database table for notes
- AI created API routes to save/load notes
- Database schema auto-synced during deployment
- Everything went live automatically

**You just shipped a feature. From your phone. In 5 minutes.**

---

### Section 3: Building Features

**Purpose:** Teach the core workflow, mobile-first

**The Core Workflow**

*This is how you build everything:*

```
1. Describe what you want
   ↓
2. AI generates code
   ↓
3. Review the changes
   ↓
4. Approve/merge
   ↓
5. Auto-deploys (1-2 min)
   ↓
6. Test in production
   ↓
7. Iterate or move to next feature
```

*The secret:* Professional developers use this exact workflow now. You're not learning a toy - you're learning the modern way.

**Mobile vs. Laptop Building**

*When to use each:*

**Mobile (Claude/Gemini/ChatGPT app):**
- ✓ Quick feature additions
- ✓ Bug fixes and tweaks
- ✓ Building in spare moments
- ✓ When you don't have laptop access
- ✓ Reviewing and merging PRs
- ✗ Complex multi-file refactors (harder to review)
- ✗ Heavy debugging (harder to see full context)

**Laptop (Cursor/VS Code/GitHub.dev):**
- ✓ Complex features spanning many files
- ✓ Deep debugging sessions
- ✓ Large refactors
- ✓ Better code review (bigger screen)
- ✗ Requires being at laptop
- ✗ More setup (if running locally)

**The reality:** Most users do 80% on mobile, 20% on laptop.

**Working with AI: Prompting Guide**

*How to describe features effectively:*

**Good prompts:**
- ✓ "Add a page where users can upload profile photos"
- ✓ "Create a form to collect user feedback and save it to the database"
- ✓ "Make the homepage show the 5 most recent items from the database"
- ✓ Specific about UI ("add a button") and behavior ("save to database")

**Vague prompts:**
- ✗ "Make the app better"
- ✗ "Add some features"
- ✗ "Fix the design"
- ✗ No clear outcome specified

**Template for effective prompts:**
```
[Action] + [What] + [Where] + [Behavior]

Examples:
- Add a profile page that shows user's uploaded items
- Create a settings page where users can update their email
- Make the dashboard show total count of items for this user
```

**Using PROMPT.md Effectively**

*What PROMPT.md is:*
- A file in your repo that explains your project to AI
- Contains stack info, structure, current database schema
- Updated automatically as your project grows

*How to use it:*
1. Always paste PROMPT.md at the start of a new AI conversation
2. This gives AI context about your project
3. AI will reference it when building features
4. No need to re-explain your stack each time

*Example conversation:*
```
You: [paste PROMPT.md]
You: Add a page where users can save favorite items

AI: [reads PROMPT.md, understands your stack]
AI: I'll create /favorites page using your existing items table...
```

---

### Section 4: When Things Break 🔧

**Purpose:** Teach debugging workflow, reduce panic

**The Debugging Workflow**

*When something breaks (and it will):*

**Don't panic. Here's the loop:**

```
1. Something breaks (error page, feature doesn't work)
   ↓
2. Open Vercel (mobile app or web)
   ↓
3. Find your project → Deployments → Latest → Logs
   ↓
4. Copy the error section (long press on mobile)
   ↓
5. Paste to AI: "Here's the error, what's wrong?"
   ↓
6. AI diagnoses and pushes a fix
   ↓
7. Wait 1-2 min for redeploy
   ↓
8. Test again
```

**The key insight:** You don't need to understand the error. Your AI understands it.

**Mobile Debugging: Step-by-Step**

*Accessing Vercel logs on your phone:*

**Option 1: Vercel App (Recommended)**
1. Install Vercel app (iOS/Android)
2. Sign in
3. Tap your project
4. Tap "Deployments"
5. Tap latest deployment
6. Scroll to "Logs"
7. Long press to select error text
8. Tap "Copy"

**Option 2: Mobile Browser**
1. Open vercel.com on phone
2. Navigate to your project
3. Click "Deployments" tab
4. Click latest deployment
5. Scroll to logs
6. Select and copy error

*Pro tip:* Bookmark your Vercel project URL for quick access.

**What to copy:**
- The error message (usually in red)
- 5-10 lines before it (for context)
- File name and line number if shown

**What to say to AI:**

*Template 1 (Simple):*
```
Here's an error from Vercel. What's wrong and how do we fix it?

[paste error]
```

*Template 2 (With context):*
```
I tried to [what you did] and now [what broke].

Here are the logs:
[paste error]

What's the issue?
```

*Template 3 (Specific):*
```
Getting this error when I [user action]:

[paste error]

Can you diagnose and push a fix?
```

**Common Errors (Quick Reference)**

| Error Type | What It Means | What to Say |
|-----------|---------------|-------------|
| `Module not found` | Missing dependency | "Missing module error: [paste]" |
| `500 Internal Server Error` | API route crashed | "API route error: [paste logs]" |
| `Database error` | Can't connect to Neon | "Database connection issue: [paste]" |
| `API key invalid` | Wrong/expired API key | "API auth error: [paste]" |
| `Type error` | TypeScript issue | "Type error in build: [paste]" |

**Full Guide:** [Link to TROUBLESHOOTING.md]

---

### Section 5: Understanding Your Stack

**Purpose:** Build confidence through understanding

**How the Pieces Connect**

*Your app has three main parts:*

**Frontend (What Users See)**
- Pages, forms, buttons - the UI
- Runs in the user's browser
- Built with React + Next.js
- Hosted on Vercel

**Backend (Business Logic)**
- API routes that handle requests
- Processes data, checks permissions
- Runs on Vercel's servers (serverless)
- Connects frontend to database

**Database (Data Storage)**
- Stores user data permanently
- Postgres database on Neon
- Accessed via Drizzle ORM
- Auto-syncs schema on deploy

*The flow when a user interacts:*
```
User clicks button
   ↓
Frontend sends request to backend API
   ↓
Backend checks auth (Clerk)
   ↓
Backend queries database (Neon)
   ↓
Database returns data
   ↓
Backend processes and responds
   ↓
Frontend displays result to user
```

**What Each Service Does**

**GitHub** (Code Repository)
- Stores all your code
- Tracks changes (version control)
- Enables collaboration
- Triggers deployments when you push

**Vercel** (Hosting + Deployment)
- Hosts your app globally
- Automatically builds on git push
- Handles scaling (10 users or 10 million)
- Provides HTTPS, CDN, edge functions

**Clerk** (Authentication)
- Manages user sign-up/sign-in
- Pre-built UI components
- Handles passwords, sessions, security
- Provides user management dashboard

**Neon** (Database)
- Serverless Postgres database
- Scales automatically
- Built-in connection pooling
- Generous free tier

**AI API** (Claude/Gemini/OpenAI)
- Powers AI features in your app
- Pay per use (very cheap)
- You bring your own key
- Can switch providers anytime

**Why This Stack**

*Three reasons this stack is special:*

**1. Production-Ready**
- Powers companies from startups to Fortune 500
- Not a toy stack - this is what professionals use
- Handles real traffic and real users
- Battle-tested for security and performance

**2. Scales With You**
- Free tier handles 1-1000 users
- Same stack scales to millions
- No rewrite needed as you grow
- Pay only for what you use

**3. No Lock-In**
- You own all accounts
- Can migrate away anytime
- Standard tech, not proprietary
- Providers are replaceable

**Environment Variables Explained**

*What they are:*
- Secret values your app needs (API keys, database URLs)
- Stored securely in Vercel
- Never committed to git (for security)
- Available to your app at runtime

*The ones Vibe Starter sets:*

| Variable | What It Does |
|----------|--------------|
| `CLERK_SECRET_KEY` | Authenticates with Clerk |
| `DATABASE_URL` | Connects to Neon database |
| `ANTHROPIC_API_KEY` (or similar) | Powers AI features |

*You can see/edit these in Vercel:*
- Go to your project on Vercel
- Settings → Environment Variables
- Add, edit, or remove as needed

---

### Section 6: Going Deeper

**Purpose:** Advanced users who want more control

**Running Locally**

*For those who want to run the app on their laptop:*

**Prerequisites:**
- Node.js installed (nodejs.org)
- Git installed
- Terminal/command line basics

**Steps:**
```bash
# 1. Clone your repo
git clone https://github.com/[your-username]/[your-app-name]
cd [your-app-name]

# 2. Install dependencies
npm install

# 3. Create .env.local file
# Copy .env.example and fill in your values

# 4. Run database migrations
npm run db:push

# 5. Start dev server
npm run dev

# 6. Open browser
# Visit http://localhost:3000
```

**Why run locally:**
- Faster iteration (no deploy wait)
- Easier debugging (see console logs)
- Work offline
- Test before pushing to production

**Why you might not need to:**
- Building directly in production works fine
- No setup required
- Works from any device
- Mobile-friendly workflow

**Customizing Beyond the Template**

*Your app is yours to modify:*

**What you can change:**
- Everything - you own the code
- Add any npm package
- Integrate any API
- Change styling completely
- Add any features

**Common customizations:**
- Custom domain (via Vercel)
- Different styling (Tailwind themes)
- Additional auth providers (Clerk supports many)
- Scheduled jobs (Vercel cron)
- File uploads (Vercel Blob)
- Email sending (Resend, SendGrid)

**How to add these:**
- Describe what you want to your AI
- AI will guide you through setup
- May require adding env vars
- Usually takes 10-30 minutes

**Advanced Patterns**

*As you build more:*

**API Route Patterns**
- REST endpoints for data operations
- Middleware for authentication
- Error handling best practices
- Rate limiting (for production apps)

**Database Patterns**
- Relations between tables
- Indexes for performance
- Migrations for schema changes
- Backup strategies

**Deployment Patterns**
- Preview deployments for testing
- Environment-specific configs
- Rollbacks (if something breaks)
- Monitoring and logging

*Where to learn more:*
- Next.js docs: nextjs.org/docs
- Vercel docs: vercel.com/docs
- Drizzle ORM: orm.drizzle.team

**How to Migrate Away**

*Proving ownership is real:*

**Why we include this:**
- You're not locked to Vibe Starter
- This proves you own everything
- You can always leave
- Trust through transparency

**How to migrate:**

1. **Change hosting:** Deploy to any platform that supports Next.js (Netlify, Railway, your own server)
2. **Change database:** Export data from Neon, import to any Postgres database
3. **Change auth:** Clerk migration tools exist, or swap to Auth.js, Supabase Auth, etc.
4. **Change AI:** Just swap the API key and provider

**The point:** Everything is standard tech. Nothing proprietary. True ownership.

---

### Section 7: Video Library (Future)

**Purpose:** Visual learning, build-along content

**Coming Soon:**

*Wizard Walkthroughs*
- Full walkthrough of wizard (screen recording)
- Each step explained in detail
- Common issues and how to resolve

*Build-Along Series*
- "Let's build [X] together"
- Real-time coding with AI
- Shows the full workflow
- Includes mistakes and fixes

*Stack Deep Dives*
- How authentication works (Clerk walkthrough)
- Database design patterns (Drizzle + Neon)
- Deployment process (Vercel internals)

*"Built from My Phone" Series*
- Real features built on mobile
- Shows the full workflow
- Vercel logs, debugging, testing
- Proving it actually works

**Subscribe to our YouTube:** [Link - future]

---

## Design Principles

### Content First
- Clear, scannable typography
- Generous whitespace
- Mobile-optimized (most users will read on phone)
- Code blocks with syntax highlighting
- Expandable sections for deep dives

### Progressive Disclosure
- Start simple, offer depth for those who want it
- Collapsible sections for advanced topics
- "Skip this" options for experienced users
- Clear visual hierarchy

### Action-Oriented
- Every section has a "try this now" CTA
- Copy-paste templates provided
- Links to relevant dashboards
- Next steps always visible

### Trust Through Transparency
- Honest about what's hard vs. easy
- Acknowledges limitations
- Shows the "migrate away" path
- No BS marketing speak

### Mobile-First
- Touch-friendly UI
- Works great on small screens
- Fast loading (minimal images)
- Readable without zooming

---

## User Flows

### Flow 1: New User Post-Deployment

```
User finishes wizard
   ↓
Success screen links to /education
   ↓
Lands on "Getting Started" section
   ↓
Follows "Your First Feature" guide
   ↓
Builds something in 5 minutes
   ↓
Feels confident, continues building
```

### Flow 2: User Hits Error

```
Feature breaks, user stuck
   ↓
Remembers education page
   ↓
Goes to "When Things Break" section
   ↓
Follows mobile debugging workflow
   ↓
Copies logs, pastes to AI
   ↓
AI fixes, user deploys
   ↓
Problem solved in minutes
```

### Flow 3: Pre-Purchase Evaluation

```
Potential buyer considering purchase
   ↓
Visits /education (linked from landing page)
   ↓
Reads "What You'll Learn"
   ↓
Sees education is comprehensive
   ↓
Increased trust → Purchase
```

---

## Technical Implementation

### Phase 1: MVP (Week 1-2)

**Scope:**
- Create `/education` page
- Implement sections 1-5 (text only, no videos)
- Link from wizard success screen
- Link from landing page footer
- Basic styling (Tailwind)

**Content:**
- Write all text content
- Create code examples
- Build simple accordions/tabs
- Ensure mobile responsive

**Success criteria:**
- Page exists and is accessible
- All sections have content
- Mobile-friendly
- Under 3 second load time

### Phase 2: Polish (Week 3-4)

**Scope:**
- Enhanced navigation (sticky sidebar)
- Search functionality (CMD+K)
- Copy buttons on code blocks
- Progress tracking (optional)
- Analytics integration

**Nice-to-haves:**
- Dark mode toggle
- Print styles (for offline reference)
- Bookmark/favorites
- Share links to specific sections

### Phase 3: Video Integration (Month 2+)

**Scope:**
- Film and edit video content
- Embed YouTube videos
- Create video thumbnails
- Build video library section

**Content to create:**
- Wizard walkthrough (10-15 min)
- First feature build-along (15 min)
- Mobile debugging demo (8 min)
- Stack overview (20 min)

### Phase 4: Community Features (Month 3+)

**Scope:**
- User-submitted tips
- Community Q&A section
- Case studies / user builds
- Discord integration (optional)

---

## Success Metrics

### Engagement Metrics

**Primary:**
- % of new users who visit /education
- Time spent on page
- Scroll depth (are they reading?)
- Section engagement (which sections most visited)

**Secondary:**
- Return visits to /education
- Search queries (what are users looking for?)
- Exit pages (where do they go after?)

### Business Impact

**Support Reduction:**
- % decrease in "how do I..." support tickets
- % of tickets resolved by pointing to education
- Time to resolution when education is used

**User Success:**
- % of users who build first feature within 24h
- % who build 5+ features within first week
- Correlation between education visits and retention

**Discovery & Trust:**
- Organic traffic to /education
- Bounce rate (are they staying?)
- Conversion rate (education → purchase)

### Content Performance

**What's working:**
- Most visited sections
- Highest engagement sections
- Most copied code examples
- Most clicked external links

**What's not:**
- Sections with high bounce
- Sections never/rarely visited
- Content that generates support questions

---

## Open Questions

1. **Navigation:** Sidebar + tabs, or just tabs, or accordion?
2. **Search:** Build custom or use Algolia/DocSearch?
3. **Gating:** Should any content be behind login? (Probably not - public education builds trust)
4. **Versioning:** As stack evolves, how do we handle docs for different versions?
5. **Translations:** Priority for non-English content? (Probably later)
6. **Offline:** Make available as PDF download?

---

## Risks & Mitigation

### Risk: Content becomes stale
**Mitigation:**
- Regular review schedule (monthly)
- User feedback mechanism
- Link checking automation
- Version tags for external service docs

### Risk: Too much content, overwhelming
**Mitigation:**
- Progressive disclosure design
- Clear visual hierarchy
- "Quick start" vs "Deep dive" paths
- Search to find specific info

### Risk: Videos become outdated
**Mitigation:**
- Focus on concepts, not specific UI
- Note versions in video descriptions
- Supplement with written updates
- Re-record only when major changes

### Risk: Doesn't reduce support load
**Mitigation:**
- Track which questions education answers
- Add content for common issues
- Make search prominent
- Improve discoverability

---

## Future Enhancements (Post-V1)

### Interactive Tutorials
- Step-by-step in-page coding
- Verify completion before advancing
- Sandbox environment

### AI Chat Assistant
- "Ask about this page" bot
- Answers questions using education content
- Links to relevant sections

### Personalization
- "Your progress" tracking
- Recommended next topics
- Bookmark favorite sections

### Community Features
- User tips and tricks
- Build showcases
- Q&A forum
- Discord integration

---

## Appendix: Content Calendar

### Week 1: Foundation
- Write "Before You Start" section
- Write "Getting Started" section
- Create basic page structure

### Week 2: Core Workflows
- Write "Building Features" section
- Write "When Things Break" section
- Integrate TROUBLESHOOTING.md

### Week 3: Deep Content
- Write "Understanding Your Stack" section
- Write "Going Deeper" section
- Polish and edit all content

### Week 4: Launch Prep
- Design and styling
- Mobile optimization
- SEO optimization
- Internal linking
- Beta test with users

### Month 2: Video Production
- Script video content
- Film and edit
- Create thumbnails
- Integrate into page

---

## Approval & Next Steps

**Required Approvals:**
- [ ] Product Owner
- [ ] Content review
- [ ] Design review
- [ ] Engineering estimate

**Next Steps:**
1. Approve PRD
2. Create detailed content outline
3. Begin writing content
4. Design mockups
5. Engineering implementation
6. Beta launch
7. Full launch

---

**Document version 1.0 — January 2026**
