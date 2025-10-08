import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!, // ✅ Fixed variable name
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!, // ✅ Fixed typo
      clientSecret: process.env.DISCORD_CLIENT_SECRET!, // ✅ Fixed variable name
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  plugins: [nextCookies()],

  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});

// Aur pta hai hum isme drizzle orm use kr rehe with postgress iske sabse badi baat yehi hai isme jo schema hota hai n wo automatically create ho jata hai

// Better Auth includes a CLI tool to help manage the schema required by the library
