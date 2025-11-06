type CacheEntry<T> = {
  value: T;
  expiry: number;
};

const cache = new Map<string, CacheEntry<any>>();
const CLEANUP_INTERVAL = 60_000;

export async function cacheWrap<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key);

  if (entry && entry.expiry > now) {
    return entry.value;
  }

  const value = await fn();
  cache.set(key, { value, expiry: now + ttlMs });
  return value;
}

export function clearCache(): void {
  cache.clear();
  if (process.env.NODE_ENV === "development") {
    console.log("🧹 Cache cleared manually.");
  }
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiry <= now) {
      cache.delete(key);
    }
  }
}, CLEANUP_INTERVAL).unref();