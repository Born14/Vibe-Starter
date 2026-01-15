import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiters for different endpoints
export const rateLimiters = {
  // License validation: 5 attempts per 10 minutes per IP
  validateLicense: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    analytics: true,
    prefix: "@ratelimit/validate-license",
  }),

  // Deploy endpoint: 3 deploys per hour per IP
  deploy: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "@ratelimit/deploy",
  }),

  // Session API: 30 requests per minute per IP
  session: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    analytics: true,
    prefix: "@ratelimit/session",
  }),
};

// Helper function to get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  // Fallback (shouldn't happen in production)
  return "unknown";
}

// Distributed lock helper for preventing race conditions
export async function acquireLock(
  key: string,
  ttlMs: number = 5000
): Promise<boolean> {
  const lockKey = `lock:${key}`;
  const result = await redis.set(lockKey, "locked", {
    nx: true, // Only set if not exists
    px: ttlMs, // TTL in milliseconds
  });
  return result === "OK";
}

export async function releaseLock(key: string): Promise<void> {
  const lockKey = `lock:${key}`;
  await redis.del(lockKey);
}
