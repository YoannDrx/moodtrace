import { cn } from "@/lib/utils";

type MoodTraceLogoProps = {
  className?: string;
  /** Show text alongside the icon */
  showText?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  xl: "h-12",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

/**
 * MoodTrace Logo Icon
 *
 * SVG logo representing a mood tracking chart with a heart/pulse line.
 * Uses the primary teal color from the design system.
 *
 * @example
 * ```tsx
 * // Icon only
 * <MoodTraceLogoIcon className="h-8" />
 *
 * // With text
 * <MoodTraceLogo showText size="lg" />
 * ```
 */
export function MoodTraceLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-label="MoodTrace Logo"
    >
      {/* Background circle - subtle */}
      <circle cx="24" cy="24" r="22" className="fill-primary/10" />

      {/* Mood chart line - ascending wave */}
      <path
        d="M8 32 L14 28 L20 30 L26 22 L32 18 L38 14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Heart pulse spike */}
      <path
        d="M20 30 L22 26 L24 34 L26 22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Dots at data points */}
      <circle cx="8" cy="32" r="2.5" fill="currentColor" />
      <circle cx="14" cy="28" r="2.5" fill="currentColor" />
      <circle cx="32" cy="18" r="2.5" fill="currentColor" />
      <circle cx="38" cy="14" r="2.5" fill="currentColor" />

      {/* Central dot - emphasis */}
      <circle cx="24" cy="34" r="3" className="fill-secondary" />
    </svg>
  );
}

/**
 * MoodTrace Full Logo
 *
 * Complete logo with icon and text.
 *
 * @example
 * ```tsx
 * <MoodTraceLogo size="lg" />
 * <MoodTraceLogo showText={false} size="md" />
 * ```
 */
export function MoodTraceLogo({
  className,
  showText = true,
  size = "md",
}: MoodTraceLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <MoodTraceLogoIcon className={sizeClasses[size]} />
      {showText && (
        <span
          className={cn(
            "text-foreground font-semibold tracking-tight",
            textSizeClasses[size],
          )}
        >
          Mood<span className="text-primary">Trace</span>
        </span>
      )}
    </div>
  );
}

/**
 * MoodTrace Favicon/App Icon
 *
 * Simplified version for small contexts like favicons.
 *
 * @example
 * ```tsx
 * <MoodTraceAppIcon className="size-8" />
 * ```
 */
export function MoodTraceAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-label="MoodTrace"
    >
      {/* Rounded square background */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="6"
        className="fill-primary"
      />

      {/* Simplified chart line */}
      <path
        d="M6 22 L10 18 L14 20 L18 14 L22 12 L26 10"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Heart pulse */}
      <path
        d="M14 20 L16 16 L18 24 L20 14"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
