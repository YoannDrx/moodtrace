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

type PageProps = {
  params: Promise<{ spaceSlug: string }>;
};

export default function Page(props: PageProps) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RoutePage {...props} />
    </Suspense>
  );
}

async function RoutePage(props: PageProps) {
  const params = await props.params;
  const org = await getRequiredCurrentOrgCache();

  const today = new Date().toISOString().split("T")[0];

  // Détermine si l'utilisateur est patient ou aidant
  const isPatient = org.memberRoles.includes("owner");

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
          {isPatient ? "Tableau de bord" : `Suivi de ${org.name}`}
        </LayoutTitle>
      </LayoutHeader>
      {isPatient && (
        <LayoutActions>
          <Link
            href={`/space/${params.spaceSlug}/mood`}
            className={buttonVariants({ variant: "default" })}
          >
            <Plus className="mr-2 size-4" />
            Nouvelle entrée
          </Link>
        </LayoutActions>
      )}
      <LayoutContent className="flex flex-col gap-6 lg:gap-8">
        {/* Welcome message */}
        <Typography variant="muted">
          {isPatient
            ? "Bienvenue sur MoodTrace. Suivez votre humeur et optimisez votre traitement."
            : "Consultez les données de votre proche et ajoutez vos observations."}
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
            href={`/space/${params.spaceSlug}/mood`}
            className={buttonVariants({
              variant: "outline",
              className: "h-auto justify-start gap-3 p-4",
            })}
          >
            <Heart className="text-primary size-5" />
            <div className="text-left">
              <p className="font-medium">Suivi détaillé</p>
              <p className="text-muted-foreground text-sm">
                Énergie, sommeil, anxiété...
              </p>
            </div>
          </Link>
          <Link
            href={`/space/${params.spaceSlug}/medications`}
            className={buttonVariants({
              variant: "outline",
              className: "h-auto justify-start gap-3 p-4",
            })}
          >
            <Pill className="text-primary size-5" />
            <div className="text-left">
              <p className="font-medium">Médicaments</p>
              <p className="text-muted-foreground text-sm">
                {isPatient ? "Gérez vos traitements" : "Voir les traitements"}
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
