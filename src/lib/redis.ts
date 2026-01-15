import Redis from "ioredis";

// Initialize Redis client for Redis Cloud
let redis: Redis | null = null;

function getRedisClient(): Redis {
  if (!redis) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL environment variable is not set");
    }
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });
  }
  return redis;
}

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

// Rate limiting using sliding window algorithm
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; reset: number }> {
  const client = getRedisClient();
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  try {
    // Connect if not already connected
    if (client.status !== "ready") {
      await client.connect();
    }

    // Remove old entries outside the window
    await client.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const count = await client.zcard(key);

    if (count >= limit) {
      // Get the oldest request timestamp to calculate reset time
      const oldest = await client.zrange(key, 0, 0, "WITHSCORES");
      const resetTime = oldest.length > 1 ? parseInt(oldest[1]) + windowMs : now + windowMs;

      return {
        success: false,
        reset: resetTime,
      };
    }

    // Add current request
    await client.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiry on the key
    await client.expire(key, windowSeconds * 2);

    return {
      success: true,
      reset: now + windowMs,
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Fail open - allow request if Redis is down
    return {
      success: true,
      reset: now + windowMs,
    };
  }
}

// Rate limiters for different endpoints
export const rateLimiters = {
  // License validation: 5 attempts per 10 minutes per IP
  validateLicense: {
    limit: async (ip: string) => checkRateLimit(`validate-license:${ip}`, 5, 600),
  },

  // Deploy endpoint: 3 deploys per hour per IP
  deploy: {
    limit: async (ip: string) => checkRateLimit(`deploy:${ip}`, 3, 3600),
  },

  // Session API: 30 requests per minute per IP
  session: {
    limit: async (ip: string) => checkRateLimit(`session:${ip}`, 30, 60),
  },
};

// Distributed lock helper for preventing race conditions
export async function acquireLock(
  key: string,
  ttlMs: number = 5000
): Promise<boolean> {
  const client = getRedisClient();
  const lockKey = `lock:${key}`;

  try {
    // Connect if not already connected
    if (client.status !== "ready") {
      await client.connect();
    }

    // Use SET with NX (only set if not exists) and PX (TTL in milliseconds)
    const result = await client.set(lockKey, "locked", "PX", ttlMs, "NX");
    return result === "OK";
  } catch (error) {
    console.error("Acquire lock error:", error);
    // Fail safe - don't block if Redis is down
    return true;
  }
}

export async function releaseLock(key: string): Promise<void> {
  const client = getRedisClient();
  const lockKey = `lock:${key}`;

  try {
    if (client.status === "ready") {
      await client.del(lockKey);
    }
  } catch (error) {
    console.error("Release lock error:", error);
    // Ignore errors on release
  }
}
