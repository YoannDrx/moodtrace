import { BarChart3 } from "lucide-react";
import { Suspense } from "react";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Layout,
  LayoutHeader,
  LayoutTitle,
  LayoutContent,
  LayoutGrid,
} from "@/features/page/layout";
import { StatCard } from "@/components/nowts/stat-card";
import { WeekMoodViewBipolar } from "@/components/nowts/mood-slider-bipolar";
import { MoodHistoryList } from "@/features/mood/mood-history-list";
import { getRequiredCurrentOrg } from "@/lib/organizations/get-org";
import { getMoodEntries, getMoodStats } from "@/features/mood/mood.query";
import type { MoodValueBipolar } from "@/lib/design-tokens";
import { TrendingUp, Battery, Moon, Brain } from "lucide-react";

async function TrendsStatsLoader() {
  const org = await getRequiredCurrentOrg();
  const stats = await getMoodStats({
    userId: org.user.id,
    organizationId: org.id,
    days: 30,
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={TrendingUp}
        label="Humeur moyenne"
        value={
          stats.averageMood !== null
            ? stats.averageMood > 0
              ? `+${stats.averageMood.toFixed(1)}`
              : stats.averageMood.toFixed(1)
            : "-"
        }
        variant="primary"
      />
      <StatCard
        icon={Battery}
        label="Énergie moyenne"
        value={stats.averageEnergy?.toFixed(1) ?? "-"}
        unit="/10"
      />
      <StatCard
        icon={Moon}
        label="Sommeil moyen"
        value={stats.averageSleepHours?.toFixed(1) ?? "-"}
        unit="h"
      />
      <StatCard
        icon={Brain}
        label="Anxiété moyenne"
        value={stats.averageAnxiety?.toFixed(1) ?? "-"}
        unit="/10"
      />
    </div>
  );
}

async function WeekViewLoader() {
  const org = await getRequiredCurrentOrg();
  const today = new Date();
  const weekAgo = subDays(today, 6);

  const entries = await getMoodEntries({
    userId: org.user.id,
    organizationId: org.id,
    startDate: weekAgo,
    endDate: today,
    limit: 7,
  });

  // Build week data
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const entry = entries.find(
      (e) => format(new Date(e.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
    );
    return {
      day: format(date, "EEE", { locale: fr }),
      mood: entry?.mood as MoodValueBipolar | null ?? null,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cette semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <WeekMoodViewBipolar data={weekData} />
      </CardContent>
    </Card>
  );
}

async function RecentEntriesLoader() {
  const org = await getRequiredCurrentOrg();
  const entries = await getMoodEntries({
    userId: org.user.id,
    organizationId: org.id,
    limit: 7,
  });

  return <MoodHistoryList entries={entries} title="Dernières entrées" />;
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function WeekSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EntriesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-4 rounded-lg border p-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function TrendsPage() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle
          icon={<BarChart3 className="size-6" />}
          description="Visualisez l'évolution de votre humeur au fil du temps"
        >
          Tendances
        </LayoutTitle>
      </LayoutHeader>

      <LayoutContent>
        {/* Stats */}
        <Suspense fallback={<StatsSkeleton />}>
          <TrendsStatsLoader />
        </Suspense>

        {/* Week view and recent entries */}
        <LayoutGrid cols={2}>
          <Suspense fallback={<WeekSkeleton />}>
            <WeekViewLoader />
          </Suspense>

          <Suspense fallback={<EntriesSkeleton />}>
            <RecentEntriesLoader />
          </Suspense>
        </LayoutGrid>
      </LayoutContent>
    </Layout>
  );
}
