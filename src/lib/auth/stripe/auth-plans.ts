import type { Subscription } from "@/generated/prisma";
import { logger } from "@/lib/logger";
import {
  Calendar,
  FileText,
  Heart,
  LineChart,
  Pill,
  Shield,
  Users,
  Zap,
} from "lucide-react";

/**
 * MoodTrace Plan Limits
 *
 * - moodEntriesPerMonth: Number of mood entries per month (-1 = unlimited)
 * - medications: Number of medications to track (-1 = unlimited)
 * - exportPerMonth: Number of PDF exports per month (-1 = unlimited)
 * - caregiverAccess: Can add caregiver role
 * - correlations: Access to correlations & insights
 */
const DEFAULT_LIMIT = {
  moodEntriesPerMonth: 31,
  medications: 3,
  exportPerMonth: 1,
  caregiverAccess: 0,
  correlations: 0,
};

export type PlanLimit = typeof DEFAULT_LIMIT;

export type OverrideLimits = Partial<PlanLimit>;

type HookCtx = {
  req: Request;
  organizationId: string;
  stripeCustomerId: string;
  subscriptionId: string;
};

export type AppAuthPlan = {
  priceId?: string | undefined;
  lookupKey?: string | undefined;
  annualDiscountPriceId?: string | undefined;
  annualDiscountLookupKey?: string | undefined;
  name: string;
  limits?: Record<string, number> | undefined;
  group?: string;
  freeTrial?: {
    days: number;
    onTrialStart?: (subscription: Subscription, ctx: HookCtx) => Promise<void>;
    onTrialEnd?: (
      data: {
        subscription: Subscription;
      },
      ctx: HookCtx,
    ) => Promise<void>;
    onTrialExpired?: (
      subscription: Subscription,
      ctx: HookCtx,
    ) => Promise<void>;
  };
  onSubscriptionCanceled?: (
    subscription: Subscription,
    ctx: HookCtx,
  ) => Promise<void>;
} & {
  description: string;
  isPopular?: boolean;
  price: number;
  yearlyPrice?: number;
  currency: string;
  isHidden?: boolean;
  limits: PlanLimit;
};

/**
 * MoodTrace Plans
 *
 * - Gratuit: Basic mood tracking for getting started
 * - Pro: Full access with caregiver role, correlations, unlimited exports
 */
export const AUTH_PLANS: AppAuthPlan[] = [
  {
    name: "gratuit",
    description: "Parfait pour commencer le suivi de votre humeur",
    limits: DEFAULT_LIMIT,
    price: 0,
    currency: "EUR",
    yearlyPrice: 0,
  },
  {
    name: "pro",
    isPopular: true,
    description:
      "Suivi complet avec insights, correlations et role aidant integre",
    priceId: process.env.STRIPE_PRO_PLAN_ID ?? "",
    annualDiscountPriceId: process.env.STRIPE_PRO_YEARLY_PLAN_ID ?? "",
    limits: {
      moodEntriesPerMonth: -1, // Unlimited
      medications: -1, // Unlimited
      exportPerMonth: -1, // Unlimited
      caregiverAccess: 1, // Enabled
      correlations: 1, // Enabled
    },
    freeTrial: {
      days: 14,
      onTrialStart: async (subscription) => {
        logger.debug(`Trial started for ${subscription.id}`);
      },
      onTrialExpired: async (subscription) => {
        logger.debug(`Trial expired for ${subscription.id}`);
      },
      onTrialEnd: async ({ subscription }) => {
        logger.debug(`Trial ended for ${subscription.id}`);
      },
    },
    price: 4.99,
    yearlyPrice: 49.99,
    currency: "EUR",
  },
];

// Limits transformation object for MoodTrace
export const LIMITS_CONFIG: Record<
  keyof PlanLimit,
  {
    icon: React.ElementType;
    getLabel: (value: number) => string;
    description: string;
  }
> = {
  moodEntriesPerMonth: {
    icon: Heart,
    getLabel: (value: number) =>
      value === -1 ? "Entrees illimitees" : `${value} entrees/mois`,
    description: "Enregistrez votre humeur quotidiennement",
  },
  medications: {
    icon: Pill,
    getLabel: (value: number) =>
      value === -1 ? "Medicaments illimites" : `${value} medicaments`,
    description: "Suivez vos traitements et leur adherence",
  },
  exportPerMonth: {
    icon: FileText,
    getLabel: (value: number) =>
      value === -1 ? "Exports illimites" : `${value} export PDF/mois`,
    description: "Generez des rapports pour votre medecin",
  },
  caregiverAccess: {
    icon: Users,
    getLabel: (value: number) =>
      value > 0 ? "Role aidant" : "Role aidant (Pro)",
    description: "Permettez a un proche de suivre votre evolution",
  },
  correlations: {
    icon: LineChart,
    getLabel: (value: number) =>
      value > 0 ? "Correlations & insights" : "Correlations (Pro)",
    description: "Analysez les liens entre medication et humeur",
  },
};

// Additional features by plan
export const ADDITIONAL_FEATURES = {
  gratuit: [
    {
      icon: Shield,
      label: "Donnees securisees",
      description: "Chiffrement et confidentialite garantis",
    },
    {
      icon: Calendar,
      label: "Dashboard 7 jours",
      description: "Visualisez vos tendances sur une semaine",
    },
  ],
  pro: [
    {
      icon: Zap,
      label: "Support prioritaire",
      description: "Aide rapide quand vous en avez besoin",
    },
    {
      icon: LineChart,
      label: "Dashboard 30 jours",
      description: "Tendances et analyses sur un mois complet",
    },
    {
      icon: Users,
      label: "Role aidant",
      description: "Un proche peut ajouter des observations",
    },
  ],
};

export const getPlanLimits = (
  plan = "gratuit",
  overrideLimits?: OverrideLimits | null,
): PlanLimit => {
  const planLimits = AUTH_PLANS.find((p) => p.name === plan)?.limits;

  const baseLimits = planLimits ?? DEFAULT_LIMIT;

  if (!overrideLimits) {
    return baseLimits;
  }

  return {
    ...baseLimits,
    ...overrideLimits,
  };
};

export const getPlanFeatures = (plan: AppAuthPlan): string[] => {
  const features: string[] = [
    ...Object.entries(plan.limits)
      .filter(([key]) => key in LIMITS_CONFIG)
      .map(([key, value]) => {
        const limitConfig = LIMITS_CONFIG[key as keyof typeof LIMITS_CONFIG];
        return limitConfig.getLabel(value as number);
      }),
    ...ADDITIONAL_FEATURES[plan.name as keyof typeof ADDITIONAL_FEATURES].map(
      (f) => f.label,
    ),
  ];
  return features;
};
