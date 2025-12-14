import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AUTH_PLANS, getPlanFeatures } from "@/lib/auth/stripe/auth-plans";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { Check } from "lucide-react";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PlanPage />
    </Suspense>
  );
}

async function PlanPage() {
  const org = await getRequiredCurrentOrgCache({
    permissions: {
      subscription: ["manage"],
    },
  });

  const currentPlan = org.subscription?.plan ?? "gratuit";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {AUTH_PLANS.map((plan) => {
        const isCurrentPlan = plan.name === currentPlan;
        const features = getPlanFeatures(plan);

        return (
          <Card
            key={plan.name}
            className={isCurrentPlan ? "border-primary border-2" : ""}
          >
            <CardHeader className="gap-2">
              <CardTitle>
                {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
              </CardTitle>
              <Typography variant="muted" className="text-sm">
                {plan.description}
              </Typography>
              <div className="flex items-baseline gap-1">
                <Typography className="text-3xl font-bold">
                  {plan.price === 0 ? "Gratuit" : `${plan.price}€`}
                </Typography>
                {plan.price > 0 && (
                  <Typography variant="muted">/mois</Typography>
                )}
              </div>
              {isCurrentPlan ? (
                <Button variant="outline" disabled>
                  Plan actuel
                </Button>
              ) : (
                <Button>
                  {plan.price === 0 ? "Rétrograder" : "Améliorer"}
                </Button>
              )}
            </CardHeader>

            <Separator />

            <CardContent className="flex flex-col gap-4 pt-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="text-primary size-5 shrink-0" />
                  <Typography variant="small">{feature}</Typography>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
