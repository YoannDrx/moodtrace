import type { CaregiverDailyCheckin } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Get daily check-ins made by a caregiver (author)
 */
export async function getAuthorCheckins({
  authorId,
  spaceId,
  subjectId,
  limit = 30,
}: {
  authorId: string;
  spaceId: string;
  subjectId?: string;
  limit?: number;
}): Promise<CaregiverDailyCheckin[]> {
  return prisma.caregiverDailyCheckin.findMany({
    where: {
      authorId,
      spaceId,
      ...(subjectId ? { subjectId } : {}),
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}

/**
 * Get daily check-ins about a patient (subject)
 * Filters by patientVisibility unless includeHidden is true
 */
export async function getSubjectCheckins({
  subjectId,
  spaceId,
  includeHidden = false,
  limit = 30,
}: {
  subjectId: string;
  spaceId: string;
  includeHidden?: boolean;
  limit?: number;
}): Promise<
  (CaregiverDailyCheckin & {
    author: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  })[]
> {
  return prisma.caregiverDailyCheckin.findMany({
    where: {
      subjectId,
      spaceId,
      ...(includeHidden ? {} : { patientVisibility: "visible" }),
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}

/**
 * Get a specific daily check-in by ID
 */
export async function getDailyCheckinById({
  id,
  spaceId,
}: {
  id: string;
  spaceId: string;
}): Promise<CaregiverDailyCheckin | null> {
  return prisma.caregiverDailyCheckin.findFirst({
    where: {
      id,
      spaceId,
    },
  });
}

/**
 * Check if a daily check-in already exists for a given date
 */
export async function getDailyCheckinForDate({
  authorId,
  subjectId,
  spaceId,
  date,
}: {
  authorId: string;
  subjectId: string;
  spaceId: string;
  date: Date;
}): Promise<CaregiverDailyCheckin | null> {
  return prisma.caregiverDailyCheckin.findFirst({
    where: {
      authorId,
      subjectId,
      spaceId,
      date,
    },
  });
}
