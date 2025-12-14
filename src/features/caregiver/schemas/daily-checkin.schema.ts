import { z } from "zod";

export const MoodObservedEnum = z.enum([
  "very_good",
  "good",
  "neutral",
  "down",
  "very_down",
  "concerning",
]);

export const EnergyObservedEnum = z.enum(["high", "normal", "low", "very_low"]);

export const SocialBehaviorEnum = z.enum([
  "engaged",
  "normal",
  "withdrawn",
  "isolated",
]);

export const SleepObservedEnum = z.enum([
  "good",
  "restless",
  "insomnia",
  "oversleeping",
]);

export const PatientVisibilityEnum = z.enum(["visible", "hidden"]);

export const DailyCheckinSchema = z.object({
  subjectId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  moodObserved: MoodObservedEnum.optional(),
  energyObserved: EnergyObservedEnum.optional(),
  socialBehavior: SocialBehaviorEnum.optional(),
  sleepObserved: SleepObservedEnum.optional(),
  notes: z.string().max(1000).optional(),
  patientVisibility: PatientVisibilityEnum.default("visible"),
});

// Alias for create action
export const DailyCheckinCreateSchema = DailyCheckinSchema;

// Update schema (includes id, all fields optional except id)
export const DailyCheckinUpdateSchema = z.object({
  id: z.string().min(1),
  moodObserved: MoodObservedEnum.optional(),
  energyObserved: EnergyObservedEnum.optional(),
  socialBehavior: SocialBehaviorEnum.optional(),
  sleepObserved: SleepObservedEnum.optional(),
  notes: z.string().max(1000).optional(),
  patientVisibility: PatientVisibilityEnum.optional(),
});

export type DailyCheckinSchemaType = z.infer<typeof DailyCheckinSchema>;
export type DailyCheckinCreateInput = z.infer<typeof DailyCheckinCreateSchema>;
export type DailyCheckinUpdateInput = z.infer<typeof DailyCheckinUpdateSchema>;
export type MoodObservedType = z.infer<typeof MoodObservedEnum>;
export type EnergyObservedType = z.infer<typeof EnergyObservedEnum>;
export type SocialBehaviorType = z.infer<typeof SocialBehaviorEnum>;
export type SleepObservedType = z.infer<typeof SleepObservedEnum>;
export type PatientVisibilityType = z.infer<typeof PatientVisibilityEnum>;
