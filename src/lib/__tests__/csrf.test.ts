import { describe, it, expect, vi } from 'vitest';
import { generateCsrfToken, validateCsrfToken, validateOrigin } from '../csrf';
import { NextRequest } from 'next/server';

describe('CSRF Protection', () => {
  describe('generateCsrfToken', () => {
    it('should generate a token', () => {
      const token = generateCsrfToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 10; i++) {
        tokens.add(generateCsrfToken());
      }

      expect(tokens.size).toBe(10);
    });

    it('should generate hex string', () => {
      const token = generateCsrfToken();

      expect(token).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('validateCsrfToken', () => {
    it('should allow GET requests without token', () => {
      const request = new NextRequest('http://localhost/api/test', {
        method: 'GET',
      });

      expect(validateCsrfToken(request)).toBe(true);
    });

    it('should allow HEAD requests without token', () => {
      const request = new NextRequest('http://localhost/api/test', {
        method: 'HEAD',
      });

      expect(validateCsrfToken(request)).toBe(true);
    });

    it('should allow OPTIONS requests without token', () => {
      const request = new NextRequest('http://localhost/api/test', {
        method: 'OPTIONS',
      });

      expect(validateCsrfToken(request)).toBe(true);
    });

    it('should reject POST without token', () => {
      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
      });

      expect(validateCsrfToken(request)).toBe(false);
    });

    it('should reject POST with only cookie token', () => {
      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        headers: {
          cookie: 'csrf-token=test-token-123',
        },
      });

      expect(validateCsrfToken(request)).toBe(false);
    });

    it('should reject POST with only header token', () => {
      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        headers: {
          'x-csrf-token': 'test-token-123',
        },
      });

      // Note: Without cookie, this will fail
      expect(validateCsrfToken(request)).toBe(false);
    });

    it('should accept POST with matching cookie and header tokens', () => {
      const token = 'test-token-123';
      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        headers: {
          cookie: `csrf-token=${token}`,
          'x-csrf-token': token,
        },
      });

      expect(validateCsrfToken(request)).toBe(true);
    });

    it('should reject POST with mismatched tokens', () => {
      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        headers: {
          cookie: 'csrf-token=token-1',
          'x-csrf-token': 'token-2',
        },
      });

      expect(validateCsrfToken(request)).toBe(false);
    });
  });

  describe('validateOrigin', () => {
    it('should accept same-origin requests', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          origin: 'http://localhost:3000',
          host: 'localhost:3000',
        },
      });

      expect(validateOrigin(request)).toBe(true);
    });

    it('should accept requests with matching referer', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          referer: 'http://localhost:3000/page',
          host: 'localhost:3000',
        },
      });

      expect(validateOrigin(request)).toBe(true);
    });

    it('should reject cross-origin requests', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          origin: 'http://evil.com',
          host: 'localhost:3000',
        },
      });

      expect(validateOrigin(request)).toBe(false);
    });

    it('should reject requests with mismatched referer', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          referer: 'http://evil.com/page',
          host: 'localhost:3000',
        },
      });

      expect(validateOrigin(request)).toBe(false);
    });

    it('should reject POST without origin or referer', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          host: 'localhost:3000',
        },
      });

      expect(validateOrigin(request)).toBe(false);
    });

    it('should allow GET without origin or referer', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
        headers: {
          host: 'localhost:3000',
        },
      });

      expect(validateOrigin(request)).toBe(true);
    });
  });
});
