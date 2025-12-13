"use client";

import { MoodScale, type MoodValue } from "@/components/nowts/mood-indicator";
import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { useMutation } from "@tanstack/react-query";
import { Battery, BedDouble, Brain, Loader2, Save } from "lucide-react";
import { useState } from "react";
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

  const [showOptional, setShowOptional] = useState(
    Boolean(
      initialData?.energy ??
      initialData?.sleepHours ??
      initialData?.sleepQuality ??
      initialData?.anxiety,
    ),
  );

  const mutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        saveMoodEntryAction({
          date: today,
          mood,
          energy: showOptional ? energy : null,
          sleepHours: showOptional ? sleepHours : null,
          sleepQuality: showOptional ? sleepQuality : null,
          anxiety: showOptional ? anxiety : null,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="text-primary size-5" />
          Comment vous sentez-vous ?
        </CardTitle>
        <Typography variant="muted">
          {new Date(today).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </Typography>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Scale - Main */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Humeur</Label>
          <MoodScale
            value={mood}
            onChange={setMood}
            className="justify-center"
          />
        </div>

        {/* Toggle optional fields */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowOptional(!showOptional)}
          className="w-full"
        >
          {showOptional ? "Masquer les details" : "Ajouter plus de details"}
        </Button>

        {showOptional && (
          <div className="space-y-6 border-t pt-6">
            {/* Energy */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Battery className="text-primary size-4" />
                  Energie
                </Label>
                <span className="text-muted-foreground text-sm">
                  {ENERGY_LABELS[energy]}
                </span>
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

            {/* Sleep Hours */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <BedDouble className="text-primary size-4" />
                  Heures de sommeil
                </Label>
                <span className="text-muted-foreground text-sm">
                  {sleepHours}h
                </span>
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

            {/* Sleep Quality */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Qualite du sommeil</Label>
                <span className="text-muted-foreground text-sm">
                  {SLEEP_QUALITY_LABELS[sleepQuality]}
                </span>
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

            {/* Anxiety */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Anxiete</Label>
                <span className="text-muted-foreground text-sm">
                  {ANXIETY_LABELS[anxiety]}
                </span>
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

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optionnel)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Comment s'est passee votre journee ?"
            rows={3}
            maxLength={2000}
          />
        </div>

        {/* Submit */}
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="w-full"
          size="lg"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              Enregistrer
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
