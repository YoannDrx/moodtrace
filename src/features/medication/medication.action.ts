"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  MedicationChangeSchema,
  MedicationIntakeSchema,
  MedicationSchema,
} from "./medication.schema";

/**
 * Create a new medication
 */
export const createMedicationAction = orgAction
  .metadata({})
  .inputSchema(MedicationSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const userId = org.user.id;
    const organizationId = org.id;

    const medication = await prisma.medication.create({
      data: {
        userId,
        organizationId,
        name: data.name,
        molecule: data.molecule,
        dosageMg: data.dosageMg,
        frequency: data.frequency,
        timeOfDay: data.timeOfDay,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        notes: data.notes,
        isActive: true,
      },
    });

    return {
      success: true,
      medication,
      message: "Medicament ajoute",
    };
  });

/**
 * Update an existing medication
 */
export const updateMedicationAction = orgAction
  .metadata({})
  .inputSchema(MedicationSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const userId = org.user.id;
    const organizationId = org.id;

    // Verify ownership
    const existing = await prisma.medication.findFirst({
      where: {
        id: data.id,
        userId,
        organizationId,
      },
    });

    if (!existing) {
      throw new Error("Medicament non trouve");
    }

    // Check if dosage changed
    const dosageChanged = existing.dosageMg !== data.dosageMg;

    const medication = await prisma.medication.update({
      where: { id: data.id },
      data: {
        name: data.name,
        molecule: data.molecule,
        dosageMg: data.dosageMg,
        frequency: data.frequency,
        timeOfDay: data.timeOfDay,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        notes: data.notes,
      },
    });

    // Record dosage change if applicable
    if (dosageChanged) {
      await prisma.medicationChange.create({
        data: {
          medicationId: data.id,
          previousDosageMg: existing.dosageMg,
          newDosageMg: data.dosageMg,
          changeDate: new Date(),
          reason: "Modification manuelle",
        },
      });
    }

    return {
      success: true,
      medication,
      message: "Medicament mis a jour",
    };
  });

/**
 * Deactivate a medication (soft delete)
 */
export const deactivateMedicationAction = orgAction
  .metadata({})
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { org } }) => {
    const userId = org.user.id;
    const organizationId = org.id;

    await prisma.medication.updateMany({
      where: {
        id,
        userId,
        organizationId,
      },
      data: {
        isActive: false,
        endDate: new Date(),
      },
    });

    return {
      success: true,
      message: "Medicament arrete",
    };
  });

/**
 * Delete a medication permanently
 */
export const deleteMedicationAction = orgAction
  .metadata({})
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { org } }) => {
    const userId = org.user.id;
    const organizationId = org.id;

    await prisma.medication.deleteMany({
      where: {
        id,
        userId,
        organizationId,
      },
    });

    return {
      success: true,
      message: "Medicament supprime",
    };
  });

/**
 * Record medication intake
 */
export const recordIntakeAction = orgAction
  .metadata({})
  .inputSchema(MedicationIntakeSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const userId = org.user.id;

    // Verify medication ownership
    const medication = await prisma.medication.findFirst({
      where: {
        id: data.medicationId,
        userId,
        organizationId: org.id,
      },
    });

    if (!medication) {
      throw new Error("Medicament non trouve");
    }

    const intake = await prisma.medicationIntake.upsert({
      where: {
        medicationId_date_scheduledAt: {
          medicationId: data.medicationId,
          date: new Date(data.date),
          scheduledAt: data.scheduledAt ?? "",
        },
      },
      update: {
        takenAt: data.takenAt,
        status: data.status,
        notes: data.notes,
      },
      create: {
        userId,
        medicationId: data.medicationId,
        date: new Date(data.date),
        scheduledAt: data.scheduledAt,
        takenAt: data.takenAt,
        status: data.status,
        notes: data.notes,
      },
    });

    return {
      success: true,
      intake,
      message: "Prise enregistree",
    };
  });

/**
 * Record a dosage change
 */
export const recordDosageChangeAction = orgAction
  .metadata({})
  .inputSchema(MedicationChangeSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const userId = org.user.id;

    // Verify medication ownership
    const medication = await prisma.medication.findFirst({
      where: {
        id: data.medicationId,
        userId,
        organizationId: org.id,
      },
    });

    if (!medication) {
      throw new Error("Medicament non trouve");
    }

    // Update medication dosage
    await prisma.medication.update({
      where: { id: data.medicationId },
      data: { dosageMg: data.newDosageMg },
    });

    // Record the change
    const change = await prisma.medicationChange.create({
      data: {
        medicationId: data.medicationId,
        previousDosageMg: data.previousDosageMg,
        newDosageMg: data.newDosageMg,
        changeDate: new Date(data.changeDate),
        reason: data.reason,
      },
    });

    return {
      success: true,
      change,
      message: "Changement de dosage enregistre",
    };
  });
