import { z } from "zod";
import { PatientVisibilityEnum } from "./daily-checkin.schema";

export const EventTypeEnum = z.enum([
  "compulsive_purchase",
  "crisis",
  "conflict",
  "milestone",
  "medication_issue",
  "other",
]);

export const CaregiverEventSchema = z.object({
  subjectId: z.string().min(1),
  occurredAt: z.string().datetime(),
  eventType: EventTypeEnum,
  severity: z.number().min(1).max(5),
  title: z.string().min(1).max(100),
  details: z.string().max(1000).optional(),
  patientVisibility: PatientVisibilityEnum.default("visible"),
});

// Alias for create action
export const CaregiverEventCreateSchema = CaregiverEventSchema;

// Update schema (includes id, all fields optional except id)
export const CaregiverEventUpdateSchema = z.object({
  id: z.string().min(1),
  occurredAt: z.string().datetime().optional(),
  eventType: EventTypeEnum.optional(),
  severity: z.number().min(1).max(5).optional(),
  title: z.string().min(1).max(100).optional(),
  details: z.string().max(1000).optional(),
  patientVisibility: PatientVisibilityEnum.optional(),
});

export type CaregiverEventSchemaType = z.infer<typeof CaregiverEventSchema>;
export type CaregiverEventCreateInput = z.infer<
  typeof CaregiverEventCreateSchema
>;
export type CaregiverEventUpdateInput = z.infer<
  typeof CaregiverEventUpdateSchema
>;
export type EventTypeType = z.infer<typeof EventTypeEnum>;
