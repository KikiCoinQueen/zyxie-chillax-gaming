import { TokenData } from "@/types/token";
import { createFallbackChain } from "./apiRetry";
import { toast } from "sonner";
import { fetchDexScreenerData } from "./api/dexScreenerClient";
import { fetchCoinGeckoData, fetchMarketChart } from "./api/coinGeckoClient";

const API_CACHE = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

const getCachedData = <T>(key: string): T | null => {
  const cached = API_CACHE.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
};

const setCachedData = <T>(key: string, data: T): void => {
  API_CACHE.set(key, { data, timestamp: Date.now() });
};

export const fetchSolanaTokens = async (useFallback: boolean): Promise<TokenData[]> => {
  const cacheKey = `solana_tokens_${useFallback}`;
  const cached = getCachedData<TokenData[]>(cacheKey);
  
  if (cached) {
    console.log("Using cached token data");
    return cached;
  }

  try {
    const data = await createFallbackChain(
      fetchDexScreenerData,
      fetchCoinGeckoData,
      {
        onFallback: () => {
          toast.warning("Primary API unavailable, using backup data source", {
            duration: 5000,
            action: {
              label: "Retry Primary",
              onClick: () => window.location.reload()
            }
          });
        },
        retryConfig: {
          maxAttempts: 3,
          baseDelay: 1000,
          maxDelay: 5000
        }
      }
    );

    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Failed to fetch token data:", error);
    toast.error("Unable to fetch token data", {
      description: "Please try again later"
    });
    throw error;
  }
};

export const fetchMarketData = async (tokenAddress: string): Promise<any> => {
  const cacheKey = `market_${tokenAddress}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  const data = await fetchMarketChart(tokenAddress);
  setCachedData(cacheKey, data);
  return data;
};