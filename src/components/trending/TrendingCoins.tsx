import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Rocket, Star, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    score: number;
    data: {
      price: string;
      price_change_percentage_24h: number | null;
      market_cap: string;
      total_volume: string;
      sparkline: string;
    };
  };
}

export const TrendingCoins = () => {
  const [timeframe] = useState("24h");

  const { data: coins, isLoading } = useQuery({
    queryKey: ["trendingCoins", timeframe],
    queryFn: async () => {
      try {
        console.log("Fetching trending coins from CoinGecko...");
        const response = await fetch(
          "https://api.coingecko.com/api/v3/search/trending",
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch trending coins");
        }
        
        const data = await response.json();
        console.log("CoinGecko Response:", data);
        
        if (!data?.coins || !Array.isArray(data.coins)) {
          console.log("Invalid response structure:", data);
          return [];
        }
        
        return data.coins;
      } catch (error) {
        console.error("Error fetching trending coins:", error);
        toast.error("Failed to fetch trending coins");
        return [];
      }
    },
    refetchInterval: 60000, // Refresh every minute
    meta: {
      onError: () => {
        toast.error("Failed to fetch trending coins");
      }
    }
  });

  const calculateSentiment = (coin: TrendingCoin) => {
    const score = typeof coin.item.score === 'number' ? coin.item.score : 0;
    const priceChange = typeof coin.item.data?.price_change_percentage_24h === 'number' 
      ? coin.item.data.price_change_percentage_24h 
      : 0;
    const marketCapRank = typeof coin.item.market_cap_rank === 'number' 
      ? coin.item.market_cap_rank 
      : 100;
    
    // Weighted scoring system
    const scoreWeight = 0.4;
    const priceWeight = 0.3;
    const rankWeight = 0.3;
    
    const normalizedScore = (score * scoreWeight) +
      ((priceChange > 0 ? 1 : 0) * priceWeight) +
      ((100 - marketCapRank) / 100 * rankWeight);
    
    return Math.min(Math.max(normalizedScore * 100, 0), 100);
  };

  return (
    <section className="py-20 px-4" id="trending-coins">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Rocket className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Trending Gems
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coins.slice(0, 6).map((coin: TrendingCoin) => {
                const sentiment = calculateSentiment(coin);
                const priceChange = typeof coin.item.data?.price_change_percentage_24h === 'number' 
                  ? coin.item.data.price_change_percentage_24h 
                  : 0;
                const score = typeof coin.item.score === 'number' 
                  ? coin.item.score 
                  : 0;

                return (
                  <Card key={coin.item.id} className="glass-card hover:scale-[1.02] transition-transform">
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
                              #{coin.item.market_cap_rank || 'N/A'}
                            </Badge>
                          </div>
                        </div>
                        <AlertTriangle 
                          className={`w-5 h-5 ${sentiment > 70 ? 'text-green-500' : 'text-yellow-500'}`} 
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Market Sentiment</p>
                          <div className="flex items-center gap-2">
                            <Progress value={sentiment} className="h-2" />
                            <span className="text-sm font-mono">
                              {sentiment.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">24h Change</p>
                            <p className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {priceChange.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Trend Score</p>
                            <p className="text-sm font-mono">
                              {score.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <a 
                          href={`https://www.coingecko.com/en/coins/${coin.item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center text-sm text-primary hover:underline mt-2"
                        >
                          View on CoinGecko →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Data updates every minute • Powered by CoinGecko • 
              <span className="text-primary ml-1">Top 6 trending coins</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};