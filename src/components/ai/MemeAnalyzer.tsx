import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { pipeline } from "@huggingface/transformers";
import { AnalysisHeader } from "./analysis/AnalysisHeader";
import { AnalysisProgress } from "./analysis/AnalysisProgress";
import { AchievementCard } from "../achievements/AchievementCard";
import { Achievement } from "../achievements/types";
import { AnalysisResult, TextClassificationOutput, extractSentiment } from "./analysis/types";

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_analysis",
    name: "First Analysis",
    description: "Complete your first token analysis",
    icon: "🎯",
    progress: 0,
    target: 1,
    reward: 100,
    completed: false
  },
  {
    id: "analysis_master",
    name: "Analysis Master",
    description: "Analyze 5 different tokens",
    icon: "🏆",
    progress: 0,
    target: 5,
    reward: 500,
    completed: false
  },
  {
    id: "prediction_streak",
    name: "Prediction Streak",
    description: "Make 3 successful predictions in a row",
    icon: "🎯",
    progress: 0,
    target: 3,
    reward: 300,
    completed: false
  }
];

export const MemeAnalyzer = () => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [userScore, setUserScore] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const { data: analysisResults, isLoading } = useQuery({
    queryKey: ["memeAnalysis", selectedTokens],
    queryFn: async () => {
      try {
        const classifier = await pipeline(
          "text-classification",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
          { device: "webgpu" }
        );

        const results: AnalysisResult[] = await Promise.all(
          selectedTokens.map(async (token) => {
            try {
              const result = await classifier(`${token} market analysis`) as TextClassificationOutput;
              const sentiment = extractSentiment(result);

              return {
                symbol: token,
                sentiment: sentiment.score * 100,
                riskScore: Math.random() * 5,
                socialScore: Math.random() * 5,
                prediction: sentiment.score > 0.6 ? "Bullish 🚀" : "Bearish 🐻",
                confidence: sentiment.score * 100
              };
            } catch (error) {
              console.error(`Error analyzing token ${token}:`, error);
              toast.error(`Failed to analyze ${token}`);
              return {
                symbol: token,
                sentiment: 50,
                riskScore: 2.5,
                socialScore: 2.5,
                prediction: "Neutral 😐",
                confidence: 50
              };
            }
          })
        );

        return results;
      } catch (error) {
        console.error("Analysis error:", error);
        toast.error("Failed to initialize AI model. Please try again later.");
        return [];
      }
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
      setUserScore(prev => prev + 10);
      updateAchievements(token);
      toast.success(`Earned 10 points for analyzing ${token}!`);
    }
  };

  const updateAchievements = (token: string) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.completed) return achievement;

      let newProgress = achievement.progress;
      
      switch (achievement.id) {
        case "first_analysis":
          newProgress = 1;
          break;
        case "analysis_master":
          newProgress = Math.min(achievement.target, selectedTokens.length + 1);
          break;
        case "prediction_streak":
          // This would be updated based on actual prediction accuracy
          break;
      }

      const completed = newProgress >= achievement.target;
      
      if (completed && !achievement.completed) {
        toast.success(`Achievement Unlocked: ${achievement.name}!`);
        setUserScore(prev => prev + achievement.reward);
      }

      return {
        ...achievement,
        progress: newProgress,
        completed
      };
    }));
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
                    {analysisResults?.map((result) => (
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

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Your Progress
                  <AlertTriangle className="w-4 h-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalysisProgress 
                  userScore={userScore}
                  selectedTokens={selectedTokens}
                />

                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold">Achievements</h3>
                  {achievements.map((achievement) => (
                    <AchievementCard 
                      key={achievement.id} 
                      achievement={achievement}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
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