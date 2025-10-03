
import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);


// Pta hai ye wahi File hai jiske help hum sign and sign-out funtion ko easly implement kr sekte hai 
