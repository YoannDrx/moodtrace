"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Check,
  Loader2,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  CreditCard,
  Users,
  Star,
  Pill,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  EVENT_TYPE_LABELS,
  EVENT_TYPE_COLORS,
  SEVERITY_LABELS,
  SEVERITY_COLORS,
} from "./caregiver.schema";
import {
  createCaregiverEventAction,
  updateCaregiverEventAction,
} from "./caregiver.action";

const EVENT_TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  compulsive_purchase: <CreditCard className="size-4" />,
  crisis: <AlertTriangle className="size-4" />,
  conflict: <Users className="size-4" />,
  milestone: <Star className="size-4" />,
  medication_issue: <Pill className="size-4" />,
  other: <FileText className="size-4" />,
};

type CaregiverEventFormProps = {
  subjectId: string;
  subjectName: string;
  existingEvent?: {
    id: string;
    occurredAt: Date;
    eventType: string;
    severity: number;
    title: string;
    details?: string | null;
    patientVisibility?: string;
  } | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CaregiverEventForm({
  subjectId,
  subjectName,
  existingEvent,
  onSuccess,
  onCancel,
}: CaregiverEventFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!existingEvent;

  // Form state
  const [eventType, setEventType] = useState(existingEvent?.eventType ?? "");
  const [severity, setSeverity] = useState(existingEvent?.severity ?? 3);
  const [title, setTitle] = useState(existingEvent?.title ?? "");
  const [details, setDetails] = useState(existingEvent?.details ?? "");
  const [occurredAt, setOccurredAt] = useState(
    existingEvent
      ? format(new Date(existingEvent.occurredAt), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  );
  const [isVisible, setIsVisible] = useState(
    existingEvent?.patientVisibility !== "hidden",
  );

  const createMutation = useMutation({
    mutationFn: async () => {
      const result = await createCaregiverEventAction({
        subjectId,
        occurredAt: new Date(occurredAt).toISOString(),
        eventType: eventType as "compulsive_purchase" | "crisis" | "conflict" | "milestone" | "medication_issue" | "other",
        severity,
        title,
        details: details || null,
        patientVisibility: isVisible ? "visible" : "hidden",
      });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
      return result?.data;
    },
    onSuccess: () => {
      toast.success("Événement signalé");
      void queryClient.invalidateQueries({ queryKey: ["caregiver"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!existingEvent) return;
      const result = await updateCaregiverEventAction({
        id: existingEvent.id,
        subjectId,
        occurredAt: new Date(occurredAt).toISOString(),
        eventType: eventType as "compulsive_purchase" | "crisis" | "conflict" | "milestone" | "medication_issue" | "other",
        severity,
        title,
        details: details || null,
        patientVisibility: isVisible ? "visible" : "hidden",
      });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
      return result?.data;
    },
    onSuccess: () => {
      toast.success("Événement mis à jour");
      void queryClient.invalidateQueries({ queryKey: ["caregiver"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    if (!eventType || !title) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    if (isEditing) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {isEditing ? "Modifier l'événement" : `Signaler un événement pour ${subjectName}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event type */}
        <div className="space-y-3">
          <Label>Type d'événement *</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setEventType(value)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3 text-sm transition-all",
                  eventType === value
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-muted-foreground/30",
                )}
              >
                <div
                  className="flex size-6 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: EVENT_TYPE_COLORS[value] }}
                >
                  {EVENT_TYPE_ICON_MAP[value]}
                </div>
                <span className="text-left">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div className="space-y-3">
          <Label>Sévérité *</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSeverity(level)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg border p-2 text-sm transition-all",
                  severity === level
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-muted-foreground/30",
                )}
              >
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: SEVERITY_COLORS[level] }}
                />
                <span className="text-xs">{SEVERITY_LABELS[level]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brève description de l'événement"
            maxLength={200}
          />
        </div>

        {/* Date/time */}
        <div className="space-y-2">
          <Label htmlFor="occurredAt">Date et heure *</Label>
          <Input
            id="occurredAt"
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
          />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <Label htmlFor="details">Détails</Label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Contexte, observations, actions prises..."
            rows={4}
            maxLength={2000}
          />
        </div>

        {/* Visibility toggle */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            {isVisible ? (
              <Eye className="size-4 text-muted-foreground" />
            ) : (
              <EyeOff className="size-4 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isVisible ? "Visible" : "Masqué"} au patient
              </p>
              <p className="text-xs text-muted-foreground">
                {isVisible
                  ? "Le patient peut voir cet événement"
                  : "Cet événement est privé"}
              </p>
            </div>
          </div>
          <Switch checked={isVisible} onCheckedChange={setIsVisible} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 size-4" />
              Annuler
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {isEditing ? "Mise à jour..." : "Enregistrement..."}
              </>
            ) : (
              <>
                <Check className="mr-2 size-4" />
                {isEditing ? "Mettre à jour" : "Signaler"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
