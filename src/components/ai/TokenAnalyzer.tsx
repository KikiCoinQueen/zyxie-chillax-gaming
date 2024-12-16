import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pipeline } from "@huggingface/transformers";
import { toast } from "sonner";

interface TokenAnalysis {
  symbol: string;
  riskScore: number;
  sentiment: string;
  recommendation: string;
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
          
          // Extract label based on result type and ensure type safety
          let sentimentLabel = "NEUTRAL";
          if (Array.isArray(sentimentResult)) {
            const firstResult = sentimentResult[0] as ClassificationResult;
            sentimentLabel = firstResult?.label || "NEUTRAL";
          } else {
            sentimentLabel = (sentimentResult as ClassificationResult).label;
          }
          
          const riskScore = calculateRiskScore(token);
          
          return {
            symbol: token.baseToken.symbol,
            riskScore,
            sentiment: sentimentLabel,
            recommendation: generateRecommendation(riskScore, sentimentLabel)
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
    return (volumeScore + volatilityScore) / 2;
  };

  const generateRecommendation = (riskScore: number, sentiment: string): string => {
    if (riskScore > 4 && sentiment === "POSITIVE") {
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
              AI-Powered Token Analysis
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
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Risk Score</span>
                        <span className="font-mono">{result.riskScore.toFixed(1)}/5</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-primary mt-1" />
                        <p className="text-sm">{result.recommendation}</p>
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