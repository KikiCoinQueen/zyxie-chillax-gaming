import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SentimentData {
  symbol: string;
  sentiment: number;
  volume24h: string;
  priceChange24h: number;
}

export const MarketSentiment = () => {
  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ["marketSentiment"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/SOL"
        );
        if (!response.ok) throw new Error("Failed to fetch market data");
        const data = await response.json();
        
        if (!data?.pairs) return [];
        
        return data.pairs
          .filter((pair: any) => parseFloat(pair.volume24h) > 1000)
          .map((pair: any) => ({
            symbol: pair.baseToken.symbol,
            sentiment: calculateSentiment(pair.priceChange24h, pair.volume24h),
            volume24h: pair.volume24h,
            priceChange24h: pair.priceChange24h
          }))
          .sort((a: any, b: any) => b.sentiment - a.sentiment)
          .slice(0, 5);
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        throw error;
      }
    },
    refetchInterval: 30000,
    meta: {
      onError: () => {
        toast.error("Failed to fetch market sentiment");
      }
    }
  });

  const calculateSentiment = (priceChange: number, volume: string): number => {
    const volumeScore = Math.min(parseFloat(volume) / 10000, 5);
    const priceScore = Math.min(Math.abs(priceChange) / 10, 5);
    return (volumeScore + priceScore) / 2;
  };

  const getSentimentColor = (sentiment: number): string => {
    if (sentiment >= 4) return "text-green-500";
    if (sentiment >= 2.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getSentimentLabel = (sentiment: number): string => {
    if (sentiment >= 4) return "Very Bullish";
    if (sentiment >= 2.5) return "Neutral";
    return "Bearish";
  };

  return (
    <section className="py-20 px-4" id="market-sentiment">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <AlertTriangle className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Market Sentiment Analysis
            </h2>
            <AlertTriangle className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sentimentData?.map((token: SentimentData) => (
                <Card 
                  key={token.symbol}
                  className="glass-card hover:scale-[1.02] transition-transform"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {token.symbol}
                      <span className={`text-sm ${getSentimentColor(token.sentiment)}`}>
                        {getSentimentLabel(token.sentiment)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">24h Change</span>
                        <div className="flex items-center gap-2">
                          {token.priceChange24h >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={token.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                            {token.priceChange24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">24h Volume</span>
                        <span className="font-mono">
                          ${Number(token.volume24h).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Sentiment Score</span>
                        <span className={`font-mono ${getSentimentColor(token.sentiment)}`}>
                          {token.sentiment.toFixed(1)}/5
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
              Data updates every 30 seconds • Sentiment based on price action and volume • 
              <span className="text-primary ml-1">Top 5 tokens by sentiment</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};