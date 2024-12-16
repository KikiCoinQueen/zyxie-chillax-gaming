import { toast } from "sonner";

interface RetryConfig {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> => {
  const { maxAttempts = 3, baseDelay = 1000, maxDelay = 10000 } = config;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxAttempts) break;

      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export const createFallbackChain = async <T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  options: { 
    onFallback?: () => void;
    retryConfig?: RetryConfig;
  } = {}
): Promise<T> => {
  const { onFallback, retryConfig } = options;

  try {
    return await withRetry(primaryFn, retryConfig);
  } catch (primaryError) {
    console.error("Primary API failed, switching to fallback:", primaryError);
    onFallback?.();
    
    try {
      return await withRetry(fallbackFn, retryConfig);
    } catch (fallbackError) {
      console.error("Fallback API also failed:", fallbackError);
      toast.error("Unable to fetch data from any source. Please try again later.");
      throw fallbackError;
    }
  }
};