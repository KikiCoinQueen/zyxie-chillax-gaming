import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Mic, StopCircle, Volume2, Brain, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useConversation } from "@11labs/react";

interface MarketAnalysis {
  sentiment: string;
  recommendation: string;
  riskLevel: string;
  keyPoints: string[];
}

export const VoiceTrader = () => {
  const [isListening, setIsListening] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const conversation = useConversation({
    clientTools: {
      displayMessage: (parameters: { text: string }) => {
        toast.info(parameters.text);
        return "Message displayed";
      }
    }
  });

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["marketAnalysis"],
    queryFn: async () => {
      try {
        const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/SOL");
        if (!response.ok) throw new Error("Failed to fetch market data");
        
        const data = await response.json();
        const pair = data.pairs?.[0];
        
        if (!pair) throw new Error("No market data found");

        const marketAnalysis: MarketAnalysis = {
          sentiment: pair.priceChange24h > 0 ? "Bullish" : "Bearish",
          recommendation: generateRecommendation(pair),
          riskLevel: calculateRiskLevel(pair),
          keyPoints: generateKeyPoints(pair)
        };

        return marketAnalysis;
      } catch (error) {
        console.error("Analysis error:", error);
        toast.error("Failed to analyze market data");
        return null;
      }
    },
    refetchInterval: 30000
  });

  const startListening = async () => {
    if (!apiKey) {
      toast.error("Please enter your ElevenLabs API key first");
      return;
    }

    try {
      setIsListening(true);
      await conversation.startSession({
        agentId: "voice-trader",
        overrides: {
          tts: {
            voiceId: "21m00Tcm4TlvDq8ikWAM" // Rachel voice
          },
          agent: {
            firstMessage: "Hello! I'm your AI trading assistant. How can I help you today?",
            language: "en"
          }
        }
      });
    } catch (error) {
      console.error("Error starting voice session:", error);
      toast.error("Failed to start voice interaction");
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await conversation.endSession();
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping voice session:", error);
      toast.error("Failed to stop voice interaction");
    }
  };

  return (
    <section className="py-20 px-4" id="voice-trader">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold gradient-text text-center">
              AI Voice Trading Assistant
            </h2>
            <Volume2 className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {!apiKey && (
            <Card className="glass-card mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <p className="text-center text-muted-foreground">
                    Please enter your ElevenLabs API key to enable voice interactions
                  </p>
                  <input
                    type="password"
                    placeholder="Enter your ElevenLabs API key"
                    className="w-full p-2 rounded border"
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                ) : analysis ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Market Sentiment</span>
                      <span className={analysis.sentiment === "Bullish" ? "text-green-500" : "text-red-500"}>
                        {analysis.sentiment}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Risk Level</span>
                      <span className="font-medium">{analysis.riskLevel}</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Key Points:</h4>
                      <ul className="space-y-2">
                        {analysis.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Failed to load market analysis
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Voice Interaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-center">
                    {isListening ? (
                      <Button
                        variant="destructive"
                        size="lg"
                        className="rounded-full w-24 h-24"
                        onClick={stopListening}
                      >
                        <StopCircle className="w-12 h-12" />
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="lg"
                        className="rounded-full w-24 h-24"
                        onClick={startListening}
                        disabled={!apiKey}
                      >
                        <Mic className="w-12 h-12" />
                      </Button>
                    )}
                  </div>
                  {conversation.isSpeaking && (
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 animate-pulse" />
                      <span className="text-sm text-muted-foreground">AI is speaking...</span>
                    </div>
                  )}
                  <div className="text-center text-sm text-muted-foreground">
                    {isListening ? (
                      "Listening... Click to stop"
                    ) : (
                      "Click the microphone to start voice interaction"
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Note: This is an AI assistant. Always verify information and DYOR before making trading decisions.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Utility functions
const generateRecommendation = (pair: any): string => {
  const priceChange = parseFloat(pair.priceChange24h);
  const volume = parseFloat(pair.volume24h);
  
  if (priceChange > 10 && volume > 100000) {
    return "Strong Buy";
  } else if (priceChange > 5 && volume > 50000) {
    return "Buy";
  } else if (priceChange < -10 && volume > 100000) {
    return "Strong Sell";
  } else if (priceChange < -5 && volume > 50000) {
    return "Sell";
  }
  return "Hold";
};

const calculateRiskLevel = (pair: any): string => {
  const volume = parseFloat(pair.volume24h);
  const liquidity = parseFloat(pair.liquidity?.usd || "0");
  
  if (volume < 10000 || liquidity < 50000) {
    return "Very High";
  } else if (volume < 50000 || liquidity < 100000) {
    return "High";
  } else if (volume < 100000 || liquidity < 500000) {
    return "Medium";
  }
  return "Low";
};

const generateKeyPoints = (pair: any): string[] => {
  const points: string[] = [];
  const priceChange = parseFloat(pair.priceChange24h);
  const volume = parseFloat(pair.volume24h);
  const liquidity = parseFloat(pair.liquidity?.usd || "0");

  if (Math.abs(priceChange) > 10) {
    points.push(`Significant price movement of ${priceChange.toFixed(2)}% in 24h`);
  }

  if (volume > 100000) {
    points.push(`High trading volume of $${(volume / 1000).toFixed(1)}K`);
  }

  if (liquidity > 500000) {
    points.push(`Strong liquidity pool of $${(liquidity / 1000).toFixed(1)}K`);
  }

  points.push(`Current price: $${parseFloat(pair.priceUsd).toFixed(6)}`);
  
  return points;
};