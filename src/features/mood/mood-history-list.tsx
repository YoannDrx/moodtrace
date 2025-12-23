import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { MoodEntry } from "@/generated/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodIndicatorBipolar } from "@/components/nowts/mood-slider-bipolar";
import type { MoodValueBipolar } from "@/lib/design-tokens";
import { Battery, Moon, Brain } from "lucide-react";

type MoodHistoryListProps = {
  entries: MoodEntry[];
  title?: string;
};

export function MoodHistoryList({
  entries,
  title = "Historique récent",
}: MoodHistoryListProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Aucune entrée pour le moment. Commencez par enregistrer votre
            humeur.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-4 rounded-lg border p-3"
          >
            <MoodIndicatorBipolar
              value={entry.mood as MoodValueBipolar}
              size="lg"
              showTooltip
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {format(new Date(entry.date), "EEEE d MMMM", { locale: fr })}
                </p>
                <span className="text-muted-foreground text-sm">
                  {entry.mood > 0 ? `+${entry.mood}` : entry.mood}
                </span>
              </div>

              {/* Metrics row */}
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                {entry.energy !== null && (
                  <span className="flex items-center gap-1">
                    <Battery className="size-3" />
                    {entry.energy}/10
                  </span>
                )}
                {entry.sleepHours !== null && (
                  <span className="flex items-center gap-1">
                    <Moon className="size-3" />
                    {entry.sleepHours}h
                  </span>
                )}
                {entry.anxiety !== null && (
                  <span className="flex items-center gap-1">
                    <Brain className="size-3" />
                    Anxiété: {entry.anxiety}/10
                  </span>
                )}
              </div>

              {/* Notes */}
              {entry.notes && (
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm italic">
                  {entry.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
