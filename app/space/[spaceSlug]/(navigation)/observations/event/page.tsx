import { EventForm } from "@/features/caregiver/components/event-form";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { Suspense } from "react";

export const generateMetadata = combineWithParentMetadata({
  title: "Signaler un événement",
  description: "Signalez un événement concernant votre proche.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EventPage />
    </Suspense>
  );
}

async function EventPage() {
  const org = await getRequiredCurrentOrgCache();

  // TODO: Récupérer le patient (owner) de l'espace
  // Pour l'instant, on utilise des valeurs par défaut
  const patient = {
    id: "patient-placeholder",
    name: org.name,
  };

  return (
    <div className="mx-auto max-w-2xl">
      <EventForm
        subjectId={patient.id}
        subjectName={patient.name}
        spaceSlug={org.slug}
      />
    </div>
  );
}
