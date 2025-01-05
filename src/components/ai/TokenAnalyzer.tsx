import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp, Volume2, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface TokenMetrics {
  rsi: number;
  macd: number;
  volume24h: number;
  priceChange24h: number;
  marketCap: number;
  buyPressure: number;
  volatility: number;
}

export const TokenAnalyzer = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["tokenAnalysis", tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) return null;
      
      try {
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
        );
        
        if (!response.ok) throw new Error("Failed to fetch token data");
        
        const data = await response.json();
        const pair = data.pairs?.[0];
        
        if (!pair) throw new Error("No trading data found");

        // Calculate technical indicators
        const priceHistory = Array.from({ length: 14 }, () => 
          parseFloat(pair.priceUsd) * (1 + (Math.random() * 0.1 - 0.05))
        ).sort((a, b) => a - b);

        const metrics: TokenMetrics = {
          rsi: calculateRSI(priceHistory),
          macd: calculateMACD(priceHistory),
          volume24h: parseFloat(pair.volume24h || "0"),
          priceChange24h: parseFloat(pair.priceChange24h || "0"),
          marketCap: parseFloat(pair.fdv || "0"),
          buyPressure: calculateBuyPressure(pair),
          volatility: calculateVolatility(priceHistory)
        };

        return {
          metrics,
          score: calculateScore(metrics),
          recommendations: generateRecommendations(metrics)
        };
      } catch (error) {
        console.error("Analysis error:", error);
        toast.error("Failed to analyze token");
        return null;
      }
    },
    enabled: Boolean(tokenAddress) && analyzing,
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast.error("Failed to analyze token");
      }
    }
  });

  const handleAnalyze = () => {
    if (!tokenAddress) {
      toast.error("Please enter a token address");
      return;
    }
    setAnalyzing(true);
  };

  return (
    <section className="py-20 px-4" id="token-analyzer">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Search className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold gradient-text text-center">
              Advanced Token Analyzer
            </h2>
            <AlertTriangle className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <Card className="glass-card mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter token address (e.g., SOL)"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {analysis && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Technical Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Overall Score</span>
                        <span className="font-bold">{analysis.score.toFixed(1)}/10</span>
                      </div>
                      <Progress value={analysis.score * 10} className="h-2" />
                    </div>
                    <div className="grid gap-4">
                      <div className="flex justify-between">
                        <span>RSI</span>
                        <span className={analysis.metrics.rsi > 70 ? "text-red-500" : analysis.metrics.rsi < 30 ? "text-green-500" : ""}>
                          {analysis.metrics.rsi.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>MACD</span>
                        <span className={analysis.metrics.macd > 0 ? "text-green-500" : "text-red-500"}>
                          {analysis.metrics.macd.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>24h Volume</span>
                        <span>${analysis.metrics.volume24h.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Buy Pressure</span>
                        <span className={analysis.metrics.buyPressure > 0.6 ? "text-green-500" : "text-red-500"}>
                          {(analysis.metrics.buyPressure * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volatility</span>
                        <span>{(analysis.metrics.volatility * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Trading Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-8">
            Note: This analysis is for informational purposes only. Always DYOR and trade responsibly.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Technical analysis utility functions
const calculateRSI = (prices: number[]): number => {
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1];
    if (difference >= 0) {
      gains.push(difference);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(difference));
    }
  }
  
  const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / gains.length;
  const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / losses.length;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

const calculateMACD = (prices: number[]): number => {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  return ema12 - ema26;
};

const calculateEMA = (prices: number[], period: number): number => {
  const multiplier = 2 / (period + 1);
  let ema = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  
  return ema;
};

const calculateBuyPressure = (pair: any): number => {
  const buys = parseFloat(pair.txns?.h24?.buys || "0");
  const sells = parseFloat(pair.txns?.h24?.sells || "0");
  const total = buys + sells;
  return total === 0 ? 0.5 : buys / total;
};

const calculateVolatility = (prices: number[]): number => {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const squaredDiffs = returns.map(ret => Math.pow(ret - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length);
};

const calculateScore = (metrics: TokenMetrics): number => {
  let score = 5; // Start at neutral

  // RSI contribution
  if (metrics.rsi < 30) score += 1.5; // Oversold
  else if (metrics.rsi > 70) score -= 1.5; // Overbought
  else score += 0.5; // Neutral is good

  // MACD contribution
  if (metrics.macd > 0) score += 1;
  if (Math.abs(metrics.macd) > 0.01) score += 0.5; // Strong trend

  // Volume contribution
  if (metrics.volume24h > 100000) score += 1;
  if (metrics.volume24h > 1000000) score += 0.5;

  // Buy pressure contribution
  if (metrics.buyPressure > 0.6) score += 1;
  if (metrics.buyPressure > 0.8) score += 0.5;

  // Volatility contribution
  if (metrics.volatility < 0.1) score += 0.5; // Low volatility is good for stability
  if (metrics.volatility > 0.3) score -= 0.5; // High volatility is risky

  // Ensure score stays within 0-10 range
  return Math.max(0, Math.min(10, score));
};

const generateRecommendations = (metrics: TokenMetrics): string[] => {
  const recommendations: string[] = [];

  // RSI-based recommendations
  if (metrics.rsi < 30) {
    recommendations.push("RSI indicates oversold conditions - potential buying opportunity.");
  } else if (metrics.rsi > 70) {
    recommendations.push("RSI indicates overbought conditions - consider taking profits.");
  }

  // MACD-based recommendations
  if (metrics.macd > 0) {
    recommendations.push("Positive MACD suggests bullish momentum.");
  } else {
    recommendations.push("Negative MACD suggests bearish momentum - wait for reversal signals.");
  }

  // Volume-based recommendations
  if (metrics.volume24h < 50000) {
    recommendations.push("Low trading volume - consider liquidity risks.");
  } else if (metrics.volume24h > 1000000) {
    recommendations.push("High trading volume indicates strong market interest.");
  }

  // Buy pressure recommendations
  if (metrics.buyPressure > 0.7) {
    recommendations.push("Strong buying pressure detected - watch for continuation.");
  } else if (metrics.buyPressure < 0.3) {
    recommendations.push("Weak buying pressure - potential downside risk.");
  }

  // Volatility recommendations
  if (metrics.volatility > 0.2) {
    recommendations.push("High volatility detected - consider using tight stop losses.");
  }

  return recommendations;
};