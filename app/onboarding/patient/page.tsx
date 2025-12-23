import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { Suspense } from "react";
import { NewSpaceForm } from "./new-space-form";

/**
 * Page de création d'un nouvel espace patient
 * L'utilisateur crée son espace personnel de suivi
 */
export default async function OnboardingPatientPage() {
  return (
    <Layout size="sm" className="py-12">
      <LayoutHeader className="text-center">
        <LayoutTitle>Créer mon espace de suivi</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <Suspense fallback={null}>
          <OnboardingContent />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}

async function OnboardingContent() {
  await getRequiredUser();

  return <NewSpaceForm />;
}
