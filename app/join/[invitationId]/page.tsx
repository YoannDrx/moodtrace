import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth, SocialProviders } from "@/lib/auth";
import { getUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInProviders } from "../../auth/signin/sign-in-providers";

type PageProps = {
  params: Promise<{ invitationId: string }>;
};

/**
 * Page d'acceptation d'invitation à rejoindre un espace
 * Remplace /orgs/accept-invitation/[id]
 */
export default async function JoinSpacePage(props: PageProps) {
  const params = await props.params;
  const user = await getUser();

  const invitation = await prisma.invitation.findUnique({
    where: {
      id: params.invitationId,
    },
    include: {
      organization: {
        select: {
          name: true,
          slug: true,
          logo: true,
        },
      },
    },
  });

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md lg:max-w-lg lg:p-6">
          <CardHeader className="text-center">
            <CardTitle>Invitation non trouvée</CardTitle>
            <CardDescription>
              Cette invitation a peut-être expiré ou été révoquée.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md lg:max-w-lg lg:p-6">
        <CardHeader>
          <div className="flex justify-center">
            <Avatar className="size-16">
              {invitation.organization.logo ? (
                <AvatarImage
                  src={invitation.organization.logo}
                  alt={invitation.organization.name}
                />
              ) : null}
              <AvatarFallback className="text-xl font-medium">
                {invitation.organization.name.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-center">
            Rejoindre l'espace de {invitation.organization.name}
          </CardTitle>
          <CardDescription className="text-center">
            Vous avez été invité à suivre ce proche en tant qu'aidant
          </CardDescription>
        </CardHeader>
        {user ? (
          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            <p className="text-muted-foreground text-center text-sm">
              Connecté en tant que{" "}
              <span className="font-medium">{user.email}</span>
            </p>
            <form className="w-full">
              <Button
                className="w-full"
                formAction={async () => {
                  "use server";

                  await auth.api.acceptInvitation({
                    body: {
                      invitationId: params.invitationId,
                    },
                    headers: await headers(),
                  });

                  redirect(`/space/${invitation.organization.slug}`);
                }}
              >
                Accepter l'invitation
              </Button>
            </form>
          </CardFooter>
        ) : (
          <CardContent className="border-t pt-6">
            <p className="text-muted-foreground mb-4 text-center text-sm">
              Connectez-vous pour accepter cette invitation
            </p>
            <SignInProviders
              callbackUrl={`/join/${params.invitationId}`}
              providers={Object.keys(SocialProviders ?? {})}
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
