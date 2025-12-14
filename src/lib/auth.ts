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

import { sendEmail } from "@/lib/mail/send-email";
import { SiteConfig } from "@/site-config";
import MarkdownEmail from "@email/markdown.email";
import { setupResendCustomer } from "./auth/auth-config-setup";
import { env } from "./env";
import { generateSlug } from "./format/id";
import { logger } from "./logger";
import { prisma } from "./prisma";
import { getServerUrl } from "./server-url";
import { getStripeOrThrow } from "./stripe";
type SocialProvidersType = Parameters<typeof betterAuth>[0]["socialProviders"];

export const SocialProviders: SocialProvidersType = {};

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  SocialProviders.github = {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  };
}

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
  databaseHooks: {
    user: {
      create: {
        after: async (user, _req) => {
          await setupResendCustomer(user);

          const emailName = user.email.slice(0, 8);
          try {
            await auth.api.createOrganization({
              body: {
                name: `${emailName}'s org`, // required
                slug: generateSlug(emailName), // required
                logo: `${getServerUrl()}/images/org-logo.png`,
                userId: user.id,
                keepCurrentActiveOrganization: false,
              },
            });
          } catch (err) {
            logger.error("Failed to create org", { err });
          }
        },
      },
    },
  },
  advanced: {
    cookiePrefix: SiteConfig.appId,
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: MarkdownEmail({
          preview: `Reset your password for ${SiteConfig.title}`,
          markdown: `
          Hello,

          You requested to reset your password.

          [Click here to reset your password](${url})
          `,
        }),
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await sendEmail({
          to: newEmail,
          subject: "Change email address",
          html: MarkdownEmail({
            preview: `Change your email address for ${SiteConfig.title}`,
            markdown: `
            Hello,

            You requested to change your email address.

            [Click here to verify your new email address](${url})
            `,
          }),
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, token }) => {
        const url = `${getServerUrl()}/auth/confirm-delete?token=${token}&callbackUrl=/auth/goodbye`;
        await sendEmail({
          to: user.email,
          subject: "Delete your account",
          html: MarkdownEmail({
            preview: `Delete your account from ${SiteConfig.title}`,
            markdown: `
            Hello,

            You requested to delete your account.

            [Click here to confirm account deletion](${url})
            `,
          }),
        });
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: MarkdownEmail({
          preview: `Verify your email for ${SiteConfig.title}`,
          markdown: `
          Hello,

          Welcome to ${SiteConfig.title}! Please verify your email address.

          [Click here to verify your email](${url})
          `,
        }),
      });
    },
  },
  socialProviders: SocialProviders,
  plugins: [
    organization({
      ac: ac,
      roles: roles,
      organizationLimit: 5,
      membershipLimit: 10,
      autoCreateOrganizationOnSignUp: true,

      organizationCreation: {
        async afterCreate(data) {
          // Create Stripe customer for the organization (optional if Stripe not configured)
          try {
            const stripeCustomer = await getStripeOrThrow().customers.create({
              email: data.user.email,
              name: data.organization.name,
              metadata: {
                organizationId: data.organization.id,
              },
            });
            await prisma.organization.update({
              where: { id: data.organization.id },
              data: { stripeCustomerId: stripeCustomer.id },
            });
          } catch (error) {
            // Stripe not configured - this is fine in development/test environments
            logger.warn("Stripe customer not created for organization", {
              organizationId: data.organization.id,
              error,
            });
          }
        },
      },
      async sendInvitationEmail({ id, email }) {
        const inviteLink = `${getServerUrl()}/join/${id}`;
        await sendEmail({
          to: email,
          subject: "Vous êtes invité(e) à rejoindre un espace",
          html: MarkdownEmail({
            preview: `Rejoignez un espace sur ${SiteConfig.title}`,
            markdown: `
            Bonjour,

            Vous avez été invité(e) à rejoindre un espace sur ${SiteConfig.title}.

            [Cliquez ici pour accepter l'invitation](${inviteLink})
            `,
          }),
        });
      },
    }),
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        logger.debug("Sending OTP", { email, otp });
        await sendEmail({
          to: email,
          subject: `Your code to sign in to ${SiteConfig.title}`,
          html: MarkdownEmail({
            preview: `Your code to sign in to ${SiteConfig.title}`,
            markdown: `
            Hello,

            Your code to sign in: **${otp}**

            [Or click here to sign in automatically](${getServerUrl()}/auth/signin/otp?email=${email}&otp=${otp})
            `,
          }),
        });
      },
    }),
    admin({}),
    lastLoginMethod({}),
    // Warning: always last plugin
    nextCookies(),
  ],
});
