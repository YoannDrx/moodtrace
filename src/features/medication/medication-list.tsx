"use client";

import type { Medication } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pause, Pencil, Pill, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deactivateMedicationAction,
  deleteMedicationAction,
} from "./medication.action";
import { FREQUENCY_LABELS, TIME_OF_DAY_LABELS } from "./medication.schema";

type MedicationListProps = {
  medications: Medication[];
  onEdit?: (medication: Medication) => void;
};

export function MedicationList({ medications, onEdit }: MedicationListProps) {
  const queryClient = useQueryClient();

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      return resolveActionResult(deactivateMedicationAction({ id }));
    },
    onSuccess: () => {
      toast.success("Medicament arrete");
      void queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return resolveActionResult(deleteMedicationAction({ id }));
    },
    onSuccess: () => {
      toast.success("Medicament supprime");
      void queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (medications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Pill className="text-muted-foreground mb-4 size-12" />
          <p className="text-muted-foreground text-center">
            Aucun medicament enregistre.
            <br />
            Ajoutez votre premier medicament pour commencer le suivi.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {medications.map((medication) => (
        <Card
          key={medication.id}
          className={!medication.isActive ? "opacity-60" : ""}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <Pill className="text-primary size-4" />
                {medication.name}
                {!medication.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Arrete
                  </Badge>
                )}
              </CardTitle>
              {medication.molecule && (
                <p className="text-muted-foreground text-sm">
                  {medication.molecule}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(medication)}>
                  <Pencil className="mr-2 size-4" />
                  Modifier
                </DropdownMenuItem>
                {medication.isActive && (
                  <DropdownMenuItem
                    onClick={() => deactivateMutation.mutate(medication.id)}
                    disabled={deactivateMutation.isPending}
                  >
                    <Pause className="mr-2 size-4" />
                    Arreter
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => deleteMutation.mutate(medication.id)}
                  disabled={deleteMutation.isPending}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Dosage:</span>{" "}
                <span className="font-medium">{medication.dosageMg} mg</span>
              </div>
              <div>
                <span className="text-muted-foreground">Frequence:</span>{" "}
                <span className="font-medium">
                  {FREQUENCY_LABELS[medication.frequency] ??
                    medication.frequency}
                </span>
              </div>
              {medication.timeOfDay && (
                <div>
                  <span className="text-muted-foreground">Moment:</span>{" "}
                  <span className="font-medium">
                    {TIME_OF_DAY_LABELS[medication.timeOfDay] ??
                      medication.timeOfDay}
                  </span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Depuis:</span>{" "}
                <span className="font-medium">
                  {new Date(medication.startDate).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
            {medication.notes && (
              <p className="text-muted-foreground mt-2 text-sm">
                {medication.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
