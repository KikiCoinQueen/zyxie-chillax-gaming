import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Volume2, ArrowUpDown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";

interface TrendingPair {
  baseToken: {
    symbol: string;
    name: string;
  };
  priceUsd: string;
  volume24h: string;
  priceChange24h: number;
  txns24h: {
    buys: number;
    sells: number;
  };
}

export const TrendingPairs = () => {
  const [timeframe] = useState("24h");

  const { data: pairs, isLoading } = useQuery({
    queryKey: ["trendingPairs", timeframe],
    queryFn: async () => {
      try {
        console.log("Fetching trending pairs...");
        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/pairs/solana/top",
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch trending pairs");
        }
        
        const data = await response.json();
        console.log("Trending pairs response:", data);
        
        if (!data?.pairs) {
          throw new Error("No pairs data available");
        }
        
        return data.pairs
          .filter((pair: any) => parseFloat(pair.volume24h) > 10000)
          .slice(0, 6);
      } catch (error) {
        console.error("Error fetching trending pairs:", error);
        toast.error("Failed to fetch trending pairs");
        return [];
      }
    },
    refetchInterval: 30000
  });

  return (
    <section className="py-20 px-4" id="trending-pairs">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Trending Pairs
            </h2>
            <ArrowUpDown className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : pairs?.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No trending pairs found at the moment.</p>
              <p className="text-sm mt-2">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pairs?.map((pair: TrendingPair) => (
                <Card key={pair.baseToken.symbol} className="glass-card hover:scale-[1.02] transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {pair.baseToken.symbol}
                        <Badge variant="secondary" className="text-xs">
                          {pair.baseToken.name}
                        </Badge>
                      </div>
                      <span className={`text-sm ${
                        pair.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {formatPercentage(pair.priceChange24h)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-mono">
                          ${Number(pair.priceUsd).toFixed(6)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Volume2 className="w-4 h-4" />
                          Volume 24h
                        </span>
                        <span className="font-mono">
                          {formatMarketCap(parseFloat(pair.volume24h))}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Transactions</span>
                        <div className="flex gap-2">
                          <span className="text-green-500 text-sm">
                            B: {pair.txns24h?.buys || 0}
                          </span>
                          <span className="text-red-500 text-sm">
                            S: {pair.txns24h?.sells || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Data updates every 30 seconds • Showing pairs with 24h volume &gt; $10,000 • 
              <span className="text-primary ml-1">Top 6 trending pairs</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};