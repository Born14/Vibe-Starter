/**
 * Input Validation and Sanitization Library
 * Centralized validators using Zod for type safety and security
 */

import { z } from 'zod';

/**
 * Sanitize string input to prevent XSS
 * Removes dangerous HTML tags and JavaScript
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove <iframe> tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove inline event handlers (onclick, onload, etc.)
    .trim();
}

/**
 * Sanitize HTML but allow safe tags
 */
export function sanitizeHTML(input: string): string {
  // Only allow specific safe tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'];
  const tagPattern = new RegExp(`<(?!\\/?(${allowedTags.join('|')})\\b)[^>]+>`, 'gi');

  return input
    .replace(tagPattern, '') // Remove all tags except allowed ones
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// ============================================================================
// VALIDATORS
// ============================================================================

/**
 * License Key Validator
 */
export const licenseKeySchema = z
  .string()
  .regex(/^VS-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/, 'Invalid license key format')
  .transform(sanitizeString);

/**
 * App Name Validator
 * Must be lowercase, alphanumeric with hyphens, 3-50 characters
 */
export const appNameSchema = z
  .string()
  .min(3, 'App name must be at least 3 characters')
  .max(50, 'App name must be at most 50 characters')
  .regex(/^[a-z0-9-]+$/, 'App name must be lowercase alphanumeric with hyphens only')
  .refine((name) => !name.startsWith('-') && !name.endsWith('-'), {
    message: 'App name cannot start or end with a hyphen',
  })
  .refine((name) => !name.includes('--'), {
    message: 'App name cannot contain consecutive hyphens',
  })
  .transform(sanitizeString);

/**
 * Vercel Token Validator
 */
export const vercelTokenSchema = z
  .string()
  .min(10, 'Vercel token too short')
  .max(500, 'Vercel token too long')
  .transform(sanitizeString);

/**
 * GitHub Token Validator
 */
export const githubTokenSchema = z
  .string()
  .regex(/^(ghp_|github_pat_)[A-Za-z0-9_]+$/, 'Invalid GitHub token format')
  .transform(sanitizeString);

/**
 * Clerk API Key Validators
 */
export const clerkPublishableKeySchema = z
  .string()
  .regex(/^pk_(test|live)_[A-Za-z0-9]+$/, 'Invalid Clerk publishable key format')
  .transform(sanitizeString);

export const clerkSecretKeySchema = z
  .string()
  .regex(/^sk_(test|live)_[A-Za-z0-9]+$/, 'Invalid Clerk secret key format')
  .transform(sanitizeString);

/**
 * Neon Database URL Validator
 */
export const neonDatabaseUrlSchema = z
  .string()
  .url('Invalid database URL')
  .refine((url) => url.startsWith('postgresql://') || url.startsWith('postgres://'), {
    message: 'Database URL must use postgresql:// protocol',
  })
  .refine((url) => url.includes('neon.tech'), {
    message: 'Must be a Neon database URL',
  })
  .transform(sanitizeString);

/**
 * Generic PostgreSQL Database URL Validator (for future flexibility)
 */
export const postgresUrlSchema = z
  .string()
  .url('Invalid database URL')
  .refine((url) => url.startsWith('postgresql://') || url.startsWith('postgres://'), {
    message: 'Database URL must use postgresql:// protocol',
  })
  .transform(sanitizeString);

/**
 * AI API Key Validators
 */
export const anthropicKeySchema = z
  .string()
  .regex(/^sk-ant-[A-Za-z0-9-_]+$/, 'Invalid Anthropic API key format')
  .transform(sanitizeString);

export const openaiKeySchema = z
  .string()
  .regex(/^sk-[A-Za-z0-9]+$/, 'Invalid OpenAI API key format')
  .transform(sanitizeString);

export const googleAIKeySchema = z
  .string()
  .regex(/^AIza[A-Za-z0-9_-]+$/, 'Invalid Google AI API key format')
  .transform(sanitizeString);

/**
 * Email Validator
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(320, 'Email too long')
  .transform((email) => sanitizeString(email.toLowerCase()));

/**
 * URL Validator
 */
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .max(2048, 'URL too long')
  .transform(sanitizeString);

/**
 * Session ID Validator (for Stripe)
 */
export const stripeSessionIdSchema = z
  .string()
  .regex(/^cs_[A-Za-z0-9]+$/, 'Invalid Stripe session ID')
  .transform(sanitizeString);

/**
 * Generic ID Validator (alphanumeric + hyphens/underscores)
 */
export const idSchema = z
  .string()
  .min(1, 'ID cannot be empty')
  .max(255, 'ID too long')
  .regex(/^[A-Za-z0-9_-]+$/, 'ID contains invalid characters')
  .transform(sanitizeString);

/**
 * Environment Name Validator
 */
export const environmentSchema = z
  .enum(['development', 'staging', 'production'])
  .default('production');

/**
 * Session Data Validator
 */
export const sessionDataSchema = z.object({
  appName: appNameSchema.optional(),
  vercelToken: vercelTokenSchema.optional(),
  githubToken: githubTokenSchema.optional(),
  clerkPublishableKey: clerkPublishableKeySchema.optional(),
  clerkSecretKey: clerkSecretKeySchema.optional(),
  neonDatabaseUrl: neonDatabaseUrlSchema.optional(),
  anthropicKey: anthropicKeySchema.optional(),
  openaiKey: openaiKeySchema.optional(),
  googleAIKey: googleAIKeySchema.optional(),
});

/**
 * OAuth Callback Parameters Validator
 */
export const oauthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code required').transform(sanitizeString),
  state: z.string().min(1, 'State parameter required').transform(sanitizeString),
  error: z.string().optional().transform((val) => (val ? sanitizeString(val) : undefined)),
  error_description: z
    .string()
    .optional()
    .transform((val) => (val ? sanitizeString(val) : undefined)),
});

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Safe parse with error formatting
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format Zod errors into user-friendly message
  const errorMessage = result.error.issues
    .map((err) => `${err.path.join('.')}: ${err.message}`)
    .join(', ');

  return { success: false, error: errorMessage };
}

/**
 * Validate and throw on error
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, input: unknown): T {
  return schema.parse(input);
}

/**
 * Validate multiple fields at once
 */
export function validateFields(
  fields: Record<string, { schema: z.ZodSchema; value: unknown }>
): { success: true; data: Record<string, any> } | { success: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const data: Record<string, any> = {};

  for (const [key, { schema, value }] of Object.entries(fields)) {
    const result = validateInput(schema, value);
    if (!result.success) {
      errors[key] = result.error;
    } else {
      data[key] = result.data;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data };
}

/**
 * Rate limit key generator
 * Creates consistent keys for rate limiting based on IP and endpoint
 */
export function generateRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`;
}
