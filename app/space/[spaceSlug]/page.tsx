import Link from "next/link";

export default function SpaceDashboard({
  params,
}: {
  params: { spaceSlug: string };
}) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-foreground">
          Tableau de bord
        </h1>
        <p className="mb-4 text-muted-foreground">
          Espace: {params.spaceSlug}
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href={`/space/${params.spaceSlug}/mood`}
            className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              Check-in quotidien
            </h2>
            <p className="text-sm text-muted-foreground">
              Enregistrez votre humeur du jour
            </p>
          </Link>

          <Link
            href={`/space/${params.spaceSlug}/trends`}
            className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              Timeline
            </h2>
            <p className="text-sm text-muted-foreground">
              Visualisez l'évolution de votre humeur
            </p>
          </Link>

          <Link
            href={`/space/${params.spaceSlug}/medications`}
            className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              Médicaments
            </h2>
            <p className="text-sm text-muted-foreground">
              Gérez vos traitements
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
