import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Repeat2, Heart } from "lucide-react";
import { TweetAnalysis } from "./types";

interface TweetListProps {
  tweets: TweetAnalysis[];
}

export const TweetList = ({ tweets }: TweetListProps) => {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.6) return "text-green-500";
    if (sentiment <= 0.4) return "text-red-500";
    return "text-yellow-500";
  };

  const getMetricValue = (value: number | undefined) => {
    return value?.toLocaleString() || '0';
  };

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <motion.div
          key={tweet.tweet_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <p className="text-sm mb-4">{tweet.tweet_text}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {getMetricValue(tweet.metrics?.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Repeat2 className="w-4 h-4" />
                    {getMetricValue(tweet.metrics?.retweets)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {getMetricValue(tweet.metrics?.replies)}
                  </span>
                </div>
                <div className={`font-medium ${getSentimentColor(tweet.sentiment)}`}>
                  Sentiment: {(tweet.sentiment * 100).toFixed(1)}%
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tweet.mentioned_coins?.map((mention, i) => (
                  <Badge key={i} variant="secondary">
                    {mention}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};