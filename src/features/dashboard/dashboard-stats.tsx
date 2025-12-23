import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoodIndicatorBipolar } from "@/components/nowts/mood-slider-bipolar";
import type { MoodValueBipolar } from "@/lib/design-tokens";
import { Calendar, Flame, TrendingUp, Pill } from "lucide-react";

type DashboardStatsProps = {
  averageMood: number | null;
  streak: number;
  entriesCount: number;
  adherenceRate: number;
};

export function DashboardStats({
  averageMood,
  streak,
  entriesCount,
  adherenceRate,
}: DashboardStatsProps) {
  // Clamp averageMood to bipolar scale
  const displayMood =
    averageMood !== null
      ? (Math.max(-3, Math.min(3, Math.round(averageMood))) as MoodValueBipolar)
      : null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Average Mood */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Humeur moyenne</CardTitle>
          <TrendingUp className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {displayMood !== null ? (
              <>
                <MoodIndicatorBipolar value={displayMood} size="lg" />
                <span className="text-2xl font-bold">
                  {averageMood !== null && averageMood > 0 ? "+" : ""}
                  {averageMood?.toFixed(1)}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground text-sm">
                Pas encore de données
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">Sur 30 jours</p>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Série actuelle</CardTitle>
          <Flame className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {streak} jour{streak !== 1 ? "s" : ""}
          </div>
          <p className="text-muted-foreground text-xs">
            {streak > 0 ? "Continuez comme ça !" : "Commencez aujourd'hui"}
          </p>
        </CardContent>
      </Card>

      {/* Entries Count */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entrées totales</CardTitle>
          <Calendar className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{entriesCount}</div>
          <p className="text-muted-foreground text-xs">Ce mois-ci</p>
        </CardContent>
      </Card>

      {/* Medication Adherence */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Observance</CardTitle>
          <Pill className="text-muted-foreground size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{adherenceRate}%</div>
          <p className="text-muted-foreground text-xs">Médicaments pris</p>
        </CardContent>
      </Card>
    </div>
  );
}
