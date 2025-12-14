"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

import {
  DailyCheckinCreateSchema,
  DailyCheckinUpdateSchema,
} from "../schemas/daily-checkin.schema";

/**
 * Create a daily check-in observation
 */
export const createDailyCheckinAction = orgAction
  .metadata({})
  .inputSchema(DailyCheckinCreateSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const authorId = org.user.id;
    const spaceId = org.id;

    const checkin = await prisma.caregiverDailyCheckin.create({
      data: {
        authorId,
        subjectId: data.subjectId,
        spaceId,
        date: new Date(data.date),
        moodObserved: data.moodObserved,
        energyObserved: data.energyObserved,
        socialBehavior: data.socialBehavior,
        sleepObserved: data.sleepObserved,
        notes: data.notes,
        patientVisibility: data.patientVisibility,
      },
    });

    return {
      success: true,
      checkin,
      message: "Check-in enregistré",
    };
  });

/**
 * Update a daily check-in observation
 */
export const updateDailyCheckinAction = orgAction
  .metadata({})
  .inputSchema(DailyCheckinUpdateSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const authorId = org.user.id;

    const checkin = await prisma.caregiverDailyCheckin.updateMany({
      where: {
        id: data.id,
        authorId,
        spaceId: org.id,
      },
      data: {
        moodObserved: data.moodObserved,
        energyObserved: data.energyObserved,
        socialBehavior: data.socialBehavior,
        sleepObserved: data.sleepObserved,
        notes: data.notes,
        patientVisibility: data.patientVisibility,
      },
    });

    return {
      success: checkin.count > 0,
      message:
        checkin.count > 0 ? "Check-in mis à jour" : "Check-in non trouvé",
    };
  });

/**
 * Delete a daily check-in observation
 */
export const deleteDailyCheckinAction = orgAction
  .metadata({})
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { org } }) => {
    const authorId = org.user.id;

    const result = await prisma.caregiverDailyCheckin.deleteMany({
      where: {
        id,
        authorId,
        spaceId: org.id,
      },
    });

    return {
      success: result.count > 0,
      message: result.count > 0 ? "Check-in supprimé" : "Check-in non trouvé",
    };
  });
