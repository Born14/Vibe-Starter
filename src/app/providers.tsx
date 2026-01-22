'use client';

import { useEffect } from 'react';
import { initErrorTracking } from '@/lib/error-tracking';

/**
 * Client-side providers and initialization
 */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize error tracking on client
    initErrorTracking();
  }, []);

  return <>{children}</>;
}
