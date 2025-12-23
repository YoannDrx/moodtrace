"use server";

import { adminAction } from "@/lib/actions/safe-actions";
import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { invalidateOrgSubscription } from "@/lib/cache-invalidation";
import { prisma } from "@/lib/prisma";
import { getStripeOrThrow } from "@/lib/stripe";
import { z } from "zod";

export const updateSubscriptionPlanAction = adminAction
  .inputSchema(
    z.object({
      organizationId: z.string(),
      planName: z.string(),
      isYearly: z.boolean().optional(),
    }),
  )
  .action(async ({ parsedInput: { organizationId, planName, isYearly } }) => {
    const plan = AUTH_PLANS.find((p) => p.name === planName);
    if (!plan) {
      throw new Error("Invalid plan");
    }

    const subscription = await prisma.subscription.findFirst({
      where: { referenceId: organizationId },
    });

    if (!subscription) {
      if (planName === "free") {
        return;
      }
      throw new Error("No subscription found");
    }

    if (planName === "free") {
      if (subscription.stripeSubscriptionId) {
        await getStripeOrThrow().subscriptions.cancel(
          subscription.stripeSubscriptionId,
        );
      }

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          plan: "free",
          status: "canceled",
          stripeSubscriptionId: null,
        },
      });
      return;
    }

    const priceId =
      isYearly && plan.annualDiscountPriceId
        ? plan.annualDiscountPriceId
        : plan.priceId;

    if (!priceId) {
      throw new Error(
        "Plan does not have a price ID for the selected billing frequency",
      );
    }

    if (!subscription.stripeSubscriptionId) {
      throw new Error("No Stripe subscription found");
    }

    const stripeSubscription = await getStripeOrThrow().subscriptions.retrieve(
      subscription.stripeSubscriptionId,
    );

    await getStripeOrThrow().subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: "always_invoice",
      },
    );

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: planName,
      },
    });
  });

export const cancelSubscriptionAction = adminAction
  .inputSchema(
    z.object({
      organizationId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { organizationId } }) => {
    const subscription = await prisma.subscription.findFirst({
      where: { referenceId: organizationId },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new Error("No active subscription found");
    }

    await getStripeOrThrow().subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      },
    );

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
      },
    });
  });

export const reactivateSubscriptionAction = adminAction
  .inputSchema(
    z.object({
      organizationId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { organizationId } }) => {
    const subscription = await prisma.subscription.findFirst({
      where: { referenceId: organizationId },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new Error("No subscription found");
    }

    await getStripeOrThrow().subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      },
    );

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
      },
    });
  });

export const createSubscriptionAction = adminAction
  .inputSchema(
    z.object({
      organizationId: z.string(),
      planName: z.string(),
      isYearly: z.boolean().optional(),
    }),
  )
  .action(async ({ parsedInput: { organizationId, planName, isYearly } }) => {
    const plan = AUTH_PLANS.find((p) => p.name === planName);
    if (!plan || planName === "free") {
      throw new Error("Invalid plan for subscription creation");
    }

    const priceId =
      isYearly && plan.annualDiscountPriceId
        ? plan.annualDiscountPriceId
        : plan.priceId;

    if (!priceId) {
      throw new Error(
        "Plan does not have a price ID for the selected billing frequency",
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { subscription: true },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    if (organization.subscription) {
      throw new Error("Organization already has a subscription");
    }

    let stripeCustomerId = organization.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await getStripeOrThrow().customers.create({
        email: organization.email ?? undefined,
        name: organization.name,
        metadata: {
          organizationId: organization.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId },
      });
    }

    const stripeSubscription = await getStripeOrThrow().subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      trial_period_days: plan.freeTrial?.days,
      metadata: {
        organizationId: organization.id,
      },
    });

    await prisma.subscription.create({
      data: {
        id: crypto.randomUUID(),
        plan: planName,
        referenceId: organizationId,
        stripeCustomerId,
        stripeSubscriptionId: stripeSubscription.id,
        status: stripeSubscription.status,
        periodStart: new Date(
          stripeSubscription.items.data[0].current_period_start * 1000,
        ),
        periodEnd: new Date(
          stripeSubscription.items.data[0].current_period_end * 1000,
        ),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      },
    });
  });

export const updateOverrideLimitsAction = adminAction
  .inputSchema(
    z.object({
      organizationId: z.string(),
      overrideLimits: z
        .object({
          moodEntriesPerMonth: z.number().int().min(-1).optional(),
          medications: z.number().int().min(-1).optional(),
          exportPerMonth: z.number().int().min(-1).optional(),
          caregiverAccess: z.number().int().min(0).max(1).optional(),
          correlations: z.number().int().min(0).max(1).optional(),
        })
        .optional(),
    }),
  )
  .action(async ({ parsedInput: { organizationId, overrideLimits } }) => {
    const subscription = await prisma.subscription.findFirst({
      where: { referenceId: organizationId },
    });

    if (!subscription) {
      throw new Error("No subscription found");
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        overrideLimits: overrideLimits
          ? JSON.parse(JSON.stringify(overrideLimits))
          : null,
      },
    });

    await invalidateOrgSubscription(organizationId);
  });
