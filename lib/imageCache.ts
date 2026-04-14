/**
 * Image Cache Utility
 *
 * Caches fetched images in localStorage to avoid repeated API calls
 * Helps improve performance and reduce API usage
 */

const CACHE_KEY = 'property_images_cache';
const CACHE_VERSION = '1';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  url: string;
  timestamp: number;
}

interface CacheData {
  version: string;
  data: Record<string, CacheEntry>;
}

/**
 * Get cached image URL if available and not expired
 */
export function getCachedImage(key: string): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const cacheData: CacheData = JSON.parse(cached);
    if (cacheData.version !== CACHE_VERSION) {
      clearImageCache();
      return null;
    }

    const entry = cacheData.data[key];
    if (!entry) return null;

    // Check if cache has expired
    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      delete cacheData.data[key];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      return null;
    }

    return entry.url;
  } catch (error) {
    console.warn('Error reading image cache:', error);
    return null;
  }
}

/**
 * Cache an image URL
 */
export function setCachedImage(key: string, url: string): void {
  if (typeof window === 'undefined') return;

  try {
    let cacheData: CacheData = { version: CACHE_VERSION, data: {} };

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed: CacheData = JSON.parse(cached);
      if (parsed.version === CACHE_VERSION) {
        cacheData = parsed;
      }
    }

    cacheData.data[key] = {
      url,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Error writing to image cache:', error);
  }
}

/**
 * Clear all cached images
 */
export function clearImageCache(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Error clearing image cache:', error);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return { entries: 0, size: 0 };

    const cacheData: CacheData = JSON.parse(cached);
    return {
      entries: Object.keys(cacheData.data).length,
      size: new Blob([cached]).size,
      version: cacheData.version,
    };
  } catch (error) {
    return null;
  }
}
