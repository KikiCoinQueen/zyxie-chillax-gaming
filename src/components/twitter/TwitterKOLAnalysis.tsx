import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Twitter, TrendingUp, AlertTriangle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { TweetAnalysis } from "./types";
import { TweetList } from "./TweetList";
import { KOLStats } from "./KOLStats";
import { pipeline } from "@huggingface/transformers";

const TwitterKOLAnalysis = () => {
  const [handle, setHandle] = useState("");
  const [classifier, setClassifier] = useState<any>(null);

  const initializeClassifier = async () => {
    try {
      const model = await pipeline(
        "text-classification",
        "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
        { device: "webgpu" }
      );
      setClassifier(model);
      return model;
    } catch (error) {
      console.error("Failed to initialize classifier:", error);
      toast.error("Failed to initialize AI model");
      return null;
    }
  };

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["twitterAnalysis", handle],
    queryFn: async () => {
      if (!handle) return null;
      
      if (!classifier) {
        await initializeClassifier();
      }

      // Mock data for demonstration
      const mockTweets: TweetAnalysis[] = [
        {
          id: "1",
          text: "Just found a gem! $PEPE looking bullish with strong community support 🚀",
          timestamp: new Date().toISOString(),
          sentiment: 0.85,
          contracts: ["0x6982508145454ce325ddbe47a25d4ec3d2311933"],
          mentions: ["$PEPE"],
          metrics: {
            likes: 1200,
            retweets: 450,
            replies: 89
          }
        },
        {
          id: "2",
          text: "Be careful with $SCAM, looks like a honeypot. DYOR! ⚠️",
          timestamp: new Date().toISOString(),
          sentiment: 0.2,
          contracts: ["0x1234567890abcdef"],
          mentions: ["$SCAM"],
          metrics: {
            likes: 800,
            retweets: 300,
            replies: 120
          }
        }
      ];

      return {
        tweets: mockTweets,
        stats: {
          totalTweets: mockTweets.length,
          averageSentiment: 0.52,
          topContracts: ["0x6982508145454ce325ddbe47a25d4ec3d2311933"],
          topMentions: ["$PEPE"]
        }
      };
    },
    enabled: Boolean(handle),
    meta: {
      onError: () => {
        toast.error("Failed to fetch Twitter data");
      }
    }
  });

  return (
    <section className="py-20 px-4" id="twitter-analysis">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Twitter className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Crypto KOL Analysis
            </h2>
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter Twitter handle (e.g. @cryptoKOL)"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="max-w-md"
                />
                <Button
                  onClick={() => {
                    if (!handle) {
                      toast.error("Please enter a Twitter handle");
                      return;
                    }
                    // Trigger query refetch
                    window.location.hash = "twitter-analysis";
                  }}
                  disabled={isLoading}
                >
                  Analyze
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : analysis ? (
            <div className="grid gap-6">
              <KOLStats stats={analysis.stats} />
              <TweetList tweets={analysis.tweets} />
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
};

export default TwitterKOLAnalysis;