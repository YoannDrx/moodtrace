"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, useForm } from "@/features/form/tanstack-form";
import { dayjs } from "@/lib/dayjs";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DailyCheckinSchema,
  type DailyCheckinSchemaType,
} from "../schemas/daily-checkin.schema";
import { VisibilityToggle } from "./visibility-toggle";

// Labels pour l'UI
const MOOD_LABELS: Record<string, string> = {
  very_good: "Très bien",
  good: "Bien",
  neutral: "Neutre",
  down: "Bas",
  very_down: "Très bas",
  concerning: "Préoccupant",
};

const ENERGY_LABELS: Record<string, string> = {
  high: "Élevée",
  normal: "Normale",
  low: "Basse",
  very_low: "Très basse",
};

const SOCIAL_LABELS: Record<string, string> = {
  engaged: "Engagé",
  normal: "Normal",
  withdrawn: "Replié",
  isolated: "Isolé",
};

const SLEEP_LABELS: Record<string, string> = {
  good: "Bon",
  restless: "Agité",
  insomnia: "Insomnie",
  oversleeping: "Hypersomnie",
};

type DailyCheckinFormProps = {
  subjectId: string;
  subjectName: string;
  spaceSlug: string;
  defaultValues?: Partial<DailyCheckinSchemaType>;
};

export const DailyCheckinForm = ({
  subjectId,
  subjectName,
  spaceSlug,
  defaultValues,
}: DailyCheckinFormProps) => {
  const router = useRouter();
  const today = dayjs().format("YYYY-MM-DD");

  const form = useForm({
    schema: DailyCheckinSchema,
    defaultValues: {
      subjectId,
      date: defaultValues?.date ?? today,
      moodObserved: defaultValues?.moodObserved,
      energyObserved: defaultValues?.energyObserved,
      socialBehavior: defaultValues?.socialBehavior,
      sleepObserved: defaultValues?.sleepObserved,
      notes: defaultValues?.notes ?? "",
      patientVisibility: defaultValues?.patientVisibility ?? "visible",
    },
    onSubmit: async () => {
      // TODO: Call server action when Prisma is ready
      toast.success("Observation enregistrée");
      router.push(`/space/${spaceSlug}/observations`);
    },
  });

  const formattedDate = dayjs(form.state.values.date)
    .locale("fr")
    .format("dddd D MMMM");

  return (
    <Form form={form}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="text-primary size-5" />
            <CardTitle>Observation quotidienne</CardTitle>
          </div>
          <CardDescription>
            Comment va {subjectName} aujourd&apos;hui ? ({formattedDate})
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Humeur observée */}
          <form.AppField name="moodObserved">
            {(field) => (
              <field.Field>
                <field.Label>Humeur observée</field.Label>
                <field.Content>
                  <Select
                    value={field.state.value ?? ""}
                    onValueChange={(value) =>
                      field.handleChange(value as typeof field.state.value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MOOD_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Énergie observée */}
          <form.AppField name="energyObserved">
            {(field) => (
              <field.Field>
                <field.Label>Niveau d&apos;énergie</field.Label>
                <field.Content>
                  <Select
                    value={field.state.value ?? ""}
                    onValueChange={(value) =>
                      field.handleChange(value as typeof field.state.value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ENERGY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Comportement social */}
          <form.AppField name="socialBehavior">
            {(field) => (
              <field.Field>
                <field.Label>Comportement social</field.Label>
                <field.Content>
                  <Select
                    value={field.state.value ?? ""}
                    onValueChange={(value) =>
                      field.handleChange(value as typeof field.state.value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SOCIAL_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Sommeil observé */}
          <form.AppField name="sleepObserved">
            {(field) => (
              <field.Field>
                <field.Label>Qualité du sommeil</field.Label>
                <field.Content>
                  <Select
                    value={field.state.value ?? ""}
                    onValueChange={(value) =>
                      field.handleChange(value as typeof field.state.value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SLEEP_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Textarea
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Observations supplémentaires..."
                    rows={4}
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Visibilité */}
          <form.AppField name="patientVisibility">
            {(field) => (
              <VisibilityToggle
                isHidden={field.state.value === "hidden"}
                onToggle={(hidden) =>
                  field.handleChange(hidden ? "hidden" : "visible")
                }
              />
            )}
          </form.AppField>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <form.SubmitButton>Enregistrer</form.SubmitButton>
        </CardFooter>
      </Card>
    </Form>
  );
};
