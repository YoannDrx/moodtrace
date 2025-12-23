"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { Clock, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicationIntakeCard } from "@/components/nowts/medication-card";
import { recordIntakeAction } from "./medication.action";
import type { Medication, MedicationIntake } from "@/generated/prisma";

type MedicationWithStatus = Medication & {
  todayIntakes: MedicationIntake[];
  nextDoseTime: string | null;
};

type TodayIntakeProps = {
  medications: MedicationWithStatus[];
};

export function TodayIntake({ medications }: TodayIntakeProps) {
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const intakeMutation = useMutation({
    mutationFn: async ({
      medicationId,
      scheduledAt,
    }: {
      medicationId: string;
      scheduledAt: string;
    }) => {
      const result = await recordIntakeAction({
        medicationId,
        date: today,
        scheduledAt,
        takenAt: format(new Date(), "HH:mm"),
        status: "taken",
      });
      if (result?.serverError) throw new Error(result.serverError);
      return result?.data;
    },
    onSuccess: () => {
      toast.success("Prise enregistrée");
      void queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Calculate overall progress
  const totalRequired = medications.reduce((acc, med) => {
    if (med.frequency === "three_times_daily") return acc + 3;
    if (med.frequency === "twice_daily") return acc + 2;
    if (med.frequency === "daily") return acc + 1;
    return acc;
  }, 0);

  const totalTaken = medications.reduce((acc, med) => {
    return acc + med.todayIntakes.filter((i) => i.status === "taken").length;
  }, 0);

  const allComplete = totalRequired > 0 && totalTaken >= totalRequired;

  if (medications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="size-5" />
            Prises du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-4">
            Aucun médicament actif à prendre aujourd'hui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="size-5" />
            Prises du jour
          </CardTitle>
          {totalRequired > 0 && (
            <span
              className={`text-sm font-medium ${
                allComplete ? "text-green-600" : "text-muted-foreground"
              }`}
            >
              {allComplete ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-4" />
                  Complet
                </span>
              ) : (
                `${totalTaken}/${totalRequired} prises`
              )}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {medications.map((medication) => (
          <MedicationIntakeCard
            key={medication.id}
            medication={medication}
            todayIntakes={medication.todayIntakes}
            nextDoseTime={medication.nextDoseTime}
            onRecordIntake={(medicationId, scheduledAt) =>
              intakeMutation.mutate({ medicationId, scheduledAt })
            }
            isPending={intakeMutation.isPending}
          />
        ))}
      </CardContent>
    </Card>
  );
}
