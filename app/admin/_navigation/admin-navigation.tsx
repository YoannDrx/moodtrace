import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Layout } from "@/features/page/layout";
import type { PropsWithChildren } from "react";
import { AdminSidebar } from "./admin-sidebar";

export async function AdminNavigation({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 flex h-16 shrink-0 items-center border-b backdrop-blur">
          <Layout size="lg" className="mt-0 flex items-center gap-2">
            <SidebarTrigger
              size="lg"
              variant="outline"
              className="size-9 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <span className="font-semibold">Admin Panel</span>
            </div>
          </Layout>
        </header>
        <div className="flex flex-1 flex-col pb-24 md:pb-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
