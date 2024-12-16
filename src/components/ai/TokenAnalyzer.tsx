import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";

interface TokenAnalysis {
  symbol: string;
  riskScore: number;
  sentiment: string;
  recommendation: string;
  confidence: number;
  momentum: number;
  socialScore: number;
}

// Define the expected shape of the classification result
interface ClassificationResult {
  label: string;
  score: number;
}

export const TokenAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TokenAnalysis[]>([]);

  const analyzeTokens = async (tokens: any[]) => {
    setIsAnalyzing(true);
    try {
      const classifier = await pipeline(
        "text-classification",
        "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
        { device: "webgpu" }
      );

      const results = await Promise.all(
        tokens.map(async (token) => {
          const text = `${token.baseToken.symbol} price ${token.priceChange24h > 0 ? 'increased' : 'decreased'} 
                       by ${Math.abs(token.priceChange24h)}% with volume ${token.volume24h}`;
          
          const sentimentResult = await classifier(text);
          
          let sentimentLabel = "NEUTRAL";
          let confidence = 0.5;
          
          if (Array.isArray(sentimentResult)) {
            const firstResult = sentimentResult[0] as ClassificationResult;
            sentimentLabel = firstResult?.label || "NEUTRAL";
            confidence = firstResult?.score || 0.5;
          } else {
            const result = sentimentResult as ClassificationResult;
            sentimentLabel = result.label;
            confidence = result.score;
          }
          
          const riskScore = calculateRiskScore(token);
          const momentum = calculateMomentum(token);
          const socialScore = calculateSocialScore(token);
          
          return {
            symbol: token.baseToken.symbol,
            riskScore,
            sentiment: sentimentLabel,
            recommendation: generateRecommendation(riskScore, sentimentLabel, momentum),
            confidence,
            momentum,
            socialScore
          };
        })
      );

      setAnalysis(results);
      toast.success("AI analysis completed!");
    } catch (error) {
      console.error("Error in AI analysis:", error);
      toast.error("Failed to complete AI analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateRiskScore = (token: any): number => {
    const volumeScore = Math.min(parseFloat(token.volume24h) / 100000, 5);
    const volatilityScore = Math.min(Math.abs(token.priceChange24h) / 20, 5);
    const liquidityScore = Math.min(token.liquidity?.usd / 50000, 5) || 0;
    return (volumeScore + volatilityScore + liquidityScore) / 3;
  };

  const calculateMomentum = (token: any): number => {
    const priceChange = token.priceChange24h;
    const volume = parseFloat(token.volume24h);
    return Math.min((Math.abs(priceChange) * volume) / 1000000, 5);
  };

  const calculateSocialScore = (token: any): number => {
    // Placeholder for social score calculation
    // In a real implementation, this would use social media API data
    return Math.random() * 5;
  };

  const generateRecommendation = (
    riskScore: number,
    sentiment: string,
    momentum: number
  ): string => {
    if (riskScore > 4 && sentiment === "POSITIVE" && momentum > 3) {
      return "Strong Buy Signal 🚀";
    } else if (riskScore > 3 && sentiment === "POSITIVE") {
      return "Consider Buying 📈";
    } else if (riskScore < 2 || sentiment === "NEGATIVE") {
      return "High Risk - Caution ⚠️";
    }
    return "Monitor Closely 👀";
  };

  return (
    <section className="py-20 px-4" id="ai-insights">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              AI-Powered Market Analysis
            </h2>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isAnalyzing ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysis.map((result) => (
                <Card key={result.symbol} className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {result.symbol}
                      <Badge variant={result.sentiment === "POSITIVE" ? "default" : "destructive"}>
                        {result.sentiment}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Risk Score</span>
                          <span className="font-mono">{result.riskScore.toFixed(1)}/5</span>
                        </div>
                        <Progress value={result.riskScore * 20} className="h-1.5" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Momentum</span>
                          <span className="font-mono">{result.momentum.toFixed(1)}/5</span>
                        </div>
                        <Progress value={result.momentum * 20} className="h-1.5" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Social Score</span>
                          <span className="font-mono">{result.socialScore.toFixed(1)}/5</span>
                        </div>
                        <Progress value={result.socialScore * 20} className="h-1.5" />
                      </div>

                      <div className="flex items-start gap-2 pt-4 border-t border-border/50">
                        <AlertTriangle className="w-4 h-4 text-primary mt-1" />
                        <div>
                          <p className="text-sm font-medium">{result.recommendation}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Confidence: {(result.confidence * 100).toFixed(1)}%
                          </p>
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
              Powered by AI • Not financial advice • DYOR
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};