import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoodSlider } from "./MoodSlider";
import { SliderInput } from "./SliderInput";
import { TagSelector } from "./TagSelector";
import { Check, Moon, Zap, Brain, Pill, MessageSquare, ChevronRight, ChevronLeft } from "lucide-react";
import { CONTEXT_TAGS, SIDE_EFFECTS_OPTIONS, type MoodValue, type SleepQuality } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock medications for demo
const mockMedications = [
  { id: "1", name: "Lithium", dose: 400, time: "matin" },
  { id: "2", name: "Quetiapine", dose: 100, time: "soir" },
];

interface CheckinData {
  mood: MoodValue;
  energy: number;
  anxiety: number;
  sleepHours: number;
  sleepQuality: SleepQuality;
  medicationIntakes: { id: string; taken: boolean }[];
  sideEffects: string[];
  tags: string[];
  notes: string;
}

const steps = [
  { id: "mood", title: "Humeur", icon: Brain },
  { id: "sleep", title: "Sommeil", icon: Moon },
  { id: "medication", title: "Médication", icon: Pill },
  { id: "context", title: "Contexte", icon: MessageSquare },
];

export function DailyCheckin() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CheckinData>({
    mood: 0,
    energy: 5,
    anxiety: 3,
    sleepHours: 7,
    sleepQuality: "average",
    medicationIntakes: mockMedications.map((m) => ({ id: m.id, taken: true })),
    sideEffects: [],
    tags: [],
    notes: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Check-in enregistré",
      description: "Vos données ont été sauvegardées avec succès.",
    });
    // In a real app, this would save to the database
    console.log("Checkin data:", data);
  };

  const toggleMedication = (id: string) => {
    setData({
      ...data,
      medicationIntakes: data.medicationIntakes.map((m) =>
        m.id === id ? { ...m, taken: !m.taken } : m
      ),
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Check-in quotidien</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setCurrentStep(index)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 md:w-16 mx-2",
                  index < currentStep ? "bg-success" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const StepIcon = steps[currentStep].icon;
              return <StepIcon className="h-5 w-5 text-primary" />;
            })()}
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <>
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">
                  Comment vous sentez-vous aujourd'hui ?
                </label>
                <MoodSlider
                  value={data.mood}
                  onChange={(mood) => setData({ ...data, mood })}
                />
              </div>

              <SliderInput
                label="Niveau d'énergie"
                value={data.energy}
                onChange={(energy) => setData({ ...data, energy })}
                max={10}
                showLabels={{ min: "Épuisé", max: "Très énergique" }}
              />

              <SliderInput
                label="Niveau d'anxiété"
                value={data.anxiety}
                onChange={(anxiety) => setData({ ...data, anxiety })}
                max={10}
                showLabels={{ min: "Calme", max: "Très anxieux" }}
              />
            </>
          )}

          {currentStep === 1 && (
            <>
              <SliderInput
                label="Heures de sommeil"
                value={data.sleepHours}
                onChange={(sleepHours) => setData({ ...data, sleepHours })}
                min={0}
                max={14}
                unit="h"
              />

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Qualité du sommeil
                </label>
                <div className="flex gap-3">
                  {(["bad", "average", "good"] as SleepQuality[]).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setData({ ...data, sleepQuality: quality })}
                      className={cn(
                        "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all",
                        data.sleepQuality === quality
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {quality === "bad" && "Mauvais"}
                      {quality === "average" && "Moyen"}
                      {quality === "good" && "Bon"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">
                  Avez-vous pris vos médicaments ?
                </label>
                <div className="space-y-3">
                  {mockMedications.map((med) => {
                    const intake = data.medicationIntakes.find((m) => m.id === med.id);
                    return (
                      <button
                        key={med.id}
                        onClick={() => toggleMedication(med.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-lg border transition-all",
                          intake?.taken
                            ? "border-success bg-success/5"
                            : "border-border bg-card hover:border-muted-foreground/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                              intake?.taken
                                ? "border-success bg-success text-white"
                                : "border-muted-foreground"
                            )}
                          >
                            {intake?.taken && <Check className="h-3 w-3" />}
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-foreground">{med.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {med.dose}mg · {med.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <TagSelector
                label="Effets secondaires ressentis"
                tags={SIDE_EFFECTS_OPTIONS}
                selectedTags={data.sideEffects}
                onChange={(sideEffects) => setData({ ...data, sideEffects })}
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <TagSelector
                label="Contexte de la journée"
                tags={CONTEXT_TAGS}
                selectedTags={data.tags}
                onChange={(tags) => setData({ ...data, tags })}
              />

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Notes (facultatif)
                </label>
                <textarea
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  placeholder="Événement marquant, pensées à partager avec votre psy..."
                  className="mood-input min-h-[120px] resize-none"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex-1"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Précédent
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="flex-1">
            Suivant
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="success" className="flex-1">
            <Check className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        )}
      </div>
    </div>
  );
}
