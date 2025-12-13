"use client";

import type { MoodEntry } from "@/generated/prisma";
import { MoodIndicator } from "@/components/nowts/mood-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MoodValue } from "@/lib/design-tokens";
import { Battery, BedDouble, Brain, Calendar, History } from "lucide-react";

type MoodHistoryListProps = {
  entries: MoodEntry[];
};

export function MoodHistoryList({ entries }: MoodHistoryListProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="text-primary size-5" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Aucune entree pour le moment. Commencez a suivre votre humeur pour
            voir votre historique.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="text-primary size-5" />
          Historique ({entries.length} entrees)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {entries.map((entry) => (
          <MoodHistoryItem key={entry.id} entry={entry} />
        ))}
      </CardContent>
    </Card>
  );
}

function MoodHistoryItem({ entry }: { entry: MoodEntry }) {
  const formattedDate = new Date(entry.date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <MoodIndicator value={entry.mood as MoodValue} size="lg" />

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground size-3" />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>

        <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
          {entry.energy !== null && (
            <span className="flex items-center gap-1">
              <Battery className="size-3" />
              Energie: {entry.energy}/10
            </span>
          )}
          {entry.sleepHours !== null && (
            <span className="flex items-center gap-1">
              <BedDouble className="size-3" />
              {entry.sleepHours}h
            </span>
          )}
          {entry.anxiety !== null && (
            <span className="flex items-center gap-1">
              <Brain className="size-3" />
              Anxiete: {entry.anxiety}/10
            </span>
          )}
        </div>

        {entry.notes && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs italic">
            "{entry.notes}"
          </p>
        )}
      </div>
    </div>
  );
}
