"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, useForm } from "@/features/form/tanstack-form";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pill } from "lucide-react";
import { toast } from "sonner";
import {
  createMedicationAction,
  updateMedicationAction,
} from "./medication.action";
import {
  COMMON_MEDICATIONS,
  FREQUENCY_LABELS,
  type MedicationInput,
  MedicationSchema,
  TIME_OF_DAY_LABELS,
} from "./medication.schema";

type MedicationFormProps = {
  initialData?: {
    id: string;
    name: string;
    molecule?: string | null;
    dosageMg: number;
    frequency: string;
    timeOfDay?: string | null;
    startDate: string;
    endDate?: string | null;
    notes?: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function MedicationForm({
  initialData,
  onSuccess,
  onCancel,
}: MedicationFormProps) {
  const queryClient = useQueryClient();
  const isEditing = Boolean(initialData?.id);

  const mutation = useMutation({
    mutationFn: async (values: MedicationInput) => {
      if (isEditing && initialData?.id) {
        return resolveActionResult(
          updateMedicationAction({ ...values, id: initialData.id }),
        );
      }
      return resolveActionResult(createMedicationAction(values));
    },
    onSuccess: () => {
      toast.success(isEditing ? "Medicament mis a jour" : "Medicament ajoute");
      void queryClient.invalidateQueries({ queryKey: ["medications"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm({
    schema: MedicationSchema,
    defaultValues: {
      name: initialData?.name ?? "",
      molecule: initialData?.molecule ?? "",
      dosageMg: initialData?.dosageMg ?? 0,
      frequency:
        (initialData?.frequency as
          | "daily"
          | "twice_daily"
          | "three_times_daily"
          | "as_needed"
          | "weekly"
          | undefined) ?? "daily",
      timeOfDay:
        (initialData?.timeOfDay as
          | "morning"
          | "evening"
          | "both"
          | "any"
          | null) ?? null,
      startDate:
        initialData?.startDate ?? new Date().toISOString().split("T")[0],
      endDate: initialData?.endDate ?? null,
      notes: initialData?.notes ?? "",
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  // Handle medication selection from common list
  const handleMedicationSelect = (name: string) => {
    const medication = COMMON_MEDICATIONS.find((m) => m.name === name);
    if (medication) {
      form.setFieldValue("name", medication.name);
      form.setFieldValue("molecule", medication.molecule);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="text-primary size-5" />
          {isEditing ? "Modifier le medicament" : "Ajouter un medicament"}
        </CardTitle>
      </CardHeader>
      <Form form={form}>
        <CardContent className="flex flex-col gap-4">
          {/* Name with autocomplete */}
          <form.AppField name="name">
            {(field) => (
              <field.Field>
                <field.Label>Nom du medicament</field.Label>
                <field.Content>
                  <field.Input
                    type="text"
                    placeholder="Ex: Lamictal"
                    list="medication-suggestions"
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      handleMedicationSelect(e.target.value);
                    }}
                  />
                  <datalist id="medication-suggestions">
                    {COMMON_MEDICATIONS.map((med) => (
                      <option key={med.name} value={med.name}>
                        {med.molecule}
                      </option>
                    ))}
                  </datalist>
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Molecule */}
          <form.AppField name="molecule">
            {(field) => (
              <field.Field>
                <field.Label>Molecule (optionnel)</field.Label>
                <field.Content>
                  <field.Input type="text" placeholder="Ex: Lamotrigine" />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Dosage */}
          <form.AppField name="dosageMg">
            {(field) => (
              <field.Field>
                <field.Label>Dosage (mg)</field.Label>
                <field.Content>
                  <field.Input
                    type="number"
                    min={0}
                    max={10000}
                    placeholder="Ex: 100"
                    onChange={(e) => {
                      field.handleChange(Number(e.target.value));
                    }}
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Frequency */}
          <form.AppField name="frequency">
            {(field) => (
              <field.Field>
                <field.Label>Frequence</field.Label>
                <field.Content>
                  <field.Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionnez la frequence" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FREQUENCY_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </field.Select>
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Time of Day */}
          <form.AppField name="timeOfDay">
            {(field) => (
              <field.Field>
                <field.Label>Moment de la journee (optionnel)</field.Label>
                <field.Content>
                  <field.Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionnez le moment" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIME_OF_DAY_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </field.Select>
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Start Date */}
          <form.AppField name="startDate">
            {(field) => (
              <field.Field>
                <field.Label>Date de debut</field.Label>
                <field.Content>
                  <field.Input type="date" />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Notes */}
          <form.AppField name="notes">
            {(field) => (
              <field.Field>
                <field.Label>Notes (optionnel)</field.Label>
                <field.Content>
                  <field.Textarea
                    placeholder="Notes supplementaires..."
                    rows={2}
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Annuler
            </button>
          )}
          <form.SubmitButton>
            {isEditing ? "Mettre a jour" : "Ajouter"}
          </form.SubmitButton>
        </CardFooter>
      </Form>
    </Card>
  );
}
