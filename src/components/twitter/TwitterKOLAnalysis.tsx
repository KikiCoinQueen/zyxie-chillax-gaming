import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Twitter, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TwitterKOLAnalysis = () => {
  const [handle, setHandle] = useState("");

  const { data: analysis, isLoading, error, refetch } = useQuery({
    queryKey: ["twitterAnalysis", handle],
    queryFn: async () => {
      if (!handle) return null;
      
      try {
        console.log("Analyzing handle:", handle);
        const { data, error } = await supabase.functions.invoke('analyze-twitter', {
          body: { handle: handle.replace('@', '') }
        });

        if (error) {
          console.error("Supabase function error:", error);
          throw error;
        }

        if (!data.success) {
          throw new Error(data.error || 'Failed to analyze Twitter data');
        }
        
        // Store analysis in Supabase
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
          return data;
        }

        // Store tweet analyses
        if (kolData) {
          const analysisPromises = data.tweets.map((tweet: any) => 
            supabase
              .from('kol_analyses')
              .insert({
                kol_id: kolData.id,
                tweet_id: Math.random().toString(36).substring(7),
                tweet_text: tweet.text,
                sentiment: tweet.sentiment,
                is_bullish: tweet.isBullish,
                mentioned_coins: tweet.mentionedCoins
              })
          );

          await Promise.allSettled(analysisPromises);
        }

        return data;
      } catch (error: any) {
        console.error("Twitter analysis error:", error);
        toast.error("Failed to analyze Twitter data", {
          description: error.message
        });
        throw error;
      }
    },
    enabled: false,
    retry: 1
  });

  const handleAnalyze = () => {
    if (!handle) {
      toast.error("Please enter a Twitter handle");
      return;
    }
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

          <Card className="mb-8 relative z-40">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter Twitter handle (e.g. @cryptoKOL)"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="max-w-md relative z-50"
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="relative z-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <>Analyze</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Card className="p-6 border-destructive/50 bg-destructive/10">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="w-5 h-5" />
                <CardTitle>Error Analyzing Twitter Data</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "An unexpected error occurred"}
              </p>
            </Card>
          ) : analysis?.success ? (
            <div className="grid gap-6">
              <Card className="p-6">
                <CardTitle className="mb-4">Analysis Summary</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Tweets Analyzed</div>
                    <div className="text-2xl font-bold">{analysis.summary.totalTweets}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Bullish Signals</div>
                    <div className="text-2xl font-bold text-green-500">
                      {analysis.summary.bullishTweets}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Mentioned Coins</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.summary.mentionedCoins.map((coin: string) => (
                        <Badge key={coin} variant="secondary">{coin}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="space-y-4">
                {analysis.tweets.map((tweet: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm mb-2">{tweet.text}</p>
                        <div className="flex flex-wrap gap-2">
                          {tweet.mentionedCoins.map((coin: string) => (
                            <Badge key={coin} variant="outline">{coin}</Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant={tweet.isBullish ? "default" : "secondary"} className={tweet.isBullish ? "bg-green-500" : ""}>
                        {tweet.isBullish ? "Bullish" : "Neutral"}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
};

export default TwitterKOLAnalysis;