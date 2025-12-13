import { getPlanLimits } from "@/lib/auth/stripe/auth-plans";
import { combineWithParentMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { getOrgsMembers } from "@/query/org/get-orgs-members";
import { Suspense } from "react";
import { OrgMembersForm } from "./org-members-form";

export const generateMetadata = combineWithParentMetadata({
  title: "Members",
  description: "Manage your organization members.",
});

export default function Page(
  props: PageProps<"/orgs/[orgSlug]/settings/members">,
) {
  return (
    <Suspense fallback={null}>
      <RoutePage {...props} />
    </Suspense>
  );
}

async function RoutePage(props: PageProps<"/orgs/[orgSlug]/settings/members">) {
  const org = await getRequiredCurrentOrgCache({
    permissions: {
      member: ["create", "update", "delete"],
    },
  });

  const members = await getOrgsMembers(org.id);

  // MoodTrace: caregiverAccess determines if aidant role is allowed
  // 0 = no caregiver, 1 = one caregiver allowed (Pro plan)
  const planLimits = getPlanLimits(org.subscription?.plan);
  // Max 2 members: patient + optional caregiver (if Pro)
  const maxMembers = planLimits.caregiverAccess > 0 ? 2 : 1;

  const invitations = await prisma.invitation.findMany({
    where: {
      organizationId: org.id,
    },
  });

  return (
    <OrgMembersForm
      invitations={invitations}
      members={members}
      maxMembers={maxMembers}
    />
  );
}
