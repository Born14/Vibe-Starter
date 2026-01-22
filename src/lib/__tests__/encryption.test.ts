import { describe, it, expect, beforeEach } from 'vitest';
import { encrypt, decrypt } from '../encryption';

describe('Encryption', () => {
  const testData = [
    'simple-text',
    'token-with-special-chars!@#$%',
    'very-long-token-'.repeat(10),
    'unicode-🚀-emoji-test',
  ];

  beforeEach(() => {
    // Ensure encryption key is set
    if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length < 32) {
      process.env.ENCRYPTION_KEY = 'test-encryption-key-must-be-32-characters-long';
    }
  });

  describe('encrypt', () => {
    it('should encrypt text successfully', () => {
      const text = 'test-secret-token';
      const encrypted = encrypt(text);

      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(text);
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should produce different ciphertext for same input (due to random IV)', () => {
      const text = 'test-secret';
      const encrypted1 = encrypt(text);
      const encrypted2 = encrypt(text);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle various text inputs', () => {
      testData.forEach((text) => {
        const encrypted = encrypt(text);
        expect(encrypted).toBeDefined();
        expect(encrypted).not.toBe(text);
      });
    });
  });

  describe('decrypt', () => {
    it('should decrypt text successfully', () => {
      const original = 'test-secret-token';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(original);
    });

    it('should handle various text inputs', () => {
      testData.forEach((original) => {
        const encrypted = encrypt(original);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(original);
      });
    });

    it('should throw error on invalid encrypted text format', () => {
      expect(() => decrypt('invalid-format')).toThrow();
      expect(() => decrypt('abc:def')).toThrow();
      expect(() => decrypt('')).toThrow();
    });

    it('should throw error on tampered ciphertext', () => {
      const original = 'test-secret';
      const encrypted = encrypt(original);

      // Tamper with the encrypted text
      const parts = encrypted.split(':');
      const tampered = `${parts[0]}:${parts[1]}:modified`;

      expect(() => decrypt(tampered)).toThrow();
    });
  });

  describe('encrypt/decrypt round-trip', () => {
    it('should successfully round-trip various data types', () => {
      const testCases = [
        'github-token-abc123',
        'postgresql://user:pass@host:5432/db',
        'sk-ant-api03-test-key-very-long-string',
        'pk_test_clerk_key_123456789',
      ];

      testCases.forEach((original) => {
        const encrypted = encrypt(original);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(original);
      });
    });

    it('should preserve exact text content', () => {
      const original = 'Token with spaces, commas, and special!@#$%^&*()';
      const encrypted = encrypt(original);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(original);
      expect(decrypted.length).toBe(original.length);
    });
  });
});
