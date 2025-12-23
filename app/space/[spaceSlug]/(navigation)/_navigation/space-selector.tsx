"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { UserSpaceWithRole } from "@/query/org/get-users-orgs.query";
import { Heart, Home, Plus } from "lucide-react";
import Link from "next/link";

type SpaceSelectorProps = {
  currentSpaceSlug?: string;
  spaces: UserSpaceWithRole[];
};

export const SpaceSelector = (props: SpaceSelectorProps) => {
  const currentSpace = props.spaces.find(
    (space) => space.slug === props.currentSpaceSlug,
  );
  const otherSpaces = props.spaces.filter(
    (space) => space.slug !== props.currentSpaceSlug,
  );

  // Déterminer si l'utilisateur est le propriétaire (patient) de l'espace courant
  const isOwner = currentSpace?.memberRole === "owner";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              data-testid="space-selector"
              variant="default"
              size="lg"
              className="border-border bg-background dark:bg-input/30 rounded-lg border"
            >
              {currentSpace ? (
                <span className="inline-flex w-full items-center gap-2">
                  <Avatar className="size-6 object-contain">
                    <AvatarFallback>
                      {currentSpace.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                    {currentSpace.logo ? (
                      <AvatarImage src={currentSpace.logo} />
                    ) : null}
                  </Avatar>
                  <span className="flex flex-1 flex-col items-start">
                    <span className="line-clamp-1 text-left">
                      {currentSpace.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {isOwner ? "Mon espace" : "Proche aidant"}
                    </span>
                  </span>
                  {isOwner ? (
                    <Home className="text-primary size-4" />
                  ) : (
                    <Heart className="text-primary size-4" />
                  )}
                </span>
              ) : (
                <span>Sélectionner un espace</span>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            {otherSpaces.map((space) => {
              if (typeof window === "undefined") return null;

              const href = `/space/${space.slug}`;
              const spaceIsOwner = space.memberRole === "owner";

              return (
                <DropdownMenuItem key={space.slug} asChild>
                  {/* Full reload when switching space */}
                  <a
                    href={href}
                    className="inline-flex w-full items-center gap-2"
                  >
                    <Avatar className="size-6">
                      <AvatarFallback>
                        {space.name.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                      {space.logo ? <AvatarImage src={space.logo} /> : null}
                    </Avatar>
                    <span className="flex flex-1 flex-col items-start">
                      <span className="line-clamp-1 text-left">
                        {space.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {spaceIsOwner ? "Mon espace" : "Proche aidant"}
                      </span>
                    </span>
                    {spaceIsOwner ? (
                      <Home className="text-muted-foreground size-4" />
                    ) : (
                      <Heart className="text-muted-foreground size-4" />
                    )}
                  </a>
                </DropdownMenuItem>
              );
            })}

            {otherSpaces.length > 0 && <DropdownMenuSeparator />}

            <DropdownMenuItem asChild>
              <Link href="/onboarding/patient">
                <Plus className="mr-2 size-4" />
                <span className="line-clamp-1 text-left">
                  Créer mon espace santé
                </span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
