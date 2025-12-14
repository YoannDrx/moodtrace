import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContactSupportDialog } from "@/features/contact/support/contact-support-dialog";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { env } from "@/lib/env";
import { resend } from "@/lib/mail/resend";
import { combineWithParentMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { ChangeEmailCard } from "./change-email-card";
import { ToggleEmailCheckbox } from "./toggle-email-checkbox";

export const generateMetadata = combineWithParentMetadata({
  title: "Email",
  description: "Gérez vos paramètres email.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EmailPage />
    </Suspense>
  );
}

async function EmailPage() {
  const user = await getRequiredUser();
  const userWithResendContactId = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      resendContactId: true,
    },
  });

  const resendContactId = userWithResendContactId?.resendContactId;
  const audienceId = env.RESEND_AUDIENCE_ID;

  let resendUser: { unsubscribed: boolean } | null = null;

  if (resendContactId && audienceId) {
    const { data } = await resend.contacts.get({
      audienceId,
      id: resendContactId,
    });
    resendUser = data;
  }

  const hasResendSetup = !!resendUser;

  return (
    <div className="flex flex-col gap-6">
      <ChangeEmailCard defaultEmail={user.email} />

      {hasResendSetup && resendUser ? (
        <Card>
          <CardHeader>
            <CardTitle>Notifications par email</CardTitle>
            <CardDescription>
              Gérez vos préférences de notifications email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleEmailCheckbox unsubscribed={resendUser.unsubscribed} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Notifications par email</CardTitle>
            <CardDescription>
              Impossible de charger vos préférences email. Veuillez contacter le
              support.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <ContactSupportDialog />
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
