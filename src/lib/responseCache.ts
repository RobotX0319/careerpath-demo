/**
 * Response caching utilities
 * Simple caching for AI responses to reduce API calls
 */

interface CacheEntry {
  response: string;
  timestamp: number;
  requestType: string;
}

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

/**
 * Generate a cache key from input parameters
 */
function generateCacheKey(type: string, input: any): string {
  const inputString = typeof input === 'string' ? input : JSON.stringify(input);
  return `${type}_${btoa(inputString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 50)}`;
}

/**
 * Get a cached response if available and not expired
 */
export function getCachedResponse(type: string, input: any): string | null {
  try {
    const key = generateCacheKey(type, input);
    const cached = localStorage.getItem(`cache_${key}`);
    
    if (cached) {
      const entry: CacheEntry = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - entry.timestamp < CACHE_DURATION) {
        console.log(`Cache hit for ${type}`);
        return entry.response;
      } else {
        // Remove expired cache
        localStorage.removeItem(`cache_${key}`);
      }
    }
  } catch (e) {
    console.error('Failed to get cached response:', e);
  }
  
  return null;
}

/**
 * Cache response
 */
export function cacheResponse(type: string, input: any, response: string): void {
  try {
    const key = generateCacheKey(type, input);
    const entry: CacheEntry = {
      response,
      timestamp: Date.now(),
      requestType: type
    };
    
    localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    console.log(`Response cached for ${type}`);
    
    // Clean old cache entries
    cleanOldCache();
  } catch (e) {
    console.error('Failed to cache response:', e);
  }
}

/**
 * Clean old cache entries
 */
function cleanOldCache(): void {
  try {
    const now = Date.now();
    const keysToRemove: string[] = [];
    
    // Check all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry = JSON.parse(cached);
            if (now - entry.timestamp >= CACHE_DURATION) {
              keysToRemove.push(key);
            }
          }
        } catch (e) {
          // If we can't parse it, remove it
          keysToRemove.push(key);
        }
      }
    }
    
    // Remove old entries
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`Cleaned ${keysToRemove.length} old cache entries`);
    }
  } catch (e) {
    console.error('Failed to clean old cache:', e);
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`Cleared ${keysToRemove.length} cache entries`);
  } catch (e) {
    console.error('Failed to clear cache:', e);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  try {
    let totalEntries = 0;
    let totalSize = 0;
    let oldEntries = 0;
    const now = Date.now();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        totalEntries++;
        const cached = localStorage.getItem(key);
        if (cached) {
          totalSize += cached.length;
          try {
            const entry: CacheEntry = JSON.parse(cached);
            if (now - entry.timestamp >= CACHE_DURATION) {
              oldEntries++;
            }
          } catch (e) {
            oldEntries++;
          }
        }
      }
    }
    
    return {
      totalEntries,
      totalSize,
      oldEntries,
      cacheDuration: CACHE_DURATION
    };
  } catch (e) {
    console.error('Failed to get cache stats:', e);
    return {
      totalEntries: 0,
      totalSize: 0,
      oldEntries: 0,
      cacheDuration: CACHE_DURATION
    };
  }
}