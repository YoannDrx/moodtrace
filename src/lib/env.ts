import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().optional().default("noreply@example.com"),
    STRIPE_SECRET_KEY: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    REDIS_URL: z.string().optional(),
    BETTER_AUTH_SECRET: z.string().optional(),
    CI: z.coerce.boolean().optional(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_EMAIL_CONTACT: z
      .string()
      .optional()
      .default("contact@example.com"),
    NEXT_PUBLIC_APP_URL: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_EMAIL_CONTACT: process.env.NEXT_PUBLIC_EMAIL_CONTACT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
