export const CACHE_TTL = {
  FEATURED: 60, // seconds
  ARTICLE_LIST: 30,
  FIXTURES_WEEK: 60,
  SPORTS: 300,
} as const;

interface CacheEntry {
  value: any;
  expiresAt: number;
}

// Simple in-memory cache since we run on a single instance for the free MVP
const memoryCache = new Map<string, CacheEntry>();

export async function getCache<T>(key: string): Promise<T | null> {
  const entry = memoryCache.get(key);
  if (!entry) return null;

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value as T;
}

export async function setCache(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  memoryCache.set(key, { value, expiresAt });
}

export async function invalidateCache(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  
  // Support simple wildcard matching at the end (e.g. "articles:*")
  const exactKeys = keys.filter(k => !k.endsWith('*'));
  const wildcardKeys = keys.filter(k => k.endsWith('*')).map(k => k.slice(0, -1));

  for (const key of memoryCache.keys()) {
    if (exactKeys.includes(key)) {
      memoryCache.delete(key);
    } else if (wildcardKeys.some(wk => key.startsWith(wk))) {
      memoryCache.delete(key);
    }
  }
}
