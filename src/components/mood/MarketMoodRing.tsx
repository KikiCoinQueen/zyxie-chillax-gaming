import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Brain, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface MoodData {
  symbol: string;
  sentiment: number;
  volume24h: string;
  priceChange24h: number;
}

const calculateOverallMood = (data: MoodData[]): number => {
  if (!data?.length) return 0;
  const sentimentSum = data.reduce((acc, token) => {
    const volumeWeight = Math.min(parseFloat(token.volume24h) / 100000, 1);
    const priceWeight = token.priceChange24h > 0 ? 1 : -1;
    return acc + (token.sentiment * volumeWeight * priceWeight);
  }, 0);
  return Math.max(-100, Math.min(100, sentimentSum / data.length));
};

const getMoodColor = (mood: number): string => {
  if (mood >= 75) return "from-green-300 to-green-500";
  if (mood >= 25) return "from-blue-300 to-blue-500";
  if (mood >= -25) return "from-yellow-300 to-yellow-500";
  if (mood >= -75) return "from-orange-300 to-orange-500";
  return "from-red-300 to-red-500";
};

const getMoodEmoji = (mood: number): string => {
  if (mood >= 75) return "🚀";
  if (mood >= 25) return "😊";
  if (mood >= -25) return "😐";
  if (mood >= -75) return "😟";
  return "😱";
};

const getMoodText = (mood: number): string => {
  if (mood >= 75) return "Super Bullish";
  if (mood >= 25) return "Optimistic";
  if (mood >= -25) return "Neutral";
  if (mood >= -75) return "Cautious";
  return "Bearish";
};

export const MarketMoodRing = () => {
  const { data: moodData, isLoading } = useQuery({
    queryKey: ["marketMood"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/SOL",
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch market mood");
        }
        
        const data = await response.json();
        
        return data.pairs
          ?.filter((pair: any) => parseFloat(pair.volume24h) > 1000)
          .map((pair: any) => ({
            symbol: pair.baseToken.symbol,
            sentiment: parseFloat(pair.priceChange24h) > 0 ? 1 : -1,
            volume24h: pair.volume24h,
            priceChange24h: parseFloat(pair.priceChange24h)
          }))
          .slice(0, 10) || [];
      } catch (error) {
        console.error("Error fetching market mood:", error);
        toast.error("Failed to fetch market mood");
        return [];
      }
    },
    refetchInterval: 30000
  });

  const mood = calculateOverallMood(moodData || []);

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
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <Card className="glass-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center">Current Market Vibe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                <motion.div 
                  className={`w-32 h-32 rounded-full bg-gradient-to-br ${getMoodColor(mood)} shadow-lg flex items-center justify-center text-4xl`}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {getMoodEmoji(mood)}
                </motion.div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{getMoodText(mood)}</h3>
                  <p className="text-muted-foreground">
                    Based on recent price action and volume
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      Bullish Signals: {moodData?.filter(t => t.priceChange24h > 0).length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">
                      Bearish Signals: {moodData?.filter(t => t.priceChange24h < 0).length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Updated every 30 seconds • Based on top 10 active tokens
          </div>
        </motion.div>
      </div>
    </section>
  );
};