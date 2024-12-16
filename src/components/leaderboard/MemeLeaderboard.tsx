import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, TrendingUp, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";

interface LeaderboardToken {
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  volume24h: string;
  priceChange24h: number;
  liquidity: {
    usd: number;
  };
  fdv: number;
}

export const MemeLeaderboard = () => {
  const [timeframe] = useState("24h");

  const { data: topPerformers, isLoading } = useQuery({
    queryKey: ["topPerformers", timeframe],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/SOL"
        );
        if (!response.ok) throw new Error("Failed to fetch token data");
        const data = await response.json();
        
        if (!data?.pairs) {
          console.log("No pairs data received:", data);
          return [];
        }
        
        return data.pairs
          .filter((pair: any) => {
            const volume = parseFloat(pair.volume24h);
            const priceChange = parseFloat(pair.priceChange24h);
            return volume > 5000 && priceChange > 0; // Only show tokens with significant volume and positive gains
          })
          .sort((a: any, b: any) => {
            return parseFloat(b.priceChange24h) - parseFloat(a.priceChange24h);
          })
          .slice(0, 5); // Top 5 performers
      } catch (error) {
        console.error("Error fetching top performers:", error);
        throw error;
      }
    },
    refetchInterval: 30000,
    meta: {
      onError: () => {
        toast.error("Failed to fetch leaderboard data");
      }
    }
  });

  return (
    <section className="py-20 px-4" id="leaderboard">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Trophy className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Top Performing Meme Coins
            </h2>
            <Star className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topPerformers?.map((token: LeaderboardToken, index: number) => (
                <Card 
                  key={token.baseToken.address} 
                  className="glass-card hover:scale-[1.02] transition-transform relative overflow-hidden"
                >
                  <div className="absolute -top-4 -right-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {token.baseToken.name}
                      <Badge variant="secondary" className="text-xs">
                        {token.baseToken.symbol}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-mono">
                          ${Number(token.priceUsd).toFixed(6)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">24h Gain</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-green-500 font-mono">
                            {formatPercentage(token.priceChange24h)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Volume2 className="w-4 h-4" />
                          Volume 24h
                        </span>
                        <span className="font-mono">
                          {formatMarketCap(parseFloat(token.volume24h))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Data updates every 30 seconds • Only showing tokens with 24h volume &gt; $5,000 •{" "}
              <span className="text-primary">Top 5 gainers</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};