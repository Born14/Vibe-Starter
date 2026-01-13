# Claude Code Context for Vibe Starter

## Stack Education Implementation

We have stack education in three places with context-appropriate framing:

1. **Landing page** (`src/app/page.tsx`) - Pre-purchase trust building
   - "Why this stack?" section under stack grid
   - Focus: Production-ready, scalable, cost-effective, no lock-in
   - Purpose: Address buying concerns, build confidence

2. **Wizard success** (`src/app/setup/wizard/steps/DeployStep.tsx`) - Post-purchase validation
   - "Your Full Stack:" explains Frontend/Backend/Database
   - "Why This Stack?" validates purchase decision
   - Purpose: First-time education + confidence building

3. **Deployed dashboard** (`src/app/api/deploy/route.ts` template) - Ownership empowerment
   - "Your Tech Stack" with technical details
   - "What This Means for You" emphasizes capability
   - Purpose: Ongoing reference without prescriptive examples

All three explain Frontend/Backend/Database but with audience-appropriate tone and messaging.

## License Key Format

**IMPORTANT**: License keys must use HEX characters only (0-9, A-F).

- Format: `VS-XXXX-XXXX-XXXX`
- Validation regex: `/^VS-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/`
- Use `toString(16)` NOT `toString(36)` when generating segments

To create a license key:
```bash
cd "c:\Users\mccar\VIBE STARTER\vibe-starter" && npx tsx scripts/create-license.ts
```

## Key Files

- `src/app/api/deploy/route.ts` - Main deployment logic
- `src/app/api/deploy/status/[id]/route.ts` - Polls Vercel for build status
- `src/app/setup/wizard/` - Wizard UI components
- `src/lib/license.ts` - License validation logic
- `scripts/create-license.ts` - Creates new license keys

## Template Details

- Next.js version in template: **15.2.6** (patched for CVE-2025-66478)
- AI providers supported: Claude (Anthropic) or Gemini

## Previous Fixes Applied

1. Next.js version updated to **15.2.6** (patched version for CVE-2025-66478). Versions 15.0.0-16.0.6 are blocked by Vercel. Safe versions: 15.0.5, 15.1.9, 15.2.6, 15.3.6, 15.4.8, 15.5.7, 16.0.7
2. License key format fixed to use hex-only characters (toString(16) instead of toString(36))
3. Vercel deployment trigger requires numeric `repoId` from GitHub API
4. Clerk middleware syntax: `auth().protect()` not `await auth.protect()`
5. Frontend uses 2-second polling with 90 max attempts (3 min timeout) for Vercel builds
6. Database connection uses fallback dummy string during build to prevent TypeScript errors when DATABASE_URL is not set
7. Production branch explicitly set to "main" in Vercel project creation for auto-deployment on push
8. **Auto-migrations on deploy**: Build script runs `drizzle-kit push && next build` to automatically create/update database tables during Vercel deployment. This enables true "build from mobile" workflow where database schema changes deploy and work immediately without manual migration steps.
