import { Heart } from "lucide-react";
import { Suspense } from "react";
import { format } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Layout,
  LayoutHeader,
  LayoutTitle,
  LayoutContent,
  LayoutGrid,
} from "@/features/page/layout";
import { MoodEntryForm } from "@/features/mood/mood-entry-form";
import { MoodHistoryList } from "@/features/mood/mood-history-list";
import { getRequiredCurrentOrg } from "@/lib/organizations/get-org";
import { getMoodEntries, getMoodEntryByDate } from "@/features/mood/mood.query";

async function MoodFormLoader() {
  const org = await getRequiredCurrentOrg();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEntry = await getMoodEntryByDate({
    userId: org.user.id,
    organizationId: org.id,
    date: today,
  });

  return (
    <MoodEntryForm
      existingEntry={todayEntry}
      date={format(new Date(), "yyyy-MM-dd")}
    />
  );
}

async function MoodHistoryLoader() {
  const org = await getRequiredCurrentOrg();

  const entries = await getMoodEntries({
    userId: org.user.id,
    organizationId: org.id,
    limit: 14,
  });

  return <MoodHistoryList entries={entries} title="14 dernières entrées" />;
}

function FormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <div className="mt-4 flex justify-between">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-6 w-64" />
        <div className="flex justify-between gap-2">
          {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="size-11 rounded-full" />
          ))}
        </div>
        <div className="flex justify-between pt-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

function HistorySkeleton() {
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

export default function MoodPage() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle
          icon={<Heart className="size-6" />}
          description="Enregistrez votre humeur et vos métriques du jour"
        >
          Suivi d'humeur
        </LayoutTitle>
      </LayoutHeader>

      <LayoutContent>
        <LayoutGrid cols={2}>
          {/* Form */}
          <Suspense fallback={<FormSkeleton />}>
            <MoodFormLoader />
          </Suspense>

          {/* History */}
          <Suspense fallback={<HistorySkeleton />}>
            <MoodHistoryLoader />
          </Suspense>
        </LayoutGrid>
      </LayoutContent>
    </Layout>
  );
}
