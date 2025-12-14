"use client";

import type { OverrideLimits, PlanLimit } from "@/lib/auth/stripe/auth-plans";
import { getPlanLimits } from "@/lib/auth/stripe/auth-plans";
import type { CurrentOrgPayload } from "@/lib/organizations/get-org";
import type React from "react";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { create } from "zustand";

type CurrentSpaceStore = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  subscription: CurrentOrgPayload["subscription"] | null;
  limits: PlanLimit;
  /** true si l'utilisateur est le owner (patient), false si membre (aidant) */
  isOwner: boolean;
  /** true si l'utilisateur est patient dans cet espace */
  isPatient: boolean;
  /** true si l'utilisateur est aidant dans cet espace */
  isCaregiver: boolean;
};

/**
 * Récupère l'espace courant dans un **client component**
 *
 * Usage :
 *
 * ```tsx
 * "use client";
 *
 * export const ClientComponent = () => {
 *   const currentSpace = useCurrentSpace();
 *
 *   return (
 *     <div>
 *       <p>Espace : {currentSpace?.name}</p>
 *       <p>Rôle : {currentSpace?.isPatient ? "Patient" : "Aidant"}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export const useCurrentSpace = create<CurrentSpaceStore | null>(() => null);

/**
 * Alias pour compatibilité avec le code existant
 * @deprecated Utiliser useCurrentSpace à la place
 */
export const useCurrentOrg = useCurrentSpace;

export const InjectCurrentSpaceStore = (
  props: PropsWithChildren<{
    space?: Omit<CurrentSpaceStore, "limits">;
  }>,
): React.ReactNode => {
  const space = props.space;

  useEffect(() => {
    if (!space) return;
    if (useCurrentSpace.getState()) return;

    useCurrentSpace.setState({
      id: space.id,
      slug: space.slug,
      name: space.name,
      image: space.image,
      subscription: space.subscription,
      isOwner: space.isOwner,
      isPatient: space.isPatient,
      isCaregiver: space.isCaregiver,
      limits: getPlanLimits(
        space.subscription?.plan,
        space.subscription?.overrideLimits
          ? (space.subscription.overrideLimits as unknown as OverrideLimits)
          : null,
      ),
    });
  }, [space]);

  return props.children;
};

/**
 * Alias pour compatibilité avec le code existant
 * @deprecated Utiliser InjectCurrentSpaceStore à la place
 */
export const InjectCurrentOrgStore = InjectCurrentSpaceStore;
