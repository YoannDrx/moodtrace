"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { MoodEntry } from "@/generated/prisma";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type MoodTrendChartProps = {
  entries: MoodEntry[];
  days?: number;
};

const chartConfig = {
  mood: {
    label: "Humeur",
    color: "var(--color-primary)",
  },
  energy: {
    label: "Energie",
    color: "var(--chart-2)",
  },
  anxiety: {
    label: "Anxiete",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function MoodTrendChart({ entries, days = 30 }: MoodTrendChartProps) {
  // Prepare chart data - sort by date ascending
  const chartData = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      }),
      mood: entry.mood,
      energy: entry.energy,
      anxiety: entry.anxiety,
    }));

  // Calculate trend
  const recentEntries = entries.slice(0, Math.min(7, entries.length));
  const olderEntries = entries.slice(7, Math.min(14, entries.length));

  const recentAvg =
    recentEntries.length > 0
      ? recentEntries.reduce((sum, e) => sum + e.mood, 0) / recentEntries.length
      : 0;

  const olderAvg =
    olderEntries.length > 0
      ? olderEntries.reduce((sum, e) => sum + e.mood, 0) / olderEntries.length
      : recentAvg;

  const trendPercent =
    olderAvg > 0 ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100) : 0;

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolution de l'humeur</CardTitle>
          <CardDescription>
            Pas encore de donnees. Commencez a enregistrer votre humeur.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Aucune donnee disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-primary size-5" />
          Evolution de l'humeur
        </CardTitle>
        <CardDescription>Vos {days} derniers jours d'humeur</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-64 w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 12, top: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[1, 10]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={[1, 5, 10]}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={(props) => <ChartTooltipContent {...props} />}
            />
            <defs>
              <linearGradient id="fillMood" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="mood"
              type="monotone"
              fill="url(#fillMood)"
              fillOpacity={0.4}
              stroke="var(--color-primary)"
              strokeWidth={2}
              name="Humeur"
            />
          </AreaChart>
        </ChartContainer>
        {trendPercent !== 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp
              className={`size-4 ${trendPercent > 0 ? "text-green-500" : "rotate-180 text-red-500"}`}
            />
            <span
              className={trendPercent > 0 ? "text-green-600" : "text-red-600"}
            >
              {trendPercent > 0 ? "+" : ""}
              {trendPercent}% cette semaine
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
