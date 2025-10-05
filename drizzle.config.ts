 // Pta hai hamne yeha per drizzle kit k config kiya hai basically yehi mere saab kaam backend mein krta hai means jo mera db ka backend ka kaam hota hai jaise migrations and all jo bhi ho ye wahi saab krta hai

import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./src/drizzle/schemas/auth-schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
