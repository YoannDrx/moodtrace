"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export type SliderInputProps = {
  /** Label displayed above the slider */
  label: string;
  /** Current value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 10) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Unit to display after the value (e.g., "h" for hours) */
  unit?: string;
  /** Show min/max labels below the slider */
  showLabels?: { min: string; max: string };
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** ID for the input (auto-generated if not provided) */
  id?: string;
};

/**
 * SliderInput Component
 *
 * A customized slider input with label, value display, and optional min/max labels.
 * Styled to match the MoodTrace design system.
 *
 * @example
 * ```tsx
 * // Energy slider
 * <SliderInput
 *   label="Niveau d'énergie"
 *   value={energy}
 *   onChange={setEnergy}
 *   min={0}
 *   max={10}
 *   showLabels={{ min: "Épuisé", max: "Très énergique" }}
 * />
 *
 * // Sleep hours slider
 * <SliderInput
 *   label="Heures de sommeil"
 *   value={sleepHours}
 *   onChange={setSleepHours}
 *   min={0}
 *   max={14}
 *   unit="h"
 *   showLabels={{ min: "0h", max: "14h" }}
 * />
 * ```
 */
export function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  unit = "",
  showLabels,
  disabled = false,
  className,
  id,
}: SliderInputProps) {
  const inputId = id ?? `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
        <span className="text-primary text-sm font-semibold">
          {value}
          {unit}
        </span>
      </div>

      <div className="relative">
        <input
          type="range"
          id={inputId}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            "slider-input h-2 w-full cursor-pointer appearance-none rounded-full",
            "bg-muted focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
            "[&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110",
          )}
          style={{
            background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--muted) ${percentage}%, var(--muted) 100%)`,
          }}
        />
      </div>

      {showLabels && (
        <div className="flex justify-between">
          <span className="text-muted-foreground text-xs">
            {showLabels.min}
          </span>
          <span className="text-muted-foreground text-xs">
            {showLabels.max}
          </span>
        </div>
      )}
    </div>
  );
}

export type QualitySelectorProps = {
  /** Current selected quality */
  value: "bad" | "average" | "good" | null;
  /** Callback when quality changes */
  onChange: (value: "bad" | "average" | "good") => void;
  /** Custom labels (defaults to French) */
  labels?: {
    bad: string;
    average: string;
    good: string;
  };
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
};

/**
 * QualitySelector Component
 *
 * Three-option selector for quality ratings (bad/average/good).
 * Used for sleep quality and similar inputs.
 *
 * @example
 * ```tsx
 * <QualitySelector
 *   value={sleepQuality}
 *   onChange={setSleepQuality}
 * />
 * ```
 */
export function QualitySelector({
  value,
  onChange,
  labels = { bad: "Mauvais", average: "Moyen", good: "Bon" },
  disabled = false,
  className,
}: QualitySelectorProps) {
  const options: { key: "bad" | "average" | "good"; label: string }[] = [
    { key: "bad", label: labels.bad },
    { key: "average", label: labels.average },
    { key: "good", label: labels.good },
  ];

  return (
    <div
      className={cn("flex gap-2", className)}
      role="radiogroup"
      aria-label="Sélectionnez la qualité"
    >
      {options.map((option) => {
        const isSelected = value === option.key;

        return (
          <button
            key={option.key}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(option.key)}
            className={cn(
              "flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all",
              "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
