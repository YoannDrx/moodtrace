"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export type StatCardProps = {
  /** Icon to display */
  icon: LucideIcon;
  /** Label/title of the stat */
  label: string;
  /** Value to display (number or string) */
  value: string | number;
  /** Optional unit or suffix */
  unit?: string;
  /** Variant for styling */
  variant?: "default" | "primary" | "success" | "warning";
  /** Additional CSS classes */
  className?: string;
};

/**
 * StatCard Component
 *
 * Displays a statistic with an icon, label, and value.
 * Used for dashboard stats like streak, adherence, etc.
 *
 * @example
 * ```tsx
 * <StatCard
 *   icon={TrendingUp}
 *   label="Série"
 *   value={7}
 *   unit="jours"
 * />
 *
 * <StatCard
 *   icon={CheckCircle}
 *   label="Observance"
 *   value={92}
 *   unit="%"
 *   variant="success"
 * />
 * ```
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  variant = "default",
  className,
}: StatCardProps) {
  const iconColors = {
    default: "text-muted-foreground bg-muted",
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={cn("rounded-full p-2.5", iconColors[variant])}>
          <Icon className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">{label}</span>
          <span className="text-lg font-semibold">
            {value}
            {unit && (
              <span className="text-muted-foreground ml-0.5 text-sm">
                {unit}
              </span>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export type StepIndicatorProps = {
  /** Total number of steps */
  totalSteps: number;
  /** Current active step (1-indexed) */
  currentStep: number;
  /** Optional labels for each step */
  labels?: string[];
  /** Optional icons for each step (replaces numbers) */
  icons?: LucideIcon[];
  /** Additional CSS classes */
  className?: string;
};

/**
 * StepIndicator Component
 *
 * Multi-step progress indicator with checkmarks for completed steps.
 * Supports icons instead of numbers when provided.
 * Used in multi-step forms like the daily check-in.
 *
 * @example
 * ```tsx
 * // With numbers
 * <StepIndicator
 *   totalSteps={4}
 *   currentStep={2}
 *   labels={['Humeur', 'Sommeil', 'Médication', 'Contexte']}
 * />
 *
 * // With icons
 * <StepIndicator
 *   totalSteps={4}
 *   currentStep={2}
 *   icons={[Brain, Moon, Pill, MessageSquare]}
 * />
 * ```
 */
export function StepIndicator({
  totalSteps,
  currentStep,
  labels,
  icons,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const StepIcon = icons?.[index];

        return (
          <div key={stepNumber} className="flex flex-1 items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent &&
                    "bg-primary text-primary-foreground ring-primary/20 ring-4",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-border text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : StepIcon ? (
                  <StepIcon className="size-5" />
                ) : (
                  stepNumber
                )}
              </div>
              {labels?.[index] && (
                <span
                  className={cn(
                    "text-xs",
                    isCurrent
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {labels[index]}
                </span>
              )}
            </div>

            {/* Connector line */}
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  stepNumber < currentStep ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export type PeriodSelectorProps = {
  /** Currently selected period */
  value: "7" | "30" | "90";
  /** Callback when period changes */
  onChange: (value: "7" | "30" | "90") => void;
  /** Labels for each period (defaults to French) */
  labels?: {
    "7": string;
    "30": string;
    "90": string;
  };
  /** Additional CSS classes */
  className?: string;
};

/**
 * PeriodSelector Component
 *
 * Tabs for selecting a time period (7, 30, or 90 days).
 * Used in timeline and trend views.
 *
 * @example
 * ```tsx
 * <PeriodSelector
 *   value={period}
 *   onChange={setPeriod}
 * />
 * ```
 */
export function PeriodSelector({
  value,
  onChange,
  labels = { "7": "7 jours", "30": "30 jours", "90": "90 jours" },
  className,
}: PeriodSelectorProps) {
  const periods: ("7" | "30" | "90")[] = ["7", "30", "90"];

  return (
    <div
      className={cn("bg-muted inline-flex rounded-lg p-1", className)}
      role="tablist"
    >
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          role="tab"
          aria-selected={value === period}
          onClick={() => onChange(period)}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-all",
            "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
            value === period
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {labels[period]}
        </button>
      ))}
    </div>
  );
}
