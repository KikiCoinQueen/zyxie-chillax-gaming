import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinGeckoData, fetchCoinDetails } from "@/utils/api/coinGeckoClient";
import { analyzeCoin } from "@/utils/ai/coinAnalysis";
import { TrendingHeader } from "./components/TrendingHeader";
import { TrendingGrid } from "./components/TrendingGrid";
import { TrendingFooter } from "./components/TrendingFooter";
import { TrendingCoin, EnhancedTrendingCoin } from "@/types/coin";
import { TokenData } from "@/types/token";

export const TrendingCoins = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const { data: coins, isLoading, error } = useQuery({
    queryKey: ["trendingCoins"],
    queryFn: async () => {
      const trendingData = await fetchCoinGeckoData();
      
      // Map TokenData to the format we need
      const mappedCoins = trendingData.map(token => ({
        item: {
          id: token.baseToken.id,
          coin_id: 0, // Default value since TokenData doesn't have this
          name: token.baseToken.name,
          symbol: token.baseToken.symbol,
          market_cap_rank: token.rank || 999,
          thumb: token.baseToken.thumb || "",
          price_btc: 0, // Default value
          data: {
            price_change_percentage_24h: token.priceChange24h,
            market_cap: parseFloat(token.fdv.toString()),
            total_volume: parseFloat(token.volume24h)
          }
        }
      }));
      
      const coinsWithDetails = await Promise.all(
        mappedCoins.map(async (coin) => {
          try {
            const coinData = await fetchCoinDetails(coin.item.id);
            
            const analysis = await analyzeCoin(
              coin.item.name,
              coin.item.data?.price_change_percentage_24h || 0,
              coin.item.data?.market_cap || 0,
              parseFloat(coin.item.data?.total_volume?.toString() || "0"),
              coinData
            );

            return {
              item: coin.item,
              analysis,
              detailedData: coinData
            };
          } catch (error) {
            console.error(`Error fetching details for ${coin.item.id}:`, error);
            
            const analysis = await analyzeCoin(
              coin.item.name,
              coin.item.data?.price_change_percentage_24h || 0,
              coin.item.data?.market_cap || 0,
              parseFloat(coin.item.data?.total_volume?.toString() || "0")
            );
            
            return {
              item: coin.item,
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