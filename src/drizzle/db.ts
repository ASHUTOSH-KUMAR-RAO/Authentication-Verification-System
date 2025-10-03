
import * as schema from "./schema"
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!,{schema});

// db.query.user.findFirst() ,Pta hai aise kaar kr hum manually bhi access kr sekte hai apne schema ke andar models ko 
