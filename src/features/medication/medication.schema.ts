import { z } from "zod";

/**
 * Schema for creating/updating a medication
 */
export const MedicationSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
  molecule: z.string().max(100).optional().nullable(),
  dosageMg: z.number().int().min(0).max(10000),
  frequency: z.enum([
    "daily",
    "twice_daily",
    "three_times_daily",
    "as_needed",
    "weekly",
  ]),
  timeOfDay: z
    .enum(["morning", "evening", "both", "any", "night"])
    .optional()
    .nullable(),
  color: z.string().optional().nullable(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide")
    .optional()
    .nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type MedicationInput = z.infer<typeof MedicationSchema>;

/**
 * Schema for recording medication intake
 */
export const MedicationIntakeSchema = z.object({
  medicationId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  scheduledAt: z.string().optional().nullable(), // "08:00", "20:00"
  takenAt: z.string().optional().nullable(), // "08:15" or null if not taken
  status: z.enum(["taken", "missed", "skipped", "delayed"]),
  notes: z.string().max(500).optional().nullable(),
});

export type MedicationIntakeInput = z.infer<typeof MedicationIntakeSchema>;

/**
 * Schema for recording dosage changes
 */
export const MedicationChangeSchema = z.object({
  medicationId: z.string().min(1),
  previousDosageMg: z.number().int().min(0),
  newDosageMg: z.number().int().min(0),
  changeDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  reason: z.string().max(500).optional().nullable(),
  prescribedBy: z.string().max(100).optional().nullable(),
});

export type MedicationChangeInput = z.infer<typeof MedicationChangeSchema>;

/**
 * Frequency labels (French)
 */
export const FREQUENCY_LABELS: Record<string, string> = {
  daily: "1x par jour",
  twice_daily: "2x par jour",
  three_times_daily: "3x par jour",
  as_needed: "Si besoin",
  weekly: "Hebdomadaire",
};

/**
 * Time of day labels (French)
 */
export const TIME_OF_DAY_LABELS: Record<string, string> = {
  morning: "Matin",
  evening: "Soir",
  both: "Matin et soir",
  night: "Nuit",
  any: "N'importe quand",
};

/**
 * Intake status labels (French)
 */
export const INTAKE_STATUS_LABELS: Record<string, string> = {
  taken: "Pris",
  missed: "Manque",
  skipped: "Ignore",
  delayed: "Retard",
};

/**
 * Medication colors for UI
 */
export const MEDICATION_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#EAB308", // Yellow
  "#84CC16", // Lime
  "#22C55E", // Green
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#0EA5E9", // Sky
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#D946EF", // Fuchsia
  "#EC4899", // Pink
] as const;

/**
 * Common psychiatric medications for autocomplete
 */
export const COMMON_MEDICATIONS = [
  // Mood stabilizers
  { name: "Lamictal", molecule: "Lamotrigine" },
  { name: "Depakote", molecule: "Valproate" },
  { name: "Lithium", molecule: "Lithium" },
  { name: "Tegretol", molecule: "Carbamazepine" },

  // Antipsychotics
  { name: "Abilify", molecule: "Aripiprazole" },
  { name: "Seroquel", molecule: "Quetiapine" },
  { name: "Risperdal", molecule: "Risperidone" },
  { name: "Zyprexa", molecule: "Olanzapine" },
  { name: "Latuda", molecule: "Lurasidone" },

  // Antidepressants
  { name: "Prozac", molecule: "Fluoxetine" },
  { name: "Zoloft", molecule: "Sertraline" },
  { name: "Lexapro", molecule: "Escitalopram" },
  { name: "Effexor", molecule: "Venlafaxine" },
  { name: "Cymbalta", molecule: "Duloxetine" },
  { name: "Wellbutrin", molecule: "Bupropion" },

  // Anxiolytics
  { name: "Xanax", molecule: "Alprazolam" },
  { name: "Ativan", molecule: "Lorazepam" },
  { name: "Klonopin", molecule: "Clonazepam" },
  { name: "Valium", molecule: "Diazepam" },

  // ADHD medications
  { name: "Concerta", molecule: "Methylphenidate" },
  { name: "Ritalin", molecule: "Methylphenidate" },
  { name: "Adderall", molecule: "Amphetamine" },
  { name: "Vyvanse", molecule: "Lisdexamfetamine" },
  { name: "Strattera", molecule: "Atomoxetine" },

  // Sleep aids
  { name: "Ambien", molecule: "Zolpidem" },
  { name: "Lunesta", molecule: "Eszopiclone" },
  { name: "Trazodone", molecule: "Trazodone" },
] as const;

/**
 * Common dosage change reasons
 */
export const DOSAGE_CHANGE_REASONS = [
  "Augmentation palier",
  "Diminution progressive",
  "Effet secondaire",
  "Stabilisation",
  "Ajustement psychiatre",
  "Efficacite insuffisante",
  "Amelioration constatee",
  "Interaction medicamenteuse",
] as const;
