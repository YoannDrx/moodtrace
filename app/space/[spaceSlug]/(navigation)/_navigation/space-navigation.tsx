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
      <SidebarInset className="border-border border">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <Layout size="lg" className="flex items-center justify-between gap-2">
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
