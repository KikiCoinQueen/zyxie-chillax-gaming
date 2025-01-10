import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Twitter, TrendingUp, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { KOLStats } from "./KOLStats";
import { TweetList } from "./TweetList";
import { AnalysisForm } from "./components/AnalysisForm";
import type { TwitterAnalysis, Tweet, KOLAnalysisStats } from "./types";

const TwitterKOLAnalysis = () => {
  const [handle, setHandle] = useState("");

  const { data: analysis, isLoading, error, refetch } = useQuery({
    queryKey: ["twitterAnalysis", handle],
    queryFn: async () => {
      if (!handle) return null;
      
      try {
        console.log("Analyzing Twitter handle:", handle);
        const { data, error: functionError } = await supabase.functions.invoke<TwitterAnalysis>('analyze-twitter', {
          body: { handle }
        });

        if (functionError) {
          console.error("Edge function error:", functionError);
          throw new Error(functionError.message);
        }

        if (!data?.tweets?.length) {
          throw new Error('No tweets found for analysis');
        }

        // Transform tweets to match the Tweet interface
        const transformedTweets: Tweet[] = data.tweets.map(tweet => ({
          ...tweet,
          mentionedCoins: tweet.mentions || [],
          isBullish: tweet.sentiment > 0.6,
          contracts: tweet.mentions || [], // Using mentions as contracts for now
          metrics: {
            likes: 0,
            retweets: 0,
            replies: 0
          }
        }));

        // Calculate KOL stats
        const kolStats: KOLAnalysisStats = {
          totalTweets: transformedTweets.length,
          averageSentiment: transformedTweets.reduce((acc, t) => acc + t.sentiment, 0) / transformedTweets.length,
          topMentions: Array.from(new Set(transformedTweets.flatMap(t => t.mentions))).slice(0, 5),
          topContracts: Array.from(new Set(transformedTweets.flatMap(t => t.contracts))).slice(0, 5)
        };

        // Store KOL data
        const { data: kolData, error: kolError } = await supabase
          .from('kols')
          .upsert({
            twitter_handle: handle,
            last_analyzed: new Date().toISOString(),
            name: handle
          })
          .select()
          .single();

        if (kolError) {
          console.error("Error storing KOL:", kolError);
          toast.error("Failed to store analysis results");
          throw kolError;
        }

        // Store analyses
        const analysisPromises = transformedTweets.map(tweet => 
          supabase
            .from('kol_analyses')
            .insert({
              kol_id: kolData.id,
              tweet_id: tweet.id,
              tweet_text: tweet.text,
              sentiment: tweet.sentiment,
              is_bullish: tweet.isBullish,
              mentioned_coins: tweet.mentionedCoins
            })
        );

        await Promise.all(analysisPromises);
        
        return {
          tweets: transformedTweets,
          stats: kolStats
        };
      } catch (error: any) {
        console.error("Twitter analysis error:", error);
        toast.error(error.message || "Failed to analyze Twitter data");
        throw error;
      }
    },
    enabled: false,
    retry: 1
  });

  const handleAnalyze = (newHandle: string) => {
    setHandle(newHandle);
    refetch();
  };

  return (
    <section className="py-20 px-4 relative z-20" id="twitter-analysis">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-30"
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Twitter className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Crypto KOL Analysis
            </h2>
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Card className="p-6 border-destructive/50 bg-destructive/10">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Error Analyzing Twitter Data</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "An unexpected error occurred"}
              </p>
            </Card>
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