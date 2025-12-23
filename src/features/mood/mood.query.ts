import type { MoodEntry } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Get mood entries for a user within a date range
 */
export async function getMoodEntries({
  userId,
  organizationId,
  startDate,
  endDate,
  limit = 30,
}: {
  userId: string;
  organizationId: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): Promise<MoodEntry[]> {
  const whereClause: {
    userId: string;
    organizationId: string;
    date?: { gte?: Date; lte?: Date };
  } = {
    userId,
    organizationId,
  };

  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = startDate;
    if (endDate) whereClause.date.lte = endDate;
  }

  return prisma.moodEntry.findMany({
    where: whereClause,
    orderBy: { date: "desc" },
    take: limit,
  });
}

/**
 * Get a single mood entry for a specific date
 */
export async function getMoodEntryByDate({
  userId,
  organizationId,
  date,
}: {
  userId: string;
  organizationId: string;
  date: Date;
}): Promise<MoodEntry | null> {
  return prisma.moodEntry.findUnique({
    where: {
      userId_organizationId_date: {
        userId,
        organizationId,
        date,
      },
    },
  });
}

/**
 * Get mood entry for today
 */
export async function getTodayMoodEntry({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}): Promise<MoodEntry | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return getMoodEntryByDate({
    userId,
    organizationId,
    date: today,
  });
}

/**
 * Get mood statistics for a period
 */
export async function getMoodStats({
  userId,
  organizationId,
  days = 30,
}: {
  userId: string;
  organizationId: string;
  days?: number;
}): Promise<{
  averageMood: number | null;
  averageEnergy: number | null;
  averageSleepHours: number | null;
  averageAnxiety: number | null;
  entriesCount: number;
  streak: number;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const entries = await prisma.moodEntry.findMany({
    where: {
      userId,
      organizationId,
      date: { gte: startDate },
    },
    orderBy: { date: "desc" },
  });

  if (entries.length === 0) {
    return {
      averageMood: null,
      averageEnergy: null,
      averageSleepHours: null,
      averageAnxiety: null,
      entriesCount: 0,
      streak: 0,
    };
  }

  // Calculate averages
  const moodSum = entries.reduce((sum, e) => sum + e.mood, 0);
  const energyEntries = entries.filter((e) => e.energy !== null);
  const sleepHoursEntries = entries.filter((e) => e.sleepHours !== null);
  const anxietyEntries = entries.filter((e) => e.anxiety !== null);

  // Calculate streak (consecutive days with entries)
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const hasEntry = entries.some((e) => {
      const entryDate = new Date(e.date);
      return entryDate.toDateString() === checkDate.toDateString();
    });

    if (hasEntry) {
      streak++;
    } else if (i > 0) {
      // Only break streak after first day (allow missing today)
      break;
    }
  }

  return {
    averageMood: Math.round((moodSum / entries.length) * 10) / 10,
    averageEnergy:
      energyEntries.length > 0
        ? Math.round(
            (energyEntries.reduce((sum, e) => sum + (e.energy ?? 0), 0) /
              energyEntries.length) *
              10,
          ) / 10
        : null,
    averageSleepHours:
      sleepHoursEntries.length > 0
        ? Math.round(
            (sleepHoursEntries.reduce(
              (sum, e) => sum + (e.sleepHours ?? 0),
              0,
            ) /
              sleepHoursEntries.length) *
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
    entriesCount: entries.length,
    streak,
  };
}

/**
 * Check if user has reached their mood entry limit for the month
 */
export async function checkMoodEntryLimit({
  userId,
  organizationId,
  monthlyLimit,
}: {
  userId: string;
  organizationId: string;
  monthlyLimit: number;
}): Promise<{ allowed: boolean; currentCount: number; limit: number }> {
  // -1 means unlimited
  if (monthlyLimit === -1) {
    return { allowed: true, currentCount: 0, limit: -1 };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const count = await prisma.moodEntry.count({
    where: {
      userId,
      organizationId,
      createdAt: { gte: startOfMonth },
    },
  });

  return {
    allowed: count < monthlyLimit,
    currentCount: count,
    limit: monthlyLimit,
  };
}
