"use client";

import { cn } from "@/lib/utils";
import {
  type MoodValueBipolar,
  moodBipolarLabels,
  getMoodBipolarColor,
} from "@/lib/design-tokens";
import { cva, type VariantProps } from "class-variance-authority";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Re-export MoodValueBipolar for convenience
export type { MoodValueBipolar };

/**
 * MoodIndicatorBipolar Variants
 *
 * Visual indicator for bipolar mood values (-3 to +3 scale).
 */
const moodIndicatorBipolarVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold text-white transition-all",
  {
    variants: {
      mood: {
        "-3": "bg-mood-bipolar-minus-3",
        "-2": "bg-mood-bipolar-minus-2",
        "-1": "bg-mood-bipolar-minus-1",
        "0": "bg-mood-bipolar-0",
        "1": "bg-mood-bipolar-plus-1",
        "2": "bg-mood-bipolar-plus-2",
        "3": "bg-mood-bipolar-plus-3",
      },
      size: {
        xs: "size-5 text-[10px]",
        sm: "size-6 text-xs",
        md: "size-8 text-sm",
        lg: "size-10 text-base",
        xl: "size-12 text-lg",
        "2xl": "size-16 text-xl",
      },
      variant: {
        default: "",
        outline: "bg-transparent border-2",
        ghost: "bg-opacity-20",
      },
    },
    compoundVariants: [
      // Outline variants
      {
        mood: "-3",
        variant: "outline",
        className: "border-mood-bipolar-minus-3 text-mood-bipolar-minus-3",
      },
      {
        mood: "-2",
        variant: "outline",
        className: "border-mood-bipolar-minus-2 text-mood-bipolar-minus-2",
      },
      {
        mood: "-1",
        variant: "outline",
        className: "border-mood-bipolar-minus-1 text-mood-bipolar-minus-1",
      },
      {
        mood: "0",
        variant: "outline",
        className: "border-mood-bipolar-0 text-mood-bipolar-0",
      },
      {
        mood: "1",
        variant: "outline",
        className: "border-mood-bipolar-plus-1 text-mood-bipolar-plus-1",
      },
      {
        mood: "2",
        variant: "outline",
        className: "border-mood-bipolar-plus-2 text-mood-bipolar-plus-2",
      },
      {
        mood: "3",
        variant: "outline",
        className: "border-mood-bipolar-plus-3 text-mood-bipolar-plus-3",
      },
      // Ghost variants
      {
        mood: "-3",
        variant: "ghost",
        className: "bg-mood-bipolar-minus-3/20 text-mood-bipolar-minus-3",
      },
      {
        mood: "-2",
        variant: "ghost",
        className: "bg-mood-bipolar-minus-2/20 text-mood-bipolar-minus-2",
      },
      {
        mood: "-1",
        variant: "ghost",
        className: "bg-mood-bipolar-minus-1/20 text-mood-bipolar-minus-1",
      },
      {
        mood: "0",
        variant: "ghost",
        className: "bg-mood-bipolar-0/20 text-mood-bipolar-0",
      },
      {
        mood: "1",
        variant: "ghost",
        className: "bg-mood-bipolar-plus-1/20 text-mood-bipolar-plus-1",
      },
      {
        mood: "2",
        variant: "ghost",
        className: "bg-mood-bipolar-plus-2/20 text-mood-bipolar-plus-2",
      },
      {
        mood: "3",
        variant: "ghost",
        className: "bg-mood-bipolar-plus-3/20 text-mood-bipolar-plus-3",
      },
    ],
    defaultVariants: {
      mood: "0",
      size: "md",
      variant: "default",
    },
  },
);

export type MoodIndicatorBipolarProps = Omit<
  VariantProps<typeof moodIndicatorBipolarVariants>,
  "mood"
> & {
  /** Mood value from -3 to +3 */
  value: MoodValueBipolar;
  /** Additional CSS classes */
  className?: string;
  /** Show tooltip with mood label on hover */
  showTooltip?: boolean;
  /** Custom aria-label (defaults to mood label) */
  "aria-label"?: string;
};

/**
 * MoodIndicatorBipolar Component
 *
 * Displays a bipolar mood value (-3 to +3) as a colored circular indicator.
 *
 * @example
 * ```tsx
 * <MoodIndicatorBipolar value={0} />
 * <MoodIndicatorBipolar value={-2} size="lg" />
 * <MoodIndicatorBipolar value={2} variant="outline" />
 * ```
 */
export function MoodIndicatorBipolar({
  value,
  size,
  variant,
  className,
  showTooltip = false,
  "aria-label": ariaLabel,
}: MoodIndicatorBipolarProps) {
  const label = ariaLabel ?? moodBipolarLabels[value];
  const displayValue = value > 0 ? `+${value}` : String(value);

  const indicator = (
    <span
      className={cn(
        moodIndicatorBipolarVariants({
          mood: String(value) as "-3" | "-2" | "-1" | "0" | "1" | "2" | "3",
          size,
          variant,
        }),
        className,
      )}
      role="img"
      aria-label={label}
    >
      {displayValue}
    </span>
  );

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{indicator}</TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return indicator;
}

/**
 * MoodSliderBipolar Component
 *
 * Interactive mood selection scale from -3 to +3.
 * Designed for bipolar mood tracking with a stable center (0).
 *
 * @example
 * ```tsx
 * const [mood, setMood] = useState<MoodValueBipolar>(0);
 * <MoodSliderBipolar value={mood} onChange={setMood} />
 * ```
 */
export function MoodSliderBipolar({
  value,
  onChange,
  className,
  disabled = false,
  showLabels = true,
}: {
  value: MoodValueBipolar;
  onChange?: (value: MoodValueBipolar) => void;
  className?: string;
  disabled?: boolean;
  showLabels?: boolean;
}) {
  const moodValues: MoodValueBipolar[] = [-3, -2, -1, 0, 1, 2, 3];

  const getMoodButtonClass = (moodValue: MoodValueBipolar) => {
    const isSelected = value === moodValue;
    const baseClass =
      "relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-all focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

    if (isSelected) {
      return cn(baseClass, "text-white shadow-lg scale-110", "hover:scale-115");
    }

    return cn(
      baseClass,
      "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105",
    );
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className="flex items-center justify-between gap-2"
        role="radiogroup"
        aria-label="Sélectionnez votre humeur"
      >
        {moodValues.map((moodValue) => {
          const displayValue =
            moodValue > 0 ? `+${moodValue}` : String(moodValue);
          const isSelected = value === moodValue;

          return (
            <button
              key={moodValue}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={moodBipolarLabels[moodValue]}
              disabled={disabled}
              onClick={() => onChange?.(moodValue)}
              className={getMoodButtonClass(moodValue)}
              style={
                isSelected
                  ? { backgroundColor: getMoodBipolarColor(moodValue) }
                  : undefined
              }
            >
              {displayValue}
            </button>
          );
        })}
      </div>
      {showLabels && (
        <div className="flex justify-between px-1">
          <span className="text-muted-foreground text-xs">Très bas</span>
          <span className="text-muted-foreground text-xs">Stable</span>
          <span className="text-muted-foreground text-xs">Très élevé</span>
        </div>
      )}
    </div>
  );
}

/**
 * WeekMoodViewBipolar Component
 *
 * Displays a week of mood values as colored dots.
 *
 * @example
 * ```tsx
 * const weekMoods = [
 *   { day: 'Lun', mood: -1 },
 *   { day: 'Mar', mood: 0 },
 *   // ...
 * ];
 * <WeekMoodViewBipolar data={weekMoods} />
 * ```
 */
export function WeekMoodViewBipolar({
  data,
  className,
}: {
  data: {
    day: string;
    mood: MoodValueBipolar | null;
  }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        {data.map((entry, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "size-10 rounded-full transition-all",
                entry.mood !== null
                  ? "shadow-sm"
                  : "bg-muted border-muted-foreground/30 border-2 border-dashed",
              )}
              style={
                entry.mood !== null
                  ? { backgroundColor: getMoodBipolarColor(entry.mood) }
                  : undefined
              }
            />
            <span className="text-muted-foreground text-xs">{entry.day}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-1">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: getMoodBipolarColor(-3) }}
          />
          <span className="text-muted-foreground text-xs">Bas</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: getMoodBipolarColor(0) }}
          />
          <span className="text-muted-foreground text-xs">Stable</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: getMoodBipolarColor(3) }}
          />
          <span className="text-muted-foreground text-xs">Élevé</span>
        </div>
      </div>
    </div>
  );
}
