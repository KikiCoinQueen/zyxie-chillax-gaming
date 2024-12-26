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
              
              const marketCap = coinData?.market_data?.market_cap?.usd;
              const priceChange = coinData?.market_data?.price_change_percentage_24h;
              const volume = coinData?.market_data?.total_volume?.usd;

              const analysis = await analyzeCoin(
                coin.baseToken.name,
                priceChange,
                marketCap,
                volume,
                coinData
              );

              return {
                ...coin,
                analysis,
                detailedData: coinData
              };
            } catch (error) {
              console.error(`Error fetching details for ${coin.baseToken.id}:`, error);
              
              const analysis = await analyzeCoin(
                coin.baseToken.name,
                coin.priceChange24h,
                parseFloat(coin.fdv),
                parseFloat(coin.volume24h)
              );
              
              return {
                ...coin,
                analysis
              };
            }
          })
        );
        
        return analyzedCoins
          .sort((a, b) => (b.analysis?.interestScore || 0) - (a.analysis?.interestScore || 0))
          .slice(0, 6);
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