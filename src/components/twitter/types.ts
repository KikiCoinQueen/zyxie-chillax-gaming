export interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
}

export interface TweetAnalysis {
  id: string;
  text: string;
  sentiment: number;
  mentions: string[];
  contracts: string[];
  metrics: TweetMetrics;
}

export interface KOLAnalysisStats {
  totalTweets: number;
  averageSentiment: number;
  topMentions: string[];
  topContracts: string[];
}

export interface AnalysisSummary {
  totalTweets: number;
  bullishTweets: number;
  mentionedCoins: string[];
}

export interface TwitterAnalysis {
  tweets: TweetAnalysis[];
  summary: AnalysisSummary;
}

export interface Tweet {
  id: string;
  text: string;
  sentiment: number;
  mentions: string[];
  contracts: string[];
  metrics: TweetMetrics;
  mentionedCoins: string[];
  isBullish: boolean;
}