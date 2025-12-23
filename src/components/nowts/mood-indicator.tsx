import { cn } from "@/lib/utils";
import { type MoodValue, moodLabels } from "@/lib/design-tokens";
import { cva, type VariantProps } from "class-variance-authority";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Re-export MoodValue for convenience
export type { MoodValue };

/**
 * MoodIndicator Variants
 *
 * Visual indicator for mood values (1-10 scale).
 * Uses the MoodTrace design system mood colors.
 */
const moodIndicatorVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold text-white transition-all",
  {
    variants: {
      mood: {
        1: "bg-mood-1",
        2: "bg-mood-2",
        3: "bg-mood-3",
        4: "bg-mood-4",
        5: "bg-mood-5",
        6: "bg-mood-6",
        7: "bg-mood-7",
        8: "bg-mood-8",
        9: "bg-mood-9",
        10: "bg-mood-10",
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
      // Outline variants - use border color instead of background
      { mood: 1, variant: "outline", className: "border-mood-1 text-mood-1" },
      { mood: 2, variant: "outline", className: "border-mood-2 text-mood-2" },
      { mood: 3, variant: "outline", className: "border-mood-3 text-mood-3" },
      { mood: 4, variant: "outline", className: "border-mood-4 text-mood-4" },
      { mood: 5, variant: "outline", className: "border-mood-5 text-mood-5" },
      { mood: 6, variant: "outline", className: "border-mood-6 text-mood-6" },
      { mood: 7, variant: "outline", className: "border-mood-7 text-mood-7" },
      { mood: 8, variant: "outline", className: "border-mood-8 text-mood-8" },
      { mood: 9, variant: "outline", className: "border-mood-9 text-mood-9" },
      {
        mood: 10,
        variant: "outline",
        className: "border-mood-10 text-mood-10",
      },
      // Ghost variants - subtle background
      { mood: 1, variant: "ghost", className: "bg-mood-1/20 text-mood-1" },
      { mood: 2, variant: "ghost", className: "bg-mood-2/20 text-mood-2" },
      { mood: 3, variant: "ghost", className: "bg-mood-3/20 text-mood-3" },
      { mood: 4, variant: "ghost", className: "bg-mood-4/20 text-mood-4" },
      { mood: 5, variant: "ghost", className: "bg-mood-5/20 text-mood-5" },
      { mood: 6, variant: "ghost", className: "bg-mood-6/20 text-mood-6" },
      { mood: 7, variant: "ghost", className: "bg-mood-7/20 text-mood-7" },
      { mood: 8, variant: "ghost", className: "bg-mood-8/20 text-mood-8" },
      { mood: 9, variant: "ghost", className: "bg-mood-9/20 text-mood-9" },
      { mood: 10, variant: "ghost", className: "bg-mood-10/20 text-mood-10" },
    ],
    defaultVariants: {
      mood: 5,
      size: "md",
      variant: "default",
    },
  },
);

export type MoodIndicatorProps = Omit<
  VariantProps<typeof moodIndicatorVariants>,
  "mood"
> & {
  /** Mood value from 1 to 10 */
  value: MoodValue;
  /** Additional CSS classes */
  className?: string;
  /** Show tooltip with mood label on hover */
  showTooltip?: boolean;
  /** Custom aria-label (defaults to mood label) */
  "aria-label"?: string;
};

/**
 * MoodIndicator Component
 *
 * Displays a mood value (1-10) as a colored circular indicator.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MoodIndicator value={7} />
 *
 * // Different sizes
 * <MoodIndicator value={5} size="sm" />
 * <MoodIndicator value={8} size="xl" />
 *
 * // Outline variant
 * <MoodIndicator value={6} variant="outline" />
 *
 * // With tooltip
 * <MoodIndicator value={9} showTooltip />
 * ```
 */
export function MoodIndicator({
  value,
  size,
  variant,
  className,
  showTooltip = false,
  "aria-label": ariaLabel,
}: MoodIndicatorProps) {
  const label = ariaLabel ?? moodLabels[value];

  const indicator = (
    <span
      className={cn(
        moodIndicatorVariants({ mood: value, size, variant }),
        className,
      )}
      role="img"
      aria-label={label}
    >
      {value}
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
 * MoodIndicatorBar Component
 *
 * Displays a horizontal bar showing mood progression.
 *
 * @example
 * ```tsx
 * <MoodIndicatorBar value={7} />
 * ```
 */
export function MoodIndicatorBar({
  value,
  className,
  showValue = true,
}: {
  value: MoodValue;
  className?: string;
  showValue?: boolean;
}) {
  const percentage = (value / 10) * 100;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-muted relative h-2 flex-1 overflow-hidden rounded-full">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
            `bg-mood-${value}`,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <MoodIndicator value={value} size="sm" className="shrink-0" />
      )}
    </div>
  );
}

/**
 * MoodScale Component
 *
 * Interactive mood selection scale from 1 to 10.
 *
 * @example
 * ```tsx
 * const [mood, setMood] = useState<MoodValue>(5);
 * <MoodScale value={mood} onChange={setMood} />
 * ```
 */
export function MoodScale({
  value,
  onChange,
  className,
  disabled = false,
}: {
  value: MoodValue;
  onChange?: (value: MoodValue) => void;
  className?: string;
  disabled?: boolean;
}) {
  const moodValues: MoodValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div
      className={cn("flex items-center justify-between gap-1", className)}
      role="radiogroup"
      aria-label="Sélectionnez votre humeur"
    >
      {moodValues.map((moodValue) => (
        <button
          key={moodValue}
          type="button"
          role="radio"
          aria-checked={value === moodValue}
          aria-label={moodLabels[moodValue]}
          disabled={disabled}
          onClick={() => onChange?.(moodValue)}
          className={cn(
            "relative flex size-8 items-center justify-center rounded-full text-xs font-medium transition-all",
            "focus:ring-ring hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            value === moodValue
              ? `bg-mood-${moodValue} text-white shadow-md`
              : "bg-muted text-muted-foreground hover:bg-muted/80",
          )}
        >
          {moodValue}
        </button>
      ))}
    </div>
  );
}
