import { spaceMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import type { Metadata } from "next";
import { Suspense } from "react";
import { InjectCurrentSpaceStore } from "./use-current-space";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ spaceSlug: string }>;
};

export async function generateMetadata(props: LayoutProps): Promise<Metadata> {
  const params = await props.params;
  return spaceMetadata(params.spaceSlug);
}

export default async function SpaceLayout(props: LayoutProps) {
  return (
    <>
      {props.children}
      <Suspense fallback={null}>
        <LayoutPage />
      </Suspense>
    </>
  );
}

const LayoutPage = async () => {
  const org = await getRequiredCurrentOrgCache();

  // Détermine si l'utilisateur est owner (patient) ou membre (aidant)
  const isOwner = org.memberRoles.includes("owner");

  return (
    <InjectCurrentSpaceStore
      space={{
        id: org.id,
        slug: org.slug,
        name: org.name,
        image: org.logo ?? null,
        subscription: org.subscription,
        isOwner,
        isPatient: isOwner,
        isCaregiver: !isOwner,
      }}
    />
  );
};
