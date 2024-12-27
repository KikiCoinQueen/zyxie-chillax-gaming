import { toast } from "sonner";

const CACHE_DURATION = 30000; // 30 seconds
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const MAX_DELAY = 5000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

const cache = new Map<string, CacheEntry<any>>();

export const getCachedData = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    console.log(`Cache expired for key: ${key}`);
    cache.delete(key);
    return null;
  }
  
  console.log(`Cache hit for key: ${key}`);
  return entry.data;
};

export const setCachedData = <T>(key: string, data: T, etag?: string) => {
  if (!data) {
    console.warn(`Attempted to cache null/undefined data for key: ${key}`);
    return;
  }
  
  cache.set(key, {
    data,
    timestamp: Date.now(),
    etag
  });
  console.log(`Cached data for key: ${key}`);
};

export const handleApiError = (error: any, source: string) => {
  console.error(`Error in ${source}:`, error);
  
  if (error?.status === 429) {
    console.warn(`Rate limit exceeded for ${source}`);
    toast.error(`Rate limit exceeded for ${source}`, {
      description: "Using cached data while waiting for API cooldown",
      duration: 5000
    });
  } else if (error?.status === 404) {
    console.warn(`Resource not found in ${source}`);
    toast.error(`Resource not found in ${source}`, {
      description: "The requested data is not available"
    });
  } else {
    console.error(`Unexpected error in ${source}:`, error);
    toast.error(`Failed to fetch data from ${source}`, {
      description: "Falling back to alternative data source",
      action: {
        label: "Retry",
        onClick: () => window.location.reload()
      }
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

  const finalUrl = url.startsWith('http') 
    ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    : url;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} for URL:`, finalUrl);
      
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
      
      if (!data) {
        console.warn("Received null/undefined data from API");
        throw new Error("Invalid API response");
      }

      const etag = response.headers.get('etag');
      setCachedData(cacheKey, data, etag);
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt === MAX_RETRIES - 1) {
        throw error;
      }
      
      const delay = Math.min(BASE_DELAY * Math.pow(2, attempt), MAX_DELAY);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Failed after ${MAX_RETRIES} retries`);
};