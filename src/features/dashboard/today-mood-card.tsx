"use client";

import {
  MoodIndicatorBipolar,
  MoodSliderBipolar,
} from "@/components/nowts/mood-slider-bipolar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MoodValueBipolar } from "@/lib/design-tokens";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { saveMoodEntryAction } from "@/features/mood/mood.action";

type TodayMoodCardProps = {
  existingMood?: number | null;
  date: string;
};

export function TodayMoodCard({ existingMood, date }: TodayMoodCardProps) {
  const queryClient = useQueryClient();
  const [mood, setMood] = useState<MoodValueBipolar>(
    (existingMood as MoodValueBipolar | undefined) ?? 0,
  );
  const [hasChanged, setHasChanged] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await saveMoodEntryAction({
        date,
        mood,
        energy: null,
        sleepHours: null,
        sleepQuality: null,
        anxiety: null,
        notes: null,
        tags: [],
        sideEffects: [],
      });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
      return result?.data;
    },
    onSuccess: () => {
      toast.success("Humeur enregistrée");
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setHasChanged(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleMoodChange = (value: MoodValueBipolar) => {
    setMood(value);
    setHasChanged(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="text-primary size-5" />
          {existingMood !== null && existingMood !== undefined
            ? "Humeur d'aujourd'hui"
            : "Comment allez-vous ?"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {existingMood !== null && existingMood !== undefined && !hasChanged ? (
          <div className="flex items-center gap-4">
            <MoodIndicatorBipolar
              value={existingMood as MoodValueBipolar}
              size="xl"
            />
            <div>
              <p className="font-medium">
                Vous avez noté votre humeur à{" "}
                {existingMood > 0 ? `+${existingMood}` : existingMood}
              </p>
              <p className="text-muted-foreground text-sm">
                Cliquez ci-dessous pour modifier
              </p>
            </div>
          </div>
        ) : null}

        <MoodSliderBipolar value={mood} onChange={handleMoodChange} />

        {hasChanged && (
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full"
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
      </CardContent>
    </Card>
  );
}
