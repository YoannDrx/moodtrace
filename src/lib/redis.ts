import Redis from "ioredis";

const getRedisClient = () => {
  if (!process.env.REDIS_URL) {
    console.warn(
      "[Redis] REDIS_URL not set. Caching disabled. Set REDIS_URL in .env for production."
    );
    return null;
  }

  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) {
        return null;
      }
      return Math.min(times * 50, 2000);
    },
    lazyConnect: false,
  });
};

export const redisClient = getRedisClient();

/**
 * Get value from Redis cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redisClient) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("[Redis] Get error:", error);
    return null;
  }
}

/**
 * Set value in Redis cache
 */
export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number = 3600
): Promise<void> {
  if (!redisClient) return;
  try {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error("[Redis] Set error:", error);
  }
}

/**
 * Delete value from Redis cache
 */
export async function deleteCache(key: string): Promise<void> {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("[Redis] Delete error:", error);
  }
}
