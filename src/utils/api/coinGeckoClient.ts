import { TokenData, TrendingCoin } from "@/types/token";
import { validateMarketChartData } from "../validation/tokenDataValidator";
import { toast } from "sonner";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const CACHE_DURATION = 60000; // 1 minute cache

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Map<string, CacheEntry<any>> = new Map();

const getCachedData = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
};

const setCachedData = <T>(key: string, data: T) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
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

export const fetchCoinGeckoData = async (): Promise<TokenData[]> => {
  console.log("Fetching from CoinGecko...");
  
  const cachedData = getCachedData<TokenData[]>("trending");
  if (cachedData) {
    console.log("Using cached trending data");
    return cachedData;
  }
  
  try {
    const response = await fetchWithTimeout(`${COINGECKO_BASE_URL}/search/trending`);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data?.coins || !Array.isArray(data.coins)) {
      throw new Error("Invalid data from CoinGecko API");
    }

    const tokens = data.coins.slice(0, 6).map((coin: TrendingCoin) => ({
      baseToken: {
        address: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
      },
      priceUsd: (coin.item.price_btc * 40000).toString(),
      volume24h: (coin.item.price_btc * 40000 * 1000000).toString(),
      priceChange24h: coin.item.data?.price_change_percentage_24h || 0,
      liquidity: { usd: 1000000 },
      fdv: coin.item.market_cap_rank ? coin.item.market_cap_rank * 1000000 : 5000000,
    }));

    setCachedData("trending", tokens);
    return tokens;
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error);
    toast.error("Failed to fetch trending coins", {
      description: "Please try again later."
    });
    throw error;
  }
};

export const fetchMarketChart = async (coinId: string, days: number = 2) => {
  const cacheKey = `chart_${coinId}_${days}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log("Using cached chart data");
    return cachedData;
  }
  
  try {
    const response = await fetchWithTimeout(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch price data");
    }
    
    const data = await response.json();
    
    if (!validateMarketChartData(data)) {
      throw new Error("Invalid market chart data structure");
    }
    
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching market chart:", error);
    toast.error("Failed to fetch price chart", {
      description: "We'll try again shortly."
    });
    throw error;
  }
};