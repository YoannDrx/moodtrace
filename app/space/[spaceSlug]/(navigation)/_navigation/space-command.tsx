"use client";

import { CmdOrOption } from "@/components/nowts/keyboard-shortcut";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { upfetch } from "@/lib/up-fetch";
import { cn } from "@/lib/utils";
import type { CommandSearchResult } from "@/types/command";
import { useQuery } from "@tanstack/react-query";
import { CornerDownLeft, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { COMMAND_ICONS } from "./command-icons";
import { PATIENT_LINKS } from "./space-navigation-links";

function SpaceCommandItem({
  children,
  className,
  ...props
}: ComponentProps<typeof CommandItem>) {
  return (
    <CommandItem
      className={cn(
        "data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-md border border-transparent !px-3 font-medium",
        className,
      )}
      {...props}
    >
      {children}
    </CommandItem>
  );
}

const SKELETON_WIDTHS = [160, 128, 144, 176, 112];

export function SpaceCommand() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const params = useParams();
  const router = useRouter();
  const spaceSlug =
    typeof params.spaceSlug === "string" ? params.spaceSlug : "";

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["command-search", debouncedSearch, spaceSlug],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const encodedQuery = encodeURIComponent(debouncedSearch);
      const url = `/api/space/${spaceSlug}/command?q=${encodedQuery}`;
      return upfetch<CommandSearchResult[]>(url);
    },
    enabled: Boolean(debouncedSearch),
  });

  const down = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useHotkeys("mod+k", down);

  return (
    <>
      <InputGroup className="w-full">
        <InputGroupAddon align="inline-start">
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Rechercher..."
          onClick={() => {
            setOpen(true);
          }}
        />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <Kbd>
              <CmdOrOption />
            </Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="bg-popover rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-border/80"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Rechercher...</DialogTitle>
            <DialogDescription>
              Recherchez une page ou une commande...
            </DialogDescription>
          </DialogHeader>
          <Command
            shouldFilter={false}
            className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border"
          >
            <CommandInput
              placeholder="Rechercher..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
              {isLoading ? (
                <CommandGroup className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1">
                  {SKELETON_WIDTHS.map((width, index) => (
                    <div
                      key={index}
                      className="flex h-9 items-center gap-2 rounded-md border border-transparent px-3"
                    >
                      <Skeleton className="size-4 rounded" />
                      <Skeleton className="h-4" style={{ width }} />
                    </div>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
                  Aucun résultat trouvé.
                </CommandEmpty>
              )}

              {!isLoading && !debouncedSearch && (
                <>
                  {PATIENT_LINKS.map((link, index) => (
                    <CommandGroup
                      heading={link.title}
                      key={index}
                      className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
                    >
                      {link.links.map((navLink) => (
                        <SpaceCommandItem
                          key={navLink.href}
                          onSelect={() => {
                            router.push(
                              navLink.href.replace(":spaceSlug", spaceSlug),
                            );
                            setOpen(false);
                          }}
                        >
                          <navLink.Icon className="size-4" />
                          <span>{navLink.label}</span>
                        </SpaceCommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </>
              )}

              {!isLoading && searchResults && searchResults.length > 0 && (
                <CommandGroup
                  heading="Résultats"
                  className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
                >
                  {searchResults.map((result) => {
                    const Icon = COMMAND_ICONS[result.icon];
                    return (
                      <SpaceCommandItem
                        key={result.url}
                        onSelect={() => {
                          router.push(result.url);
                          setOpen(false);
                          setSearch("");
                        }}
                      >
                        <Icon className="size-4" />
                        <span>{result.label}</span>
                      </SpaceCommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
          <div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-border bg-muted/40 px-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <Kbd>
                <CornerDownLeft className="size-3" />
              </Kbd>
              Aller à la page
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
