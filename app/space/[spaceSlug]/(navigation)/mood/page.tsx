import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { MoodEntryForm } from "@/features/mood/mood-entry-form";
import { MoodHistoryList } from "@/features/mood/mood-history-list";
import { getMoodEntries } from "@/features/mood/mood.query";
import { Typography } from "@/components/nowts/typography";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { Heart } from "lucide-react";
import { Suspense } from "react";

export default function MoodPage() {
  return (
    <Layout size="default">
      <LayoutHeader>
        <LayoutTitle className="flex items-center gap-2">
          <Heart className="text-primary size-6" />
          Suivi d'humeur
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <Typography variant="muted">
          Enregistrez votre humeur quotidienne pour suivre votre bien-être au
          fil du temps.
        </Typography>
        <MoodEntryForm />
        <Suspense fallback={<HistorySkeleton />}>
          <MoodHistory />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}

async function MoodHistory() {
  const org = await getRequiredCurrentOrgCache();

  const entries = await getMoodEntries({
    userId: org.user.id,
    organizationId: org.id,
    limit: 14,
  });

  return <MoodHistoryList entries={entries} />;
}

function HistorySkeleton() {
  return <div className="bg-card h-64 animate-pulse rounded-lg border" />;
}
