import { Eye } from "lucide-react";
import { Suspense } from "react";
import { format } from "date-fns";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Layout,
  LayoutHeader,
  LayoutTitle,
  LayoutContent,
  LayoutGrid,
} from "@/features/page/layout";
import { CaregiverCheckinForm } from "@/features/caregiver/caregiver-checkin-form";
import { CaregiverEventForm } from "@/features/caregiver/caregiver-event-form";
import { getRequiredCurrentOrg } from "@/lib/organizations/get-org";
import {
  getOrganizationMembers,
  getCaregiverCheckinByDate,
} from "@/features/caregiver/caregiver.query";

type PageProps = {
  params: Promise<{ spaceSlug: string }>;
  searchParams: Promise<{ subject?: string }>;
};

async function SubjectSelector({
  spaceSlug,
  selectedSubjectId,
}: {
  spaceSlug: string;
  selectedSubjectId?: string;
}) {
  const org = await getRequiredCurrentOrg();

  const members = await getOrganizationMembers({
    organizationId: org.id,
    excludeUserId: org.user.id,
  });

  if (members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sélectionner un patient</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-4">
            Aucun autre membre dans cet espace. Vous ne pouvez observer que les
            autres membres de votre espace.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sélectionner un patient</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {members.map((member) => (
          <a
            key={member.id}
            href={`/space/${spaceSlug}/caregiver/observe?subject=${member.id}`}
            className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
              selectedSubjectId === member.id
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "hover:bg-muted"
            }`}
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
              {member.role}
            </span>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

async function CheckinFormLoader({ subjectId }: { subjectId: string }) {
  const org = await getRequiredCurrentOrg();

  // Get the member info
  const members = await getOrganizationMembers({
    organizationId: org.id,
  });
  const subject = members.find((m) => m.id === subjectId);

  if (!subject) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-muted-foreground text-sm text-center">
            Patient non trouvé.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get today's checkin if exists
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingCheckin = await getCaregiverCheckinByDate({
    authorId: org.user.id,
    subjectId,
    spaceId: org.id,
    date: today,
  });

  return (
    <CaregiverCheckinForm
      subjectId={subjectId}
      subjectName={subject.name}
      existingCheckin={existingCheckin}
      date={format(new Date(), "yyyy-MM-dd")}
    />
  );
}

async function EventFormLoader({ subjectId }: { subjectId: string }) {
  const org = await getRequiredCurrentOrg();

  // Get the member info
  const members = await getOrganizationMembers({
    organizationId: org.id,
  });
  const subject = members.find((m) => m.id === subjectId);

  if (!subject) {
    return null;
  }

  return (
    <CaregiverEventForm
      subjectId={subjectId}
      subjectName={subject.name}
    />
  );
}

function SelectorSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-2">
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

function FormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default async function ObservePage({ params, searchParams }: PageProps) {
  const { spaceSlug } = await params;
  const { subject: subjectId } = await searchParams;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle
          icon={<Eye className="size-6" />}
          description="Enregistrez vos observations sur un patient"
        >
          Faire une observation
        </LayoutTitle>
      </LayoutHeader>

      <LayoutContent>
        <LayoutGrid cols={subjectId ? 2 : 1}>
          {/* Subject selector */}
          <Suspense fallback={<SelectorSkeleton />}>
            <SubjectSelector
              spaceSlug={spaceSlug}
              selectedSubjectId={subjectId}
            />
          </Suspense>

          {/* Forms only shown when a subject is selected */}
          {subjectId && (
            <div className="space-y-6">
              <Suspense fallback={<FormSkeleton />}>
                <CheckinFormLoader subjectId={subjectId} />
              </Suspense>

              <Suspense fallback={<FormSkeleton />}>
                <EventFormLoader subjectId={subjectId} />
              </Suspense>
            </div>
          )}
        </LayoutGrid>
      </LayoutContent>
    </Layout>
  );
}
