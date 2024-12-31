import { TokenData } from "@/types/token";
import { handleApiError, fetchWithRetry } from "./apiHelpers";
import { BACKUP_PAIRS } from "./backupData";
import { toast } from "sonner";
import { CoinGeckoResponse } from "@/types/coin";

const BACKUP_API_URL = "https://api.coingecko.com/api/v3/search/trending";

export const fetchBackupData = async (): Promise<TokenData[]> => {
  try {
    console.log("Attempting to fetch backup data from CoinGecko...");
    
    const data = await fetchWithRetry<CoinGeckoResponse>(BACKUP_API_URL);
    console.log("CoinGecko backup data response:", data);

    if (!data?.coins?.length) {
      console.warn("Invalid or empty backup data structure, using fallback pairs");
      return BACKUP_PAIRS;
    }

    const backupTokens: TokenData[] = data.coins
      .filter(coin => {
        const marketCap = coin.item.data?.market_cap || 0;
        return marketCap < 100000000 && marketCap > 10000;
      })
      .slice(0, 6)
      .map((coin) => ({
        baseToken: {
          id: coin.item.id,
          address: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
          thumb: coin.item.thumb
        },
        priceUsd: ((Math.random() * 0.0001)).toString(),
        volume24h: Math.max(Math.random() * 1000000, 10000).toString(),
        priceChange24h: (Math.random() * 20) - 10,
        liquidity: { usd: Math.max(10000, Math.random() * 500000) },
        fdv: Math.random() * 100000000,
        marketCap: Math.random() * 100000000,
        rank: Math.floor(Math.random() * 100) + 1
      }));

    if (!backupTokens.length) {
      console.warn("No valid backup tokens, using fallback pairs");
      return BACKUP_PAIRS;
    }

    console.log("Successfully fetched backup data:", backupTokens.length);
    toast.info("Using backup data source", {
      description: "Primary API is temporarily unavailable"
    });
    
    return backupTokens;
  } catch (error) {
    handleApiError(error, "backup API");
    console.warn("All API attempts failed, using fallback data");
    return BACKUP_PAIRS;
  }
};