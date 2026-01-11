import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { licenseKeys } from "../src/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function createKey() {
  // Format: VS-XXXX-XXXX-XXXX (hex only: 0-9, A-F)
  const seg1 = Math.random().toString(16).substring(2, 6).toUpperCase();
  const seg2 = Math.random().toString(16).substring(2, 6).toUpperCase();
  const seg3 = Math.random().toString(16).substring(2, 6).toUpperCase();
  const key = `VS-${seg1}-${seg2}-${seg3}`;

  const [result] = await db.insert(licenseKeys).values({
    key: key,
    email: 'test@vibe.com',
    used: false,
  }).returning();

  console.log('Created license key:', result.key);
  process.exit(0);
}

createKey();
