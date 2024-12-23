import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CoinAnalysisCard } from "./CoinAnalysisCard";
import { analyzeCoin } from "@/utils/ai/coinAnalysis";

export const TrendingCoins = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const { data: coins, isLoading } = useQuery({
    queryKey: ["trendingCoins"],
    queryFn: async () => {
      try {
        console.log("Fetching trending coins...");
        const response = await fetch(
          "https://api.coingecko.com/api/v3/search/trending"
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch trending coins");
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        if (!data?.coins || !Array.isArray(data.coins)) {
          console.log("Invalid response structure:", data);
          return [];
        }

        // Filter out well-known coins
        const lesserKnownCoins = data.coins.filter((coin: any) => {
          const marketCapRank = coin.item.market_cap_rank;
          return marketCapRank > 100 || !marketCapRank; // Filter out top 100 coins
        });

        const analyzedCoins = await Promise.all(
          lesserKnownCoins.map(async (coin: any) => {
            try {
              const detailResponse = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coin.item.id}?localization=false&tickers=false&community_data=false&developer_data=false`
              );
              
              const coinData = await detailResponse.json();
              
              const marketCap = coinData.market_data?.market_cap?.usd;
              const priceChange = coinData.market_data?.price_change_percentage_24h;
              const volume = coinData.market_data?.total_volume?.usd;

              const analysis = await analyzeCoin(
                coin.item.name,
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
              console.error(`Error fetching details for ${coin.item.id}:`, error);
              const analysis = await analyzeCoin(
                coin.item.name,
                coin.item.data?.price_change_percentage_24h || 0,
                parseFloat(coin.item.data?.market_cap || '0'),
                parseFloat(coin.item.data?.total_volume || '0')
              );
              
              return {
                ...coin,
                analysis
              };
            }
          })
        );
        
        // Sort by interest score
        return analyzedCoins.sort((a, b) => 
          (b.analysis?.interestScore || 0) - (a.analysis?.interestScore || 0)
        );
      } catch (error) {
        console.error("Error fetching trending coins:", error);
        toast.error("Failed to fetch trending coins");
        return [];
      }
    },
    refetchInterval: 60000
  });

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
              {coins.map((coin: any, index: number) => (
                <div key={coin.item.id} className="space-y-4">
                  <Card 
                    className="glass-card hover:scale-[1.02] transition-transform cursor-pointer"
                    onClick={() => setSelectedCoin(coin.item.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={coin.item.thumb} 
                            alt={coin.item.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <span className="text-lg">{coin.item.symbol.toUpperCase()}</span>
                            <Badge variant="secondary" className="ml-2">
                              #{index + 1}
                            </Badge>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  {selectedCoin === coin.item.id && (
                    <CoinAnalysisCard
                      analysis={coin.analysis}
                      symbol={coin.item.symbol}
                      marketCap={coin.detailedData?.market_data?.market_cap?.usd}
                      priceChange={coin.detailedData?.market_data?.price_change_percentage_24h}
                      rank={index + 1}
                    />
                  )}
                </div>
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