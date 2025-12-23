"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Form, useForm } from "@/features/form/tanstack-form";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CaregiverEventSchema,
  type CaregiverEventSchemaType,
} from "../schemas/event.schema";
import { VisibilityToggle } from "./visibility-toggle";

// Labels pour les types d'événements
const EVENT_TYPE_LABELS: Record<string, string> = {
  compulsive_purchase: "Achat compulsif",
  crisis: "Crise",
  conflict: "Conflit",
  milestone: "Événement marquant",
  medication_issue: "Problème médicament",
  other: "Autre",
};

const SEVERITY_LABELS = ["Mineur", "Léger", "Modéré", "Important", "Grave"];

type EventFormProps = {
  subjectId: string;
  subjectName: string;
  spaceSlug: string;
  defaultValues?: Partial<CaregiverEventSchemaType>;
};

export const EventForm = ({
  subjectId,
  subjectName,
  spaceSlug,
  defaultValues,
}: EventFormProps) => {
  const router = useRouter();

  const form = useForm({
    schema: CaregiverEventSchema,
    defaultValues: {
      subjectId,
      occurredAt: defaultValues?.occurredAt ?? new Date().toISOString(),
      eventType: defaultValues?.eventType ?? "other",
      severity: defaultValues?.severity ?? 1,
      title: defaultValues?.title ?? "",
      details: defaultValues?.details ?? "",
      patientVisibility: defaultValues?.patientVisibility ?? "visible",
    },
    onSubmit: async () => {
      // TODO: Call server action when Prisma is ready
      toast.success("Événement signalé");
      router.push(`/space/${spaceSlug}/observations`);
    },
  });

  return (
    <Form form={form}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive size-5" />
            <CardTitle>Signaler un événement</CardTitle>
          </div>
          <CardDescription>
            Signalez un événement concernant {subjectName}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Type d'événement */}
          <form.AppField name="eventType">
            {(field) => (
              <field.Field>
                <field.Label>Type d&apos;événement</field.Label>
                <field.Content>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(
                        value as CaregiverEventSchemaType["eventType"],
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EVENT_TYPE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Titre */}
          <form.AppField name="title">
            {(field) => (
              <field.Field>
                <field.Label>Titre</field.Label>
                <field.Content>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Résumé de l'événement"
                    maxLength={100}
                  />
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Sévérité */}
          <form.AppField name="severity">
            {(field) => (
              <field.Field>
                <field.Label>
                  Gravité : {SEVERITY_LABELS[field.state.value - 1]}
                </field.Label>
                <field.Content>
                  <Slider
                    value={[field.state.value]}
                    onValueChange={([value]) => field.handleChange(value)}
                    min={1}
                    max={5}
                    step={1}
                    className="py-4"
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>Mineur</span>
                    <span>Grave</span>
                  </div>
                  <field.Message />
                </field.Content>
              </field.Field>
            )}
          </form.AppField>

          {/* Détails */}
          <form.AppField name="details">
            {(field) => (
              <field.Field>
                <field.Label>Détails (optionnel)</field.Label>
                <field.Content>
                  <Textarea
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Description détaillée de l'événement..."
                    rows={4}
                    maxLength={1000}
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
          <form.SubmitButton>Signaler</form.SubmitButton>
        </CardFooter>
      </Card>
    </Form>
  );
};
