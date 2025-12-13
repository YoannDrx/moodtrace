"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CaregiverObservationSchema } from "./caregiver.schema";

/**
 * Create a caregiver observation
 */
export const createObservationAction = orgAction
  .metadata({})
  .inputSchema(CaregiverObservationSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const caregiverId = org.user.id;
    const organizationId = org.id;

    const observation = await prisma.caregiverObservation.create({
      data: {
        caregiverId,
        patientId: data.patientId,
        organizationId,
        date: new Date(data.date),
        moodObservation: data.moodObservation,
        notes: data.notes,
        isPrivate: data.isPrivate,
      },
    });

    return {
      success: true,
      observation,
      message: "Observation enregistree",
    };
  });

/**
 * Delete a caregiver observation
 */
export const deleteObservationAction = orgAction
  .metadata({})
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { org } }) => {
    const caregiverId = org.user.id;

    await prisma.caregiverObservation.deleteMany({
      where: {
        id,
        caregiverId,
        organizationId: org.id,
      },
    });

    return {
      success: true,
      message: "Observation supprimee",
    };
  });
