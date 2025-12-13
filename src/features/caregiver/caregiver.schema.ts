import { z } from "zod";

/**
 * Schema for creating a caregiver observation
 */
export const CaregiverObservationSchema = z.object({
  patientId: z.string().min(1, "Patient requis"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  moodObservation: z.enum(["good", "neutral", "down", "concerning"]),
  notes: z.string().max(1000).optional().nullable(),
  isPrivate: z.boolean().default(false),
});

export type CaregiverObservationInput = z.infer<
  typeof CaregiverObservationSchema
>;

/**
 * Mood observation labels (French)
 */
export const MOOD_OBSERVATION_LABELS: Record<string, string> = {
  good: "Bon",
  neutral: "Neutre",
  down: "Bas",
  concerning: "Preoccupant",
};

/**
 * Mood observation colors for UI
 */
export const MOOD_OBSERVATION_COLORS: Record<string, string> = {
  good: "bg-green-500",
  neutral: "bg-yellow-500",
  down: "bg-orange-500",
  concerning: "bg-red-500",
};
