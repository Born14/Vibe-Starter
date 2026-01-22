import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          // Content Security Policy - Prevents XSS attacks
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow scripts from self, Clerk, and inline scripts (needed for Next.js)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.*.accounts.dev https://*.clerk.accounts.dev https://js.stripe.com https://cdn.vercel-insights.com",
              // Allow styles from self, inline styles, and Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Allow images from self, data URIs, and common CDNs
              "img-src 'self' data: https: blob:",
              // Allow fonts from self and Google Fonts
              "font-src 'self' https://fonts.gstatic.com data:",
              // Allow connections to APIs
              "connect-src 'self' https://*.clerk.accounts.dev https://api.stripe.com https://api.github.com https://api.vercel.com https://*.neon.tech https://clerk.*.accounts.dev wss://*.clerk.accounts.dev https://vitals.vercel-insights.com",
              // Allow frames from Stripe
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              // Disallow object/embed
              "object-src 'none'",
              // Require all resources to be loaded over HTTPS in production
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Strict Transport Security - Forces HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer Policy - Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy - Control browser features
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=(self)',
            ].join(', '),
          },
          // XSS Protection (legacy, but still useful for older browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
