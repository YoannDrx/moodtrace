"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { getAdminNavigation } from "./admin-navigation.links";

import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";

// ... existing imports ...

export function AdminSidebar() {
  const links: NavigationGroup[] = getAdminNavigation();

  return (
    <>
      <Sidebar variant="sidebar">
        <SidebarHeader className="flex flex-col gap-3 border-b p-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <span className="text-sm font-semibold">A</span>
            </div>
            <span className="font-semibold">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {links.map((link) => (
            <ItemCollapsing
              defaultOpenStartPath={link.defaultOpenStartPath}
              key={link.title}
            >
              <SidebarGroup key={link.title}>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    {link.title}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarNavigationMenu link={link} />
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </ItemCollapsing>
          ))}
        </SidebarContent>
        <SidebarFooter className="flex flex-col gap-2 border-t p-4">
          <SidebarUserButton />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <MobileBottomNav groups={links} />
    </>
  );
}

const ItemCollapsing = (
  props: PropsWithChildren<{ defaultOpenStartPath?: string }>,
) => {
  const pathname = usePathname();

  const isOpen = props.defaultOpenStartPath
    ? pathname.startsWith(props.defaultOpenStartPath)
    : true;

  const [open, setOpen] = useState(isOpen);

  return (
    <Collapsible
      defaultOpen={isOpen}
      onOpenChange={setOpen}
      open={open || isOpen}
      className="group/collapsible"
    >
      {props.children}
    </Collapsible>
  );
};
