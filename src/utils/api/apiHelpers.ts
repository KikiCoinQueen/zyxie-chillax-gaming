import { toast } from "sonner";

const CACHE_DURATION = 30000; // 30 seconds
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const MAX_DELAY = 5000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

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
  if (!data) return;
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const handleApiError = (error: any, source: string) => {
  console.error(`Error in ${source}:`, error);
  
  if (error?.status === 429) {
    toast.error(`Rate limit exceeded for ${source}`, {
      description: "Using cached data while waiting for API cooldown"
    });
  } else {
    toast.error(`Failed to fetch data from ${source}`, {
      description: "Falling back to alternative data source"
    });
  }
};

export const fetchWithRetry = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const cacheKey = `${url}${JSON.stringify(options)}`;
  const cachedData = getCachedData<T>(cacheKey);
  
  if (cachedData) {
    console.log("Using cached data for:", url);
    return cachedData;
  }

  // Add CORS proxy for all requests
  const finalUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(finalUrl, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      if (attempt === MAX_RETRIES - 1) throw error;
      const delay = Math.min(BASE_DELAY * Math.pow(2, attempt), MAX_DELAY);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Failed after ${MAX_RETRIES} retries`);
};