import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TweetAnalysis } from "../types";
import { ApiDebugPanel } from "@/components/debug/ApiDebugPanel";

interface ScrapedTweetsProps {
  handle: string;
  onAnalysisComplete: (analysis: TweetAnalysis[]) => void;
}

export const ScrapedTweets = ({ handle, onAnalysisComplete }: ScrapedTweetsProps) => {
  const [tweets, setTweets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const scrapeTweets = async () => {
    setIsLoading(true);
    setError(null);
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
      setLastResponse(data);
      setLastUpdated(new Date());
      toast.success(`Successfully scraped ${data.tweets.length} tweets`);
    } catch (error) {
      console.error("Error scraping tweets:", error);
      setError(error as Error);
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
    setError(null);
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

      setLastResponse(data);
      setLastUpdated(new Date());
      onAnalysisComplete(data.tweets);
      toast.success("AI analysis completed!");
    } catch (error) {
      console.error("Error analyzing tweets:", error);
      setError(error as Error);
      toast.error("Failed to analyze tweets");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ApiDebugPanel 
        apiUrl={`${supabase.functions.url}/analyze-twitter`}
        lastResponse={lastResponse}
        isLoading={isLoading}
        error={error}
        lastUpdated={lastUpdated}
      />

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