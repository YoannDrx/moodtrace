import { getPlanLimits } from "@/lib/auth/stripe/auth-plans";
import { combineWithParentMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { getOrgsMembers } from "@/query/org/get-orgs-members";
import { Suspense } from "react";
import { CaregiversForm } from "./caregivers-form";

export const generateMetadata = combineWithParentMetadata({
  title: "Mes proches",
  description: "Gérez les proches aidants de votre espace.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RoutePage />
    </Suspense>
  );
}

async function RoutePage() {
  const org = await getRequiredCurrentOrgCache({
    permissions: {
      member: ["create", "update", "delete"],
    },
  });

  const members = await getOrgsMembers(org.id);

  // MoodTrace: caregiverAccess détermine si le rôle aidant est autorisé
  // 0 = pas d'aidant, 1 = un aidant autorisé (plan Pro)
  const planLimits = getPlanLimits(org.subscription?.plan);
  // Max 2 membres: patient + aidant optionnel (si Pro)
  const maxMembers = planLimits.caregiverAccess > 0 ? 2 : 1;

  const invitations = await prisma.invitation.findMany({
    where: {
      organizationId: org.id,
    },
  });

  return (
    <CaregiversForm
      invitations={invitations}
      members={members}
      maxMembers={maxMembers}
    />
  );
}
