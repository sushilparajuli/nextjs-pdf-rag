import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({
  path: ".env.local",
});

const connectionString =
  process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL ?? null;

export const hasDatabaseConfig = Boolean(connectionString);

export const db = connectionString ? drizzle(neon(connectionString)) : null;
