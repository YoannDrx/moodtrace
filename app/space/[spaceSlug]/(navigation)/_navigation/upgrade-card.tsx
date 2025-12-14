import { buttonVariants } from "@/components/ui/button";
import {
  Item,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import Link from "next/link";
import { useCurrentSpace } from "../../use-current-space";

export const UpgradeCard = () => {
  const space = useCurrentSpace();

  if (!space) return null;

  // Ne pas afficher si l'utilisateur n'est pas le propriétaire (patient)
  if (!space.isOwner) return null;

  // Ne pas afficher si déjà abonné
  if (space.subscription) return null;

  return (
    <Item variant="outline">
      <ItemHeader className="flex flex-col items-start gap-0">
        <ItemTitle>Passer à Pro</ItemTitle>
        <ItemDescription>
          Débloquez toutes les fonctionnalités et obtenez un accès illimité.
        </ItemDescription>
      </ItemHeader>
      <ItemFooter>
        <Link
          href={`/space/${space.slug}/settings/billing`}
          className={buttonVariants({ className: "w-full" })}
        >
          Améliorer
        </Link>
      </ItemFooter>
    </Item>
  );
};
