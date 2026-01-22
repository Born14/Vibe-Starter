/**
 * Next.js Instrumentation
 * This file is executed when the Next.js server starts
 * Used to initialize error tracking and other monitoring services
 */

export async function register() {
  // Only run instrumentation in Node.js runtime (server-side)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initErrorTracking } = await import('./src/lib/error-tracking');
    initErrorTracking();
  }

  // For Edge runtime (if needed in the future)
  if (process.env.NEXT_RUNTIME === 'edge') {
    const { initErrorTracking } = await import('./src/lib/error-tracking');
    initErrorTracking();
  }
}
