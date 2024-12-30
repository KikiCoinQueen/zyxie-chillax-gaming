import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, AlertTriangle, TrendingUp } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

export const TokenAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TokenAnalysis[]>([]);
  const [progress, setProgress] = useState(0);

  const analyzeTokens = async (tokens: any[]) => {
    setIsAnalyzing(true);
    setProgress(0);
    
    try {
      toast.info("Initializing AI model...");
      const classifier = await initializeClassifier();
      setProgress(20);

      const results = await Promise.all(
        tokens.map(async (token, index) => {
          // Update progress as each token is analyzed
          setProgress(20 + ((index + 1) / tokens.length) * 60);
          
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
            socialScore,
            priceChange: token.priceChange24h,
            volume: parseFloat(token.volume24h)
          };
        })
      );

      setProgress(90);
      setAnalysis(results);
      setProgress(100);
      toast.success("AI analysis completed successfully!", {
        description: `Analyzed ${tokens.length} tokens with advanced metrics`
      });
    } catch (error) {
      console.error("Error in AI analysis:", error);
      toast.error("Failed to complete AI analysis", {
        description: "Please try again or contact support if the issue persists"
      });
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
            <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Analyzing tokens...</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-muted-foreground">
                  {progress < 20 && "Initializing AI model..."}
                  {progress >= 20 && progress < 80 && "Processing market data..."}
                  {progress >= 80 && "Finalizing analysis..."}
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysis.map((result, index) => (
                  <motion.div
                    key={result.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <AnalysisCard {...result} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          <div className="mt-12 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <p className="text-sm text-muted-foreground">
                AI analysis is for informational purposes only
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Always conduct your own research before making investment decisions
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};