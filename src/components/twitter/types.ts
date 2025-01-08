export interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
}

export interface TweetAnalysis {
  id: string;
  text: string;
  timestamp: string;
  sentiment: number;
  contracts: string[];
  mentions: string[];
  metrics: TweetMetrics;
}

export interface KOLAnalysisStats {
  totalTweets: number;
  averageSentiment: number;
  topContracts: string[];
  topMentions: string[];
}

export interface TwitterAnalysis {
  tweets: TweetAnalysis[];
  stats: KOLAnalysisStats;
}