"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNavigationMenu } from "@/components/ui/sidebar-utils";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SidebarUserButton } from "@/features/sidebar/sidebar-user-button";
import type { AuthRole } from "@/lib/auth/auth-permissions";
import type { UserSpaceWithRole } from "@/query/org/get-users-orgs.query";
import { ArrowLeft, Settings } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getSpaceNavigation } from "./space-navigation-links";
import { SpaceSelector } from "./space-selector";
import { UpgradeCard } from "./upgrade-card";

const SpaceCommand = dynamic(
  async () => import("./space-command").then((mod) => mod.SpaceCommand),
  { ssr: false },
);

type SpaceSidebarProps = {
  slug: string;
  roles: AuthRole[] | undefined;
  userSpaces: UserSpaceWithRole[];
  isPatient: boolean;
};

export function SpaceSidebar({
  slug,
  userSpaces,
  roles,
  isPatient,
}: SpaceSidebarProps) {
  const pathname = usePathname();
  const allLinks: NavigationGroup[] = getSpaceNavigation(
    slug,
    roles,
    isPatient,
  );

  const isSettingsPage = pathname.includes("/settings");

  const links = useMemo(() => {
    if (isSettingsPage) {
      return allLinks.filter((group) => group.title === "Paramètres");
    }
    return allLinks.filter((group) => group.title === "Suivi");
  }, [allLinks, isSettingsPage]);

  const basePath = `/space/${slug}`;

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-2">
        {isSettingsPage ? (
          <Button variant="ghost" className="justify-start" asChild>
            <Link href={basePath} prefetch={false}>
              <ArrowLeft className="size-4" />
              <span>Retour au tableau de bord</span>
            </Link>
          </Button>
        ) : (
          <>
            <SpaceSelector spaces={userSpaces} currentSpaceSlug={slug} />
            <SpaceCommand />
          </>
        )}
      </SidebarHeader>
      <SidebarContent className="border-card">
        {links.map((link) => (
          <SidebarGroup key={link.title}>
            <SidebarGroupLabel>{link.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNavigationMenu link={link} />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        {!isSettingsPage && (
          <>
            <UpgradeCard />
            <Button variant="outline" asChild size="sm">
              <Link href={`${basePath}/settings`} prefetch={false}>
                <Settings className="size-4" />
                <span>Paramètres</span>
              </Link>
            </Button>
          </>
        )}
        <SidebarUserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
