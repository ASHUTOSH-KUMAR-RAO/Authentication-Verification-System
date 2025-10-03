import { betterAuth } from "better-auth";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  emailAndPassword: {
    // ye line hamne isiliye likha hai n jisese hum alow kr diye hai hum apne auth ke andar email and password credential ka set-up bhi kr sekte hai
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true, // aur hamne yeha manully cookies ko enbled kiya hai ye bhi seekh gya ye bhi mujhe nhi ata tha ,and i personally fell ki better auth se authentication itna easy hai ki mai explain nhi kaar sakta hu 👀✅⭐
      maxAge: 60 * 5, // Iska mtlb hua user apne cookies ko only 5 minutes taak hi dekh sakta hai jieses wo confirm kr sakte hai ki wo successfully login to ho gya hai n
    },
  },

  plugins:[nextCookies()], // basically ye confirm krta hai ki kya mera next js ka jo app hai wo cookies ko set kr raha hai ya nhi ,(aur haan ye saab kaam hi server side per hi ho raha hai mtlb ki jaab maine uper baat kiya tha n signup /sign in to ye mai apne server side per login /signout ki baat kr raha tha abhi client side per kuch nhi kaar raha hai )
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
});

// Aur pta hai hum isme drizzle orm use kr rehe with postgress iske sabse badi baat yehi hai isme jo schema hota hai n wo automatically create ho jata hai

// Better Auth includes a CLI tool to help manage the schema required by the library
