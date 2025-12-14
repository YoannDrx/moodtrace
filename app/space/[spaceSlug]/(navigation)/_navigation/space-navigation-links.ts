import type { NavigationGroup } from "@/features/navigation/navigation.type";
import type { AuthRole } from "@/lib/auth/auth-permissions";
import { isInRoles } from "@/lib/organizations/is-in-roles";
import {
  BarChart3,
  CreditCard,
  Eye,
  FileText,
  Heart,
  HeartHandshake,
  Home,
  Pill,
  Settings,
  TriangleAlert,
  User2,
  Users,
} from "lucide-react";

const replaceSlug = (href: string, slug: string): string =>
  href.replace(":spaceSlug", slug);

export const getSpaceNavigation = (
  slug: string,
  userRoles: AuthRole[] | undefined,
  isPatient: boolean,
): NavigationGroup[] => {
  const links = isPatient ? PATIENT_LINKS : CAREGIVER_LINKS;

  return links.reduce<NavigationGroup[]>((acc, group) => {
    const filteredLinks = group.links
      .filter((link) => !link.roles || isInRoles(userRoles, link.roles))
      .map((link) => ({
        ...link,
        href: replaceSlug(link.href, slug),
      }));

    if (filteredLinks.length === 0) return acc;

    acc.push({
      ...group,
      defaultOpenStartPath: group.defaultOpenStartPath
        ? replaceSlug(group.defaultOpenStartPath, slug)
        : undefined,
      links: filteredLinks,
    });

    return acc;
  }, []);
};

const SPACE_PATH = `/space/:spaceSlug`;

// Navigation pour le patient (propriétaire de l'espace)
export const PATIENT_LINKS: NavigationGroup[] = [
  {
    title: "Suivi",
    links: [
      {
        href: SPACE_PATH,
        Icon: Home,
        label: "Tableau de bord",
      },
      {
        href: `${SPACE_PATH}/mood`,
        Icon: Heart,
        label: "Humeur",
      },
      {
        href: `${SPACE_PATH}/medications`,
        Icon: Pill,
        label: "Médicaments",
      },
      {
        href: `${SPACE_PATH}/trends`,
        Icon: BarChart3,
        label: "Tendances",
      },
      {
        href: `${SPACE_PATH}/export`,
        Icon: FileText,
        label: "Export",
      },
      {
        href: `${SPACE_PATH}/crisis`,
        Icon: HeartHandshake,
        label: "Ressources de crise",
      },
    ],
  },
  {
    title: "Paramètres",
    defaultOpenStartPath: `${SPACE_PATH}/settings`,
    links: [
      {
        href: `${SPACE_PATH}/settings/profile`,
        Icon: User2,
        label: "Mon profil",
      },
      {
        href: `${SPACE_PATH}/settings`,
        Icon: Settings,
        label: "Mon espace",
        roles: ["admin"],
      },
      {
        href: `${SPACE_PATH}/settings/caregivers`,
        Icon: Users,
        label: "Mes proches",
        roles: ["admin"],
      },
      {
        href: `${SPACE_PATH}/settings/billing`,
        Icon: CreditCard,
        label: "Facturation",
        roles: ["admin"],
      },
      {
        href: `${SPACE_PATH}/settings/danger`,
        Icon: TriangleAlert,
        label: "Zone danger",
        roles: ["owner"],
      },
    ],
  },
] satisfies NavigationGroup[];

// Navigation pour l'aidant (membre de l'espace)
export const CAREGIVER_LINKS: NavigationGroup[] = [
  {
    title: "Suivi",
    links: [
      {
        href: SPACE_PATH,
        Icon: Home,
        label: "Tableau de bord",
      },
      {
        href: `${SPACE_PATH}/observations`,
        Icon: Eye,
        label: "Mes observations",
      },
      {
        href: `${SPACE_PATH}/trends`,
        Icon: BarChart3,
        label: "Tendances",
      },
      {
        href: `${SPACE_PATH}/export`,
        Icon: FileText,
        label: "Export",
      },
      {
        href: `${SPACE_PATH}/crisis`,
        Icon: HeartHandshake,
        label: "Ressources de crise",
      },
    ],
  },
  {
    title: "Paramètres",
    defaultOpenStartPath: `${SPACE_PATH}/settings`,
    links: [
      {
        href: `${SPACE_PATH}/settings/profile`,
        Icon: User2,
        label: "Mon profil",
      },
    ],
  },
] satisfies NavigationGroup[];

// Export all links for command palette
export const ALL_SPACE_LINKS: NavigationGroup[] = [
  ...PATIENT_LINKS,
  ...CAREGIVER_LINKS.filter(
    (group) => !PATIENT_LINKS.some((p) => p.title === group.title),
  ),
];
