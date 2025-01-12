import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Trophy, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { PredictionCard } from "./PredictionCard";
import { ChallengeCard } from "./ChallengeCard";
import { useMarketData } from "./hooks/useMarketData";
import { generatePrediction } from "./services/predictionService";
import type { Prediction } from "./types/prediction";

export const MemePredictor = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const { data: marketData, isLoading } = useMarketData();

  const handlePrediction = async (token: any) => {
    try {
      const prediction = await generatePrediction(token);
      setPredictions(prev => [...prev, prediction]);
      toast.success(`New prediction generated for ${token.baseToken.symbol}!`);
      setUserPoints(prev => prev + 10);
    } catch (error) {
      console.error("Error in prediction handler:", error);
    }
  };

  return (
    <section className="py-20 px-4" id="meme-predictor">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              AI Meme Coin Predictor
            </h2>
            <Trophy className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Live Predictions
                  <Badge variant="secondary" className="ml-2">
                    Beta
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : marketData?.length > 0 ? (
                    <div className="grid gap-4">
                      {marketData.map((token: any) => (
                        <PredictionCard
                          key={token.baseToken.address}
                          token={token}
                          onPredict={() => handlePrediction(token)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      No tokens available for prediction
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Your Progress
                  <Target className="w-4 h-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Points</span>
                      <span className="font-mono text-xl">{userPoints}</span>
                    </div>
                    <Progress value={userPoints % 100} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Daily Challenges</h3>
                    <ChallengeCard
                      title="Make 3 Predictions"
                      progress={predictions.length}
                      target={3}
                      reward={50}
                    />
                    <ChallengeCard
                      title="Achieve 80% Confidence"
                      progress={predictions.filter(p => p.confidence > 0.8).length}
                      target={1}
                      reward={100}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Predictions are generated using AI analysis of market data and sentiment •{" "}
              <span className="text-primary">Not financial advice • DYOR</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};