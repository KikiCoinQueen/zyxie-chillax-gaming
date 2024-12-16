import { TokenData } from "@/types/token";
import { createFallbackChain } from "./apiRetry";
import { toast } from "sonner";
import { fetchDexScreenerData } from "./api/dexScreenerClient";
import { fetchCoinGeckoData, fetchMarketChart } from "./api/coinGeckoClient";

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

export { fetchMarketChart } from "./api/coinGeckoClient";