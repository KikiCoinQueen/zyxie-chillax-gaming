import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp, Volume2, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";

interface OpportunityScore {
  volumeScore: number;
  socialScore: number;
  priceScore: number;
  total: number;
}

const calculateOpportunityScore = (
  volume24h: string,
  priceChange24h: number,
  fdv: number
): OpportunityScore => {
  // Volume score (0-5): Higher volume is better
  const volumeScore = Math.min(parseFloat(volume24h) / 100000, 5);
  
  // Price momentum score (0-5): Based on 24h change
  const priceScore = Math.min(Math.abs(priceChange24h) / 10, 5);
  
  // Social/Market score (0-5): Lower FDV suggests more room for growth
  const socialScore = Math.min((10000000 - fdv) / 1000000, 5);
  
  return {
    volumeScore,
    socialScore,
    priceScore,
    total: (volumeScore + socialScore + priceScore) / 3
  };
};

export const OpportunityScanner = () => {
  const { data: tokens, isLoading } = useQuery({
    queryKey: ["opportunityScanner"],
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
          throw new Error("Failed to fetch opportunities");
        }
        
        const data = await response.json();
        
        if (!data?.pairs) {
          throw new Error("Invalid data structure");
        }
        
        return data.pairs
          .filter((pair: any) => {
            const fdv = parseFloat(pair.fdv);
            const volume = parseFloat(pair.volume24h);
            return !isNaN(fdv) && !isNaN(volume) && fdv < 5000000 && volume > 1000;
          })
          .map((pair: any) => ({
            ...pair,
            opportunityScore: calculateOpportunityScore(
              pair.volume24h,
              parseFloat(pair.priceChange24h),
              parseFloat(pair.fdv)
            )
          }))
          .sort((a: any, b: any) => b.opportunityScore.total - a.opportunityScore.total)
          .slice(0, 5);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        toast.error("Failed to fetch opportunities");
        return [];
      }
    },
    refetchInterval: 30000
  });

  return (
    <section className="py-20 px-4" id="opportunity-scanner">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Search className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Meme Coin Opportunity Scanner
            </h2>
            <AlertTriangle className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : tokens?.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No opportunities found at the moment.</p>
              <p className="text-sm mt-2">Check back soon for new gems!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens?.map((token: any) => (
                <motion.div
                  key={token.baseToken.address}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card rounded-xl overflow-hidden"
                >
                  <Card className="border-0 bg-transparent h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {token.baseToken.symbol}
                          <Badge variant="secondary" className="text-xs">
                            {token.opportunityScore.total.toFixed(1)}/5
                          </Badge>
                        </div>
                        <span className={`text-sm ${
                          token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatPercentage(token.priceChange24h)}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Volume2 className="w-4 h-4" />
                              Volume Score
                            </span>
                            <span className="font-mono">
                              {token.opportunityScore.volumeScore.toFixed(1)}/5
                            </span>
                          </div>
                          <Progress 
                            value={token.opportunityScore.volumeScore * 20} 
                            className="h-1.5"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              Price Score
                            </span>
                            <span className="font-mono">
                              {token.opportunityScore.priceScore.toFixed(1)}/5
                            </span>
                          </div>
                          <Progress 
                            value={token.opportunityScore.priceScore * 20} 
                            className="h-1.5"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Growth Potential
                            </span>
                            <span className="font-mono">
                              {token.opportunityScore.socialScore.toFixed(1)}/5
                            </span>
                          </div>
                          <Progress 
                            value={token.opportunityScore.socialScore * 20} 
                            className="h-1.5"
                          />
                        </div>

                        <div className="pt-4 border-t border-border/50">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">24h Volume</p>
                              <p className="font-mono text-sm">
                                {formatMarketCap(parseFloat(token.volume24h))}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">FDV</p>
                              <p className="font-mono text-sm">
                                {formatMarketCap(parseFloat(token.fdv))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Opportunities updated every 30 seconds • Scores based on volume, price action, and growth potential • 
              <span className="text-primary ml-1">Always DYOR before investing!</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};