import { getRequiredUser } from "@/lib/auth/auth-user";
import { combineWithParentMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import { UserProfileForm } from "./user-profile-form";

export const generateMetadata = combineWithParentMetadata({
  title: "Mon profil",
  description: "Gérez votre profil utilisateur.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProfilePage />
    </Suspense>
  );
}

async function ProfilePage() {
  const user = await getRequiredUser();

  return <UserProfileForm defaultValues={user} />;
}
