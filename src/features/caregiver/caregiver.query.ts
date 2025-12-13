import type { CaregiverObservation } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Get observations made by a caregiver
 */
export async function getCaregiverObservations({
  caregiverId,
  organizationId,
  patientId,
  limit = 30,
}: {
  caregiverId: string;
  organizationId: string;
  patientId?: string;
  limit?: number;
}): Promise<CaregiverObservation[]> {
  return prisma.caregiverObservation.findMany({
    where: {
      caregiverId,
      organizationId,
      ...(patientId ? { patientId } : {}),
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}

/**
 * Get observations about a patient
 */
export async function getPatientObservations({
  patientId,
  organizationId,
  includePrivate = false,
  limit = 30,
}: {
  patientId: string;
  organizationId: string;
  includePrivate?: boolean;
  limit?: number;
}): Promise<
  (CaregiverObservation & {
    caregiver: { name: string | null; email: string };
  })[]
> {
  return prisma.caregiverObservation.findMany({
    where: {
      patientId,
      organizationId,
      ...(includePrivate ? {} : { isPrivate: false }),
    },
    include: {
      caregiver: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}

/**
 * Get patients that a caregiver observes
 */
export async function getCaregiverPatients({
  caregiverId,
  organizationId,
}: {
  caregiverId: string;
  organizationId: string;
}): Promise<{ id: string; name: string | null; email: string }[]> {
  const observations = await prisma.caregiverObservation.findMany({
    where: {
      caregiverId,
      organizationId,
    },
    select: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    distinct: ["patientId"],
  });

  return observations.map((o) => o.patient);
}
