"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

type SpaceBillingTabsNavProps = {
  hasSubscription: boolean;
};

export function SpaceBillingTabsNav({
  hasSubscription,
}: SpaceBillingTabsNavProps) {
  const params = useParams();
  const pathname = usePathname();
  const spaceSlug = params.spaceSlug as string;

  const baseUrl = `/space/${spaceSlug}/settings/billing`;

  const tabs = [
    { value: "overview", label: "Aperçu", href: baseUrl },
    { value: "usage", label: "Utilisation", href: `${baseUrl}/usage` },
    ...(hasSubscription
      ? [{ value: "payment", label: "Paiement", href: `${baseUrl}/payment` }]
      : []),
    { value: "plan", label: "Plan", href: `${baseUrl}/plan` },
  ];

  const getCurrentTab = () => {
    if (pathname === baseUrl) return "overview";
    if (pathname.endsWith("/usage")) return "usage";
    if (pathname.endsWith("/payment")) return "payment";
    if (pathname.endsWith("/plan")) return "plan";
    return "overview";
  };

  const activeTab = getCurrentTab();

  return (
    <Tabs value={activeTab}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Link href={tab.href}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
