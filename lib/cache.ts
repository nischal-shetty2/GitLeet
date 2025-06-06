// Simple in-memory cache for response data
// This helps to prevent the app from going down completely when the API is unavailable

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ResponseCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Store data in cache
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  }

  // Get data from cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if the entry has expired
    if (entry.timestamp < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  // Check if the cache has a valid entry
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Check if the entry has expired
    if (entry.timestamp < Date.now()) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Remove a specific entry
  remove(key: string): void {
    this.cache.delete(key);
  }

  // Clear all entries from cache
  clear(): void {
    this.cache.clear();
  }
}

// Create a singleton instance
export const responseCache = new ResponseCache();
