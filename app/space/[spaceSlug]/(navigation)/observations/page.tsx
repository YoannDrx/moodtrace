import { Typography } from "@/components/nowts/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { AlertTriangle, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const generateMetadata = combineWithParentMetadata({
  title: "Mes observations",
  description: "Consultez et ajoutez vos observations en tant qu'aidant.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ObservationsPage />
    </Suspense>
  );
}

async function ObservationsPage() {
  const org = await getRequiredCurrentOrgCache();

  // TODO: Récupérer les observations et événements depuis la base de données
  // quand le client Prisma sera généré

  return (
    <div className="flex flex-col gap-6">
      {/* Header avec boutons d'action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h2">Mes observations</Typography>
          <Typography variant="muted">
            Suivez l&apos;évolution de votre proche au quotidien
          </Typography>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/space/${org.slug}/observations/checkin`}
            className={buttonVariants({ variant: "outline" })}
          >
            <Eye className="mr-2 size-4" />
            Observation quotidienne
          </Link>
          <Link
            href={`/space/${org.slug}/observations/event`}
            className={buttonVariants({ variant: "default" })}
          >
            <AlertTriangle className="mr-2 size-4" />
            Signaler un événement
          </Link>
        </div>
      </div>

      {/* État vide - TODO: Remplacer par les vraies données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="size-5" />
            Aucune observation
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <Typography variant="muted" className="text-center">
            Vous n&apos;avez pas encore ajouté d&apos;observations.
            <br />
            Commencez par ajouter une observation quotidienne ou signaler un
            événement.
          </Typography>
          <div className="flex gap-2">
            <Link
              href={`/space/${org.slug}/observations/checkin`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Plus className="mr-2 size-4" />
              Ajouter une observation
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* TODO: Afficher la liste des observations et événements
      <div className="flex flex-col gap-4">
        {observations.map((obs) => (
          <ObservationCard key={obs.id} observation={obs} />
        ))}
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      */}
    </div>
  );
}
