"use client";

import type { Medication } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, Pill, X } from "lucide-react";
import { toast } from "sonner";
import { recordIntakeAction } from "./medication.action";
import { FREQUENCY_LABELS, TIME_OF_DAY_LABELS } from "./medication.schema";

type MedicationIntakeCardProps = {
  medications: Medication[];
  intakes: {
    medicationId: string;
    status: string;
    takenAt?: string | null;
  }[];
  date: string;
};

export function MedicationIntakeCard({
  medications,
  intakes,
  date,
}: MedicationIntakeCardProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      medicationId,
      status,
    }: {
      medicationId: string;
      status: "taken" | "missed" | "skipped" | "delayed";
    }) => {
      const now = new Date();
      const takenAt =
        status === "taken"
          ? `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
          : null;

      return resolveActionResult(
        recordIntakeAction({
          medicationId,
          date,
          scheduledAt: null,
          takenAt,
          status,
          notes: null,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Prise enregistree");
      void queryClient.invalidateQueries({ queryKey: ["medications"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const activeMedications = medications.filter((m) => m.isActive);

  if (activeMedications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Pill className="text-primary size-5" />
            Medicaments du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Aucun medicament actif. Ajoutez vos medicaments pour suivre vos
            prises.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Pill className="text-primary size-5" />
          Medicaments du jour
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {activeMedications.map((medication) => {
          const intake = intakes.find((i) => i.medicationId === medication.id);
          const intakeStatus = intake?.status;
          const isTaken = intakeStatus === "taken";
          const isMissed =
            intakeStatus === "missed" || intakeStatus === "skipped";
          const takenAtTime = intake?.takenAt;

          return (
            <div
              key={medication.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{medication.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {medication.dosageMg} mg
                  </Badge>
                </div>
                <div className="text-muted-foreground flex gap-2 text-xs">
                  <span>{FREQUENCY_LABELS[medication.frequency]}</span>
                  {medication.timeOfDay && (
                    <>
                      <span>·</span>
                      <span>{TIME_OF_DAY_LABELS[medication.timeOfDay]}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isTaken ? (
                  <Badge className="bg-green-500">
                    <Check className="mr-1 size-3" />
                    Pris {takenAtTime ? `a ${takenAtTime}` : ""}
                  </Badge>
                ) : isMissed ? (
                  <Badge variant="destructive">
                    <X className="mr-1 size-3" />
                    Manque
                  </Badge>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        mutation.mutate({
                          medicationId: medication.id,
                          status: "taken",
                        })
                      }
                      disabled={mutation.isPending}
                    >
                      <Check className="mr-1 size-3" />
                      Pris
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        mutation.mutate({
                          medicationId: medication.id,
                          status: "skipped",
                        })
                      }
                      disabled={mutation.isPending}
                    >
                      <Clock className="size-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
