import type {
  Medication,
  MedicationChange,
  MedicationIntake,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Get all active medications for a user
 */
export async function getActiveMedications({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}): Promise<Medication[]> {
  return prisma.medication.findMany({
    where: {
      userId,
      organizationId,
      isActive: true,
    },
    orderBy: { name: "asc" },
  });
}

/**
 * Get all medications for a user (active and inactive)
 */
export async function getAllMedications({
  userId,
  organizationId,
  includeInactive = false,
}: {
  userId: string;
  organizationId: string;
  includeInactive?: boolean;
}): Promise<Medication[]> {
  return prisma.medication.findMany({
    where: {
      userId,
      organizationId,
      ...(includeInactive ? {} : { isActive: true }),
    },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });
}

/**
 * Get a single medication by ID
 */
export async function getMedicationById({
  id,
  userId,
  organizationId,
}: {
  id: string;
  userId: string;
  organizationId: string;
}): Promise<Medication | null> {
  return prisma.medication.findFirst({
    where: {
      id,
      userId,
      organizationId,
    },
  });
}

/**
 * Get medication intakes for a date range
 */
export async function getMedicationIntakes({
  userId,
  startDate,
  endDate,
  medicationId,
}: {
  userId: string;
  startDate: Date;
  endDate: Date;
  medicationId?: string;
}): Promise<MedicationIntake[]> {
  return prisma.medicationIntake.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(medicationId ? { medicationId } : {}),
    },
    orderBy: [{ date: "desc" }, { scheduledAt: "asc" }],
  });
}

/**
 * Get today's medication intakes
 */
export async function getTodayIntakes({
  userId,
}: {
  userId: string;
}): Promise<(MedicationIntake & { medication: Medication })[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.medicationIntake.findMany({
    where: {
      userId,
      date: today,
    },
    include: {
      medication: true,
    },
    orderBy: { scheduledAt: "asc" },
  });
}

/**
 * Get medication adherence stats for a period
 */
export async function getMedicationAdherence({
  userId,
  medicationId,
  days = 30,
}: {
  userId: string;
  medicationId?: string;
  days?: number;
}): Promise<{
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  adherenceRate: number;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const intakes = await prisma.medicationIntake.findMany({
    where: {
      userId,
      date: { gte: startDate },
      ...(medicationId ? { medicationId } : {}),
    },
  });

  const totalDoses = intakes.length;
  const takenDoses = intakes.filter((i) => i.status === "taken").length;
  const missedDoses = intakes.filter(
    (i) => i.status === "missed" || i.status === "skipped",
  ).length;
  const adherenceRate =
    totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  return {
    totalDoses,
    takenDoses,
    missedDoses,
    adherenceRate,
  };
}

/**
 * Get medication change history
 */
export async function getMedicationChanges({
  medicationId,
}: {
  medicationId: string;
}): Promise<MedicationChange[]> {
  return prisma.medicationChange.findMany({
    where: { medicationId },
    orderBy: { changeDate: "desc" },
  });
}

/**
 * Get all dosage changes for a user in a period
 */
export async function getAllDosageChanges({
  userId,
  organizationId,
  days = 90,
}: {
  userId: string;
  organizationId: string;
  days?: number;
}): Promise<(MedicationChange & { medication: Medication })[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return prisma.medicationChange.findMany({
    where: {
      changeDate: { gte: startDate },
      medication: {
        userId,
        organizationId,
      },
    },
    include: {
      medication: true,
    },
    orderBy: { changeDate: "desc" },
  });
}

/**
 * Check medication limit for the user's plan
 */
export async function checkMedicationLimit({
  userId,
  organizationId,
  limit,
}: {
  userId: string;
  organizationId: string;
  limit: number;
}): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, currentCount: 0, limit: -1 };
  }

  const count = await prisma.medication.count({
    where: {
      userId,
      organizationId,
      isActive: true,
    },
  });

  return {
    allowed: count < limit,
    currentCount: count,
    limit,
  };
}

/**
 * Get medications with their intake status for today
 */
export async function getMedicationsWithTodayStatus({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}): Promise<
  (Medication & { todayIntakes: MedicationIntake[]; nextDoseTime: string | null })[]
> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const medications = await prisma.medication.findMany({
    where: {
      userId,
      organizationId,
      isActive: true,
    },
    include: {
      intakes: {
        where: {
          date: today,
        },
        orderBy: { scheduledAt: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return medications.map((med) => {
    // Calculate next dose time based on frequency and taken doses
    let nextDoseTime: string | null = null;
    const takenCount = med.intakes.filter((i) => i.status === "taken").length;

    if (med.frequency === "daily" && takenCount === 0) {
      nextDoseTime = med.timeOfDay === "evening" ? "20:00" : "08:00";
    } else if (med.frequency === "twice_daily" && takenCount < 2) {
      nextDoseTime = takenCount === 0 ? "08:00" : "20:00";
    } else if (med.frequency === "three_times_daily" && takenCount < 3) {
      nextDoseTime =
        takenCount === 0 ? "08:00" : takenCount === 1 ? "14:00" : "20:00";
    }

    return {
      ...med,
      todayIntakes: med.intakes,
      nextDoseTime,
    };
  });
}
