import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TweetAnalysis } from "../types";

interface ScrapedTweetsProps {
  handle: string;
  onAnalysisComplete: (analysis: TweetAnalysis[]) => void;
}

export const ScrapedTweets = ({ handle, onAnalysisComplete }: ScrapedTweetsProps) => {
  const [tweets, setTweets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrapeTweets = async () => {
    setIsLoading(true);
    try {
      console.log("Scraping tweets for:", handle);
      const { data, error } = await supabase.functions.invoke<{
        tweets: string[];
      }>('analyze-twitter', {
        body: { handle, scrapeOnly: true }
      });

      if (error) throw error;
      if (!data?.tweets?.length) {
        throw new Error('No tweets found');
      }

      setTweets(data.tweets);
      toast.success(`Successfully scraped ${data.tweets.length} tweets`);
    } catch (error) {
      console.error("Error scraping tweets:", error);
      toast.error("Failed to scrape tweets");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeWithAI = async () => {
    if (!tweets.length) {
      toast.error("Please scrape tweets first");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<{
        tweets: TweetAnalysis[];
      }>('analyze-twitter', {
        body: { handle, tweets }
      });

      if (error) throw error;
      if (!data?.tweets) {
        throw new Error('Analysis failed');
      }

      onAnalysisComplete(data.tweets);
      toast.success("AI analysis completed!");
    } catch (error) {
      console.error("Error analyzing tweets:", error);
      toast.error("Failed to analyze tweets");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          onClick={scrapeTweets} 
          disabled={isLoading || !handle}
          className="w-1/2"
        >
          {isLoading ? "Loading..." : "Scrape Latest Tweets"}
        </Button>
        <Button
          onClick={analyzeWithAI}
          disabled={isLoading || !tweets.length}
          variant="secondary"
          className="w-1/2 ml-2"
        >
          Analyze with AI
        </Button>
      </div>

      {tweets.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Latest Tweets</h3>
          {tweets.map((tweet, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <p className="text-sm">{tweet}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};