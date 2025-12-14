import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { CreditCard, Receipt } from "lucide-react";
import { Suspense } from "react";

export const generateMetadata = combineWithParentMetadata({
  title: "Paiement",
  description: "Gérez vos moyens de paiement.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentPage />
    </Suspense>
  );
}

async function PaymentPage() {
  const org = await getRequiredCurrentOrgCache({
    permissions: {
      subscription: ["manage"],
    },
  });

  const hasSubscription = !!org.subscription;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Moyens de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasSubscription ? (
            <div className="flex flex-col gap-4">
              <Typography variant="muted">
                Gérez vos moyens de paiement via le portail Stripe.
              </Typography>
              <Button variant="outline" className="w-fit">
                Gérer les paiements
              </Button>
            </div>
          ) : (
            <Typography variant="muted">
              Aucun moyen de paiement enregistré. Passez à un plan payant pour
              ajouter un moyen de paiement.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="size-5" />
            Historique de facturation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasSubscription ? (
            <div className="flex flex-col gap-4">
              <Typography variant="muted">
                Consultez vos factures et reçus via le portail Stripe.
              </Typography>
              <Button variant="outline" className="w-fit">
                Voir les factures
              </Button>
            </div>
          ) : (
            <Typography variant="muted">Aucune facture disponible.</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
