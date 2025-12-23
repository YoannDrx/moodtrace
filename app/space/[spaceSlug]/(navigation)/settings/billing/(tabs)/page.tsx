import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AUTH_PLANS,
  LIMITS_CONFIG,
  type PlanLimit,
} from "@/lib/auth/stripe/auth-plans";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { CreditCard } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BillingOverviewPage />
    </Suspense>
  );
}

async function BillingOverviewPage() {
  const org = await getRequiredCurrentOrgCache({
    permissions: {
      subscription: ["manage"],
    },
  });

  const currentPlan = org.subscription;
  const planName = currentPlan?.plan ?? "free";
  const planLimits = currentPlan?.limits ?? AUTH_PLANS[0].limits;

  const currentPlanIndex = AUTH_PLANS.findIndex((p) => p.name === planName);
  const hasUpgrades = currentPlanIndex < AUTH_PLANS.length - 1;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Plan actuel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>
            Plan {planName.charAt(0).toUpperCase() + planName.slice(1)}
          </CardTitle>
          <CardDescription>
            {org.subscription?.status === "trialing"
              ? "Période d'essai"
              : "Votre plan actuel et ses fonctionnalités"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {Object.entries(planLimits).map(([key, value]) => {
            const limitKey = key as keyof PlanLimit;
            const config = LIMITS_CONFIG[limitKey];
            const Icon = config.icon;

            return (
              <div key={key} className="flex items-center gap-3">
                <Icon className="text-muted-foreground size-4" />
                <div>
                  <Typography variant="small" className="font-medium">
                    {config.getLabel(value)}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground"
                  >
                    {config.description}
                  </Typography>
                </div>
              </div>
            );
          })}

          {hasUpgrades && (
            <>
              <div className="border-border border-t pt-4" />
              <Button asChild className="w-full">
                <Link href={`/space/${org.slug}/settings/billing/plan`}>
                  Améliorer mon plan
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Informations de facturation */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Moyens de paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {org.subscription ? (
              <Typography variant="muted">
                Gérez vos moyens de paiement dans l&apos;onglet Paiement.
              </Typography>
            ) : (
              <Typography variant="muted">
                Aucun moyen de paiement enregistré. Passez à un plan payant pour
                ajouter un moyen de paiement.
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
