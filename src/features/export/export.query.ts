import type {
  MoodEntry,
  Medication,
  MedicationChange,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type ExportData = {
  period: {
    startDate: Date;
    endDate: Date;
  };
  patient: {
    name: string | null;
    email: string;
  };
  moodEntries: MoodEntry[];
  medications: Medication[];
  medicationChanges: (MedicationChange & { medication: { name: string } })[];
  stats: {
    averageMood: number | null;
    averageEnergy: number | null;
    averageSleepHours: number | null;
    averageAnxiety: number | null;
    entriesCount: number;
  };
};

/**
 * Get all data for export
 */
export async function getExportData({
  userId,
  organizationId,
  startDate,
  endDate,
}: {
  userId: string;
  organizationId: string;
  startDate: Date;
  endDate: Date;
}): Promise<ExportData> {
  const [user, moodEntries, medications, medicationChanges] = await Promise.all(
    [
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      }),
      prisma.moodEntry.findMany({
        where: {
          userId,
          organizationId,
          date: { gte: startDate, lte: endDate },
        },
        orderBy: { date: "asc" },
      }),
      prisma.medication.findMany({
        where: {
          userId,
          organizationId,
          OR: [
            { startDate: { lte: endDate }, endDate: null },
            { startDate: { lte: endDate }, endDate: { gte: startDate } },
          ],
        },
        orderBy: { name: "asc" },
      }),
      prisma.medicationChange.findMany({
        where: {
          changeDate: { gte: startDate, lte: endDate },
          medication: {
            userId,
            organizationId,
          },
        },
        include: {
          medication: {
            select: { name: true },
          },
        },
        orderBy: { changeDate: "asc" },
      }),
    ],
  );

  // Calculate stats
  const moodSum = moodEntries.reduce((sum, e) => sum + e.mood, 0);
  const energyEntries = moodEntries.filter((e) => e.energy !== null);
  const sleepEntries = moodEntries.filter((e) => e.sleepHours !== null);
  const anxietyEntries = moodEntries.filter((e) => e.anxiety !== null);

  const stats = {
    averageMood:
      moodEntries.length > 0
        ? Math.round((moodSum / moodEntries.length) * 10) / 10
        : null,
    averageEnergy:
      energyEntries.length > 0
        ? Math.round(
            (energyEntries.reduce((sum, e) => sum + (e.energy ?? 0), 0) /
              energyEntries.length) *
              10,
          ) / 10
        : null,
    averageSleepHours:
      sleepEntries.length > 0
        ? Math.round(
            (sleepEntries.reduce((sum, e) => sum + (e.sleepHours ?? 0), 0) /
              sleepEntries.length) *
              10,
          ) / 10
        : null,
    averageAnxiety:
      anxietyEntries.length > 0
        ? Math.round(
            (anxietyEntries.reduce((sum, e) => sum + (e.anxiety ?? 0), 0) /
              anxietyEntries.length) *
              10,
          ) / 10
        : null,
    entriesCount: moodEntries.length,
  };

  return {
    period: { startDate, endDate },
    patient: user ?? { name: null, email: "" },
    moodEntries,
    medications,
    medicationChanges,
    stats,
  };
}
