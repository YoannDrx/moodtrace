"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { MoodEntrySchema } from "./mood.schema";

/**
 * Create or update a mood entry for the current day
 */
export const saveMoodEntryAction = orgAction
  .metadata({})
  .inputSchema(MoodEntrySchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const userId = org.user.id;
    const organizationId = org.id;
    const entryDate = new Date(data.date);

    // Upsert: create or update existing entry for this date
    const moodEntry = await prisma.moodEntry.upsert({
      where: {
        userId_organizationId_date: {
          userId,
          organizationId,
          date: entryDate,
        },
      },
      update: {
        mood: data.mood,
        energy: data.energy,
        sleepHours: data.sleepHours,
        sleepQuality: data.sleepQuality,
        anxiety: data.anxiety,
        notes: data.notes,
      },
      create: {
        userId,
        organizationId,
        date: entryDate,
        mood: data.mood,
        energy: data.energy,
        sleepHours: data.sleepHours,
        sleepQuality: data.sleepQuality,
        anxiety: data.anxiety,
        notes: data.notes,
      },
    });

    return {
      success: true,
      entry: moodEntry,
      message: "Entree d'humeur enregistree",
    };
  });

/**
 * Delete a mood entry
 */
export const deleteMoodEntryAction = orgAction
  .metadata({})
  .inputSchema(MoodEntrySchema.pick({ date: true }))
  .action(async ({ parsedInput: { date }, ctx: { org } }) => {
    const userId = org.user.id;
    const organizationId = org.id;
    const entryDate = new Date(date);

    await prisma.moodEntry.delete({
      where: {
        userId_organizationId_date: {
          userId,
          organizationId,
          date: entryDate,
        },
      },
    });

    return {
      success: true,
      message: "Entree supprimee",
    };
  });
