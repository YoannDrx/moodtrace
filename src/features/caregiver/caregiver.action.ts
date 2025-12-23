"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CaregiverCheckinSchema, CaregiverEventSchema } from "./caregiver.schema";

/**
 * Save a caregiver daily check-in (upsert)
 */
export const saveCaregiverCheckinAction = orgAction
  .metadata({})
  .schema(CaregiverCheckinSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const authorId = org.user.id;
    const spaceId = org.id;

    // Verify subject is in the same organization
    const subjectMember = await prisma.member.findFirst({
      where: {
        userId: data.subjectId,
        organizationId: spaceId,
      },
    });

    if (!subjectMember) {
      throw new Error("Le patient ne fait pas partie de cet espace");
    }

    // Cannot check-in yourself
    if (data.subjectId === authorId) {
      throw new Error("Vous ne pouvez pas faire un check-in pour vous-même");
    }

    const checkin = await prisma.caregiverDailyCheckin.upsert({
      where: {
        authorId_subjectId_spaceId_date: {
          authorId,
          subjectId: data.subjectId,
          spaceId,
          date: new Date(data.date),
        },
      },
      update: {
        moodObserved: data.moodObserved,
        energyObserved: data.energyObserved,
        socialBehavior: data.socialBehavior,
        sleepObserved: data.sleepObserved,
        notes: data.notes,
        patientVisibility: data.patientVisibility,
      },
      create: {
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
      message: "Observation enregistrée",
    };
  });

/**
 * Delete a caregiver check-in
 */
export const deleteCaregiverCheckinAction = orgAction
  .metadata({})
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { org } }) => {
    const authorId = org.user.id;
    const spaceId = org.id;

    // Verify ownership
    const existing = await prisma.caregiverDailyCheckin.findFirst({
      where: {
        id,
        authorId,
        spaceId,
      },
    });

    if (!existing) {
      throw new Error("Observation non trouvée");
    }

    await prisma.caregiverDailyCheckin.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Observation supprimée",
    };
  });

/**
 * Create a caregiver event
 */
export const createCaregiverEventAction = orgAction
  .metadata({})
  .schema(CaregiverEventSchema)
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const authorId = org.user.id;
    const spaceId = org.id;

    // Verify subject is in the same organization
    const subjectMember = await prisma.member.findFirst({
      where: {
        userId: data.subjectId,
        organizationId: spaceId,
      },
    });

    if (!subjectMember) {
      throw new Error("Le patient ne fait pas partie de cet espace");
    }

    // Cannot create event for yourself
    if (data.subjectId === authorId) {
      throw new Error("Vous ne pouvez pas signaler un événement pour vous-même");
    }

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
      message: "Événement signalé",
    };
  });

/**
 * Update a caregiver event
 */
export const updateCaregiverEventAction = orgAction
  .metadata({})
  .schema(CaregiverEventSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const authorId = org.user.id;
    const spaceId = org.id;

    // Verify ownership
    const existing = await prisma.caregiverEvent.findFirst({
      where: {
        id: data.id,
        authorId,
        spaceId,
      },
    });

    if (!existing) {
      throw new Error("Événement non trouvé");
    }

    const event = await prisma.caregiverEvent.update({
      where: { id: data.id },
      data: {
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
      message: "Événement mis à jour",
    };
  });

/**
 * Delete a caregiver event
 */
export const deleteCaregiverEventAction = orgAction
  .metadata({})
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { org } }) => {
    const authorId = org.user.id;
    const spaceId = org.id;

    // Verify ownership
    const existing = await prisma.caregiverEvent.findFirst({
      where: {
        id,
        authorId,
        spaceId,
      },
    });

    if (!existing) {
      throw new Error("Événement non trouvé");
    }

    await prisma.caregiverEvent.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Événement supprimé",
    };
  });

/**
 * Toggle visibility of a check-in
 */
export const toggleCheckinVisibilityAction = orgAction
  .metadata({})
  .schema(z.object({ id: z.string(), visibility: z.enum(["visible", "hidden"]) }))
  .action(async ({ parsedInput: { id, visibility }, ctx: { org } }) => {
    const authorId = org.user.id;
    const spaceId = org.id;

    // Verify ownership
    const existing = await prisma.caregiverDailyCheckin.findFirst({
      where: {
        id,
        authorId,
        spaceId,
      },
    });

    if (!existing) {
      throw new Error("Observation non trouvée");
    }

    await prisma.caregiverDailyCheckin.update({
      where: { id },
      data: { patientVisibility: visibility },
    });

    return {
      success: true,
      message: visibility === "visible" ? "Visible au patient" : "Masqué au patient",
    };
  });

/**
 * Toggle visibility of an event
 */
export const toggleEventVisibilityAction = orgAction
  .metadata({})
  .schema(z.object({ id: z.string(), visibility: z.enum(["visible", "hidden"]) }))
  .action(async ({ parsedInput: { id, visibility }, ctx: { org } }) => {
    const authorId = org.user.id;
    const spaceId = org.id;

    // Verify ownership
    const existing = await prisma.caregiverEvent.findFirst({
      where: {
        id,
        authorId,
        spaceId,
      },
    });

    if (!existing) {
      throw new Error("Événement non trouvé");
    }

    await prisma.caregiverEvent.update({
      where: { id },
      data: { patientVisibility: visibility },
    });

    return {
      success: true,
      message: visibility === "visible" ? "Visible au patient" : "Masqué au patient",
    };
  });
