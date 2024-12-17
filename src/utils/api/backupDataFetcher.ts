import { TokenData } from "@/types/token";
import { handleApiError, retryWithBackoff, fetchWithTimeout } from "./apiHelpers";
import { BACKUP_PAIRS } from "./backupData";
import { toast } from "sonner";

const BACKUP_API_URL = "https://api.coingecko.com/api/v3/search/trending";

export const fetchBackupData = async (): Promise<TokenData[]> => {
  try {
    console.log("Attempting to fetch backup data from CoinGecko...");
    
    const response = await retryWithBackoff(async () => {
      return await fetchWithTimeout(BACKUP_API_URL, {}, 10000);
    });
    
    const data = await response.json();
    console.log("CoinGecko backup data response:", data);

    if (!data?.coins?.length) {
      console.warn("Invalid or empty backup data structure, using fallback pairs");
      return BACKUP_PAIRS;
    }

    const backupTokens = data.coins
      .slice(0, 6)
      .map((coin: any) => ({
        baseToken: {
          address: coin.item.id || "unknown",
          name: coin.item.name || "Unknown Token",
          symbol: coin.item.symbol?.toUpperCase() || "???",
        },
        priceUsd: ((coin.item.price_btc || 0) * 40000).toString(),
        volume24h: Math.max(((coin.item.price_btc || 0) * 40000 * 1000000), 1000).toString(),
        priceChange24h: coin.item.data?.price_change_percentage_24h || 0,
        liquidity: { usd: Math.max(1000000, Math.random() * 5000000) },
        fdv: coin.item.market_cap_rank ? coin.item.market_cap_rank * 1000000 : 5000000,
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