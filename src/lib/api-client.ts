/**
 * API Client with CSRF Protection
 *
 * Automatically includes CSRF token in requests
 */

const CSRF_TOKEN_KEY = "csrf-token";

/**
 * Store CSRF token in memory (received from license validation)
 */
export function storeCsrfToken(token: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }
}

/**
 * Get CSRF token from session storage
 */
export function getCsrfToken(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(CSRF_TOKEN_KEY);
  }
  return null;
}

/**
 * Clear CSRF token
 */
export function clearCsrfToken(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
  }
}

/**
 * Fetch wrapper that automatically includes CSRF token
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = getCsrfToken();

  const headers = new Headers(options.headers);

  // Add CSRF token for state-changing methods
  if (csrfToken && options.method && !["GET", "HEAD", "OPTIONS"].includes(options.method)) {
    headers.set("x-csrf-token", csrfToken);
  }

  // Ensure Content-Type is set for JSON requests
  if (options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * POST helper with CSRF protection
 */
export async function apiPost(url: string, data: unknown): Promise<Response> {
  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PUT helper with CSRF protection
 */
export async function apiPut(url: string, data: unknown): Promise<Response> {
  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * DELETE helper with CSRF protection
 */
export async function apiDelete(url: string): Promise<Response> {
  return apiFetch(url, {
    method: "DELETE",
  });
}
