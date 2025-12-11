import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <Sidebar />
      
      {/* Main content */}
      <main className="md:pl-64">
        <div className="min-h-screen pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Bottom navigation (mobile) */}
      <BottomNav />
    </div>
  );
}
