"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pill } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MedicationCard } from "@/components/nowts/medication-card";
import { MedicationForm } from "./medication-form";
import {
  deactivateMedicationAction,
  reactivateMedicationAction,
  deleteMedicationAction,
} from "./medication.action";
import type { Medication } from "@/generated/prisma";

type MedicationListProps = {
  medications: Medication[];
  showInactive?: boolean;
};

export function MedicationList({
  medications,
  showInactive = false,
}: MedicationListProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeMedications = medications.filter((m) => m.isActive);
  const inactiveMedications = medications.filter((m) => !m.isActive);

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (isActive) {
        const result = await deactivateMedicationAction({ id });
        if (result?.serverError) throw new Error(result.serverError);
      } else {
        const result = await reactivateMedicationAction({ id });
        if (result?.serverError) throw new Error(result.serverError);
      }
    },
    onSuccess: (_, { isActive }) => {
      toast.success(isActive ? "Médicament arrêté" : "Médicament réactivé");
      void queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteMedicationAction({ id });
      if (result?.serverError) throw new Error(result.serverError);
    },
    onSuccess: () => {
      toast.success("Médicament supprimé");
      void queryClient.invalidateQueries({ queryKey: ["medications"] });
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const editingMedication = editingId
    ? medications.find((m) => m.id === editingId)
    : null;

  if (isAdding) {
    return (
      <MedicationForm
        onSuccess={() => setIsAdding(false)}
        onCancel={() => setIsAdding(false)}
      />
    );
  }

  if (editingMedication) {
    return (
      <MedicationForm
        existingMedication={editingMedication}
        onSuccess={() => setEditingId(null)}
        onCancel={() => setEditingId(null)}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Pill className="size-5" />
            Mes médicaments
          </CardTitle>
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 size-4" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeMedications.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Aucun médicament actif. Cliquez sur "Ajouter" pour commencer.
            </p>
          ) : (
            activeMedications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onEdit={setEditingId}
                onDelete={setDeleteId}
                onToggleActive={(id, isActive) =>
                  toggleMutation.mutate({ id, isActive })
                }
              />
            ))
          )}

          {/* Inactive medications */}
          {showInactive && inactiveMedications.length > 0 && (
            <div className="pt-6 border-t">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">
                Médicaments arrêtés ({inactiveMedications.length})
              </h4>
              <div className="space-y-4">
                {inactiveMedications.map((medication) => (
                  <MedicationCard
                    key={medication.id}
                    medication={medication}
                    onEdit={setEditingId}
                    onDelete={setDeleteId}
                    onToggleActive={(id, isActive) =>
                      toggleMutation.mutate({ id, isActive })
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce médicament ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données de prise
              associées seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
