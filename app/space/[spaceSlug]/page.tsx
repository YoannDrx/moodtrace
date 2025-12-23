import Link from "next/link";
import { Heart, Plus, ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Layout,
  LayoutHeader,
  LayoutTitle,
  LayoutActions,
  LayoutContent,
  LayoutGrid,
} from "@/features/page/layout";
import { DashboardStats } from "@/features/dashboard/dashboard-stats";
import { TodayMoodCard } from "@/features/dashboard/today-mood-card";
import { getRequiredCurrentOrg } from "@/lib/organizations/get-org";
import { getMoodStats, getTodayMoodEntry } from "@/features/mood/mood.query";
import { getMedicationAdherence } from "@/features/medication/medication.query";

type PageProps = {
  params: Promise<{ spaceSlug: string }>;
};

async function DashboardStatsLoader() {
  const org = await getRequiredCurrentOrg();
  const [moodStats, adherence] = await Promise.all([
    getMoodStats({
      userId: org.user.id,
      organizationId: org.id,
      days: 30,
    }),
    getMedicationAdherence({
      userId: org.user.id,
      days: 30,
    }),
  ]);

  return (
    <DashboardStats
      averageMood={moodStats.averageMood}
      streak={moodStats.streak}
      entriesCount={moodStats.entriesCount}
      adherenceRate={adherence.adherenceRate}
    />
  );
}

async function TodayMoodCardLoader() {
  const org = await getRequiredCurrentOrg();
  const todayEntry = await getTodayMoodEntry({
    userId: org.user.id,
    organizationId: org.id,
  });

  const today = format(new Date(), "yyyy-MM-dd");

  return <TodayMoodCard existingMood={todayEntry?.mood} date={today} />;
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MoodCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between gap-2">
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="size-11 rounded-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function SpaceDashboard({ params }: PageProps) {
  const { spaceSlug } = await params;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle
          icon={<Heart className="size-6" />}
          description="Bienvenue dans votre espace de suivi"
        >
          Tableau de bord
        </LayoutTitle>
        <LayoutActions>
          <Button asChild>
            <Link href={`/space/${spaceSlug}/mood`}>
              <Plus className="mr-2 size-4" />
              Nouvelle entrée
            </Link>
          </Button>
        </LayoutActions>
      </LayoutHeader>

      <LayoutContent>
        {/* Stats */}
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStatsLoader />
        </Suspense>

        {/* Main content grid */}
        <LayoutGrid cols={2}>
          {/* Today's mood card */}
          <Suspense fallback={<MoodCardSkeleton />}>
            <TodayMoodCardLoader />
          </Suspense>

          {/* Quick links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accès rapide</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link
                href={`/space/${spaceSlug}/mood`}
                className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-medium">Check-in détaillé</p>
                  <p className="text-muted-foreground text-sm">
                    Sommeil, énergie, anxiété...
                  </p>
                </div>
                <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={`/space/${spaceSlug}/trends`}
                className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-medium">Voir les tendances</p>
                  <p className="text-muted-foreground text-sm">
                    Graphiques et historique
                  </p>
                </div>
                <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={`/space/${spaceSlug}/medications`}
                className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-medium">Médicaments</p>
                  <p className="text-muted-foreground text-sm">
                    Gérer vos traitements
                  </p>
                </div>
                <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        </LayoutGrid>
      </LayoutContent>
    </Layout>
  );
}
