"use client";

import { MoodIndicator, MoodScale } from "@/components/nowts/mood-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import type { MoodValue } from "@/lib/design-tokens";
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
  const [mood, setMood] = useState<MoodValue>(
    (existingMood as MoodValue | undefined) ?? 5,
  );
  const [hasChanged, setHasChanged] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        saveMoodEntryAction({
          date,
          mood,
          energy: null,
          sleepHours: null,
          sleepQuality: null,
          anxiety: null,
          notes: null,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Humeur enregistree");
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setHasChanged(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleMoodChange = (value: MoodValue) => {
    setMood(value);
    setHasChanged(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="text-primary size-5" />
          {existingMood ? "Humeur d'aujourd'hui" : "Comment allez-vous ?"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {existingMood && !hasChanged ? (
          <div className="flex items-center gap-4">
            <MoodIndicator value={existingMood as MoodValue} size="xl" />
            <div>
              <p className="font-medium">
                Vous avez note votre humeur a {existingMood}/10
              </p>
              <p className="text-muted-foreground text-sm">
                Cliquez ci-dessous pour modifier
              </p>
            </div>
          </div>
        ) : null}

        <MoodScale value={mood} onChange={handleMoodChange} />

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
