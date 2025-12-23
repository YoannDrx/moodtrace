"use client";

import { cn } from "@/lib/utils";
import {
  type MoodValueBipolar,
  getMoodBipolarColor,
  moodBipolarLabels,
} from "@/lib/design-tokens";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export type TimelineEntryProps = {
  /** Date of the entry */
  date: string;
  /** Mood value (-3 to +3) */
  mood: MoodValueBipolar;
  /** Sleep information */
  sleep?: {
    hours: number;
    quality?: "bad" | "average" | "good";
  };
  /** Context tags */
  tags?: string[];
  /** Whether the entry is clickable */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
};

/**
 * TimelineEntry Component
 *
 * Displays a single mood entry in a timeline list.
 * Shows mood indicator, date, sleep info, and tags.
 *
 * @example
 * ```tsx
 * <TimelineEntry
 *   date="lundi 15 janvier"
 *   mood={2}
 *   sleep={{ hours: 7.5 }}
 *   tags={['Sport']}
 *   onClick={() => openEntry(id)}
 * />
 * ```
 */
export function TimelineEntry({
  date,
  mood,
  sleep,
  tags,
  onClick,
  className,
}: TimelineEntryProps) {
  const displayMood = mood > 0 ? `+${mood}` : String(mood);
  const moodLabel = moodBipolarLabels[mood];

  return (
    <Card
      className={cn(
        "transition-all",
        onClick && "cursor-pointer hover:shadow-md",
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        {/* Mood indicator */}
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm"
          style={{ backgroundColor: getMoodBipolarColor(mood) }}
        >
          {displayMood}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-foreground font-medium">{date}</span>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>{moodLabel}</span>
            {sleep && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <span>{sleep.hours}h sommeil</span>
              </>
            )}
          </div>
          {tags && tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Arrow */}
        {onClick && (
          <ChevronRight className="text-muted-foreground size-5 shrink-0" />
        )}
      </CardContent>
    </Card>
  );
}

export type MoodChartData = {
  date: string;
  mood: MoodValueBipolar | null;
};

export type MoodChartProps = {
  /** Chart data points */
  data: MoodChartData[];
  /** Chart height in pixels */
  height?: number;
  /** Additional CSS classes */
  className?: string;
};

/**
 * MoodChart Component
 *
 * Simple bar chart showing mood evolution over time.
 * Each bar is colored based on the mood value.
 *
 * @example
 * ```tsx
 * <MoodChart
 *   data={[
 *     { date: '15', mood: 2 },
 *     { date: '14', mood: 1 },
 *     { date: '13', mood: 0 },
 *   ]}
 * />
 * ```
 */
export function MoodChart({ data, height = 150, className }: MoodChartProps) {
  // Map mood (-3 to +3) to height percentage (0 to 100)
  const getBarHeight = (mood: MoodValueBipolar) => {
    // Convert -3 to +3 to 0 to 100
    return ((mood + 3) / 6) * 100;
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className="bg-muted/50 flex items-end justify-between gap-1 rounded-lg p-4"
        style={{ height }}
      >
        {data.map((entry, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-1">
            {entry.mood !== null ? (
              <div
                className="w-full max-w-8 rounded-t-sm transition-all"
                style={{
                  height: `${getBarHeight(entry.mood)}%`,
                  backgroundColor: getMoodBipolarColor(entry.mood),
                  minHeight: "8px",
                }}
              />
            ) : (
              <div className="bg-muted h-2 w-full max-w-8 rounded-t-sm" />
            )}
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between px-4">
        {data.map((entry, index) => (
          <span
            key={index}
            className="text-muted-foreground flex-1 text-center text-xs"
          >
            {entry.date}
          </span>
        ))}
      </div>

      {/* Y-axis legend */}
      <div className="flex justify-between px-4">
        <span className="text-muted-foreground text-xs">Très bas (-3)</span>
        <span className="text-muted-foreground text-xs">Stable (0)</span>
        <span className="text-muted-foreground text-xs">Très élevé (+3)</span>
      </div>
    </div>
  );
}
