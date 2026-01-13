# Troubleshooting: When Things Break (And How to Fix Them)

## The Reality of Building in Production

When you build features and push directly to production, errors happen. This is normal and expected. The difference now is that **you don't need to understand the errors** - your AI does.

This guide teaches you the debugging workflow that works from anywhere, especially your phone.

---

## The Core Workflow: Logs as Communication

**Traditional debugging:**
1. Read error message
2. Understand what's wrong
3. Google the error
4. Read Stack Overflow
5. Try different solutions

**AI-assisted debugging:**
1. Copy error logs
2. Paste to your AI
3. AI diagnoses and fixes
4. Push the fix
5. Test again

**The key insight:** Logs are not for you to understand. Logs are for your AI to understand.

---

## Step-by-Step: Fixing Errors from Mobile

### When Your App Breaks

You'll know something is wrong when:
- Your app shows an error page
- A feature doesn't work as expected
- The page loads but functionality is broken
- You see a blank page or infinite loading

**Don't panic. Here's what to do:**

### 1. Access Your Vercel Logs (Mobile-Friendly)

**Option A: Vercel Mobile App**
1. Install Vercel app (iOS/Android)
2. Open your project
3. Tap "Deployments"
4. Tap the most recent deployment
5. Scroll to "Build Logs" or "Function Logs"

**Option B: Vercel Website (Mobile Browser)**
1. Open vercel.com on your phone
2. Navigate to your project
3. Click "Deployments" tab
4. Click the most recent deployment
5. Scroll down to see logs

**Pro tip:** Bookmark your Vercel project URL for quick access

### 2. Find the Error

Errors usually appear in two places:

**Build Errors** (happens during deployment)
- Look for red text in "Build Logs"
- Usually says "Error:" or "Failed:"
- Happens when your code has syntax issues or missing dependencies

**Runtime Errors** (happens when users interact with your app)
- Look in "Function Logs"
- Shows errors from API routes
- Happens when features are used but something goes wrong

### 3. Copy the Error

**What to copy:**
- The error message itself (usually in red)
- 5-10 lines before the error (for context)
- The file name and line number if shown

**On mobile:**
- Long press on the log text
- Select the error section
- Tap "Copy"

**Example of what to copy:**
```
Error: Invalid model name 'gemini-1.5-pro'
    at /vercel/path/.../route.js:23:15
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
Expected 'gemini-pro' but received 'gemini-1.5-pro'
```

### 4. Ask Your AI to Fix It

Open your AI (Claude, Gemini, ChatGPT) and paste the error with a prompt like:

**Template 1 (Simple):**
```
Here's an error from my Vercel deployment. What's wrong and how do I fix it?

[paste error here]
```

**Template 2 (With context):**
```
I deployed a new feature and now this is broken: [describe what broke]

Here are the Vercel logs:

[paste error here]

Can you diagnose the issue and push a fix?
```

**Template 3 (For build failures):**
```
My deployment failed with this build error:

[paste error here]

What's the issue and how do I fix it?
```

### 5. Let AI Fix It

Your AI will:
1. Read the error logs
2. Identify the problem
3. Explain what went wrong (if you want to know)
4. Write a fix
5. Commit the fix to your repo

**What you do:**
- Review the AI's explanation
- Approve the fix
- Wait for Vercel to auto-deploy
- Test the fix in production

### 6. Verify the Fix

1. Wait 1-2 minutes for Vercel to rebuild
2. Refresh your app
3. Test the feature that was broken
4. If still broken, check new logs and repeat

---

## Common Error Types and What to Say

### Build Errors

**Error says:** `Module not found` or `Cannot find module`
**What to say:** "I'm getting a missing module error. Here are the logs: [paste]"

**Error says:** `Syntax error` or `Unexpected token`
**What to say:** "Build failed with syntax error: [paste]"

**Error says:** `Type error` or `Property does not exist`
**What to say:** "TypeScript error in build: [paste]"

### Runtime Errors

**Error says:** `500 Internal Server Error`
**What to say:** "My API route is returning 500 error: [paste logs]"

**Error says:** `Database error` or `Connection failed`
**What to say:** "Database connection error: [paste]"

**Error says:** `API key invalid` or `Authentication failed`
**What to say:** "API authentication error: [paste]"

### The Magic Formula

No matter what the error is:
```
[Brief description of what broke]

Here are the logs:
[paste logs]

What's the issue and how do we fix it?
```

---

## Tips for Effective Error Debugging

### Do:
- ✅ Copy 5-10 lines of context, not just the error line
- ✅ Mention what you were trying to do when it broke
- ✅ Test after each fix before adding more features
- ✅ Keep your AI conversation open during a coding session

### Don't:
- ❌ Try to fix errors yourself if you don't understand them
- ❌ Copy the entire log (just the relevant error section)
- ❌ Panic - errors are normal and fixable
- ❌ Skip testing before adding more features

### Pro Tips:
- 📱 Keep Vercel app installed for quick log access
- 🔖 Bookmark your project's deployment page
- 💬 Use the same AI conversation for related fixes (it has context)
- 🧪 Test each fix before building the next feature

---

## Real Example: The Gemini Model Name Error

**What happened:** User deployed with Gemini API but the chat feature didn't work

**Error in logs:**
```
Error: Invalid model name 'gemini-1.5-pro'
Expected 'gemini-pro' but received 'gemini-1.5-pro'
```

**What user did:**
1. Opened Vercel on phone
2. Found the error in Function Logs
3. Copied the error
4. Pasted to Claude: "Gemini API isn't working. Here's the error: [paste]"

**What Claude did:**
1. Read the logs
2. Identified the issue (wrong model name)
3. Found the code using the wrong name
4. Updated it to correct model name
5. Pushed the fix

**Time to fix:** 2 minutes

**User understanding required:** Zero - Claude handled everything

---

## When AI Can't Fix It

Sometimes the error is environmental (missing env vars, wrong config, etc.) and AI can't directly fix it.

**Signs this is happening:**
- AI says "you need to update your environment variables"
- AI says "check your Vercel project settings"
- Error keeps happening after multiple fix attempts

**What to do:**
1. Ask AI: "What do I need to manually configure?"
2. Follow AI's step-by-step instructions
3. Check your Vercel dashboard settings
4. Verify environment variables are set correctly

**Common manual fixes:**
- Adding missing environment variables in Vercel
- Reconnecting GitHub integration
- Updating API keys that expired
- Changing project settings in Vercel

---

## Preventing Common Errors

### Before Deploying a New Feature

**Ask your AI:**
```
Before I deploy this, what could break?
Are there any dependencies or env vars I need to set?
```

### After Deploying

**Test immediately:**
1. Visit your live app
2. Test the new feature
3. Check logs for any errors
4. Fix issues before building more

### Regular Maintenance

**Every few features, ask:**
```
Can you review the app's error logs and identify any issues?
```

Your AI can proactively find problems before they affect users.

---

## The Mindset Shift

**Old mindset:**
- "I don't understand this error"
- "I need to learn debugging"
- "I'm stuck until I figure this out"

**New mindset:**
- "I don't need to understand this error"
- "My AI is my debugging partner"
- "I can fix this in 2 minutes by copying logs"

**The truth:** Professional developers also copy errors and ask AI for help. You're using the same workflow, just from your phone instead of a laptop.

---

## Mobile-Specific Tips

### Copying Logs on Mobile

**iOS:**
- Long press on text
- Drag selection handles
- Tap "Copy"
- Switch to AI app
- Long press and "Paste"

**Android:**
- Long press on text
- Adjust selection
- Tap "Copy"
- Switch to AI app
- Paste

### Switching Between Apps

**iOS:**
- Swipe up from bottom to switch apps
- Or use App Switcher (double tap home/swipe up)

**Android:**
- Use Recent Apps button
- Or swipe up gesture

### Pro Tip: Split Screen (if your phone supports it)

1. Open Vercel in one half
2. Open AI chat in other half
3. Copy/paste without switching apps

---

## Quick Reference Card

**When something breaks:**

1. **Get logs** → Vercel app or vercel.com
2. **Copy error** → Long press, select, copy
3. **Paste to AI** → "Here's the error: [paste]"
4. **Let AI fix** → Review and approve
5. **Wait & test** → Auto-deploys in 1-2 min
6. **Repeat if needed** → Check new logs

**Remember:** Logs are communication tools, not things you must understand.

---

## Still Stuck?

If you've tried the above and still can't fix the issue:

1. **Share more context with AI:**
   - What were you trying to build?
   - What steps led to the error?
   - What have you tried so far?

2. **Ask for explanation:**
   - "Can you explain what's causing this in simple terms?"
   - "What would a developer do to fix this?"

3. **Request step-by-step guidance:**
   - "Walk me through fixing this manually"
   - "What settings do I need to check?"

4. **Check if it's a known issue:**
   - Search Vercel docs for the error message
   - Check if service is down (Vercel, Clerk, Neon status pages)

---

## Bottom Line

**Building in production means errors happen.** The new workflow is:

1. Errors appear in production
2. You copy the logs (without understanding them)
3. Your AI reads them (and does understand them)
4. AI pushes a fix
5. You test and move on

**This is not a workaround. This is the workflow.**

You're not avoiding learning - you're using AI as your debugging partner, just like professional developers do now.

The difference is you can do it from your phone, in a coffee shop, in 2 minutes.

---

**Last updated:** January 2026
