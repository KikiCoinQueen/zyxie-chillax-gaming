import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinGeckoData, fetchCoinDetails } from "@/utils/api/coinGeckoClient";
import { analyzeCoin } from "@/utils/ai/coinAnalysis";
import { TrendingHeader } from "./components/TrendingHeader";
import { TrendingGrid } from "./components/TrendingGrid";
import { TrendingFooter } from "./components/TrendingFooter";

export const TrendingCoins = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const { data: coins, isLoading, error } = useQuery({
    queryKey: ["trendingCoins"],
    queryFn: async () => {
      const trendingCoins = await fetchCoinGeckoData();
      
      const coinsWithDetails = await Promise.all(
        trendingCoins.map(async (coin) => {
          try {
            const coinData = await fetchCoinDetails(coin.baseToken.id);
            
            const analysis = await analyzeCoin(
              coin.baseToken.name,
              coin.priceChange24h,
              coin.marketCap || 0,
              parseFloat(coin.volume24h),
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
      
      return coinsWithDetails
        .sort((a, b) => (b.analysis?.interestScore || 0) - (a.analysis?.interestScore || 0))
        .slice(0, 6);
    },
    refetchInterval: 60000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
        <h3 className="text-xl font-semibold">Failed to Load Trending Coins</h3>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-4" id="trending-coins">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TrendingHeader />
          
          <TrendingGrid 
            coins={coins || []}
            selectedCoin={selectedCoin}
            onCoinSelect={setSelectedCoin}
            isLoading={isLoading}
          />

          <TrendingFooter />
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingCoins;