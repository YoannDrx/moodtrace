import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type LayoutProps = {
  /** Content of the layout */
  children: ReactNode;
  /** Max width variant */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** Additional CSS classes */
  className?: string;
};

/**
 * Layout Component
 *
 * Main container for page content with max-width constraint.
 *
 * @example
 * ```tsx
 * <Layout maxWidth="lg">
 *   <LayoutHeader>
 *     <LayoutTitle>Dashboard</LayoutTitle>
 *   </LayoutHeader>
 *   <LayoutContent>
 *     {children}
 *   </LayoutContent>
 * </Layout>
 * ```
 */
export function Layout({
  children,
  maxWidth = "lg",
  className,
}: LayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div className={cn("mx-auto w-full px-4 py-6", maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
}

export type LayoutHeaderProps = {
  /** Content of the header */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
};

/**
 * LayoutHeader Component
 *
 * Header section with flex layout for title and actions.
 */
export function LayoutHeader({ children, className }: LayoutHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type LayoutTitleProps = {
  /** Title text */
  children: ReactNode;
  /** Optional icon */
  icon?: ReactNode;
  /** Description text */
  description?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * LayoutTitle Component
 *
 * Page title with optional icon and description.
 */
export function LayoutTitle({
  children,
  icon,
  description,
  className,
}: LayoutTitleProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        {icon && <span className="text-primary">{icon}</span>}
        {children}
      </h1>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
}

export type LayoutActionsProps = {
  /** Action buttons/elements */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
};

/**
 * LayoutActions Component
 *
 * Container for header action buttons.
 */
export function LayoutActions({ children, className }: LayoutActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  );
}

export type LayoutContentProps = {
  /** Content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
};

/**
 * LayoutContent Component
 *
 * Main content area.
 */
export function LayoutContent({ children, className }: LayoutContentProps) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}

export type LayoutSectionProps = {
  /** Section content */
  children: ReactNode;
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * LayoutSection Component
 *
 * Section within the layout with optional title.
 */
export function LayoutSection({
  children,
  title,
  description,
  className,
}: LayoutSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export type LayoutGridProps = {
  /** Grid items */
  children: ReactNode;
  /** Number of columns */
  cols?: 1 | 2 | 3 | 4;
  /** Additional CSS classes */
  className?: string;
};

/**
 * LayoutGrid Component
 *
 * Responsive grid layout.
 */
export function LayoutGrid({ children, cols = 2, className }: LayoutGridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colClasses[cols], className)}>
      {children}
    </div>
  );
}
