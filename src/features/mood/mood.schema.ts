import { z } from "zod";

/**
 * Schema for creating/updating a mood entry
 * Note: Mood uses bipolar scale (-3 to +3) for MoodJournal
 */
export const MoodEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  mood: z.number().int().min(-3).max(3), // Bipolar scale: -3 to +3
  energy: z.number().int().min(1).max(10).optional().nullable(),
  sleepHours: z.number().min(0).max(24).optional().nullable(),
  sleepQuality: z
    .enum(["bad", "average", "good"])
    .optional()
    .nullable(),
  anxiety: z.number().int().min(1).max(10).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  sideEffects: z.array(z.string()).optional().default([]),
});

export type MoodEntryInput = z.infer<typeof MoodEntrySchema>;

/**
 * Schema for querying mood entries
 */
export const MoodEntryQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(30),
});

export type MoodEntryQuery = z.infer<typeof MoodEntryQuerySchema>;

/**
 * Bipolar mood level labels (French)
 * Scale: -3 (depressed) to +3 (manic)
 */
export const MOOD_LABELS: Record<number, string> = {
  "-3": "Tres deprime",
  "-2": "Deprime",
  "-1": "Bas",
  "0": "Stable",
  "1": "Eleve",
  "2": "Hyperactif",
  "3": "Maniaque",
};

/**
 * Mood colors for bipolar scale
 */
export const MOOD_COLORS: Record<number, string> = {
  "-3": "#6366F1", // Indigo - deep depression
  "-2": "#8B5CF6", // Purple - depression
  "-1": "#A78BFA", // Light purple - low
  "0": "#10B981", // Green - stable
  "1": "#F59E0B", // Amber - elevated
  "2": "#F97316", // Orange - hyperactive
  "3": "#EF4444", // Red - manic
};

/**
 * Energy level labels (French)
 */
export const ENERGY_LABELS: Record<number, string> = {
  1: "Epuise",
  2: "Tres fatigue",
  3: "Fatigue",
  4: "Peu d'energie",
  5: "Normal",
  6: "Correct",
  7: "Energique",
  8: "Tres energique",
  9: "Plein d'energie",
  10: "Debordant d'energie",
};

/**
 * Sleep quality labels (French)
 */
export const SLEEP_QUALITY_LABELS: Record<string, string> = {
  bad: "Mauvais",
  average: "Moyen",
  good: "Bon",
};

/**
 * Anxiety level labels (French)
 */
export const ANXIETY_LABELS: Record<number, string> = {
  1: "Aucune",
  2: "Tres legere",
  3: "Legere",
  4: "Faible",
  5: "Moderee",
  6: "Notable",
  7: "Elevee",
  8: "Forte",
  9: "Tres forte",
  10: "Extreme",
};
