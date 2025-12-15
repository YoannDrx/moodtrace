"use client";

import { MoodScale, type MoodValue } from "@/components/nowts/mood-indicator";
import { StepIndicator } from "@/components/nowts/stat-card";
import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { moodLabels } from "@/lib/design-tokens";
import { useMutation } from "@tanstack/react-query";
import {
  Battery,
  BedDouble,
  Brain,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Save,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { saveMoodEntryAction } from "./mood.action";
import {
  ANXIETY_LABELS,
  ENERGY_LABELS,
  SLEEP_QUALITY_LABELS,
} from "./mood.schema";

type MoodEntryFormProps = {
  date?: string;
  initialData?: {
    mood: number;
    energy?: number | null;
    sleepHours?: number | null;
    sleepQuality?: number | null;
    anxiety?: number | null;
    notes?: string | null;
  };
  onSuccess?: () => void;
};

export function MoodEntryForm({
  date,
  initialData,
  onSuccess,
}: MoodEntryFormProps) {
  const today = date ?? new Date().toISOString().split("T")[0];

  const [mood, setMood] = useState<MoodValue>(
    (initialData?.mood as MoodValue | undefined) ?? 5,
  );
  const [energy, setEnergy] = useState(initialData?.energy ?? 5);
  const [sleepHours, setSleepHours] = useState(initialData?.sleepHours ?? 7);
  const [sleepQuality, setSleepQuality] = useState(
    initialData?.sleepQuality ?? 5,
  );
  const [anxiety, setAnxiety] = useState(initialData?.anxiety ?? 3);
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  const [includeDetails, setIncludeDetails] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = useMemo(() => {
    const quickSteps = [
      { label: "Humeur", Icon: Brain },
      { label: "Notes", Icon: MessageSquare },
    ] as const;

    const fullSteps = [
      { label: "Humeur", Icon: Brain },
      { label: "Sommeil", Icon: BedDouble },
      { label: "Énergie", Icon: Battery },
      { label: "Notes", Icon: MessageSquare },
    ] as const;

    return includeDetails ? fullSteps : quickSteps;
  }, [includeDetails]);

  const totalSteps = steps.length;

  useEffect(() => {
    setCurrentStep((step) => Math.min(step, totalSteps));
  }, [totalSteps]);

  const mutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        saveMoodEntryAction({
          date: today,
          mood,
          energy: includeDetails ? energy : null,
          sleepHours: includeDetails ? sleepHours : null,
          sleepQuality: includeDetails ? sleepQuality : null,
          anxiety: includeDetails ? anxiety : null,
          notes: notes || null,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Entree enregistree");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const goToPrevious = () => {
    setCurrentStep((step) => Math.max(1, step - 1));
  };

  const goToNext = () => {
    setCurrentStep((step) => Math.min(totalSteps, step + 1));
  };

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-primary size-5" />
              Check-in quotidien
            </CardTitle>
            <Typography variant="muted">
              {new Date(today).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Typography>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIncludeDetails((v) => !v)}
            className="w-fit"
          >
            {includeDetails ? "Check-in rapide" : "Ajouter des détails"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <StepIndicator
          totalSteps={totalSteps}
          currentStep={currentStep}
          labels={steps.map((s) => s.label)}
          icons={steps.map((s) => s.Icon)}
        />

        <div className="animate-fade-in flex flex-col gap-6">
          {/* Step 1 — Mood */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between gap-4">
                <Label className="text-base font-medium">Humeur</Label>
                <Typography variant="small" className="text-muted-foreground">
                  {mood}/10 · {moodLabels[mood]}
                </Typography>
              </div>
              <MoodScale
                value={mood}
                onChange={setMood}
                className="justify-center"
              />
              <Typography variant="caption" className="text-center">
                Choisissez une note qui reflète votre journée, sans jugement.
              </Typography>
            </div>
          )}

          {/* Step 2 — Sleep (only in detailed mode) */}
          {includeDetails && currentStep === 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <Label className="flex items-center gap-2">
                    <BedDouble className="text-primary size-4" />
                    Heures de sommeil
                  </Label>
                  <Typography variant="small" className="text-muted-foreground">
                    {sleepHours}h
                  </Typography>
                </div>
                <Slider
                  value={[sleepHours]}
                  onValueChange={([v]) => setSleepHours(v)}
                  min={0}
                  max={14}
                  step={0.5}
                  className="py-2"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <Label>Qualite du sommeil</Label>
                  <Typography variant="small" className="text-muted-foreground">
                    {SLEEP_QUALITY_LABELS[sleepQuality]}
                  </Typography>
                </div>
                <Slider
                  value={[sleepQuality]}
                  onValueChange={([v]) => setSleepQuality(v)}
                  min={1}
                  max={10}
                  step={1}
                  className="py-2"
                />
              </div>
            </div>
          )}

          {/* Step 3 — Energy & Anxiety (only in detailed mode) */}
          {includeDetails && currentStep === 3 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <Label className="flex items-center gap-2">
                    <Battery className="text-primary size-4" />
                    Energie
                  </Label>
                  <Typography variant="small" className="text-muted-foreground">
                    {ENERGY_LABELS[energy]}
                  </Typography>
                </div>
                <Slider
                  value={[energy]}
                  onValueChange={([v]) => setEnergy(v)}
                  min={1}
                  max={10}
                  step={1}
                  className="py-2"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <Label>Anxiete</Label>
                  <Typography variant="small" className="text-muted-foreground">
                    {ANXIETY_LABELS[anxiety]}
                  </Typography>
                </div>
                <Slider
                  value={[anxiety]}
                  onValueChange={([v]) => setAnxiety(v)}
                  min={1}
                  max={10}
                  step={1}
                  className="py-2"
                />
              </div>
            </div>
          )}

          {/* Final step — Notes */}
          {((includeDetails && currentStep === 4) ||
            (!includeDetails && currentStep === 2)) && (
            <div className="flex flex-col gap-3">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comment s'est passee votre journee ?"
                rows={4}
                maxLength={2000}
              />
              <Typography variant="caption">
                Vous pouvez noter un contexte, un changement de traitement, ou
                tout élément utile pour votre suivi.
              </Typography>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1 justify-center gap-2"
            onClick={goToPrevious}
            disabled={isFirstStep || mutation.isPending}
          >
            <ChevronLeft className="size-4" />
            Précédent
          </Button>

          {isLastStep ? (
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="flex-1 justify-center gap-2"
              size="lg"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Enregistrer
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              className="flex-1 justify-center gap-2"
              onClick={goToNext}
              disabled={mutation.isPending}
            >
              Suivant
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
