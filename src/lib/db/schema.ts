import { pgTable, uuid, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";

// License keys from Gumroad purchases
export const licenseKeys = pgTable("license_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").unique().notNull(),
  email: text("email").notNull(),
  used: boolean("used").default(false).notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Deployment tracking for support and analytics
export const deployments = pgTable("deployments", {
  id: uuid("id").defaultRandom().primaryKey(),
  licenseKeyId: uuid("license_key_id")
    .references(() => licenseKeys.id)
    .notNull(),
  appName: text("app_name").notNull(),
  githubRepo: text("github_repo"),
  vercelProject: text("vercel_project"),
  status: text("status").default("pending").notNull(), // pending, deploying, success, failed
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Temporary wizard sessions (encrypted tokens, deleted after deploy)
export const wizardSessions = pgTable("wizard_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  licenseKeyId: uuid("license_key_id")
    .references(() => licenseKeys.id)
    .notNull(),
  // All tokens are encrypted at rest
  githubToken: text("github_token"),
  vercelToken: text("vercel_token"),
  clerkPublishable: text("clerk_publishable"),
  clerkSecret: text("clerk_secret"),
  databaseUrl: text("database_url"),
  aiProvider: text("ai_provider"), // claude, gemini, openai
  aiKey: text("ai_key"),
  appName: text("app_name"),
  // Track which optional components were skipped
  skippedClerk: boolean("skipped_clerk").default(false).notNull(),
  skippedNeon: boolean("skipped_neon").default(false).notNull(),
  skippedAi: boolean("skipped_ai").default(false).notNull(),
  currentStep: integer("current_step").default(1).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types for TypeScript
export type LicenseKey = typeof licenseKeys.$inferSelect;
export type NewLicenseKey = typeof licenseKeys.$inferInsert;
export type Deployment = typeof deployments.$inferSelect;
export type NewDeployment = typeof deployments.$inferInsert;
export type WizardSession = typeof wizardSessions.$inferSelect;
export type NewWizardSession = typeof wizardSessions.$inferInsert;
