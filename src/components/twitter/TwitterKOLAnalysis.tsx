import { useState } from "react";
import { motion } from "framer-motion";
import { Twitter, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { KOLStats } from "./KOLStats";
import { TweetList } from "./TweetList";
import { AnalysisForm } from "./components/AnalysisForm";
import { ScrapedTweets } from "./components/ScrapedTweets";
import type { TweetAnalysis } from "./types";

const TwitterKOLAnalysis = () => {
  const [handle, setHandle] = useState("");
  const [analysis, setAnalysis] = useState<TweetAnalysis[] | null>(null);

  const handleAnalyze = (newHandle: string) => {
    if (!newHandle) {
      return;
    }
    setHandle(newHandle);
    setAnalysis(null);
  };

  const handleAnalysisComplete = (tweets: TweetAnalysis[]) => {
    setAnalysis(tweets);
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

          <AnalysisForm onAnalyze={handleAnalyze} isLoading={false} />

          {handle && (
            <Card className="mt-6 p-6">
              <ScrapedTweets 
                handle={handle} 
                onAnalysisComplete={handleAnalysisComplete}
              />
            </Card>
          )}

          {analysis && (
            <div className="grid gap-6 mt-6">
              <KOLStats stats={{
                totalTweets: analysis.length,
                averageSentiment: analysis.reduce((acc, t) => acc + (t.sentiment || 0), 0) / analysis.length,
                topMentions: Array.from(new Set(analysis.flatMap(t => t.mentioned_coins || []))).slice(0, 5),
                topContracts: []
              }} />
              <TweetList tweets={analysis} />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TwitterKOLAnalysis;