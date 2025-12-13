import { Typography } from "@/components/nowts/typography";
import { buttonVariants } from "@/components/ui/button";
import { DashboardStats } from "@/features/dashboard/dashboard-stats";
import { TodayMoodCard } from "@/features/dashboard/today-mood-card";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getMoodStats, getTodayMoodEntry } from "@/features/mood/mood.query";
import {
  getActiveMedications,
  getMedicationAdherence,
  getTodayIntakes,
} from "@/features/medication/medication.query";
import { MedicationIntakeCard } from "@/features/medication/medication-intake-card";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { Heart, Pill, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function Page(props: PageProps<"/orgs/[orgSlug]">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RoutePage {...props} />
    </Suspense>
  );
}

async function RoutePage(props: PageProps<"/orgs/[orgSlug]">) {
  const params = await props.params;
  const org = await getRequiredCurrentOrgCache();

  const today = new Date().toISOString().split("T")[0];

  const [todayEntry, stats, adherence, medications, todayIntakes] =
    await Promise.all([
      getTodayMoodEntry({
        userId: org.user.id,
        organizationId: org.id,
      }),
      getMoodStats({
        userId: org.user.id,
        organizationId: org.id,
        days: 30,
      }),
      getMedicationAdherence({
        userId: org.user.id,
        days: 30,
      }),
      getActiveMedications({
        userId: org.user.id,
        organizationId: org.id,
      }),
      getTodayIntakes({
        userId: org.user.id,
      }),
    ]);

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle className="flex items-center gap-2">
          <Heart className="text-primary size-6" />
          Tableau de bord
        </LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Link
          href={`/orgs/${params.orgSlug}/mood`}
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="mr-2 size-4" />
          Nouvelle entree
        </Link>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-6 lg:gap-8">
        {/* Welcome message */}
        <Typography variant="muted">
          Bienvenue sur MoodTrace. Suivez votre humeur et optimisez votre
          traitement.
        </Typography>

        {/* Stats Cards */}
        <DashboardStats
          averageMood={stats.averageMood}
          streak={stats.streak}
          entriesCount={stats.entriesCount}
          adherenceRate={adherence.adherenceRate}
        />

        {/* Today's Mood and Medications */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TodayMoodCard existingMood={todayEntry?.mood} date={today} />
          <MedicationIntakeCard
            medications={medications}
            intakes={todayIntakes.map((intake) => ({
              medicationId: intake.medicationId,
              status: intake.status,
              takenAt: intake.takenAt,
            }))}
            date={today}
          />
        </div>

        {/* Quick Links */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Link
            href={`/orgs/${params.orgSlug}/mood`}
            className={buttonVariants({
              variant: "outline",
              className: "h-auto justify-start gap-3 p-4",
            })}
          >
            <Heart className="text-primary size-5" />
            <div className="text-left">
              <p className="font-medium">Suivi detaille</p>
              <p className="text-muted-foreground text-sm">
                Energie, sommeil, anxiete...
              </p>
            </div>
          </Link>
          <Link
            href={`/orgs/${params.orgSlug}/medications`}
            className={buttonVariants({
              variant: "outline",
              className: "h-auto justify-start gap-3 p-4",
            })}
          >
            <Pill className="text-primary size-5" />
            <div className="text-left">
              <p className="font-medium">Medicaments</p>
              <p className="text-muted-foreground text-sm">
                Gerez vos traitements
              </p>
            </div>
          </Link>
        </div>
      </LayoutContent>
    </Layout>
  );
}

function DashboardSkeleton() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Tableau de bord</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card h-32 animate-pulse rounded-lg border"
            />
          ))}
        </div>
      </LayoutContent>
    </Layout>
  );
}
