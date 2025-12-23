import { Pill } from "lucide-react";
import { Suspense } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Layout,
  LayoutHeader,
  LayoutTitle,
  LayoutContent,
  LayoutGrid,
} from "@/features/page/layout";
import { MedicationList } from "@/features/medication/medication-list";
import { TodayIntake } from "@/features/medication/today-intake";
import { getRequiredCurrentOrg } from "@/lib/organizations/get-org";
import {
  getAllMedications,
  getMedicationsWithTodayStatus,
} from "@/features/medication/medication.query";

async function MedicationListLoader() {
  const org = await getRequiredCurrentOrg();
  const medications = await getAllMedications({
    userId: org.user.id,
    organizationId: org.id,
    includeInactive: true,
  });

  return <MedicationList medications={medications} showInactive />;
}

async function TodayIntakeLoader() {
  const org = await getRequiredCurrentOrg();
  const medications = await getMedicationsWithTodayStatus({
    userId: org.user.id,
    organizationId: org.id,
  });

  return <TodayIntake medications={medications} />;
}

function MedicationListSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-24" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-start gap-4 p-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function TodayIntakeSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-4">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

export default function MedicationsPage() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle
          icon={<Pill className="size-6" />}
          description="Gérez vos traitements et suivez vos prises quotidiennes"
        >
          Médicaments
        </LayoutTitle>
      </LayoutHeader>

      <LayoutContent>
        <LayoutGrid cols={2}>
          {/* Today's intake */}
          <Suspense fallback={<TodayIntakeSkeleton />}>
            <TodayIntakeLoader />
          </Suspense>

          {/* Medication list */}
          <Suspense fallback={<MedicationListSkeleton />}>
            <MedicationListLoader />
          </Suspense>
        </LayoutGrid>
      </LayoutContent>
    </Layout>
  );
}
