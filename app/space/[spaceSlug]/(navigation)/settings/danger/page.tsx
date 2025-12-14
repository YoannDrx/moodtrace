import { Typography } from "@/components/nowts/typography";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { Suspense } from "react";
import { SpaceDangerForm } from "./space-danger-form";
import { SpaceDeleteDialog } from "./space-delete-dialog";
import { UserDeleteCard } from "./user-delete-card";

export const generateMetadata = combineWithParentMetadata({
  title: "Zone danger",
  description: "Gérez les options critiques de votre compte et espace.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RoutePage />
    </Suspense>
  );
}

async function RoutePage() {
  const org = await getRequiredCurrentOrgCache({
    permissions: {
      organization: ["delete"],
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Section Espace */}
      <div className="flex flex-col gap-4">
        <Typography variant="h3">Mon espace</Typography>
        <SpaceDangerForm defaultValues={org} />
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Supprimer l&apos;espace</CardTitle>
            <CardDescription>
              En supprimant votre espace, vous perdrez toutes vos données de
              suivi et votre abonnement sera annulé.
            </CardDescription>
            <CardDescription>
              Aucun remboursement ne sera effectué.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end gap-2 border-t">
            <SpaceDeleteDialog space={org} />
          </CardFooter>
        </Card>
      </div>

      <Separator />

      {/* Section Compte */}
      <div className="flex flex-col gap-4">
        <Typography variant="h3">Mon compte</Typography>
        <UserDeleteCard />
      </div>
    </div>
  );
}
