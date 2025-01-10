export interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
}

export interface Tweet {
  id?: string;
  text: string;
  sentiment: number;
  mentions?: string[];
  metrics?: TweetMetrics;
}

export interface AnalysisSummary {
  totalTweets: number;
  bullishTweets: number;
  mentionedCoins: string[];
}

export interface TwitterAnalysis {
  tweets: Tweet[];
  summary: AnalysisSummary;
}