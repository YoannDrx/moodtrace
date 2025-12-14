import { Typography } from "@/components/nowts/typography";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getMoodEntries, getMoodStats } from "@/features/mood/mood.query";
import { MoodTrendChart } from "@/features/trends/mood-trend-chart";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { BarChart3 } from "lucide-react";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodIndicator } from "@/components/nowts/mood-indicator";
import type { MoodValue } from "@/lib/design-tokens";

export default function TrendsPage() {
  return (
    <Suspense fallback={<TrendsSkeleton />}>
      <TrendsPageContent />
    </Suspense>
  );
}

async function TrendsPageContent() {
  const org = await getRequiredCurrentOrgCache();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [entries, stats] = await Promise.all([
    getMoodEntries({
      userId: org.user.id,
      organizationId: org.id,
      startDate: thirtyDaysAgo,
      limit: 30,
    }),
    getMoodStats({
      userId: org.user.id,
      organizationId: org.id,
      days: 30,
    }),
  ]);

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle className="flex items-center gap-2">
          <BarChart3 className="text-primary size-6" />
          Tendances
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6 lg:gap-8">
        <Typography variant="muted">
          Analysez l'évolution de votre humeur et identifiez les patterns.
        </Typography>

        {/* Mood Trend Chart */}
        <MoodTrendChart entries={entries} days={30} />

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Humeur moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.averageMood ? (
                <div className="flex items-center gap-2">
                  <MoodIndicator
                    value={Math.round(stats.averageMood) as MoodValue}
                  />
                  <span className="text-2xl font-bold">
                    {stats.averageMood}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Énergie moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">
                {stats.averageEnergy ?? "-"}
              </span>
              {stats.averageEnergy && (
                <span className="text-muted-foreground">/10</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Sommeil moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">
                {stats.averageSleepHours ?? "-"}
              </span>
              {stats.averageSleepHours && (
                <span className="text-muted-foreground">h</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Anxiété moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">
                {stats.averageAnxiety ?? "-"}
              </span>
              {stats.averageAnxiety && (
                <span className="text-muted-foreground">/10</span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Dernières entrées</CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <p className="text-muted-foreground">
                Aucune entrée. Commencez à enregistrer votre humeur.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {entries.slice(0, 7).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <MoodIndicator
                        value={entry.mood as MoodValue}
                        size="sm"
                      />
                      <span className="text-sm">
                        {new Date(entry.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex gap-4 text-sm">
                      {entry.energy && <span>Énergie: {entry.energy}</span>}
                      {entry.sleepHours && (
                        <span>Sommeil: {entry.sleepHours}h</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}

function TrendsSkeleton() {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Tendances</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <div className="bg-card h-64 animate-pulse rounded-lg border" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-card h-24 animate-pulse rounded-lg border"
            />
          ))}
        </div>
      </LayoutContent>
    </Layout>
  );
}
