import { TokenData } from "@/types/token";
import { handleApiError, retryWithExponentialBackoff } from "./apiHelpers";
import { BACKUP_PAIRS } from "./backupData";
import { toast } from "sonner";

const BACKUP_API_URL = "https://api.coingecko.com/api/v3/search/trending";

export const fetchBackupData = async (): Promise<TokenData[]> => {
  try {
    console.log("Attempting to fetch backup data from CoinGecko...");
    const response = await retryWithExponentialBackoff(async () => {
      const res = await fetch(BACKUP_API_URL);
      if (!res.ok) throw new Error("Backup API failed");
      return res;
    });
    
    const data = await response.json();
    if (!data?.coins || !Array.isArray(data.coins)) {
      console.warn("Invalid backup data structure, using fallback pairs");
      return BACKUP_PAIRS;
    }

    const backupTokens = data.coins
      .slice(0, 6)
      .map((coin: any) => ({
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

    console.log("Successfully fetched backup data:", backupTokens.length);
    toast.info("Using backup data source", {
      description: "Primary API is temporarily unavailable."
    });
    
    return backupTokens;
  } catch (error) {
    handleApiError(error, "backup API");
    console.warn("All API attempts failed, using fallback data");
    return BACKUP_PAIRS;
  }
};