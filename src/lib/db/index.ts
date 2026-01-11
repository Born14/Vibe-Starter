import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Create a safe database connection that won't fail during build
// If DATABASE_URL is missing, we create a dummy connection that will throw at runtime
const databaseUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@dummy/dummy";
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
