import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  emailOTP,
  lastLoginMethod,
  organization,
} from "better-auth/plugins";
import { ac, roles } from "./auth/auth-permissions";
import { env } from "./env";
import { prisma } from "./prisma";
import { getServerUrl } from "./server-url";

type SocialProvidersType = Parameters<typeof betterAuth>[0]["socialProviders"];

export const SocialProviders: SocialProvidersType = {};

// Conditionally add Google OAuth if credentials are present
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  SocialProviders.google = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: getServerUrl(),
  session: {
    expiresIn: 60 * 60 * 24 * 20, // 20 days
    updateAge: 60 * 60 * 24 * 7, // Refresh session every 7 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes - cache session in signed cookie
    },
  },
  rateLimit: {
    // Disable rate limiting in CI
    enabled: env.CI ? false : undefined,
  },
  trustedOrigins: ["*"],
  advanced: {
    cookiePrefix: "moodjournal",
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      // TODO: Implement email sending with Resend
      console.log(`[Auth] Password reset link for ${user.email}: ${url}`);
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        // TODO: Implement email sending with Resend
        console.log(`[Auth] Email change verification for ${newEmail}: ${url}`);
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, token }) => {
        const url = `${getServerUrl()}/auth/confirm-delete?token=${token}&callbackUrl=/auth/goodbye`;
        // TODO: Implement email sending with Resend
        console.log(`[Auth] Account deletion confirmation for ${user.email}: ${url}`);
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Implement email sending with Resend
      console.log(`[Auth] Email verification for ${user.email}: ${url}`);
    },
  },
  socialProviders: SocialProviders,
  plugins: [
    organization({
      ac: ac,
      roles: roles,
      organizationLimit: 5,
      membershipLimit: 10,
      async sendInvitationEmail({ id, email }) {
        const inviteLink = `${getServerUrl()}/join/${id}`;
        // TODO: Implement email sending with Resend
        console.log(`[Auth] Invitation for ${email}: ${inviteLink}`);
      },
    }),
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        // TODO: Implement email sending with Resend
        console.log(`[Auth] OTP for ${email}: ${otp}`);
      },
    }),
    admin({}),
    lastLoginMethod({}),
    // Warning: always last plugin
    nextCookies(),
  ],
});
