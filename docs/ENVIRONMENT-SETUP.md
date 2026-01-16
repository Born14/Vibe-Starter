# Environment Variables Setup

## Overview

This document explains how to configure environment variables for Vibe Starter after a domain change.

## Critical Variable: NEXT_PUBLIC_APP_URL

**Why it's important:** This variable is used for OAuth callback URLs for GitHub and Vercel integrations. When you change your domain, this MUST be updated.

### Current domain: `https://vibestarter.net`

---

## Updating Vercel Environment Variables

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **Vibe-Starter**
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_APP_URL` and click **Edit**
5. Update the value to: `https://vibestarter.net`
6. Select all environments: **Production**, **Preview**, **Development**
7. Click **Save**
8. **Redeploy** your application for changes to take effect

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Update environment variable for all environments
vercel env rm NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL production
# When prompted, enter: https://vibestarter.net

vercel env rm NEXT_PUBLIC_APP_URL preview
vercel env add NEXT_PUBLIC_APP_URL preview
# When prompted, enter: https://vibestarter.net

# Trigger a new deployment
vercel --prod
```

---

## Updating OAuth Callback URLs

After changing `NEXT_PUBLIC_APP_URL`, you must update the callback URLs in:

### 1. GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Select your OAuth App
3. Update **Authorization callback URL** to:
   ```
   https://vibestarter.net/api/auth/github/callback
   ```
4. Click **Update application**

### 2. Vercel Integration

1. Go to [Vercel Integrations](https://vercel.com/dashboard/integrations)
2. Find your integration (or create a new one)
3. Update **Redirect URI** to:
   ```
   https://vibestarter.net/api/auth/vercel/callback
   ```
4. Save changes

---

## All Required Environment Variables

See `.env.example` for a complete list of required environment variables.

### Critical for wizard functionality:
- `NEXT_PUBLIC_APP_URL` - Your domain (e.g., https://vibestarter.net)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `ENCRYPTION_KEY` - 32+ character string for encrypting sensitive data
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials
- `VERCEL_CLIENT_ID` & `VERCEL_CLIENT_SECRET` - Vercel OAuth credentials

### Optional:
- `CLERK_SECRET_KEY` & `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - For admin route protection

---

## Verifying the Changes

After updating environment variables and redeploying:

1. Visit `https://vibestarter.net/setup`
2. Enter your license key
3. Try connecting GitHub - the OAuth flow should work correctly
4. Try connecting Vercel - the OAuth flow should work correctly

If OAuth redirects fail, double-check:
- ✅ `NEXT_PUBLIC_APP_URL` is set correctly in Vercel
- ✅ GitHub OAuth callback URL matches
- ✅ Vercel Integration redirect URI matches
- ✅ You redeployed after changing environment variables

---

## Local Development

For local development, copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials.

**Note:** `.env.local` is gitignored and should never be committed to version control.
