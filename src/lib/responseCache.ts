/**
 * Response caching for Gemini AI
 * 
 * This module provides a simple in-memory caching system for AI responses
 * to reduce API calls and improve performance.
 */

// Cache storage with type definitions
interface CacheEntry {
  response: string;
  timestamp: number;
  type: 'personality' | 'career' | 'chat';
}

// Cache structure by type and key
const responseCache = new Map<string, CacheEntry>();

// Cache expiration times (in milliseconds)
const CACHE_EXPIRY = {
  personality: 7 * 24 * 60 * 60 * 1000, // 7 days
  career: 7 * 24 * 60 * 60 * 1000,      // 7 days
  chat: 1 * 60 * 60 * 1000              // 1 hour
};

/**
 * Generate a cache key from input parameters
 */
function generateCacheKey(type: string, params: any): string {
  return `${type}_${JSON.stringify(params)}`;
}

/**
 * Get a cached response if available and not expired
 */
export function getCachedResponse(
  type: 'personality' | 'career' | 'chat',
  params: any
): string | null {
  const cacheKey = generateCacheKey(type, params);
  const cached = responseCache.get(cacheKey);
  
  if (!cached) {
    return null;
  }
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_EXPIRY[type]) {
    // Cache expired, remove it
    responseCache.delete(cacheKey);
    return null;
  }
  
  return cached.response;
}

/**
 * Store a response in cache
 */
export function cacheResponse(
  type: 'personality' | 'career' | 'chat',
  params: any,
  response: string
): void {
  const cacheKey = generateCacheKey(type, params);
  
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now(),
    type
  });
  
  // Cleanup old cache entries periodically
  if (responseCache.size > 100) {
    cleanupCache();
  }
}

/**
 * Clear old cache entries to prevent memory leaks
 */
function cleanupCache(): void {
  const now = Date.now();
  
  // Delete expired entries
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > CACHE_EXPIRY[entry.type]) {
      responseCache.delete(key);
    }
  }
  
  // If still too large, remove oldest entries
  if (responseCache.size > 50) {
    const entries = Array.from(responseCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Delete oldest 20 entries
    for (let i = 0; i < 20 && i < entries.length; i++) {
      responseCache.delete(entries[i][0]);
    }
  }
}

/**
 * Clear the entire cache or entries of a specific type
 */
export function clearCache(type?: 'personality' | 'career' | 'chat'): void {
  if (!type) {
    responseCache.clear();
    return;
  }
  
  for (const [key, entry] of responseCache.entries()) {
    if (entry.type === type) {
      responseCache.delete(key);
    }
  }
}