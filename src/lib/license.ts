import { randomBytes } from "crypto";

// Generate a license key in format: VS-XXXX-XXXX-XXXX
export function generateLicenseKey(): string {
  const segments = [];
  for (let i = 0; i < 3; i++) {
    const segment = randomBytes(2).toString("hex").toUpperCase();
    segments.push(segment);
  }
  return `VS-${segments.join("-")}`;
}

// Validate license key format
export function isValidLicenseKeyFormat(key: string): boolean {
  const pattern = /^VS-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/;
  return pattern.test(key);
}
