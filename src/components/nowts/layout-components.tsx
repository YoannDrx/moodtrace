"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import Link from "next/link";

// =============================================================================
// PageHeader
// =============================================================================

export type PageHeaderProps = {
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** Action button */
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick?: () => void;
    href?: string;
    variant?: "default" | "outline" | "secondary";
  };
  /** Back link href */
  backHref?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * PageHeader Component
 *
 * A standardized page header with title, description, and optional action.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Médication"
 *   description="Gérez vos traitements"
 *   action={{ label: "Ajouter", icon: Plus, onClick: () => openDialog() }}
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  action,
  backHref,
  className,
}: PageHeaderProps) {
  const ActionIcon = action?.icon;
  const actionVariant = action?.variant ?? "default";

  const ActionButton = action ? (
    action.href ? (
      <Button variant={actionVariant} asChild>
        <Link href={action.href}>
          {ActionIcon && <ActionIcon className="mr-2 size-4" />}
          {action.label}
        </Link>
      </Button>
    ) : (
      <Button variant={actionVariant} onClick={action.onClick}>
        {ActionIcon && <ActionIcon className="mr-2 size-4" />}
        {action.label}
      </Button>
    )
  ) : null;

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        {backHref && (
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-1 text-sm"
          >
            <ChevronLeft className="size-4" />
            Retour
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {ActionButton}
    </div>
  );
}

// =============================================================================
// CtaCard
// =============================================================================

export type CtaCardProps = {
  /** Card title */
  title: string;
  /** Card description */
  description?: string;
  /** Action button label */
  actionLabel: string;
  /** Action button icon */
  actionIcon?: LucideIcon;
  /** Action callback */
  onAction?: () => void;
  /** Action href */
  actionHref?: string;
  /** Color variant */
  variant?: "primary" | "secondary" | "success";
  /** Additional CSS classes */
  className?: string;
};

/**
 * CtaCard Component
 *
 * A call-to-action card with colored background and action button.
 *
 * @example
 * ```tsx
 * <CtaCard
 *   title="Check-in quotidien"
 *   description="Prenez 2 minutes pour noter votre journée"
 *   actionLabel="Commencer"
 *   actionIcon={Pencil}
 *   actionHref="/app/checkin"
 *   variant="primary"
 * />
 * ```
 */
export function CtaCard({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  actionHref,
  variant = "primary",
  className,
}: CtaCardProps) {
  const variants = {
    primary: {
      card: "bg-primary",
      title: "text-primary-foreground",
      description: "text-primary-foreground/80",
      button: "bg-white text-primary hover:bg-white/90",
    },
    secondary: {
      card: "bg-secondary",
      title: "text-secondary-foreground",
      description: "text-secondary-foreground/80",
      button: "bg-white text-secondary hover:bg-white/90",
    },
    success: {
      card: "bg-success",
      title: "text-white",
      description: "text-white/80",
      button: "bg-white text-success hover:bg-white/90",
    },
  };

  const styles = variants[variant];

  const ActionButton = actionHref ? (
    <Button className={styles.button} asChild>
      <Link href={actionHref}>
        {ActionIcon && <ActionIcon className="mr-2 size-4" />}
        {actionLabel}
      </Link>
    </Button>
  ) : (
    <Button className={styles.button} onClick={onAction}>
      {ActionIcon && <ActionIcon className="mr-2 size-4" />}
      {actionLabel}
    </Button>
  );

  return (
    <Card className={cn(styles.card, className)}>
      <CardContent className="flex items-center justify-between gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h3 className={cn("text-lg font-semibold", styles.title)}>{title}</h3>
          {description && (
            <p className={cn("text-sm", styles.description)}>{description}</p>
          )}
        </div>
        {ActionButton}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// QuickAccessCard
// =============================================================================

export type QuickAccessCardProps = {
  /** Icon to display */
  icon: LucideIcon;
  /** Label text */
  label: string;
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
};

/**
 * QuickAccessCard Component
 *
 * A clickable card for quick navigation.
 *
 * @example
 * ```tsx
 * <QuickAccessCard icon={Calendar} label="Timeline" href="/app/timeline" />
 * <QuickAccessCard icon={Pill} label="Médication" href="/app/medication" />
 * ```
 */
export function QuickAccessCard({
  icon: Icon,
  label,
  href,
  onClick,
  className,
}: QuickAccessCardProps) {
  const content = (
    <>
      <div className="bg-primary/10 text-primary group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
        <Icon className="size-5" />
      </div>
      <span className="flex-1 text-left font-medium">{label}</span>
      <ChevronRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
    </>
  );

  return (
    <Card
      className={cn(
        "group hover:border-primary/50 cursor-pointer transition-all hover:shadow-md",
        className,
      )}
    >
      {href ? (
        <Link href={href} className="flex w-full items-center gap-3 p-4">
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="flex w-full items-center gap-3 p-4"
        >
          {content}
        </button>
      )}
    </Card>
  );
}

// =============================================================================
// ProfileCard
// =============================================================================

export type ProfileCardProps = {
  /** User name */
  name: string;
  /** User email */
  email: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** Avatar fallback (initials) */
  avatarFallback?: string;
  /** Edit callback */
  onEdit?: () => void;
  /** Additional CSS classes */
  className?: string;
};

/**
 * ProfileCard Component
 *
 * A card displaying user profile information with edit action.
 *
 * @example
 * ```tsx
 * <ProfileCard
 *   name="Patient Demo"
 *   email="demo@moodtrace.app"
 *   avatarFallback="PD"
 *   onEdit={() => openEditDialog()}
 * />
 * ```
 */
export function ProfileCard({
  name,
  email,
  avatarUrl,
  avatarFallback,
  onEdit,
  className,
}: ProfileCardProps) {
  const initials =
    avatarFallback ??
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div
      className={cn("flex items-center justify-between gap-4 py-2", className)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{name}</span>
          <span className="text-muted-foreground text-sm">{email}</span>
        </div>
      </div>
      {onEdit && (
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="mr-2 size-3" />
          Modifier
        </Button>
      )}
    </div>
  );
}

// =============================================================================
// EmptyState
// =============================================================================

export type EmptyStateProps = {
  /** Icon to display */
  icon: LucideIcon;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button label */
  actionLabel?: string;
  /** Action callback */
  onAction?: () => void;
  /** Action href */
  actionHref?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * EmptyState Component
 *
 * A placeholder for empty content with optional action.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Users}
 *   title="Aucun aidant invité"
 *   description="Invitez un proche pour suivre vos observations"
 *   actionLabel="Inviter un aidant"
 *   onAction={() => openInviteDialog()}
 * />
 * ```
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  const ActionButton =
    actionLabel && (actionHref || onAction) ? (
      actionHref ? (
        <Button variant="outline" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )
    ) : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className,
      )}
    >
      <div className="bg-muted text-muted-foreground rounded-full p-4">
        <Icon className="size-8" />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-muted-foreground font-medium">{title}</h4>
        {description && (
          <p className="text-muted-foreground max-w-sm text-sm">
            {description}
          </p>
        )}
      </div>
      {ActionButton}
    </div>
  );
}
