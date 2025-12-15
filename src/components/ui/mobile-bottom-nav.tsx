"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavigationGroup } from "@/features/navigation/navigation.type";

type MobileBottomNavProps = {
  groups: NavigationGroup[];
}

export function MobileBottomNav({ groups }: MobileBottomNavProps) {
  const pathname = usePathname();
  
  if (groups.length === 0) return null;

  // Prefer "Suivi" group, otherwise the first group
  const mainGroup = groups.find(g => g.title === "Suivi") ?? groups[0];
  
  const links = mainGroup.links;

  if (links.length === 0) return null;

  // We limit to 5 items to fit in the bottom bar
  const displayLinks = links.slice(0, 5);

  return (
    <div className="bg-card border-border fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.03)] md:hidden">
      {displayLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href  }/`);
        const Icon = link.Icon;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("size-6", isActive && "stroke-2")} />
            <span className={cn("text-[10px] font-medium", isActive ? "font-semibold" : "")}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
