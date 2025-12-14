import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import { Heart, Home, Users } from "lucide-react";
import Link from "next/link";

/**
 * Sélecteur d'espaces pour les utilisateurs multi-espaces
 * (patient dans son espace + aidant dans d'autres)
 */
export default async function SpacesPage() {
  const user = await getRequiredUser();

  // Récupère tous les espaces avec le rôle de l'utilisateur
  const memberships = await prisma.member.findMany({
    where: {
      userId: user.id,
    },
    select: {
      role: true,
      organization: {
        select: {
          id: true,
          slug: true,
          name: true,
          logo: true,
        },
      },
    },
  });

  const spaces = memberships.map((m) => ({
    ...m.organization,
    role: m.role,
    isOwner: m.role === "owner",
  }));

  return (
    <Layout size="sm" className="py-12">
      <LayoutHeader className="text-center">
        <LayoutTitle>Sélectionner un espace</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4">
        {spaces.map((space) => (
          <Link key={space.id} href={`/space/${space.slug}`}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="size-12">
                  {space.logo ? (
                    <AvatarImage src={space.logo} alt={space.name} />
                  ) : null}
                  <AvatarFallback className="text-lg">
                    {space.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-1">
                  <CardTitle className="flex items-center gap-2">
                    {space.name}
                    <Badge variant={space.isOwner ? "default" : "secondary"}>
                      {space.isOwner ? (
                        <Home className="mr-1 size-3" />
                      ) : (
                        <Heart className="mr-1 size-3" />
                      )}
                      {space.isOwner ? "Mon espace" : "Aidant"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {space.isOwner
                      ? "Votre espace de suivi personnel"
                      : "Espace d'un proche"}
                  </CardDescription>
                </div>
                <Users className="text-muted-foreground size-5" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </LayoutContent>
    </Layout>
  );
}
