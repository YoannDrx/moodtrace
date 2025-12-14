"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

import {
  CaregiverEventCreateSchema,
  CaregiverEventUpdateSchema,
} from "../schemas/event.schema";

/**
 * Create a caregiver event
 */
export const createCaregiverEventAction = orgAction
  .metadata({})
  .inputSchema(CaregiverEventCreateSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const authorId = org.user.id;
    const spaceId = org.id;

    const event = await prisma.caregiverEvent.create({
      data: {
        authorId,
        subjectId: data.subjectId,
        spaceId,
        occurredAt: new Date(data.occurredAt),
        eventType: data.eventType,
        severity: data.severity,
        title: data.title,
        details: data.details,
        patientVisibility: data.patientVisibility,
      },
    });

    return {
      success: true,
      event,
      message: "Événement enregistré",
    };
  });

/**
 * Update a caregiver event
 */
export const updateCaregiverEventAction = orgAction
  .metadata({})
  .inputSchema(CaregiverEventUpdateSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const authorId = org.user.id;

    const result = await prisma.caregiverEvent.updateMany({
      where: {
        id: data.id,
        authorId,
        spaceId: org.id,
      },
      data: {
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : undefined,
        eventType: data.eventType,
        severity: data.severity,
        title: data.title,
        details: data.details,
        patientVisibility: data.patientVisibility,
      },
    });

    return {
      success: result.count > 0,
      message:
        result.count > 0 ? "Événement mis à jour" : "Événement non trouvé",
    };
  });

/**
 * Delete a caregiver event
 */
export const deleteCaregiverEventAction = orgAction
  .metadata({})
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { org } }) => {
    const authorId = org.user.id;

    const result = await prisma.caregiverEvent.deleteMany({
      where: {
        id,
        authorId,
        spaceId: org.id,
      },
    });

    return {
      success: result.count > 0,
      message: result.count > 0 ? "Événement supprimé" : "Événement non trouvé",
    };
  });
