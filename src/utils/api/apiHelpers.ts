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
  
  const message = error?.message || 'Unknown error occurred';
  if (message.includes('rate limit')) {
    toast.error(`Rate limit exceeded for ${source}`, {
      description: "Using cached data while waiting for API cooldown"
    });
  } else {
    toast.error(`Failed to fetch data from ${source}`, {
      description: "Falling back to alternative data source"
    });
  }
};

export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = 5000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  baseDelay = BASE_DELAY,
  maxDelay = MAX_DELAY
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt === retries - 1) {
        throw lastError;
      }
      
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};