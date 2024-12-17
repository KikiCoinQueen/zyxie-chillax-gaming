import { toast } from "sonner";

export const CACHE_DURATION = 15000; // 15 seconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

export const isCacheValid = (cacheKey: string): boolean => {
  const entry = cache.get(cacheKey);
  return !!(entry && (Date.now() - entry.timestamp) < CACHE_DURATION);
};

export const getCachedData = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
};

export const setCachedData = <T>(key: string, data: T) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const handleApiError = (error: any, source: string) => {
  console.error(`Error in ${source}:`, error);
  if (error.message.includes('rate limit')) {
    toast.error(`Rate limit exceeded for ${source}`, {
      description: "Using cached data while waiting for API cooldown"
    });
  } else {
    console.warn(`Failed to fetch data from ${source}`, error);
  }
};

export const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const retryWithExponentialBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.min(1000 * Math.pow(2, i), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`Retry attempt ${i + 1} after ${delay}ms delay`);
    }
  }
};