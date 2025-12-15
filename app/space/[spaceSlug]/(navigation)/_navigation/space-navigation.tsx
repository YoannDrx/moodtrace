import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Layout } from "@/features/page/layout";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { getUsersSpacesWithRoles } from "@/query/org/get-users-orgs.query";
import type { PropsWithChildren } from "react";
import { FeedbackButton } from "./feedback-button";
import SpaceBreadcrumb from "./space-breadcrumb";
import { SpaceSidebar } from "./space-sidebar";

export async function SpaceNavigation({ children }: PropsWithChildren) {
  const org = await getRequiredCurrentOrgCache();

  const userSpaces = await getUsersSpacesWithRoles();

  // Déterminer si l'utilisateur est patient (owner) ou aidant (member)
  const isPatient = org.memberRoles.includes("owner");

  return (
    <SidebarProvider>
      <SpaceSidebar
        slug={org.slug}
        roles={org.memberRoles}
        userSpaces={userSpaces}
        isPatient={isPatient}
      />
      <SidebarInset>
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 flex h-16 shrink-0 items-center border-b backdrop-blur">
          <Layout
            size="lg"
            className="mt-0 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <SidebarTrigger
                variant="outline"
                className="size-8 cursor-pointer"
              />
              <SpaceBreadcrumb />
            </div>
            <FeedbackButton />
          </Layout>
        </header>
        <div className="flex flex-1 flex-col pb-24 md:pb-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
