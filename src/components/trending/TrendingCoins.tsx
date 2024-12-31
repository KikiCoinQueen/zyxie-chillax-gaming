import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinGeckoData, fetchCoinDetails } from "@/utils/api/coinGeckoClient";
import { analyzeCoin } from "@/utils/ai/coinAnalysis";
import { TrendingHeader } from "./components/TrendingHeader";
import { TrendingGrid } from "./components/TrendingGrid";
import { TrendingFooter } from "./components/TrendingFooter";
import { EnhancedTrendingCoin, CoinDetails } from "@/types/coin";
import { toast } from "sonner";

export const TrendingCoins = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const { data: coins, isLoading, error } = useQuery({
    queryKey: ["trendingCoins"],
    queryFn: async () => {
      try {
        console.log("Fetching trending coins...");
        const trendingData = await fetchCoinGeckoData();
        
        const coinsWithDetails = await Promise.all(
          trendingData.map(async (coin) => {
            try {
              const coinData = await fetchCoinDetails(coin.baseToken.id);
              
              // Skip coins with market cap > $10M
              if (coinData?.market_data?.market_cap?.usd && 
                  coinData.market_data.market_cap.usd > 10000000) {
                return null;
              }

              const analysis = await analyzeCoin(
                coin.baseToken.name,
                coin.priceChange24h,
                parseFloat(coin.fdv.toString()),
                parseFloat(coin.volume24h),
                coinData as CoinDetails
              );

              return {
                item: {
                  id: coin.baseToken.id,
                  name: coin.baseToken.name,
                  symbol: coin.baseToken.symbol,
                  thumb: coin.baseToken.thumb,
                  data: {
                    price_change_percentage_24h: coin.priceChange24h,
                    market_cap: coin.fdv,
                    total_volume: parseFloat(coin.volume24h)
                  }
                },
                analysis,
                detailedData: coinData
              };
            } catch (error) {
              console.error(`Error analyzing ${coin.baseToken.name}:`, error);
              return null;
            }
          })
        );

        // Filter out failed analyses and null results, then sort by gem score
        const validCoins = coinsWithDetails
          .filter((coin): coin is NonNullable<typeof coin> => 
            coin !== null && coin.analysis.gemScore >= 55
          )
          .sort((a, b) => b.analysis.gemScore - a.analysis.gemScore);

        if (validCoins.length === 0) {
          toast.info("No low market cap gems found at the moment", {
            description: "Try again later for new opportunities"
          });
        }

        return validCoins;
      } catch (error) {
        console.error("Error fetching trending coins:", error);
        throw error;
      }
    },
    refetchInterval: 60000
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
        <h3 className="text-xl font-semibold">Failed to Load Gem Scanner</h3>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/50 to-background" id="trending-coins">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Micro Cap Gem Scanner
            </h2>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          
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