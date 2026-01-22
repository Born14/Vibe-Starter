/**
 * Rate Limiting Middleware
 * Protects APIs from abuse using Redis-based rate limiting
 */

import Redis from 'ioredis';
import { NextRequest, NextResponse } from 'next/server';

// Redis client singleton
let redis: Redis | null = null;

/**
 * Get or create Redis client
 */
function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL not configured. Rate limiting is disabled.');
    return null;
  }

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  return redis;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;

  /**
   * Unique identifier for this rate limiter
   */
  identifier: string;
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp when the limit resets
  limit: number;
}

/**
 * Check rate limit using Redis
 */
export async function checkRateLimit(
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient();

  // If Redis is not available, allow the request (fail open)
  if (!redis) {
    return {
      success: true,
      remaining: config.maxRequests,
      reset: Date.now() + config.windowSeconds * 1000,
      limit: config.maxRequests,
    };
  }

  const key = `ratelimit:${config.identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowSeconds * 1000;

  try {
    // Use Redis sorted set to track requests
    // Remove old entries outside the time window
    await redis.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const requestCount = await redis.zcard(key);

    if (requestCount >= config.maxRequests) {
      // Rate limit exceeded
      const oldestRequest = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const resetTime = oldestRequest[1]
        ? parseInt(oldestRequest[1]) + config.windowSeconds * 1000
        : now + config.windowSeconds * 1000;

      return {
        success: false,
        remaining: 0,
        reset: resetTime,
        limit: config.maxRequests,
      };
    }

    // Add current request to the sorted set
    await redis.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiry on the key to clean up old data
    await redis.expire(key, config.windowSeconds * 2);

    return {
      success: true,
      remaining: config.maxRequests - requestCount - 1,
      reset: now + config.windowSeconds * 1000,
      limit: config.maxRequests,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow the request if Redis fails
    return {
      success: true,
      remaining: config.maxRequests,
      reset: now + config.windowSeconds * 1000,
      limit: config.maxRequests,
    };
  }
}

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (Vercel provides x-forwarded-for)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a default if no IP is available
  return 'unknown';
}

/**
 * Rate limit middleware for API routes
 */
export async function withRateLimit(
  request: NextRequest,
  config: Omit<RateLimitConfig, 'identifier'>,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const clientId = getClientIdentifier(request);
  const endpoint = new URL(request.url).pathname;

  const result = await checkRateLimit({
    ...config,
    identifier: `${endpoint}:${clientId}`,
  });

  // Add rate limit headers to response
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', result.reset.toString());

  if (!result.success) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    headers.set('Retry-After', retryAfter.toString());

    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter,
      },
      { status: 429, headers }
    );
  }

  // Execute the handler and add rate limit headers
  const response = await handler();

  // Add rate limit headers to successful response
  for (const [key, value] of headers.entries()) {
    response.headers.set(key, value);
  }

  return response;
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const RateLimits = {
  /**
   * Strict rate limit for authentication endpoints
   * 5 requests per 15 minutes
   */
  auth: {
    maxRequests: 5,
    windowSeconds: 15 * 60,
  },

  /**
   * Moderate rate limit for API validation endpoints
   * 10 requests per 1 minute
   */
  validation: {
    maxRequests: 10,
    windowSeconds: 60,
  },

  /**
   * Strict rate limit for deployment endpoints
   * 3 requests per 10 minutes
   */
  deployment: {
    maxRequests: 3,
    windowSeconds: 10 * 60,
  },

  /**
   * Generous rate limit for general API endpoints
   * 100 requests per 1 minute
   */
  general: {
    maxRequests: 100,
    windowSeconds: 60,
  },

  /**
   * Very strict rate limit for sensitive operations
   * 3 requests per 1 hour
   */
  sensitive: {
    maxRequests: 3,
    windowSeconds: 60 * 60,
  },
};

/**
 * Close Redis connection (useful for cleanup)
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
