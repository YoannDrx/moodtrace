import { Link, useLocation } from "react-router-dom";
import { Home, PenLine, Calendar, Pill, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Accueil", href: "/app", icon: Home },
  { label: "Check-in", href: "/app/checkin", icon: PenLine },
  { label: "Timeline", href: "/app/timeline", icon: Calendar },
  { label: "Médication", href: "/app/medication", icon: Pill },
  { label: "Réglages", href: "/app/settings", icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav safe-area-bottom md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/app" && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "bottom-nav-item flex-1",
                isActive && "active"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
