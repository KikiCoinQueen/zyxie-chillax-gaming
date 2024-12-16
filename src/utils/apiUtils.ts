import { TokenData, TrendingCoin } from "@/types/token";
import { createFallbackChain } from "./apiRetry";
import { toast } from "sonner";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const DEX_SCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens/SOL";

// Improved data validation with detailed logging
const validateTokenData = (data: any): boolean => {
  if (!data) {
    console.log("Received null or undefined data");
    return false;
  }
  
  if (!data.pairs) {
    console.log("No pairs property in data:", data);
    return false;
  }
  
  if (!Array.isArray(data.pairs)) {
    console.log("Pairs is not an array:", data.pairs);
    return false;
  }
  
  if (data.pairs.length === 0) {
    console.log("Empty pairs array received");
    return false;
  }
  
  return true;
};

const fetchDexScreenerData = async (): Promise<TokenData[]> => {
  console.log("Attempting to fetch from DexScreener...");
  try {
    const response = await fetch(DEX_SCREENER_API_URL, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`DexScreener API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("DexScreener API response:", data);
    
    if (!validateTokenData(data)) {
      throw new Error("Invalid data structure from DexScreener");
    }
    
    return data.pairs
      .filter((pair: any) => {
        const fdv = parseFloat(pair.fdv);
        const volume = parseFloat(pair.volume24h);
        const hasRequiredFields = pair.baseToken?.address && 
                                pair.baseToken?.name && 
                                pair.baseToken?.symbol &&
                                pair.priceUsd &&
                                pair.volume24h;
                                
        return hasRequiredFields && 
               !isNaN(fdv) && 
               !isNaN(volume) && 
               fdv < 10000000 && 
               volume > 1000;
      })
      .sort((a: any, b: any) => parseFloat(b.volume24h) - parseFloat(a.volume24h))
      .slice(0, 6)
      .map((pair: any) => ({
        baseToken: {
          address: pair.baseToken.address,
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol,
        },
        priceUsd: pair.priceUsd,
        volume24h: pair.volume24h,
        priceChange24h: parseFloat(pair.priceChange24h),
        liquidity: { usd: pair.liquidity.usd },
        fdv: parseFloat(pair.fdv),
      }));
  } catch (error) {
    console.error("Error fetching from DexScreener:", error);
    throw error;
  }
};

const fetchCoinGeckoData = async (): Promise<TokenData[]> => {
  console.log("Fetching from CoinGecko fallback...");
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/search/trending`, {
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data?.coins || !Array.isArray(data.coins)) {
      throw new Error("Invalid data from CoinGecko API");
    }

    const coinIds = data.coins.map((coin: TrendingCoin) => coin.item.id).join(',');
    const priceResponse = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24h_vol=true&include_24h_change=true`,
      {
        signal: AbortSignal.timeout(10000)
      }
    );
    
    if (!priceResponse.ok) {
      return mapTrendingCoinsToTokens(data.coins);
    }
    
    const priceData = await priceResponse.json();
    
    return data.coins.slice(0, 6).map((coin: TrendingCoin) => ({
      baseToken: {
        address: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
      },
      priceUsd: priceData[coin.item.id]?.usd?.toString() || (coin.item.price_btc * 40000).toString(),
      volume24h: priceData[coin.item.id]?.usd_24h_vol?.toString() || 
                (coin.item.price_btc * 40000 * 1000000).toString(),
      priceChange24h: priceData[coin.item.id]?.usd_24h_change || 
                     coin.item.data?.price_change_percentage_24h || 0,
      liquidity: { usd: 1000000 },
      fdv: coin.item.market_cap_rank ? coin.item.market_cap_rank * 1000000 : 5000000,
    }));
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error);
    throw error;
  }
};

const mapTrendingCoinsToTokens = (coins: TrendingCoin[]): TokenData[] => {
  return coins.slice(0, 6).map((coin: TrendingCoin) => ({
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
};

export const fetchSolanaTokens = async (useFallback: boolean): Promise<TokenData[]> => {
  return createFallbackChain(
    fetchDexScreenerData,
    fetchCoinGeckoData,
    {
      onFallback: () => {
        toast.warning("Primary API unavailable, using fallback data source", {
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
};

export const fetchMarketChart = async (coinId: string, days: number = 2) => {
  try {
    // Removed interval parameter as it's enterprise-only
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        signal: AbortSignal.timeout(10000)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("CoinGecko Market Chart API Error:", errorData);
      throw new Error(errorData.status?.error_message || "Failed to fetch price data");
    }
    
    const data = await response.json();
    
    // Validate the response data
    if (!data?.prices || !Array.isArray(data.prices)) {
      throw new Error("Invalid market chart data structure");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching market chart:", error);
    throw error;
  }
};