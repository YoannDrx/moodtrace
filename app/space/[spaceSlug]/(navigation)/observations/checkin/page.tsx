import { DailyCheckinForm } from "@/features/caregiver/components/daily-checkin-form";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { Suspense } from "react";

export const generateMetadata = combineWithParentMetadata({
  title: "Observation quotidienne",
  description: "Ajoutez une observation quotidienne pour votre proche.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CheckinPage />
    </Suspense>
  );
}

async function CheckinPage() {
  const org = await getRequiredCurrentOrgCache();

  // TODO: Récupérer le patient (owner) de l'espace
  // Pour l'instant, on utilise des valeurs par défaut
  const patient = {
    id: "patient-placeholder",
    name: org.name,
  };

  return (
    <div className="mx-auto max-w-2xl">
      <DailyCheckinForm
        subjectId={patient.id}
        subjectName={patient.name}
        spaceSlug={org.slug}
      />
    </div>
  );
}
