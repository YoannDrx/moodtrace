import { Users, Plus } from "lucide-react";
import { Suspense } from "react";
import { format } from "date-fns";
import Link from "next/link";

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
import { StatCard } from "@/components/nowts/stat-card";
import { CaregiverActivityList } from "@/features/caregiver/caregiver-activity-list";
import { getRequiredCurrentOrg } from "@/lib/organizations/get-org";
import {
  getRecentCaregiverActivity,
  getCaregiverStats,
  getOrganizationMembers,
} from "@/features/caregiver/caregiver.query";
import { Heart, AlertTriangle, Calendar, Eye } from "lucide-react";

type PageProps = {
  params: Promise<{ spaceSlug: string }>;
};

async function CaregiverStatsLoader() {
  const org = await getRequiredCurrentOrg();
  const userId = org.user.id;

  // Get stats for entries where user is the subject (being observed)
  const stats = await getCaregiverStats({
    subjectId: userId,
    spaceId: org.id,
    days: 30,
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Calendar}
        label="Observations (30j)"
        value={stats.totalCheckins.toString()}
        variant="primary"
      />
      <StatCard
        icon={AlertTriangle}
        label="Événements (30j)"
        value={stats.totalEvents.toString()}
        variant={stats.totalEvents > 0 ? "warning" : "default"}
      />
      <StatCard
        icon={Heart}
        label="Humeur moyenne"
        value={stats.averageMood ?? "-"}
      />
      <StatCard
        icon={Eye}
        label="Aidants actifs"
        value="1"
      />
    </div>
  );
}

async function RecentActivityLoader() {
  const org = await getRequiredCurrentOrg();
  const userId = org.user.id;

  // Get recent activity where user is the subject
  const { checkins, events } = await getRecentCaregiverActivity({
    subjectId: userId,
    spaceId: org.id,
    days: 14,
  });

  // Filter to only show visible entries for patient
  const visibleCheckins = checkins.filter(
    (c) => c.patientVisibility === "visible",
  );
  const visibleEvents = events.filter((e) => e.patientVisibility === "visible");

  return (
    <CaregiverActivityList
      checkins={visibleCheckins}
      events={visibleEvents}
      title="Activité récente des aidants"
    />
  );
}

async function MembersLoader({ spaceSlug }: { spaceSlug: string }) {
  const org = await getRequiredCurrentOrg();

  const members = await getOrganizationMembers({
    organizationId: org.id,
    excludeUserId: org.user.id,
  });

  if (members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Membres de l'espace</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-4">
            Aucun autre membre dans cet espace. Invitez un aidant pour commencer
            le suivi collaboratif.
          </p>
          <div className="flex justify-center pt-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/space/${spaceSlug}/settings/members`}>
                <Plus className="mr-2 size-4" />
                Inviter un aidant
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Membres de l'espace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
              {member.role}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
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

function ActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function MembersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default async function CaregiverPage({ params }: PageProps) {
  const { spaceSlug } = await params;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle
          icon={<Users className="size-6" />}
          description="Observations et événements signalés par vos aidants"
        >
          Suivi aidant
        </LayoutTitle>
        <LayoutActions>
          <Button asChild variant="outline">
            <Link href={`/space/${spaceSlug}/caregiver/observe`}>
              <Plus className="mr-2 size-4" />
              Faire une observation
            </Link>
          </Button>
        </LayoutActions>
      </LayoutHeader>

      <LayoutContent>
        {/* Stats */}
        <Suspense fallback={<StatsSkeleton />}>
          <CaregiverStatsLoader />
        </Suspense>

        {/* Activity and members */}
        <LayoutGrid cols={2}>
          <Suspense fallback={<ActivitySkeleton />}>
            <RecentActivityLoader />
          </Suspense>

          <Suspense fallback={<MembersSkeleton />}>
            <MembersLoader spaceSlug={spaceSlug} />
          </Suspense>
        </LayoutGrid>
      </LayoutContent>
    </Layout>
  );
}
