export interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
}

export interface TweetAnalysis {
  id: string;
  tweet_id: string;
  tweet_text: string;
  sentiment: number;
  is_bullish: boolean;
  mentioned_coins: string[];
  metrics: TweetMetrics;
}

export interface KOLAnalysisStats {
  totalTweets: number;
  averageSentiment: number;
  topMentions: string[];
  topContracts: string[];
}

export interface TwitterAnalysis {
  tweets: TweetAnalysis[];
  stats: KOLAnalysisStats;
}