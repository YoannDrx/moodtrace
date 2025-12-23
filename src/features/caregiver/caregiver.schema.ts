import { z } from "zod";

/**
 * Schema for caregiver daily check-in
 */
export const CaregiverCheckinSchema = z.object({
  subjectId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  moodObserved: z
    .enum(["very_good", "good", "neutral", "down", "very_down", "concerning"])
    .optional()
    .nullable(),
  energyObserved: z
    .enum(["high", "normal", "low", "very_low"])
    .optional()
    .nullable(),
  socialBehavior: z
    .enum(["engaged", "normal", "withdrawn", "isolated"])
    .optional()
    .nullable(),
  sleepObserved: z
    .enum(["good", "restless", "insomnia", "oversleeping"])
    .optional()
    .nullable(),
  notes: z.string().max(2000).optional().nullable(),
  patientVisibility: z.enum(["visible", "hidden"]).default("visible"),
});

export type CaregiverCheckinInput = z.infer<typeof CaregiverCheckinSchema>;

/**
 * Schema for caregiver events
 */
export const CaregiverEventSchema = z.object({
  subjectId: z.string().min(1),
  occurredAt: z.string(), // ISO datetime
  eventType: z.enum([
    "compulsive_purchase",
    "crisis",
    "conflict",
    "milestone",
    "medication_issue",
    "other",
  ]),
  severity: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  details: z.string().max(2000).optional().nullable(),
  patientVisibility: z.enum(["visible", "hidden"]).default("visible"),
});

export type CaregiverEventInput = z.infer<typeof CaregiverEventSchema>;

/**
 * Mood observation labels (French)
 */
export const MOOD_OBSERVED_LABELS: Record<string, string> = {
  very_good: "Très bien",
  good: "Bien",
  neutral: "Neutre",
  down: "Morose",
  very_down: "Très bas",
  concerning: "Préoccupant",
};

export const MOOD_OBSERVED_COLORS: Record<string, string> = {
  very_good: "#22C55E",
  good: "#84CC16",
  neutral: "#FACC15",
  down: "#F97316",
  very_down: "#EF4444",
  concerning: "#DC2626",
};

/**
 * Energy observation labels (French)
 */
export const ENERGY_OBSERVED_LABELS: Record<string, string> = {
  high: "Élevée",
  normal: "Normale",
  low: "Basse",
  very_low: "Très basse",
};

/**
 * Social behavior labels (French)
 */
export const SOCIAL_BEHAVIOR_LABELS: Record<string, string> = {
  engaged: "Engagé(e)",
  normal: "Normal",
  withdrawn: "Replié(e)",
  isolated: "Isolé(e)",
};

/**
 * Sleep observation labels (French)
 */
export const SLEEP_OBSERVED_LABELS: Record<string, string> = {
  good: "Bon",
  restless: "Agité",
  insomnia: "Insomnie",
  oversleeping: "Hypersomnie",
};

/**
 * Event type labels (French)
 */
export const EVENT_TYPE_LABELS: Record<string, string> = {
  compulsive_purchase: "Achat compulsif",
  crisis: "Crise",
  conflict: "Conflit",
  milestone: "Étape positive",
  medication_issue: "Problème médicament",
  other: "Autre",
};

export const EVENT_TYPE_ICONS: Record<string, string> = {
  compulsive_purchase: "CreditCard",
  crisis: "AlertTriangle",
  conflict: "Users",
  milestone: "Star",
  medication_issue: "Pill",
  other: "FileText",
};

export const EVENT_TYPE_COLORS: Record<string, string> = {
  compulsive_purchase: "#F97316",
  crisis: "#EF4444",
  conflict: "#F59E0B",
  milestone: "#22C55E",
  medication_issue: "#6366F1",
  other: "#64748B",
};

/**
 * Severity labels (French)
 */
export const SEVERITY_LABELS: Record<number, string> = {
  1: "Mineur",
  2: "Léger",
  3: "Modéré",
  4: "Important",
  5: "Sévère",
};

export const SEVERITY_COLORS: Record<number, string> = {
  1: "#84CC16",
  2: "#FACC15",
  3: "#F97316",
  4: "#EF4444",
  5: "#DC2626",
};

/**
 * Patient visibility labels
 */
export const VISIBILITY_LABELS: Record<string, string> = {
  visible: "Visible par le patient",
  hidden: "Masqué au patient",
};
