import { useQuery } from "@tanstack/react-query";
import { fetchCoinGeckoData, fetchCoinDetails } from "@/utils/api/coinGeckoClient";
import { analyzeCoin } from "@/utils/ai/coinAnalysis";
import { toast } from "sonner";
import { CoinDetails } from "@/types/coin";

export const useTrendingCoins = () => {
  return useQuery({
    queryKey: ["trendingCoins"],
    queryFn: async () => {
      try {
        console.log("Fetching trending coins...");
        const response = await fetchCoinGeckoData();
        
        if (!response?.length) {
          console.log("No trending coins found");
          return [];
        }

        const analyzedCoins = await Promise.all(
          response.map(async (coin: any) => {
            try {
              const coinData = await fetchCoinDetails(coin.baseToken.address) as CoinDetails;
              
              // Skip coins with market cap > $100M or < $10k
              const marketCap = coinData?.market_data?.market_cap?.usd || 0;
              if (marketCap > 100000000 || marketCap < 10000) {
                return null;
              }

              const priceChange = coinData?.market_data?.price_change_percentage_24h;
              const volume = coinData?.market_data?.total_volume?.usd;

              // Skip coins with very low volume
              if (volume && volume < 10000) {
                return null;
              }

              const analysis = await analyzeCoin(
                coin.baseToken.name,
                priceChange,
                marketCap,
                volume,
                coinData
              );

              // Only return coins with high enough gem scores
              if (analysis.gemScore < 60) {
                return null;
              }

              return {
                ...coin,
                analysis,
                detailedData: coinData
              };
            } catch (error) {
              console.error(`Error fetching details for ${coin.baseToken.id}:`, error);
              return null;
            }
          })
        );
        
        // Filter out null values and sort by gem score
        const validCoins = analyzedCoins
          .filter(coin => coin !== null)
          .sort((a, b) => (b?.analysis?.gemScore || 0) - (a?.analysis?.gemScore || 0))
          .slice(0, 6);

        if (validCoins.length === 0) {
          toast.info("No micro-cap gems found at the moment", {
            description: "Looking for coins under $100M market cap with high potential"
          });
        }

        console.log("Found micro-cap gems:", validCoins);
        return validCoins;
      } catch (error) {
        console.error("Error fetching trending coins:", error);
        throw error;
      }
    },
    refetchInterval: 60000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      onError: () => {
        toast.error("Failed to fetch trending coins", {
          description: "We'll try again shortly"
        });
      }
    }
  });
};