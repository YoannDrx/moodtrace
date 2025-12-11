import { cn } from "@/lib/utils";

interface TagSelectorProps {
  label: string;
  tags: readonly string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  tagLabels?: Record<string, string>;
}

const defaultTagLabels: Record<string, string> = {
  conflit: "Conflit",
  stress_pro: "Stress pro",
  alcool: "Alcool",
  soiree_tardive: "Soirée tardive",
  voyage: "Voyage",
  sport: "Sport",
  meditation: "Méditation",
  rdv_medical: "RDV médical",
  fatigue: "Fatigue",
  anxiete: "Anxiété",
  parle_vite: "Parle vite",
  isolement: "Isolement",
  achats_impulsifs: "Achats impulsifs",
  agitation: "Agitation",
  irritabilite: "Irritabilité",
  euphorie: "Euphorie",
  pleurs: "Pleurs",
  confusion: "Confusion",
};

export function TagSelector({
  label,
  tags,
  selectedTags,
  onChange,
  tagLabels = defaultTagLabels,
}: TagSelectorProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              selectedTags.includes(tag)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tagLabels[tag] || tag}
          </button>
        ))}
      </div>
    </div>
  );
}
