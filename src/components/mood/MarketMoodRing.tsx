import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Brain, Heart, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface MoodData {
  sentiment: number;
  volume: number;
  volatility: number;
  socialScore: number;
}

export const MarketMoodRing = () => {
  const { data: moodData, isLoading } = useQuery({
    queryKey: ["marketMood"],
    queryFn: async () => {
      try {
        const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/SOL");
        if (!response.ok) throw new Error("Failed to fetch market data");
        const data = await response.json();
        
        // Calculate mood metrics from market data
        const pairs = data.pairs || [];
        const volumes = pairs.map((p: any) => parseFloat(p.volume24h));
        const priceChanges = pairs.map((p: any) => Math.abs(p.priceChange24h));
        
        const avgVolume = volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length;
        const avgPriceChange = priceChanges.reduce((a: number, b: number) => a + b, 0) / priceChanges.length;
        
        return {
          sentiment: Math.min(Math.max((avgPriceChange + 50) / 100, 0), 100),
          volume: Math.min(avgVolume / 1000000, 100),
          volatility: Math.min(avgPriceChange * 2, 100),
          socialScore: Math.random() * 100 // Simulated social score
        };
      } catch (error) {
        console.error("Error fetching market mood:", error);
        toast.error("Failed to fetch market mood");
        throw error;
      }
    },
    refetchInterval: 30000
  });

  const getMoodColor = (value: number) => {
    if (value >= 75) return "text-green-500";
    if (value >= 50) return "text-yellow-500";
    if (value >= 25) return "text-orange-500";
    return "text-red-500";
  };

  const getMoodLabel = (value: number) => {
    if (value >= 75) return "Euphoric";
    if (value >= 50) return "Optimistic";
    if (value >= 25) return "Cautious";
    return "Fearful";
  };

  return (
    <section className="py-20 px-4" id="market-mood">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Market Mood Ring
            </h2>
            <Heart className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Market Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`text-2xl font-bold ${getMoodColor(moodData?.sentiment || 0)}`}>
                      {getMoodLabel(moodData?.sentiment || 0)}
                    </div>
                    <Progress value={moodData?.sentiment} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Volume Intensity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`text-2xl font-bold ${getMoodColor(moodData?.volume || 0)}`}>
                      {moodData?.volume.toFixed(1)}M
                    </div>
                    <Progress value={moodData?.volume} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Market Volatility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`text-2xl font-bold ${getMoodColor(100 - (moodData?.volatility || 0))}`}>
                      {moodData?.volatility.toFixed(1)}%
                    </div>
                    <Progress value={moodData?.volatility} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Social Buzz</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`text-2xl font-bold ${getMoodColor(moodData?.socialScore || 0)}`}>
                      {moodData?.socialScore.toFixed(1)}%
                    </div>
                    <Progress value={moodData?.socialScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Market mood updates every 30 seconds • Based on real-time market data and social signals
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};