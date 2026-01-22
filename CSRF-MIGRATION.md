# CSRF Protection Migration Guide

## Status: Partially Complete

### ✅ Completed
- [x] Created CSRF protection utility (`src/lib/csrf.ts`)
- [x] Created API client with CSRF token handling (`src/lib/api-client.ts`)
- [x] Protected `/api/validate-license` route (generates CSRF token)
- [x] Protected `/api/session` POST route
- [x] Protected `/api/deploy` POST route
- [x] Updated setup page to store CSRF token
- [x] Updated AppNameStep to use new API client (example)

### 🚧 TODO: Update Remaining Wizard Steps

The following wizard step files need to be updated to use the CSRF-protected API client:

#### Files to Update:
1. `src/app/setup/wizard/steps/ClerkStep.tsx`
2. `src/app/setup/wizard/steps/AIStep.tsx`
3. `src/app/setup/wizard/steps/NeonStep.tsx`
4. `src/app/setup/wizard/steps/DeployStep.tsx` (if it makes POST requests)

#### Migration Pattern:

**Before:**
```typescript
const res = await fetch("/api/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sessionId, field: "fieldName", value: fieldValue }),
});
```

**After:**
```typescript
import { apiPost } from "@/lib/api-client";

const res = await apiPost("/api/session", {
  sessionId,
  field: "fieldName",
  value: fieldValue,
});
```

## How CSRF Protection Works

1. **Token Generation**: When a user validates their license key, the server generates a unique CSRF token
2. **Token Storage**: The token is stored in:
   - An httpOnly cookie (server-side validation)
   - SessionStorage (client-side header inclusion)
3. **Token Validation**: All POST/PUT/DELETE requests must include:
   - `x-csrf-token` header matching the cookie value
   - Valid origin/referer header
4. **Protection Applied**: The `withCsrfProtection()` wrapper validates tokens for all state-changing requests

## Testing CSRF Protection

After migrating all steps, test:
1. Complete wizard flow end-to-end
2. Try making API requests without CSRF token (should fail with 403)
3. Try making requests from different origin (should fail with 403)
4. Verify all wizard steps still work correctly

## Security Benefits

- Prevents cross-site request forgery attacks
- Validates request origin
- Uses httpOnly cookies (can't be accessed by JavaScript)
- Implements double-submit cookie pattern
- SameSite=Strict cookie policy
