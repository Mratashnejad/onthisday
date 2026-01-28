import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run Prisma");
}

export default defineConfig({
  schema: "./schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
