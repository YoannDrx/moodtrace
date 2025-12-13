"use client";

import { cn } from "@/lib/utils";
import {
  contextTags,
  contextTagLabels,
  sideEffects,
  sideEffectLabels,
  type ContextTag,
  type SideEffect,
} from "@/lib/design-tokens";

export type TagSelectorProps<T extends string> = {
  /** Label displayed above the tags */
  label?: string;
  /** Available tags to select from */
  tags: readonly T[];
  /** Currently selected tags */
  selectedTags: T[];
  /** Callback when selection changes */
  onChange: (tags: T[]) => void;
  /** Labels for each tag (key -> display label) */
  tagLabels?: Record<T, string>;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
};

/**
 * TagSelector Component
 *
 * Multi-select tag picker with toggle behavior.
 * Tags wrap to multiple lines and have a pill-like appearance.
 *
 * @example
 * ```tsx
 * // Generic usage
 * <TagSelector
 *   label="Contexte de la journée"
 *   tags={['work', 'exercise', 'social']}
 *   selectedTags={selected}
 *   onChange={setSelected}
 *   tagLabels={{ work: 'Travail', exercise: 'Sport', social: 'Social' }}
 * />
 * ```
 */
export function TagSelector<T extends string>({
  label,
  tags,
  selectedTags,
  onChange,
  tagLabels,
  disabled = false,
  className,
}: TagSelectorProps<T>) {
  const toggleTag = (tag: T) => {
    if (disabled) return;

    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const getLabel = (tag: T): string => {
    if (tagLabels && tag in tagLabels) {
      return tagLabels[tag];
    }
    // Fallback: capitalize and replace underscores
    return tag.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-foreground text-sm font-medium">{label}</span>
      )}
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {getLabel(tag)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ContextTagsSelector Component
 *
 * Pre-configured TagSelector for daily context tags.
 * Uses the MoodTrace design system context tags.
 *
 * @example
 * ```tsx
 * <ContextTagsSelector
 *   selectedTags={contextTags}
 *   onChange={setContextTags}
 * />
 * ```
 */
export function ContextTagsSelector({
  selectedTags,
  onChange,
  disabled = false,
  className,
}: {
  selectedTags: ContextTag[];
  onChange: (tags: ContextTag[]) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <TagSelector
      label="Contexte de la journée"
      tags={contextTags}
      selectedTags={selectedTags}
      onChange={onChange}
      tagLabels={contextTagLabels}
      disabled={disabled}
      className={className}
    />
  );
}

/**
 * SideEffectsSelector Component
 *
 * Pre-configured TagSelector for medication side effects.
 * Uses the MoodTrace design system side effects.
 *
 * @example
 * ```tsx
 * <SideEffectsSelector
 *   selectedTags={sideEffectTags}
 *   onChange={setSideEffectTags}
 * />
 * ```
 */
export function SideEffectsSelector({
  selectedTags,
  onChange,
  disabled = false,
  className,
}: {
  selectedTags: SideEffect[];
  onChange: (tags: SideEffect[]) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <TagSelector
      label="Effets secondaires ressentis"
      tags={sideEffects}
      selectedTags={selectedTags}
      onChange={onChange}
      tagLabels={sideEffectLabels}
      disabled={disabled}
      className={className}
    />
  );
}
