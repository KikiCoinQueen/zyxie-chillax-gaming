import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { AnalysisHeader } from "./analysis/AnalysisHeader";
import { AnalysisProgressCard } from "./analysis/AnalysisProgressCard";
import { analyzeToken } from "@/services/analysisService";
import { useAchievements } from "@/contexts/AchievementsContext";
import { AnalysisResult } from "./analysis/types";

export const MemeAnalyzer = () => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const { addAnalyzedToken } = useAchievements();

  const { data: analysisResults, isLoading } = useQuery({
    queryKey: ["memeAnalysis", selectedTokens],
    queryFn: async () => {
      if (selectedTokens.length === 0) return [];
      
      const results = await Promise.all(
        selectedTokens.map(token => analyzeToken(token))
      );
      
      return results;
    },
    enabled: selectedTokens.length > 0,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 5000)
  });

  const handleTokenSelect = (token: string) => {
    if (selectedTokens.includes(token)) {
      setSelectedTokens(prev => prev.filter(t => t !== token));
    } else {
      setSelectedTokens(prev => [...prev, token]);
      addAnalyzedToken(token);
      toast.success(`Started analysis for ${token}`);
    }
  };

  return (
    <section className="py-20 px-4" id="meme-analyzer">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnalysisHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Live Analysis
                  <Badge variant="secondary">Beta</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysisResults?.map((result: AnalysisResult) => (
                      <Card key={result.symbol} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">{result.symbol}</h3>
                          <Badge variant={result.sentiment > 60 ? "default" : "destructive"}>
                            {result.prediction}
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Sentiment Score</span>
                              <span>{result.sentiment.toFixed(1)}%</span>
                            </div>
                            <Progress value={result.sentiment} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Risk Level</span>
                              <span>{result.riskScore.toFixed(1)}/5</span>
                            </div>
                            <Progress value={result.riskScore * 20} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Social Score</span>
                              <span>{result.socialScore.toFixed(1)}/5</span>
                            </div>
                            <Progress value={result.socialScore * 20} className="h-2" />
                          </div>
                        </div>
                      </Card>
                    ))}

                    <div className="flex gap-2 flex-wrap">
                      {["PEPE", "DOGE", "SHIB", "BONK", "WIF"].map((token) => (
                        <Button
                          key={token}
                          variant={selectedTokens.includes(token) ? "default" : "outline"}
                          onClick={() => handleTokenSelect(token)}
                        >
                          {token}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <AnalysisProgressCard />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Powered by AI • Not financial advice • DYOR
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};