import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

/**
 * CSRF Protection Utility
 *
 * Uses a double-submit cookie pattern:
 * 1. Generate CSRF token and store in httpOnly cookie
 * 2. Client reads token from cookie and sends in X-CSRF-Token header
 * 3. Server validates header matches cookie
 */

const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

/**
 * Validate CSRF token from request
 * Checks that the token in the header matches the token in the cookie
 */
export function validateCsrfToken(request: NextRequest): boolean {
  // Skip CSRF check for GET, HEAD, OPTIONS (safe methods)
  const method = request.method;
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return true;
  }

  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  // Get token from header
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  // Both must exist and match
  if (!cookieToken || !headerToken) {
    console.warn("CSRF validation failed: missing token", {
      hasCookie: !!cookieToken,
      hasHeader: !!headerToken,
      method,
      url: request.url,
    });
    return false;
  }

  if (cookieToken !== headerToken) {
    console.warn("CSRF validation failed: token mismatch", {
      method,
      url: request.url,
    });
    return false;
  }

  return true;
}

/**
 * Validate origin header matches the request host
 * Prevents CSRF attacks from different origins
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  // For same-origin requests, origin/referer should match host
  if (origin) {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      console.warn("CSRF validation failed: origin mismatch", {
        origin: originHost,
        host,
        url: request.url,
      });
      return false;
    }
  } else if (referer) {
    const refererHost = new URL(referer).host;
    if (refererHost !== host) {
      console.warn("CSRF validation failed: referer mismatch", {
        referer: refererHost,
        host,
        url: request.url,
      });
      return false;
    }
  } else {
    // No origin or referer header - this is suspicious for state-changing requests
    const method = request.method;
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      console.warn("CSRF validation failed: no origin or referer header", {
        method,
        url: request.url,
      });
      return false;
    }
  }

  return true;
}

/**
 * Create a response with CSRF token cookie set
 */
export function setCsrfCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
  return response;
}

/**
 * Middleware wrapper to validate CSRF for API routes
 */
export function withCsrfProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Validate origin for all requests
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: "Invalid origin" },
        { status: 403 }
      );
    }

    // Validate CSRF token for state-changing methods
    if (!validateCsrfToken(request)) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Proceed with the handler
    return handler(request);
  };
}

/**
 * Get CSRF token from request cookie
 */
export function getCsrfToken(request: NextRequest): string | undefined {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value;
}
