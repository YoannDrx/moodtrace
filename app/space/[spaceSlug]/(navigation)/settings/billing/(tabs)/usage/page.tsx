import { Typography } from "@/components/nowts/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { FileText, Heart, Pill } from "lucide-react";
import { Suspense } from "react";

export const generateMetadata = combineWithParentMetadata({
  title: "Utilisation",
  description: "Consultez votre utilisation.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <UsagePage />
    </Suspense>
  );
}

async function UsagePage() {
  const org = await getRequiredCurrentOrgCache({
    permissions: {
      subscription: ["manage"],
    },
  });

  const limits = org.subscription?.limits ?? AUTH_PLANS[0].limits;

  // TODO: Récupérer l'utilisation réelle depuis la base de données
  const moodEntriesUsed = 0;
  const medicationsUsed = 0;
  const exportsUsed = 0;

  const moodLimit =
    limits.moodEntriesPerMonth === -1 ? Infinity : limits.moodEntriesPerMonth;
  const medicationsLimit =
    limits.medications === -1 ? Infinity : limits.medications;
  const exportLimit =
    limits.exportPerMonth === -1 ? Infinity : limits.exportPerMonth;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="size-5" />
            Entrées d&apos;humeur
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Progress
            value={
              moodLimit === Infinity ? 0 : (moodEntriesUsed / moodLimit) * 100
            }
          />
          <Typography variant="muted">
            {moodEntriesUsed} /{" "}
            {moodLimit === Infinity ? "Illimité" : moodLimit} entrées ce mois
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="size-5" />
            Médicaments suivis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Progress
            value={
              medicationsLimit === Infinity
                ? 0
                : (medicationsUsed / medicationsLimit) * 100
            }
          />
          <Typography variant="muted">
            {medicationsUsed} /{" "}
            {medicationsLimit === Infinity ? "Illimité" : medicationsLimit}{" "}
            médicaments
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Exports PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Progress
            value={
              exportLimit === Infinity ? 0 : (exportsUsed / exportLimit) * 100
            }
          />
          <Typography variant="muted">
            {exportsUsed} /{" "}
            {exportLimit === Infinity ? "Illimité" : exportLimit} exports ce
            mois
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
