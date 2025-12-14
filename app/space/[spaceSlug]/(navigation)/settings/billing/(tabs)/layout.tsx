import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { SpaceBillingTabsNav } from "../_components/space-billing-tabs-nav";

export const generateMetadata = combineWithParentMetadata({
  title: "Abonnement",
  description: "Gérez votre abonnement et votre facturation.",
});

export default async function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const org = await getRequiredCurrentOrgCache({
    permissions: {
      subscription: ["manage"],
    },
  });

  const hasSubscription = !!org.subscription;

  return (
    <div className="flex flex-col gap-6">
      <SpaceBillingTabsNav hasSubscription={hasSubscription} />
      {children}
    </div>
  );
}
