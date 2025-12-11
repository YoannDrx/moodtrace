import { cn } from "@/lib/utils";
import { MOOD_LABELS, type MoodValue } from "@/types";

interface MoodSliderProps {
  value: MoodValue;
  onChange: (value: MoodValue) => void;
  disabled?: boolean;
}

const moodColors: Record<MoodValue, string> = {
  [-3]: "bg-mood-very-low",
  [-2]: "bg-mood-low",
  [-1]: "bg-mood-low/70",
  [0]: "bg-mood-stable",
  [1]: "bg-mood-high/70",
  [2]: "bg-mood-high",
  [3]: "bg-mood-very-high",
};

export function MoodSlider({ value, onChange, disabled }: MoodSliderProps) {
  const moods: MoodValue[] = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div className="space-y-4">
      {/* Mood buttons */}
      <div className="flex items-center justify-between gap-2">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => onChange(mood)}
            disabled={disabled}
            className={cn(
              "flex-1 h-12 rounded-lg transition-all duration-200 font-medium text-sm",
              value === mood
                ? cn(moodColors[mood], "text-white shadow-md scale-105")
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {mood > 0 ? `+${mood}` : mood}
          </button>
        ))}
      </div>

      {/* Label */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Très bas</span>
        <span className={cn("font-medium", value !== 0 && "text-foreground")}>
          {MOOD_LABELS[value]}
        </span>
        <span>Très élevé</span>
      </div>
    </div>
  );
}
