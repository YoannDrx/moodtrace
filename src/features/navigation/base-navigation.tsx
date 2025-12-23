import { Typography } from "@/components/nowts/typography";
import { LogoSvg } from "@/components/svg/logo-svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarMenuButtonLink } from "@/components/ui/sidebar-utils";
import { Layout } from "@/features/page/layout";
import { SiteConfig } from "@/site-config";
import { Building2, Home, User } from "lucide-react";
import type { PropsWithChildren } from "react";
import { SidebarUserButton } from "../sidebar/sidebar-user-button";

export function BaseNavigation({ children }: PropsWithChildren) {
  return (
    <SidebarProvider id="app-sidebar">
      <BaseSidebar />
      <SidebarInset>
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 flex h-16 shrink-0 items-center border-b backdrop-blur">
          <Layout size="lg" className="mt-0">
            <SidebarTrigger className="-ml-1" />
          </Layout>
        </header>
        <div className="flex flex-1 flex-col pb-24 md:pb-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const BaseSidebar = () => {
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="border-b p-4">
        <div className="flex flex-row items-center gap-2">
          <LogoSvg size={24} />
          <Typography>{SiteConfig.title}</Typography>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButtonLink href="/space">
              <Building2 />
              <span>Mon espace</span>
            </SidebarMenuButtonLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButtonLink href="/home">
              <Home />
              <span>Accueil</span>
            </SidebarMenuButtonLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButtonLink href="/space">
              <User />
              <span>Paramètres</span>
            </SidebarMenuButtonLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <SidebarUserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
