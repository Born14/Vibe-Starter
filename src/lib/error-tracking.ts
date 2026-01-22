/**
 * Error Tracking Utility
 * Centralized error logging and monitoring using Sentry
 */

import * as Sentry from '@sentry/nextjs';

// Initialize Sentry (only in production or if DSN is configured)
export function initErrorTracking() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn('Sentry DSN not configured. Error tracking is disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,

    // Set sample rate (1.0 = 100% of errors)
    tracesSampleRate: 1.0,

    // Capture 100% of errors in production
    sampleRate: 1.0,

    // Don't send errors in development
    enabled: process.env.NODE_ENV === 'production',

    // Filter out known noisy errors
    beforeSend(event, hint) {
      // Filter out network errors from user's internet issues
      if (hint?.originalException instanceof TypeError) {
        const message = hint.originalException.message;
        if (message.includes('fetch') || message.includes('network')) {
          return null; // Don't send to Sentry
        }
      }
      return event;
    },
  });
}

/**
 * Log an error to Sentry with additional context
 */
export function captureError(
  error: Error | unknown,
  context?: {
    user?: { id: string; email?: string };
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    level?: 'fatal' | 'error' | 'warning' | 'info';
  }
) {
  // Always log to console for debugging
  console.error('Error captured:', error);

  // Add context if provided
  if (context?.user) {
    Sentry.setUser(context.user);
  }

  if (context?.tags) {
    Sentry.setTags(context.tags);
  }

  if (context?.extra) {
    Sentry.setContext('additional_info', context.extra);
  }

  // Capture the error
  if (error instanceof Error) {
    Sentry.captureException(error, {
      level: context?.level || 'error',
    });
  } else {
    // Handle non-Error objects
    Sentry.captureMessage(String(error), {
      level: context?.level || 'error',
    });
  }
}

/**
 * Track API errors with additional metadata
 */
export function captureAPIError(
  error: Error | unknown,
  metadata: {
    endpoint: string;
    method: string;
    statusCode?: number;
    requestBody?: any;
    userId?: string;
  }
) {
  captureError(error, {
    tags: {
      type: 'api_error',
      endpoint: metadata.endpoint,
      method: metadata.method,
      status: metadata.statusCode?.toString() || 'unknown',
    },
    extra: {
      endpoint: metadata.endpoint,
      method: metadata.method,
      statusCode: metadata.statusCode,
      requestBody: metadata.requestBody,
    },
    user: metadata.userId ? { id: metadata.userId } : undefined,
  });
}

/**
 * Track deployment errors specifically
 */
export function captureDeploymentError(
  error: Error | unknown,
  metadata: {
    step: string;
    appName?: string;
    userId?: string;
    provider?: 'github' | 'vercel' | 'neon';
  }
) {
  captureError(error, {
    tags: {
      type: 'deployment_error',
      step: metadata.step,
      provider: metadata.provider || 'unknown',
    },
    extra: {
      deploymentStep: metadata.step,
      appName: metadata.appName,
      provider: metadata.provider,
    },
    user: metadata.userId ? { id: metadata.userId } : undefined,
    level: 'error',
  });
}

/**
 * Track authentication/authorization errors
 */
export function captureAuthError(
  error: Error | unknown,
  metadata: {
    action: string;
    userId?: string;
    reason?: string;
  }
) {
  captureError(error, {
    tags: {
      type: 'auth_error',
      action: metadata.action,
    },
    extra: {
      action: metadata.action,
      reason: metadata.reason,
    },
    user: metadata.userId ? { id: metadata.userId } : undefined,
    level: 'warning',
  });
}

/**
 * Wrap async functions with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: { name: string; tags?: Record<string, string> }
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error, {
        tags: {
          function: context?.name || fn.name,
          ...context?.tags,
        },
      });
      throw error; // Re-throw after capturing
    }
  }) as T;
}

/**
 * Flush all pending events (useful for serverless)
 */
export async function flushErrorTracking(timeout = 2000): Promise<boolean> {
  return Sentry.flush(timeout);
}
