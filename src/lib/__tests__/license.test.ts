import { describe, it, expect } from 'vitest';
import { generateLicenseKey, isValidLicenseKeyFormat } from '../license';

describe('License', () => {
  describe('generateLicenseKey', () => {
    it('should generate a license key with correct format', () => {
      const key = generateLicenseKey();

      expect(key).toMatch(/^VS-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    });

    it('should start with VS- prefix', () => {
      const key = generateLicenseKey();

      expect(key.startsWith('VS-')).toBe(true);
    });

    it('should have exactly 3 segments after prefix', () => {
      const key = generateLicenseKey();
      const parts = key.split('-');

      expect(parts.length).toBe(4); // VS + 3 segments
      expect(parts[0]).toBe('VS');
      expect(parts[1].length).toBe(4);
      expect(parts[2].length).toBe(4);
      expect(parts[3].length).toBe(4);
    });

    it('should generate unique keys', () => {
      const keys = new Set();
      const count = 100;

      for (let i = 0; i < count; i++) {
        keys.add(generateLicenseKey());
      }

      // All keys should be unique
      expect(keys.size).toBe(count);
    });

    it('should only use uppercase alphanumeric characters', () => {
      const key = generateLicenseKey();
      const withoutPrefix = key.substring(3); // Remove 'VS-'
      const withoutDashes = withoutPrefix.replace(/-/g, '');

      expect(withoutDashes).toMatch(/^[A-Z0-9]+$/);
    });
  });

  describe('isValidLicenseKeyFormat', () => {
    it('should validate correct format', () => {
      expect(isValidLicenseKeyFormat('VS-ABCD-1234-EFGH')).toBe(true);
      expect(isValidLicenseKeyFormat('VS-0000-0000-0000')).toBe(true);
      expect(isValidLicenseKeyFormat('VS-ZZZZ-9999-AAAA')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(isValidLicenseKeyFormat('')).toBe(false);
      expect(isValidLicenseKeyFormat('INVALID')).toBe(false);
      expect(isValidLicenseKeyFormat('VS-ABC-1234-EFGH')).toBe(false); // Too short segment
      expect(isValidLicenseKeyFormat('VS-ABCDE-1234-EFGH')).toBe(false); // Too long segment
      expect(isValidLicenseKeyFormat('XS-ABCD-1234-EFGH')).toBe(false); // Wrong prefix
      expect(isValidLicenseKeyFormat('VS-ABCD-1234')).toBe(false); // Missing segment
      expect(isValidLicenseKeyFormat('VS-ABCD-1234-EFGH-IJKL')).toBe(false); // Extra segment
    });

    it('should reject lowercase characters', () => {
      expect(isValidLicenseKeyFormat('vs-abcd-1234-efgh')).toBe(false);
      expect(isValidLicenseKeyFormat('VS-abcd-1234-EFGH')).toBe(false);
    });

    it('should reject special characters', () => {
      expect(isValidLicenseKeyFormat('VS-ABC!-1234-EFGH')).toBe(false);
      expect(isValidLicenseKeyFormat('VS-ABCD-12@4-EFGH')).toBe(false);
      expect(isValidLicenseKeyFormat('VS-ABCD-1234-EF#H')).toBe(false);
    });

    it('should reject whitespace', () => {
      expect(isValidLicenseKeyFormat('VS-ABCD -1234-EFGH')).toBe(false);
      expect(isValidLicenseKeyFormat(' VS-ABCD-1234-EFGH')).toBe(false);
      expect(isValidLicenseKeyFormat('VS-ABCD-1234-EFGH ')).toBe(false);
    });

    it('should validate generated keys', () => {
      for (let i = 0; i < 10; i++) {
        const key = generateLicenseKey();
        expect(isValidLicenseKeyFormat(key)).toBe(true);
      }
    });
  });
});
