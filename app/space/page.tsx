import { auth } from "@/lib/auth";
import { getUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Page de redirection intelligente vers l'espace actif
 *
 * Logique:
 * - Si pas connecté -> /auth/signin
 * - Si aucun espace -> /onboarding/patient (créer son espace)
 * - Si 1 espace -> /space/[slug] (accès direct)
 * - Si plusieurs espaces -> /spaces (sélecteur)
 */
export default async function SpaceRedirectPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // Récupère tous les espaces de l'utilisateur
  const memberships = await prisma.member.findMany({
    where: {
      userId: user.id,
    },
    select: {
      organization: {
        select: {
          id: true,
          slug: true,
        },
      },
    },
  });

  const spaces = memberships.map((m) => m.organization);

  if (spaces.length === 0) {
    // Pas d'espace -> proposer de créer ou attendre invitation
    redirect("/onboarding/patient");
  }

  if (spaces.length === 1) {
    // Un seul espace -> y aller directement
    const space = spaces[0];

    // Set l'espace actif dans la session
    await auth.api.setActiveOrganization({
      body: {
        organizationId: space.id,
      },
      headers: await headers(),
    });

    redirect(`/space/${space.slug}`);
  }

  // Plusieurs espaces -> afficher sélecteur
  redirect("/spaces");
}
