"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export type SettingsSectionProps = {
  /** Section title */
  title: string;
  /** Section description */
  description?: string;
  /** Icon to display */
  icon?: LucideIcon;
  /** Section content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
};

/**
 * SettingsSection Component
 *
 * A card-based section for grouping related settings.
 * Includes title, optional icon, and description.
 *
 * @example
 * ```tsx
 * <SettingsSection
 *   title="Profil"
 *   description="Gérez vos informations personnelles"
 *   icon={User}
 * >
 *   <UserProfileCard />
 * </SettingsSection>
 * ```
 */
export function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="bg-muted text-muted-foreground rounded-full p-2">
              <Icon className="size-5" />
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export type SettingsRowProps = {
  /** Row label */
  label: string;
  /** Row description */
  description?: string;
  /** Content to display on the right (switch, button, etc.) */
  children?: React.ReactNode;
  /** Callback when row is clicked */
  onClick?: () => void;
  /** Whether to show a chevron (for clickable rows) */
  showChevron?: boolean;
  /** Whether the row is destructive (red text) */
  destructive?: boolean;
  /** Additional CSS classes */
  className?: string;
};

/**
 * SettingsRow Component
 *
 * A single row within a settings section.
 * Can be interactive (onClick) or contain controls (switch, etc.).
 *
 * @example
 * ```tsx
 * // With switch
 * <SettingsRow label="Mode sombre" description="Activer le thème sombre">
 *   <Switch checked={darkMode} onCheckedChange={setDarkMode} />
 * </SettingsRow>
 *
 * // Clickable row
 * <SettingsRow
 *   label="Changer le mot de passe"
 *   onClick={() => openPasswordDialog()}
 *   showChevron
 * />
 *
 * // Destructive action
 * <SettingsRow
 *   label="Supprimer mon compte"
 *   onClick={() => openDeleteDialog()}
 *   destructive
 *   showChevron
 * />
 * ```
 */
export function SettingsRow({
  label,
  description,
  children,
  onClick,
  showChevron = false,
  destructive = false,
  className,
}: SettingsRowProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-4 py-3",
        onClick &&
          "hover:bg-muted/50 -mx-4 cursor-pointer rounded-lg px-4 transition-colors",
        className,
      )}
    >
      <div className="flex flex-col text-left">
        <span
          className={cn(
            "font-medium",
            destructive ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </span>
        {description && (
          <span className="text-muted-foreground text-sm">{description}</span>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
      {showChevron && (
        <svg
          className={cn(
            "size-5 shrink-0",
            destructive ? "text-destructive" : "text-muted-foreground",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Wrapper>
  );
}

export type SettingsDividerProps = {
  /** Additional CSS classes */
  className?: string;
};

/**
 * SettingsDivider Component
 *
 * Horizontal divider for separating settings rows.
 */
export function SettingsDivider({ className }: SettingsDividerProps) {
  return <div className={cn("bg-border my-2 h-px", className)} />;
}
