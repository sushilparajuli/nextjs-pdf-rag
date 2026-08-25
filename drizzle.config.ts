import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: ".env.local",
});

const databaseUrl =
  process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "./src/lib/db-schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
