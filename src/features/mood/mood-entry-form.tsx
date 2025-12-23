"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MoodSliderBipolar } from "@/components/nowts/mood-slider-bipolar";
import {
  SliderInput,
  QualitySelector,
  LevelSelector,
} from "@/components/nowts/slider-input";
import { StepIndicator } from "@/components/nowts/stat-card";
import type { MoodValueBipolar } from "@/lib/design-tokens";
import { ENERGY_LABELS, ANXIETY_LABELS } from "@/features/mood/mood.schema";
import { saveMoodEntryAction } from "@/features/mood/mood.action";

type MoodEntryFormProps = {
  existingEntry?: {
    mood: number;
    energy: number | null;
    sleepHours: number | null;
    sleepQuality: string | null;
    anxiety: number | null;
    notes: string | null;
  } | null;
  date?: string;
  onSuccess?: () => void;
};

export function MoodEntryForm({
  existingEntry,
  date = format(new Date(), "yyyy-MM-dd"),
  onSuccess,
}: MoodEntryFormProps) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form state
  const [mood, setMood] = useState<MoodValueBipolar>(
    (existingEntry?.mood as MoodValueBipolar) ?? 0,
  );
  const [sleepHours, setSleepHours] = useState(existingEntry?.sleepHours ?? 7);
  const [sleepQuality, setSleepQuality] = useState<
    "bad" | "average" | "good" | null
  >((existingEntry?.sleepQuality as "bad" | "average" | "good" | null) ?? null);
  const [energy, setEnergy] = useState(existingEntry?.energy ?? 5);
  const [anxiety, setAnxiety] = useState(existingEntry?.anxiety ?? 1);
  const [notes, setNotes] = useState(existingEntry?.notes ?? "");

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await saveMoodEntryAction({
        date,
        mood,
        energy,
        sleepHours,
        sleepQuality,
        anxiety,
        notes: notes || null,
        tags: [],
        sideEffects: [],
      });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
      return result?.data;
    },
    onSuccess: () => {
      toast.success("Entrée enregistrée avec succès");
      void queryClient.invalidateQueries({ queryKey: ["mood"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    mutation.mutate();
  };

  const stepLabels = ["Humeur", "Sommeil", "Énergie", "Notes"];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Check-in du jour</CardTitle>
        <StepIndicator
          totalSteps={totalSteps}
          currentStep={currentStep}
          labels={stepLabels}
          className="mt-4"
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Mood */}
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-lg font-medium">
              Comment vous sentez-vous aujourd'hui ?
            </h3>
            <MoodSliderBipolar value={mood} onChange={setMood} />
          </div>
        )}

        {/* Step 2: Sleep */}
        {currentStep === 2 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-lg font-medium">Comment avez-vous dormi ?</h3>
            <SliderInput
              label="Heures de sommeil"
              value={sleepHours}
              onChange={setSleepHours}
              min={0}
              max={12}
              step={0.5}
              unit="h"
              minLabel="0h"
              maxLabel="12h"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Qualité du sommeil</label>
              <QualitySelector
                value={sleepQuality}
                onChange={setSleepQuality}
              />
            </div>
          </div>
        )}

        {/* Step 3: Energy & Anxiety */}
        {currentStep === 3 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-lg font-medium">Énergie et anxiété</h3>
            <LevelSelector
              label="Niveau d'énergie"
              value={energy}
              onChange={setEnergy}
              min={1}
              max={10}
              labels={ENERGY_LABELS}
            />
            <LevelSelector
              label="Niveau d'anxiété"
              value={anxiety}
              onChange={setAnxiety}
              min={1}
              max={10}
              labels={ANXIETY_LABELS}
            />
          </div>
        )}

        {/* Step 4: Notes */}
        {currentStep === 4 && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-lg font-medium">Notes (optionnel)</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Comment s'est passée votre journée ? Y a-t-il des événements importants à noter ?"
              rows={4}
              maxLength={2000}
            />
            <p className="text-muted-foreground text-xs text-right">
              {notes.length}/2000
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 size-4" />
            Précédent
          </Button>

          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Suivant
              <ChevronRight className="ml-2 size-4" />
            </Button>
          ) : (
            <Button
              type="button"
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
                  Enregistrer
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
