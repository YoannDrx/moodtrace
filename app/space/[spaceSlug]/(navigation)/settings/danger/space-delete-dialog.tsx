"use client";

import { Button } from "@/components/ui/button";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SpaceDeleteDialog = ({
  space,
}: {
  space: { id: string; slug: string };
}) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.organization.delete({
          organizationId: space.id,
        }),
      );
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description: error.message,
      });
    },
    onSuccess: () => {
      toast.success("Espace supprimé", {
        description: "Votre espace et toutes vos données ont été supprimés",
      });
      router.push("/space");
    },
  });

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={() => {
        dialogManager.confirm({
          title: "Supprimer l'espace",
          description:
            "Êtes-vous sûr de vouloir supprimer votre espace ? Cette action est irréversible et supprimera toutes vos données de suivi.",
          confirmText: space.slug,
          action: {
            label: "Supprimer",
            onClick: async () => {
              await mutation.mutateAsync();
            },
          },
        });
      }}
    >
      <Trash2 className="mr-2" size={16} />
      Supprimer l&apos;espace
    </Button>
  );
};
