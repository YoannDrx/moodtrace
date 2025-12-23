"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  MOOD_OBSERVED_LABELS,
  MOOD_OBSERVED_COLORS,
  ENERGY_OBSERVED_LABELS,
  SOCIAL_BEHAVIOR_LABELS,
  SLEEP_OBSERVED_LABELS,
} from "./caregiver.schema";
import { saveCaregiverCheckinAction } from "./caregiver.action";

type CaregiverCheckinFormProps = {
  subjectId: string;
  subjectName: string;
  existingCheckin?: {
    moodObserved?: string | null;
    energyObserved?: string | null;
    socialBehavior?: string | null;
    sleepObserved?: string | null;
    notes?: string | null;
    patientVisibility?: string;
  } | null;
  date?: string;
  onSuccess?: () => void;
};

export function CaregiverCheckinForm({
  subjectId,
  subjectName,
  existingCheckin,
  date = format(new Date(), "yyyy-MM-dd"),
  onSuccess,
}: CaregiverCheckinFormProps) {
  const queryClient = useQueryClient();

  // Form state
  const [moodObserved, setMoodObserved] = useState<string | null>(
    existingCheckin?.moodObserved ?? null,
  );
  const [energyObserved, setEnergyObserved] = useState<string | null>(
    existingCheckin?.energyObserved ?? null,
  );
  const [socialBehavior, setSocialBehavior] = useState<string | null>(
    existingCheckin?.socialBehavior ?? null,
  );
  const [sleepObserved, setSleepObserved] = useState<string | null>(
    existingCheckin?.sleepObserved ?? null,
  );
  const [notes, setNotes] = useState(existingCheckin?.notes ?? "");
  const [isVisible, setIsVisible] = useState(
    existingCheckin?.patientVisibility !== "hidden",
  );

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await saveCaregiverCheckinAction({
        subjectId,
        date,
        moodObserved: moodObserved as "very_good" | "good" | "neutral" | "down" | "very_down" | "concerning" | null,
        energyObserved: energyObserved as "high" | "normal" | "low" | "very_low" | null,
        socialBehavior: socialBehavior as "engaged" | "normal" | "withdrawn" | "isolated" | null,
        sleepObserved: sleepObserved as "good" | "restless" | "insomnia" | "oversleeping" | null,
        notes: notes || null,
        patientVisibility: isVisible ? "visible" : "hidden",
      });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
      return result?.data;
    },
    onSuccess: () => {
      toast.success("Observation enregistrée");
      void queryClient.invalidateQueries({ queryKey: ["caregiver"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!moodObserved) {
      toast.error("Veuillez indiquer l'humeur observée");
      return;
    }
    mutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Observation de {subjectName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood observed */}
        <div className="space-y-3">
          <Label>Humeur observée *</Label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(MOOD_OBSERVED_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMoodObserved(value)}
                className={cn(
                  "rounded-lg border p-3 text-sm transition-all",
                  moodObserved === value
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-muted-foreground/30",
                )}
              >
                <div
                  className="mx-auto mb-1 size-4 rounded-full"
                  style={{ backgroundColor: MOOD_OBSERVED_COLORS[value] }}
                />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="space-y-2">
          <Label htmlFor="energy">Niveau d'énergie</Label>
          <Select
            value={energyObserved ?? ""}
            onValueChange={(v) => setEnergyObserved(v || null)}
          >
            <SelectTrigger id="energy">
              <SelectValue placeholder="Non observé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Non observé</SelectItem>
              {Object.entries(ENERGY_OBSERVED_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Social behavior */}
        <div className="space-y-2">
          <Label htmlFor="social">Comportement social</Label>
          <Select
            value={socialBehavior ?? ""}
            onValueChange={(v) => setSocialBehavior(v || null)}
          >
            <SelectTrigger id="social">
              <SelectValue placeholder="Non observé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Non observé</SelectItem>
              {Object.entries(SOCIAL_BEHAVIOR_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sleep */}
        <div className="space-y-2">
          <Label htmlFor="sleep">Sommeil observé</Label>
          <Select
            value={sleepObserved ?? ""}
            onValueChange={(v) => setSleepObserved(v || null)}
          >
            <SelectTrigger id="sleep">
              <SelectValue placeholder="Non observé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Non observé</SelectItem>
              {Object.entries(SLEEP_OBSERVED_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observations, contexte, événements particuliers..."
            rows={3}
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
                  ? "Le patient peut voir cette observation"
                  : "Cette observation est privée"}
              </p>
            </div>
          </div>
          <Switch checked={isVisible} onCheckedChange={setIsVisible} />
        </div>

        {/* Submit */}
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Check className="mr-2 size-4" />
              Enregistrer l'observation
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
