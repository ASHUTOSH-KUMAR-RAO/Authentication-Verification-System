import { defineConfig } from "drizzle-kit"; // Pta hai hamne yeha per drizzle kit k config kiya hai basically yehi mere saab kaam backend mein krta hai means jo mera db ka backend ka kaam hota hai jaise migrations and all jo bhi ho ye wahi saab krta hai 

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
