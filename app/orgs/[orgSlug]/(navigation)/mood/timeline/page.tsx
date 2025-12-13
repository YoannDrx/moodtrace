"use client";

import { useState } from "react";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { Button } from "@/components/ui/button";
import { TimelineEntry, MoodChart } from "@/components/nowts/timeline-entry";
import { PeriodSelector } from "@/components/nowts/stat-card";
import { Typography } from "@/components/nowts/typography";
import type { MoodValueBipolar } from "@/lib/design-tokens";
import { Calendar, Filter } from "lucide-react";
import { toast } from "sonner";

type Period = "7" | "30" | "90";

// Mock data for demo - in real app, fetch from API
const mockEntries = [
  {
    id: "1",
    date: "Vendredi 13 decembre",
    mood: 1 as MoodValueBipolar,
    sleep: { hours: 7.5, quality: "good" as const },
    tags: ["Travail", "Sport"],
  },
  {
    id: "2",
    date: "Jeudi 12 decembre",
    mood: 0 as MoodValueBipolar,
    sleep: { hours: 6, quality: "average" as const },
    tags: ["Travail"],
  },
  {
    id: "3",
    date: "Mercredi 11 decembre",
    mood: -1 as MoodValueBipolar,
    sleep: { hours: 5, quality: "bad" as const },
    tags: ["Stress"],
  },
  {
    id: "4",
    date: "Mardi 10 decembre",
    mood: 2 as MoodValueBipolar,
    sleep: { hours: 8, quality: "good" as const },
    tags: ["Social", "Repos"],
  },
  {
    id: "5",
    date: "Lundi 9 decembre",
    mood: 0 as MoodValueBipolar,
    sleep: { hours: 7, quality: "average" as const },
    tags: ["Travail"],
  },
  {
    id: "6",
    date: "Dimanche 8 decembre",
    mood: 1 as MoodValueBipolar,
    sleep: { hours: 9, quality: "good" as const },
    tags: ["Famille", "Repos"],
  },
  {
    id: "7",
    date: "Samedi 7 decembre",
    mood: 2 as MoodValueBipolar,
    sleep: { hours: 8.5, quality: "good" as const },
    tags: ["Social", "Fete"],
  },
];

const mockChartData = [
  { date: "7", mood: 2 as MoodValueBipolar | null },
  { date: "8", mood: 1 as MoodValueBipolar | null },
  { date: "9", mood: 0 as MoodValueBipolar | null },
  { date: "10", mood: 2 as MoodValueBipolar | null },
  { date: "11", mood: -1 as MoodValueBipolar | null },
  { date: "12", mood: 0 as MoodValueBipolar | null },
  { date: "13", mood: 1 as MoodValueBipolar | null },
];

export default function TimelinePage() {
  const [period, setPeriod] = useState<Period>("7");

  return (
    <Layout size="default">
      <LayoutHeader>
        <LayoutTitle className="flex items-center gap-2">
          <Calendar className="text-primary size-6" />
          Historique
        </LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 size-4" />
          Filtrer
        </Button>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-6">
        <Typography variant="muted">
          Consultez l'evolution de votre humeur au fil du temps.
        </Typography>

        {/* Period Selector */}
        <div className="flex justify-center">
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* Mood Chart */}
        <MoodChart data={mockChartData} height={180} />

        {/* Timeline Entries */}
        <div className="flex flex-col gap-3">
          <Typography variant="h4">Entrees recentes</Typography>
          {mockEntries.map((entry) => (
            <TimelineEntry
              key={entry.id}
              date={entry.date}
              mood={entry.mood}
              sleep={entry.sleep}
              tags={entry.tags}
              onClick={() => toast.info(`Voir entree ${entry.id}`)}
            />
          ))}
        </div>
      </LayoutContent>
    </Layout>
  );
}
