import { Link, useLocation } from "react-router-dom";
import { Home, PenLine, Calendar, Pill, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Accueil", href: "/app", icon: Home },
  { label: "Check-in", href: "/app/checkin", icon: PenLine },
  { label: "Timeline", href: "/app/timeline", icon: Calendar },
  { label: "Médication", href: "/app/medication", icon: Pill },
  { label: "Réglages", href: "/app/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          M
        </div>
        <span className="text-xl font-bold text-foreground">MoodTrace</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/app" && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Patient</p>
            <p className="text-xs text-muted-foreground truncate">demo@example.com</p>
          </div>
        </div>
        <button className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
