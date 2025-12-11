import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for demo
const mockCheckins = [
  { date: "2024-01-15", mood: 2, energy: 7, anxiety: 3, sleep: 7.5, tags: ["sport"] },
  { date: "2024-01-14", mood: 1, energy: 6, anxiety: 4, sleep: 6, tags: [] },
  { date: "2024-01-13", mood: 0, energy: 5, anxiety: 5, sleep: 7, tags: ["stress_pro"] },
  { date: "2024-01-12", mood: -1, energy: 4, anxiety: 6, sleep: 5.5, tags: ["conflit"] },
  { date: "2024-01-11", mood: 0, energy: 5, anxiety: 4, sleep: 7, tags: [] },
  { date: "2024-01-10", mood: 1, energy: 6, anxiety: 3, sleep: 8, tags: ["meditation"] },
  { date: "2024-01-09", mood: 2, energy: 7, anxiety: 2, sleep: 7.5, tags: ["sport"] },
];

const getMoodColor = (mood: number) => {
  if (mood <= -2) return "bg-mood-very-low";
  if (mood === -1) return "bg-mood-low";
  if (mood === 0) return "bg-mood-stable";
  if (mood === 1) return "bg-mood-high/70";
  if (mood >= 2) return "bg-mood-high";
  return "bg-muted";
};

const getMoodLabel = (mood: number) => {
  if (mood <= -2) return "Très bas";
  if (mood === -1) return "Bas";
  if (mood === 0) return "Stable";
  if (mood === 1) return "Élevé";
  if (mood >= 2) return "Très élevé";
  return "";
};

const tagLabels: Record<string, string> = {
  conflit: "Conflit",
  stress_pro: "Stress pro",
  alcool: "Alcool",
  sport: "Sport",
  meditation: "Méditation",
};

export function Timeline() {
  const [period, setPeriod] = useState<"7" | "30" | "90">("7");

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timeline</h1>
          <p className="text-muted-foreground">Historique de vos check-ins</p>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtrer
        </Button>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg w-fit">
        {(["7", "30", "90"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              period === p
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p} jours
          </button>
        ))}
      </div>

      {/* Mood chart visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Évolution de l'humeur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-end justify-between gap-1">
            {mockCheckins.map((checkin, index) => {
              const height = ((checkin.mood + 3) / 6) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-all duration-300",
                      getMoodColor(checkin.mood)
                    )}
                    style={{ height: `${Math.max(height, 10)}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date(checkin.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Très bas (-3)</span>
            <span>Stable (0)</span>
            <span>Très élevé (+3)</span>
          </div>
        </CardContent>
      </Card>

      {/* Daily entries list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Entrées récentes</h2>
        {mockCheckins.map((checkin, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Mood indicator */}
                <div
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold",
                    getMoodColor(checkin.mood)
                  )}
                >
                  {checkin.mood > 0 ? `+${checkin.mood}` : checkin.mood}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    {new Date(checkin.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{getMoodLabel(checkin.mood)}</span>
                    <span>·</span>
                    <span>{checkin.sleep}h sommeil</span>
                  </div>
                  {checkin.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {checkin.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
                        >
                          {tagLabels[tag] || tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
