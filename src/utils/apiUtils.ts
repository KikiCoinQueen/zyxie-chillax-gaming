import { TokenData, TrendingCoin } from "@/types/token";
import { createFallbackChain } from "./apiRetry";
import { toast } from "sonner";

const FALLBACK_API_URL = "https://api.coingecko.com/api/v3/search/trending";
const DEX_SCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens/SOL";
const COINGECKO_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price";

const validateTokenData = (data: any): boolean => {
  if (!data?.pairs) {
    console.log("No pairs data received:", data);
    return false;
  }
  
  if (!Array.isArray(data.pairs)) {
    console.error("Invalid pairs data structure:", data);
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
      }
    });
    
    if (!response.ok) {
      console.error(`DexScreener API failed with status: ${response.status}`);
      throw new Error(`DexScreener API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("DexScreener API response:", data);
    
    if (!validateTokenData(data)) {
      throw new Error("Invalid or empty data from DexScreener API");
    }
    
    return data.pairs
      .filter((pair: any) => {
        const fdv = parseFloat(pair.fdv);
        const volume = parseFloat(pair.volume24h);
        return !isNaN(fdv) && !isNaN(volume) && fdv < 10000000 && volume > 1000;
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
    const response = await fetch(FALLBACK_API_URL);
    
    if (!response.ok) {
      console.error(`CoinGecko API failed with status: ${response.status}`);
      throw new Error("CoinGecko API failed");
    }
    
    const data = await response.json();
    console.log("CoinGecko API response:", data);
    
    if (!data?.coins || !Array.isArray(data.coins) || data.coins.length === 0) {
      console.error("Invalid data structure from CoinGecko API:", data);
      throw new Error("Invalid data from CoinGecko API");
    }

    const coinIds = data.coins.map((coin: TrendingCoin) => coin.item.id).join(',');
    const priceResponse = await fetch(
      `${COINGECKO_PRICE_URL}?ids=${coinIds}&vs_currencies=usd&include_24h_vol=true&include_24h_change=true`
    );
    
    if (!priceResponse.ok) {
      console.warn("Failed to fetch detailed price data, using estimated values");
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
      liquidity: { usd: 1000000 }, // Estimated liquidity for trending coins
      fdv: coin.item.market_cap_rank ? coin.item.market_cap_rank * 1000000 : 5000000, // Estimated FDV
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