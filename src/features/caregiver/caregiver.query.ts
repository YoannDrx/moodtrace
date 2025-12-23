import type {
  CaregiverDailyCheckin,
  CaregiverEvent,
  User,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Get caregiver check-ins for a subject (patient)
 */
export async function getCaregiverCheckins({
  subjectId,
  spaceId,
  startDate,
  endDate,
  limit = 30,
}: {
  subjectId: string;
  spaceId: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): Promise<(CaregiverDailyCheckin & { author: User })[]> {
  return prisma.caregiverDailyCheckin.findMany({
    where: {
      subjectId,
      spaceId,
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    },
    include: {
      author: true,
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}

/**
 * Get caregiver check-ins authored by a user
 */
export async function getAuthoredCheckins({
  authorId,
  spaceId,
  limit = 30,
}: {
  authorId: string;
  spaceId: string;
  limit?: number;
}): Promise<(CaregiverDailyCheckin & { subject: User })[]> {
  return prisma.caregiverDailyCheckin.findMany({
    where: {
      authorId,
      spaceId,
    },
    include: {
      subject: true,
    },
    orderBy: { date: "desc" },
    take: limit,
  });
}

/**
 * Get a specific check-in by date
 */
export async function getCaregiverCheckinByDate({
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
  return prisma.caregiverDailyCheckin.findUnique({
    where: {
      authorId_subjectId_spaceId_date: {
        authorId,
        subjectId,
        spaceId,
        date,
      },
    },
  });
}

/**
 * Get caregiver events for a subject
 */
export async function getCaregiverEvents({
  subjectId,
  spaceId,
  eventType,
  startDate,
  endDate,
  limit = 50,
}: {
  subjectId: string;
  spaceId: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): Promise<(CaregiverEvent & { author: User })[]> {
  return prisma.caregiverEvent.findMany({
    where: {
      subjectId,
      spaceId,
      ...(eventType && { eventType }),
      ...(startDate || endDate
        ? {
            occurredAt: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    },
    include: {
      author: true,
    },
    orderBy: { occurredAt: "desc" },
    take: limit,
  });
}

/**
 * Get caregiver events authored by a user
 */
export async function getAuthoredEvents({
  authorId,
  spaceId,
  limit = 50,
}: {
  authorId: string;
  spaceId: string;
  limit?: number;
}): Promise<(CaregiverEvent & { subject: User })[]> {
  return prisma.caregiverEvent.findMany({
    where: {
      authorId,
      spaceId,
    },
    include: {
      subject: true,
    },
    orderBy: { occurredAt: "desc" },
    take: limit,
  });
}

/**
 * Get a single event by ID
 */
export async function getCaregiverEventById({
  id,
  spaceId,
}: {
  id: string;
  spaceId: string;
}): Promise<(CaregiverEvent & { author: User; subject: User }) | null> {
  return prisma.caregiverEvent.findFirst({
    where: {
      id,
      spaceId,
    },
    include: {
      author: true,
      subject: true,
    },
  });
}

/**
 * Get recent activity (check-ins + events) for a subject
 */
export async function getRecentCaregiverActivity({
  subjectId,
  spaceId,
  days = 7,
}: {
  subjectId: string;
  spaceId: string;
  days?: number;
}): Promise<{
  checkins: (CaregiverDailyCheckin & { author: User })[];
  events: (CaregiverEvent & { author: User })[];
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const [checkins, events] = await Promise.all([
    prisma.caregiverDailyCheckin.findMany({
      where: {
        subjectId,
        spaceId,
        date: { gte: startDate },
      },
      include: { author: true },
      orderBy: { date: "desc" },
    }),
    prisma.caregiverEvent.findMany({
      where: {
        subjectId,
        spaceId,
        occurredAt: { gte: startDate },
      },
      include: { author: true },
      orderBy: { occurredAt: "desc" },
    }),
  ]);

  return { checkins, events };
}

/**
 * Get organization members (potential subjects for caregiver)
 */
export async function getOrganizationMembers({
  organizationId,
  excludeUserId,
}: {
  organizationId: string;
  excludeUserId?: string;
}): Promise<{ id: string; name: string; email: string; role: string }[]> {
  const members = await prisma.member.findMany({
    where: {
      organizationId,
      ...(excludeUserId && { userId: { not: excludeUserId } }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
  }));
}

/**
 * Get caregiver stats for a period
 */
export async function getCaregiverStats({
  subjectId,
  spaceId,
  days = 30,
}: {
  subjectId: string;
  spaceId: string;
  days?: number;
}): Promise<{
  totalCheckins: number;
  totalEvents: number;
  eventsBySeverity: Record<number, number>;
  eventsByType: Record<string, number>;
  averageMood: string | null;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const [checkins, events] = await Promise.all([
    prisma.caregiverDailyCheckin.findMany({
      where: {
        subjectId,
        spaceId,
        date: { gte: startDate },
      },
      select: { moodObserved: true },
    }),
    prisma.caregiverEvent.findMany({
      where: {
        subjectId,
        spaceId,
        occurredAt: { gte: startDate },
      },
      select: { eventType: true, severity: true },
    }),
  ]);

  // Calculate stats
  const eventsBySeverity: Record<number, number> = {};
  const eventsByType: Record<string, number> = {};

  for (const event of events) {
    eventsBySeverity[event.severity] =
      (eventsBySeverity[event.severity] || 0) + 1;
    eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
  }

  // Calculate average mood (most frequent)
  const moodCounts: Record<string, number> = {};
  for (const checkin of checkins) {
    if (checkin.moodObserved) {
      moodCounts[checkin.moodObserved] =
        (moodCounts[checkin.moodObserved] || 0) + 1;
    }
  }
  const averageMood =
    Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    totalCheckins: checkins.length,
    totalEvents: events.length,
    eventsBySeverity,
    eventsByType,
    averageMood,
  };
}
