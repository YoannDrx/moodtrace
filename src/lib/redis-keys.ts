/**
 * Redis cache keys for MoodJournal
 */

export const CacheKeys = {
  orgSubscription: (orgId: string) => `org:${orgId}:subscription`,
  userSession: (userId: string) => `user:${userId}:session`,
  moodStats: (userId: string, orgId: string) =>
    `mood:${userId}:${orgId}:stats`,
  medicationAdherence: (userId: string, medId: string) =>
    `med:${userId}:${medId}:adherence`,
} as const;

/**
 * Cache TTL in seconds
 */
export const CacheTTL = {
  ORG_SUBSCRIPTION: 3600, // 1 hour
  USER_SESSION: 1800, // 30 minutes
  MOOD_STATS: 300, // 5 minutes
  MEDICATION_ADHERENCE: 600, // 10 minutes
} as const;
