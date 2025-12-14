"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

// =============================================================================
// HeroBadge
// =============================================================================

export type HeroBadgeProps = {
  /** Icon to display */
  icon?: LucideIcon;
  /** Variant for styling */
  variant?: "primary" | "secondary" | "warning";
  /** Content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
};

/**
 * HeroBadge Component
 *
 * A pill-shaped badge used in hero sections (e.g., "Application non médicale").
 *
 * @example
 * ```tsx
 * <HeroBadge icon={Shield} variant="primary">
 *   Application non médicale · Données privées
 * </HeroBadge>
 * ```
 */
export function HeroBadge({
  icon: Icon,
  variant = "primary",
  children,
  className,
}: HeroBadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-muted text-muted-foreground border-border",
    warning: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
        variants[variant],
        className,
      )}
    >
      {Icon && <Icon className="size-4" />}
      {children}
    </div>
  );
}

// =============================================================================
// TrustIndicator
// =============================================================================

export type TrustIndicatorProps = {
  /** Icon to display */
  icon: LucideIcon;
  /** Content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
};

/**
 * TrustIndicator Component
 *
 * An inline trust indicator with icon and text.
 * Used in hero sections to show trust signals.
 *
 * @example
 * ```tsx
 * <TrustIndicator icon={Heart}>Conçu avec bienveillance</TrustIndicator>
 * <TrustIndicator icon={Shield}>Données sécurisées</TrustIndicator>
 * ```
 */
export function TrustIndicator({
  icon: Icon,
  children,
  className,
}: TrustIndicatorProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground inline-flex items-center gap-2 text-sm",
        className,
      )}
    >
      <Icon className="text-primary size-4" />
      <span>{children}</span>
    </div>
  );
}

// =============================================================================
// FeatureCard
// =============================================================================

export type FeatureCardProps = {
  /** Icon to display */
  icon: LucideIcon;
  /** Title of the feature */
  title: string;
  /** Description of the feature */
  description: string;
  /** Icon variant for styling */
  iconVariant?: "primary" | "secondary" | "success" | "warning";
  /** Additional CSS classes */
  className?: string;
};

/**
 * FeatureCard Component
 *
 * A card displaying a feature with icon, title, and description.
 * Used in landing pages to showcase features.
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={Calendar}
 *   title="Check-in quotidien"
 *   description="Renseignez votre humeur en moins de 3 minutes chaque jour."
 * />
 * ```
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconVariant = "primary",
  className,
}: FeatureCardProps) {
  const iconColors = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className={cn("w-fit rounded-xl p-3", iconColors[iconVariant])}>
          <Icon className="size-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// NumberedStep
// =============================================================================

export type StepStatus = "pending" | "active" | "completed";

export type NumberedStepProps = {
  /** Step number (1-indexed) */
  number: number;
  /** Title of the step */
  title: string;
  /** Description of the step */
  description?: string;
  /** Status of the step */
  status?: StepStatus;
  /** Additional CSS classes */
  className?: string;
};

/**
 * NumberedStep Component
 *
 * A single numbered step with title and description.
 *
 * @example
 * ```tsx
 * <NumberedStep
 *   number={1}
 *   title="Créez votre profil"
 *   description="Renseignez vos informations de base."
 *   status="completed"
 * />
 * ```
 */
export function NumberedStep({
  number,
  title,
  description,
  status = "pending",
  className,
}: NumberedStepProps) {
  const circleStyles = {
    pending: "bg-muted text-muted-foreground",
    active: "bg-primary text-primary-foreground ring-4 ring-primary/20",
    completed: "bg-primary text-primary-foreground",
  };

  const formattedNumber = number.toString().padStart(2, "0");

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-full text-lg font-bold",
          circleStyles[status],
        )}
      >
        {status === "completed" ? (
          <Check className="size-6" />
        ) : (
          formattedNumber
        )}
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h4
          className={cn(
            "font-semibold",
            status === "active" ? "text-foreground" : "text-foreground",
          )}
        >
          {title}
        </h4>
        {description && (
          <p className="text-muted-foreground max-w-[200px] text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// NumberedStepper
// =============================================================================

export type NumberedStepData = {
  /** Title of the step */
  title: string;
  /** Description of the step */
  description?: string;
};

export type NumberedStepperProps = {
  /** Steps data */
  steps: NumberedStepData[];
  /** Current active step (1-indexed) */
  currentStep?: number;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Additional CSS classes */
  className?: string;
};

/**
 * NumberedStepper Component
 *
 * A group of numbered steps connected by lines.
 * Used in "How it works" sections.
 *
 * @example
 * ```tsx
 * <NumberedStepper
 *   steps={[
 *     { title: "Créez votre profil", description: "Renseignez vos infos" },
 *     { title: "Faites votre check-in", description: "2-3 minutes par jour" },
 *     { title: "Suivez vos évolutions", description: "Consultez votre timeline" },
 *     { title: "Préparez vos consultations", description: "Générez un rapport" },
 *   ]}
 *   currentStep={2}
 * />
 * ```
 */
export function NumberedStepper({
  steps,
  currentStep = 0,
  orientation = "horizontal",
  className,
}: NumberedStepperProps) {
  const getStatus = (index: number): StepStatus => {
    const stepNumber = index + 1;
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "active";
    return "pending";
  };

  if (orientation === "vertical") {
    return (
      <div className={cn("flex flex-col", className)}>
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <NumberedStep
                number={index + 1}
                title=""
                status={getStatus(index)}
                className="w-auto"
              />
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "min-h-16 w-0.5 flex-1",
                    index + 1 < currentStep ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
            <div className="flex flex-col gap-1 pb-8">
              <h4 className="font-semibold">{step.title}</h4>
              {step.description && (
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-start justify-between", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex flex-1 items-start">
          <NumberedStep
            number={index + 1}
            title={step.title}
            description={step.description}
            status={getStatus(index)}
            className="flex-1"
          />
          {index < steps.length - 1 && (
            <div
              className={cn(
                "-mx-4 mt-6 h-0.5 flex-1",
                index + 1 < currentStep ? "bg-primary" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
