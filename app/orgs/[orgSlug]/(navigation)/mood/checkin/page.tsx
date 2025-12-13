"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MoodSliderBipolar } from "@/components/nowts/mood-slider-bipolar";
import { SliderInput, QualitySelector } from "@/components/nowts/slider-input";
import {
  ContextTagsSelector,
  SideEffectsSelector,
} from "@/components/nowts/tag-selector";
import { StepIndicator } from "@/components/nowts/stat-card";
import { MedicationIntakeToggle } from "@/components/nowts/medication-card";
import { Typography } from "@/components/nowts/typography";
import type { MoodValueBipolar } from "@/lib/design-tokens";
import type { SleepQuality, ContextTag, SideEffect } from "@/lib/design-tokens";
import {
  Heart,
  Moon,
  Pill,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

type CheckinData = {
  // Step 1: Mood
  mood: MoodValueBipolar | null;
  energy: number;
  anxiety: number;
  irritability: number;
  // Step 2: Sleep
  sleepHours: number;
  sleepQuality: SleepQuality | null;
  // Step 3: Medication
  medicationsTaken: Record<string, boolean>;
  sideEffects: SideEffect[];
  // Step 4: Context
  contextTags: ContextTag[];
  notes: string;
};

const initialData: CheckinData = {
  mood: null,
  energy: 5,
  anxiety: 3,
  irritability: 3,
  sleepHours: 7,
  sleepQuality: null,
  medicationsTaken: {},
  sideEffects: [],
  contextTags: [],
  notes: "",
};

// Mock medications for demo - in real app, fetch from API
const mockMedications = [
  { id: "1", name: "Lithium", dosage: "400mg", timeOfDay: "matin" },
  { id: "2", name: "Lamictal", dosage: "200mg", timeOfDay: "soir" },
  { id: "3", name: "Quetiapine", dosage: "50mg", timeOfDay: "soir" },
];

export default function CheckinPage() {
  const router = useRouter();
  const params = useParams();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<CheckinData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepLabels = ["Humeur", "Sommeil", "Medication", "Contexte"];

  const updateData = <K extends keyof CheckinData>(
    key: K,
    value: CheckinData[K],
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.mood !== null;
      case 2:
        return data.sleepQuality !== null;
      case 3:
        return true; // Medications are optional
      case 4:
        return true; // Context is optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In real app, submit to API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Check-in enregistre avec succes !");
      router.push(`/orgs/${params.orgSlug}`);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMedication = (id: string, taken: boolean) => {
    setData((prev) => ({
      ...prev,
      medicationsTaken: {
        ...prev.medicationsTaken,
        [id]: taken,
      },
    }));
  };

  return (
    <Layout size="default">
      <LayoutHeader>
        <LayoutTitle className="flex items-center gap-2">
          <Heart className="text-primary size-6" />
          Check-in quotidien
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        {/* Step Indicator */}
        <StepIndicator totalSteps={4} currentStep={step} labels={stepLabels} />

        {/* Step Content */}
        <Card className="min-h-[400px]">
          <CardContent className="p-6">
            {step === 1 && (
              <StepMood
                mood={data.mood}
                energy={data.energy}
                anxiety={data.anxiety}
                irritability={data.irritability}
                onMoodChange={(v) => updateData("mood", v)}
                onEnergyChange={(v) => updateData("energy", v)}
                onAnxietyChange={(v) => updateData("anxiety", v)}
                onIrritabilityChange={(v) => updateData("irritability", v)}
              />
            )}

            {step === 2 && (
              <StepSleep
                hours={data.sleepHours}
                quality={data.sleepQuality}
                onHoursChange={(v) => updateData("sleepHours", v)}
                onQualityChange={(v) => updateData("sleepQuality", v)}
              />
            )}

            {step === 3 && (
              <StepMedication
                medications={mockMedications}
                taken={data.medicationsTaken}
                sideEffects={data.sideEffects}
                onToggle={toggleMedication}
                onSideEffectsChange={(v) => updateData("sideEffects", v)}
              />
            )}

            {step === 4 && (
              <StepContext
                tags={data.contextTags}
                notes={data.notes}
                onTagsChange={(v) => updateData("contextTags", v)}
                onNotesChange={(v) => updateData("notes", v)}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 size-4" />
            Retour
          </Button>

          {step < 4 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Suivant
              <ArrowRight className="ml-2 size-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Check className="mr-2 size-4" />
              )}
              Terminer
            </Button>
          )}
        </div>
      </LayoutContent>
    </Layout>
  );
}

// Step 1: Mood
type StepMoodProps = {
  mood: MoodValueBipolar | null;
  energy: number;
  anxiety: number;
  irritability: number;
  onMoodChange: (v: MoodValueBipolar) => void;
  onEnergyChange: (v: number) => void;
  onAnxietyChange: (v: number) => void;
  onIrritabilityChange: (v: number) => void;
};

function StepMood({
  mood,
  energy,
  anxiety,
  irritability,
  onMoodChange,
  onEnergyChange,
  onAnxietyChange,
  onIrritabilityChange,
}: StepMoodProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-full p-2">
          <Heart className="size-5" />
        </div>
        <Typography variant="h3">Comment vous sentez-vous ?</Typography>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <Typography variant="small" className="text-muted-foreground mb-4">
            Selectionnez votre humeur actuelle
          </Typography>
          <MoodSliderBipolar value={mood ?? 0} onChange={onMoodChange} />
        </div>

        <SliderInput
          label="Energie"
          value={energy}
          onChange={onEnergyChange}
          min={1}
          max={10}
          showLabels={{ min: "Tres faible", max: "Tres elevee" }}
        />

        <SliderInput
          label="Anxiete"
          value={anxiety}
          onChange={onAnxietyChange}
          min={1}
          max={10}
          showLabels={{ min: "Aucune", max: "Tres forte" }}
        />

        <SliderInput
          label="Irritabilite"
          value={irritability}
          onChange={onIrritabilityChange}
          min={1}
          max={10}
          showLabels={{ min: "Aucune", max: "Tres forte" }}
        />
      </div>
    </div>
  );
}

// Step 2: Sleep
type StepSleepProps = {
  hours: number;
  quality: SleepQuality | null;
  onHoursChange: (v: number) => void;
  onQualityChange: (v: SleepQuality) => void;
};

function StepSleep({
  hours,
  quality,
  onHoursChange,
  onQualityChange,
}: StepSleepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-full p-2">
          <Moon className="size-5" />
        </div>
        <Typography variant="h3">Comment avez-vous dormi ?</Typography>
      </div>

      <div className="flex flex-col gap-6">
        <SliderInput
          label="Heures de sommeil"
          value={hours}
          onChange={onHoursChange}
          min={0}
          max={12}
          step={0.5}
          unit="h"
          showLabels={{ min: "0h", max: "12h" }}
        />

        <div>
          <Typography variant="small" className="text-muted-foreground mb-3">
            Qualite du sommeil
          </Typography>
          <QualitySelector value={quality} onChange={onQualityChange} />
        </div>
      </div>
    </div>
  );
}

// Step 3: Medication
type StepMedicationProps = {
  medications: {
    id: string;
    name: string;
    dosage: string;
    timeOfDay: string;
  }[];
  taken: Record<string, boolean>;
  sideEffects: SideEffect[];
  onToggle: (id: string, taken: boolean) => void;
  onSideEffectsChange: (effects: SideEffect[]) => void;
};

function StepMedication({
  medications,
  taken,
  sideEffects,
  onToggle,
  onSideEffectsChange,
}: StepMedicationProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-full p-2">
          <Pill className="size-5" />
        </div>
        <Typography variant="h3">Avez-vous pris vos medicaments ?</Typography>
      </div>

      <div className="flex flex-col gap-4">
        {medications.map((med) => (
          <MedicationIntakeToggle
            key={med.id}
            name={med.name}
            dosage={med.dosage}
            timeOfDay={med.timeOfDay}
            taken={taken[med.id] ?? false}
            onChange={(v) => onToggle(med.id, v)}
          />
        ))}
      </div>

      <div>
        <Typography variant="small" className="text-muted-foreground mb-3">
          Avez-vous ressenti des effets secondaires ?
        </Typography>
        <SideEffectsSelector
          selectedTags={sideEffects}
          onChange={onSideEffectsChange}
        />
      </div>
    </div>
  );
}

// Step 4: Context
type StepContextProps = {
  tags: ContextTag[];
  notes: string;
  onTagsChange: (tags: ContextTag[]) => void;
  onNotesChange: (notes: string) => void;
};

function StepContext({
  tags,
  notes,
  onTagsChange,
  onNotesChange,
}: StepContextProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary rounded-full p-2">
          <MessageSquare className="size-5" />
        </div>
        <Typography variant="h3">Contexte de la journee</Typography>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <Typography variant="small" className="text-muted-foreground mb-3">
            Qu'avez-vous fait aujourd'hui ?
          </Typography>
          <ContextTagsSelector selectedTags={tags} onChange={onTagsChange} />
        </div>

        <div>
          <Typography variant="small" className="text-muted-foreground mb-3">
            Notes (optionnel)
          </Typography>
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Ajoutez des notes sur votre journee..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
