/**
 * Offline Data Helper
 * 
 * Utility functions to assist with offline data management
 */

import { getCareerPathData } from '@/lib/offlineStorage';

/**
 * Fetches data with offline fallback
 * First attempts to fetch from the API, and if that fails, falls back to IndexedDB
 * 
 * @param apiUrl - The URL to fetch data from
 * @param offlineKey - The key to use for fetching offline data from IndexedDB
 * @returns The fetched data
 */
export async function fetchWithOfflineFallback<T>(apiUrl: string, offlineKey: string): Promise<T | null> {
  try {
    // Try online fetch first
    if (navigator.onLine) {
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        return data as T;
      }
    }
    
    // Fall back to offline data if online fetch fails or user is offline
    console.log(`Falling back to offline data for ${offlineKey}`);
    const offlineData = await getCareerPathData(offlineKey);
    return offlineData as T;
  } catch (error) {
    console.error('Error fetching data with offline fallback:', error);
    
    // Last resort - try to get from offline storage
    try {
      const offlineData = await getCareerPathData(offlineKey);
      return offlineData as T;
    } catch (innerError) {
      console.error('Error getting offline data:', innerError);
      return null;
    }
  }
}

/**
 * Determines if data should be fetched based on last fetch time
 * 
 * @param key - Storage key for the data
 * @param maxAgeMinutes - Maximum age of the data in minutes before refetching
 * @returns Boolean indicating whether data should be fetched
 */
export function shouldFetchData(key: string, maxAgeMinutes: number = 30): boolean {
  try {
    const lastFetchTime = localStorage.getItem(`lastFetch_${key}`);
    
    if (!lastFetchTime) {
      return true;
    }
    
    const lastFetchDate = new Date(parseInt(lastFetchTime, 10));
    const now = new Date();
    
    // Calculate time difference in minutes
    const diffMinutes = (now.getTime() - lastFetchDate.getTime()) / (1000 * 60);
    
    // Return true if data is older than maxAgeMinutes
    return diffMinutes > maxAgeMinutes;
  } catch (error) {
    console.error('Error checking data freshness:', error);
    return true;
  }
}

/**
 * Updates the last fetch time for a specific data key
 * 
 * @param key - Storage key for the data
 */
export function updateLastFetchTime(key: string): void {
  try {
    localStorage.setItem(`lastFetch_${key}`, Date.now().toString());
  } catch (error) {
    console.error('Error updating last fetch time:', error);
  }
}

/**
 * Checks if an object is empty
 * 
 * @param obj - The object to check
 * @returns Boolean indicating whether the object is empty
 */
export function isEmptyObject(obj: any): boolean {
  return obj === null || obj === undefined || (Object.keys(obj).length === 0 && obj.constructor === Object);
}

/**
 * Checks if a value is valid for use (not null, undefined, or empty)
 * 
 * @param value - The value to check
 * @returns Boolean indicating whether the value is valid
 */
export function isValidValue(value: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  
  if (typeof value === 'object' && isEmptyObject(value)) {
    return false;
  }
  
  return true;
}