import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AnalysisCard } from "./analysis/AnalysisCard";
import {
  TokenAnalysis,
  ClassificationResult,
  initializeClassifier,
  calculateRiskScore,
  calculateMomentum,
  calculateSocialScore,
  generateRecommendation
} from "./analysis/AnalysisUtils";

export const TokenAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TokenAnalysis[]>([]);

  const analyzeTokens = async (tokens: any[]) => {
    setIsAnalyzing(true);
    try {
      const classifier = await initializeClassifier();

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
                <AnalysisCard key={result.symbol} {...result} />
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