import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Volume2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TokenTable } from "./TokenTable";
import { StatsCards } from "./StatsCards";
import { TokenInsight } from "./types";

export const MemeInsights = () => {
  const [timeframe] = useState("24h");

  const { data: insights, isLoading } = useQuery({
    queryKey: ["memeInsights", timeframe],
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
            const fdv = parseFloat(pair.fdv);
            return volume > 1000 && fdv < 5000000;
          })
          .sort((a: any, b: any) => {
            return parseFloat(b.volume24h) - parseFloat(a.volume24h);
          })
          .slice(0, 5);
      } catch (error) {
        console.error("Error fetching insights:", error);
        throw error;
      }
    },
    refetchInterval: 30000,
    meta: {
      onError: () => {
        toast.error("Failed to fetch market insights");
      }
    }
  });

  return (
    <section className="py-20 px-4" id="meme-insights">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Meme Coin Market Insights
            </h2>
            <Volume2 className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Market Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TokenTable insights={insights || []} />
                </CardContent>
              </Card>

              <StatsCards insights={insights || []} />

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Data updates every 30 seconds • Risk scores are calculated based on volume, liquidity, and price volatility
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};