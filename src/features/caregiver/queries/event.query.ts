import type { CaregiverEvent } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

import type { EventTypeType } from "../schemas/event.schema";

type EventType = EventTypeType;

/**
 * Get events created by a caregiver (author)
 */
export async function getAuthorEvents({
  authorId,
  spaceId,
  subjectId,
  eventType,
  limit = 30,
}: {
  authorId: string;
  spaceId: string;
  subjectId?: string;
  eventType?: EventType;
  limit?: number;
}): Promise<CaregiverEvent[]> {
  return prisma.caregiverEvent.findMany({
    where: {
      authorId,
      spaceId,
      ...(subjectId ? { subjectId } : {}),
      ...(eventType ? { eventType } : {}),
    },
    orderBy: { occurredAt: "desc" },
    take: limit,
  });
}

/**
 * Get events about a patient (subject)
 * Filters by patientVisibility unless includeHidden is true
 */
export async function getSubjectEvents({
  subjectId,
  spaceId,
  includeHidden = false,
  eventType,
  minSeverity,
  limit = 30,
}: {
  subjectId: string;
  spaceId: string;
  includeHidden?: boolean;
  eventType?: EventType;
  minSeverity?: number;
  limit?: number;
}): Promise<
  (CaregiverEvent & {
    author: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  })[]
> {
  return prisma.caregiverEvent.findMany({
    where: {
      subjectId,
      spaceId,
      ...(includeHidden ? {} : { patientVisibility: "visible" }),
      ...(eventType ? { eventType } : {}),
      ...(minSeverity ? { severity: { gte: minSeverity } } : {}),
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
    orderBy: { occurredAt: "desc" },
    take: limit,
  });
}

/**
 * Get a specific event by ID
 */
export async function getEventById({
  id,
  spaceId,
}: {
  id: string;
  spaceId: string;
}): Promise<CaregiverEvent | null> {
  return prisma.caregiverEvent.findFirst({
    where: {
      id,
      spaceId,
    },
  });
}

/**
 * Get events for a date range
 */
export async function getEventsInRange({
  subjectId,
  spaceId,
  startDate,
  endDate,
  includeHidden = false,
}: {
  subjectId: string;
  spaceId: string;
  startDate: Date;
  endDate: Date;
  includeHidden?: boolean;
}): Promise<CaregiverEvent[]> {
  return prisma.caregiverEvent.findMany({
    where: {
      subjectId,
      spaceId,
      occurredAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(includeHidden ? {} : { patientVisibility: "visible" }),
    },
    orderBy: { occurredAt: "desc" },
  });
}

/**
 * Count events by type for a patient
 */
export async function countEventsByType({
  subjectId,
  spaceId,
  includeHidden = false,
}: {
  subjectId: string;
  spaceId: string;
  includeHidden?: boolean;
}): Promise<Record<string, number>> {
  const events = await prisma.caregiverEvent.groupBy({
    by: ["eventType"],
    where: {
      subjectId,
      spaceId,
      ...(includeHidden ? {} : { patientVisibility: "visible" }),
    },
    _count: {
      eventType: true,
    },
  });

  return events.reduce<Record<string, number>>(
    (
      acc: Record<string, number>,
      event: { eventType: string; _count: { eventType: number } },
    ) => {
      acc[event.eventType] = event._count.eventType;
      return acc;
    },
    {},
  );
}
