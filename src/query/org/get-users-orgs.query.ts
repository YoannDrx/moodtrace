import { auth } from "@/lib/auth";
import { getUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUsersOrgs() {
  const userOrganizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return userOrganizations;
}

export type UserSpaceWithRole = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  memberRole: "owner" | "admin" | "member";
};

/**
 * Get user's spaces with their role in each space
 */
export async function getUsersSpacesWithRoles(): Promise<UserSpaceWithRole[]> {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const memberships = await prisma.member.findMany({
    where: {
      userId: user.id,
    },
    select: {
      role: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
      },
    },
  });

  return memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug ?? "",
    logo: m.organization.logo ?? null,
    memberRole: m.role as "owner" | "admin" | "member",
  }));
}
