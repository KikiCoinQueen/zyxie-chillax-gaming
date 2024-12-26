import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Star, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoinAnalysisCard } from "./CoinAnalysisCard";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinGeckoData, fetchCoinDetails } from "@/utils/api/coinGeckoClient";
import { analyzeCoin } from "@/utils/ai/coinAnalysis";
import { TrendingCoin } from "@/types/coin";

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
              coin.marketCap || 0,
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
          <div className="flex items-center justify-center gap-3 mb-12">
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              AI-Analyzed Trending Coins
            </h2>
            <Star className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : !coins?.length ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No trending coins found at the moment.</p>
              <p className="text-sm mt-2">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {coins.map((coin, index) => (
                <motion.div 
                  key={coin.baseToken.id} 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="glass-card hover:scale-[1.02] transition-transform cursor-pointer"
                    onClick={() => setSelectedCoin(coin.baseToken.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {coin.baseToken.thumb && (
                            <img 
                              src={coin.baseToken.thumb} 
                              alt={coin.baseToken.name}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div>
                            <span className="text-lg">{coin.baseToken.symbol.toUpperCase()}</span>
                            <Badge variant="secondary" className="ml-2">
                              #{index + 1}
                            </Badge>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  {selectedCoin === coin.baseToken.id && coin.analysis && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CoinAnalysisCard
                        analysis={coin.analysis}
                        symbol={coin.baseToken.symbol}
                        marketCap={coin.marketCap}
                        priceChange={coin.priceChange24h}
                        rank={index + 1}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Data updates every minute • AI-powered analysis • Not financial advice
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};