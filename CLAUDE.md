# Claude Code Context for Vibe Starter

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
