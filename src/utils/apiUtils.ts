import { TokenData, TrendingCoin } from "@/types/token";
import { createFallbackChain } from "./apiRetry";
import { toast } from "sonner";

const FALLBACK_API_URL = "https://api.coingecko.com/api/v3/search/trending";
const DEX_SCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens/SOL";

const fetchDexScreenerData = async (): Promise<TokenData[]> => {
  console.log("Attempting to fetch from DexScreener...");
  const response = await fetch(DEX_SCREENER_API_URL, {
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
  
  if (!response.ok) {
    throw new Error(`DexScreener API failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data?.pairs || data.pairs.length === 0) {
    throw new Error("No valid data from DexScreener API");
  }
  
  return data.pairs
    .filter((pair: any) => {
      const fdv = parseFloat(pair.fdv);
      const volume = parseFloat(pair.volume24h);
      return fdv && fdv < 10000000 && volume > 1000;
    })
    .sort((a: any, b: any) => parseFloat(b.volume24h) - parseFloat(a.volume24h))
    .slice(0, 6);
};

const fetchCoinGeckoData = async (): Promise<TokenData[]> => {
  console.log("Fetching from CoinGecko fallback...");
  const response = await fetch(FALLBACK_API_URL);
  if (!response.ok) {
    throw new Error("CoinGecko API failed");
  }
  const data = await response.json();
  
  if (!data?.coins || data.coins.length === 0) {
    throw new Error("No valid data from CoinGecko API");
  }

  return data.coins.slice(0, 6).map((coin: TrendingCoin) => ({
    baseToken: {
      address: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
    },
    priceUsd: (coin.item.price_btc * 40000).toString(),
    volume24h: (coin.item.price_btc * 40000 * 1000000).toString(),
    priceChange24h: coin.item.data?.price_change_percentage_24h || 0,
    liquidity: { usd: 1000000 },
    fdv: coin.item.market_cap_rank * 1000000,
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