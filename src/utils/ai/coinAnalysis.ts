import { toast } from "sonner";

export interface CoinAnalysis {
  sentiment: number;
  riskLevel: string;
  recommendation: string;
  marketTrend: string;
  creationDate: string;
  twitterHandle?: string;
  coingeckoUrl?: string;
  interestScore: number;
  technicalAnalysis: string;
  communityInsight: string;
  investmentHorizon: string;
  riskFactors: string[];
  potentialCatalysts: string[];
  marketPosition: string;
}

export const analyzeCoin = async (
  name: string,
  priceChange: number,
  marketCap: number,
  volume: number,
  coinData?: any
): Promise<CoinAnalysis> => {
  try {
    const sentiment = calculateSentiment(priceChange, volume, marketCap);
    const riskLevel = getRiskLevel(marketCap, volume, priceChange);
    const interestScore = calculateInterestScore(sentiment, marketCap, volume, priceChange);
    const technicalAnalysis = generateTechnicalAnalysis(priceChange, volume, marketCap);
    const communityInsight = analyzeCommunityMetrics(coinData);
    const { horizon, factors } = determineInvestmentProfile(marketCap, volume, priceChange);
    
    return {
      sentiment,
      riskLevel,
      recommendation: generateSmartRecommendation(name, marketCap, priceChange, volume, coinData),
      marketTrend: getDetailedMarketTrend(priceChange, volume, marketCap),
      creationDate: getExactCreationDate(coinData?.genesis_date),
      twitterHandle: coinData?.links?.twitter_screen_name,
      coingeckoUrl: `https://www.coingecko.com/en/coins/${coinData?.id}`,
      interestScore,
      technicalAnalysis,
      communityInsight,
      investmentHorizon: horizon,
      riskFactors: factors,
      potentialCatalysts: identifyCatalysts(coinData, priceChange),
      marketPosition: analyzeMarketPosition(marketCap, volume)
    };
  } catch (error) {
    console.error("Error analyzing coin:", error);
    toast.error("Failed to analyze coin, using fallback analysis");
    
    return {
      sentiment: 0.5,
      riskLevel: "High",
      recommendation: `${name} requires careful analysis. Limited data available.`,
      marketTrend: "Insufficient data",
      creationDate: "Unknown",
      interestScore: 0,
      technicalAnalysis: "Technical analysis unavailable",
      communityInsight: "Community metrics unavailable",
      investmentHorizon: "Unknown",
      riskFactors: ["Limited data available"],
      potentialCatalysts: [],
      marketPosition: "Market position unclear"
    };
  }
};

const calculateSentiment = (priceChange: number, volume: number, marketCap: number): number => {
  const priceImpact = Math.min(Math.abs(priceChange) / 100, 1) * (priceChange > 0 ? 1 : -1);
  const volumeImpact = Math.min(volume / 1000000, 1);
  const marketCapImpact = Math.min(marketCap / 1000000000, 1);
  const rawSentiment = (priceImpact * 0.5) + (volumeImpact * 0.3) + (marketCapImpact * 0.2);
  return (rawSentiment + 1) / 2;
};

const getRiskLevel = (marketCap: number, volume: number, priceChange: number): string => {
  if (marketCap < 1000000 || Math.abs(priceChange) > 50) return "Very High";
  if (marketCap < 5000000 || Math.abs(priceChange) > 30) return "High";
  if (marketCap < 10000000 || Math.abs(priceChange) > 20) return "Medium";
  return "Low";
};

const generateTechnicalAnalysis = (priceChange: number, volume: number, marketCap: number): string => {
  const volatility = Math.abs(priceChange);
  const volumeToMcap = volume / marketCap;
  
  let analysis = "";
  
  if (volatility > 30) {
    analysis += "Extreme price volatility indicates high speculative activity. ";
  } else if (volatility > 15) {
    analysis += "Moderate price action with notable momentum. ";
  }
  
  if (volumeToMcap > 0.3) {
    analysis += "Strong trading volume relative to market cap suggests high market interest. ";
  } else if (volumeToMcap > 0.1) {
    analysis += "Healthy trading activity indicating steady market participation. ";
  }
  
  return analysis || "Insufficient technical data for analysis.";
};

const analyzeCommunityMetrics = (coinData: any): string => {
  if (!coinData?.community_data) return "Community metrics unavailable";
  
  const { twitter_followers, telegram_channel_user_count } = coinData.community_data;
  const socialScore = (twitter_followers || 0) / 1000 + (telegram_channel_user_count || 0) / 500;
  
  if (socialScore > 100) return "Very strong community engagement across platforms";
  if (socialScore > 50) return "Growing community with active social presence";
  if (socialScore > 20) return "Emerging community with potential for growth";
  return "Early-stage community development";
};

const determineInvestmentProfile = (marketCap: number, volume: number, priceChange: number) => {
  const factors: string[] = [];
  let horizon = "";
  
  if (marketCap < 1000000) {
    factors.push("Micro-cap status increases volatility risk");
    horizon = "High-risk short-term";
  } else if (marketCap < 10000000) {
    factors.push("Small-cap with growth potential");
    horizon = "Medium-term with active management";
  } else {
    factors.push("Established market presence");
    horizon = "Long-term hold potential";
  }
  
  if (volume / marketCap > 0.2) {
    factors.push("High trading volume suggests market manipulation risk");
  }
  
  if (Math.abs(priceChange) > 20) {
    factors.push("Price volatility requires careful entry timing");
  }
  
  return { horizon, factors };
};

const identifyCatalysts = (coinData: any, priceChange: number): string[] => {
  const catalysts: string[] = [];
  
  if (coinData?.developer_data?.stars > 100) {
    catalysts.push("Strong development activity");
  }
  
  if (priceChange > 20) {
    catalysts.push("Positive price momentum");
  }
  
  if (coinData?.community_data?.twitter_followers > 10000) {
    catalysts.push("Growing social media presence");
  }
  
  return catalysts;
};

const analyzeMarketPosition = (marketCap: number, volume: number): string => {
  const mcapInMillions = marketCap / 1000000;
  const volumeInK = volume / 1000;
  
  if (mcapInMillions < 1) {
    return "Micro-cap project in early growth phase";
  } else if (mcapInMillions < 10) {
    return "Small-cap with emerging market presence";
  } else if (mcapInMillions < 50) {
    return "Mid-cap with established market position";
  }
  return "Large-cap with significant market influence";
};

const getDetailedMarketTrend = (priceChange: number, volume: number, marketCap: number): string => {
  const trend = priceChange > 0 ? "Upward" : "Downward";
  const strength = Math.abs(priceChange);
  const volumeStrength = volume > 1000000 ? "high" : "moderate";
  
  if (strength > 20) {
    return `Strong ${trend} momentum with ${volumeStrength} trading volume`;
  } else if (strength > 10) {
    return `Moderate ${trend} movement with ${volumeStrength} market activity`;
  } else if (strength > 5) {
    return `Slight ${trend} trend with ${volumeStrength} trading interest`;
  }
  return `Ranging market with ${volumeStrength} volatility`;
};

const generateSmartRecommendation = (
  name: string,
  marketCap: number,
  priceChange: number,
  volume: number,
  coinData?: any
): string => {
  const mcapInMillions = marketCap / 1000000;
  const volumeInK = volume / 1000;
  const dailyVolRatio = volume / marketCap;
  const potentialRetrace = mcapInMillions * 0.8;
  
  let analysis = `${name} presents as ${coinData?.categories?.join(', ') || 'an emerging crypto asset'} `;
  
  if (coinData?.description?.en) {
    const description = coinData.description.en.split('.')[0];
    analysis += `with a core focus on ${description}. `;
  }
  
  if (marketCap < 5000000) {
    analysis += `With a nascent market cap of $${mcapInMillions.toFixed(2)}M, this project sits in the micro-cap territory, suggesting significant growth potential coupled with elevated risk. `;
  } else if (marketCap < 20000000) {
    analysis += `Positioned at $${mcapInMillions.toFixed(2)}M market cap, the project demonstrates established market presence while retaining substantial growth runway. `;
  }
  
  if (dailyVolRatio > 0.3) {
    analysis += `Notably, the volume/mcap ratio of ${(dailyVolRatio * 100).toFixed(1)}% indicates robust market participation and liquidity depth. `;
  } else if (dailyVolRatio > 0.1) {
    analysis += `The volume/mcap ratio of ${(dailyVolRatio * 100).toFixed(1)}% suggests healthy market activity without overextension. `;
  }
  
  if (priceChange > 20) {
    analysis += `Following a significant ${priceChange.toFixed(1)}% appreciation, prudent investors might consider strategic entry points near the $${potentialRetrace.toFixed(2)}M market cap level, aligning with key technical retracement zones. `;
  } else if (priceChange < -20) {
    analysis += `The recent ${Math.abs(priceChange).toFixed(1)}% correction may present an attractive entry point, contingent upon fundamental strength and market structure validation. `;
  }
  
  if (coinData?.community_data) {
    const { twitter_followers, telegram_channel_user_count } = coinData.community_data;
    if (twitter_followers > 10000 || telegram_channel_user_count > 5000) {
      analysis += `The project maintains robust social engagement metrics with ${twitter_followers?.toLocaleString() || 0} Twitter followers, indicating strong community backing. `;
    }
  }
  
  if (coinData?.developer_data?.stars > 100) {
    analysis += `Technical fundamentals appear solid with ${coinData.developer_data.stars} GitHub stars, suggesting active development and community contribution. `;
  }
  
  const riskLevel = getRiskLevel(marketCap, volume, priceChange);
  analysis += `Risk Assessment: ${riskLevel}. `;
  
  if (riskLevel === "Very High") {
    analysis += "Position sizing should be extremely conservative, with capital allocation not exceeding 0.5-1% of portfolio value. Implement strict stop-loss protocols and consider scaling in gradually.";
  } else if (riskLevel === "High") {
    analysis += "Consider implementing a scaled entry strategy with defined risk parameters. Suggested position sizing: 1-2% of portfolio with tight stop-loss orders.";
  } else {
    analysis += "Standard position sizing protocols apply. Consider implementing a core-satellite approach with this asset, maintaining flexibility for tactical adjustments based on market conditions.";
  }
  
  return analysis;
};

const getExactCreationDate = (genesisDate?: string): string => {
  if (!genesisDate) return "Creation date unknown";
  
  const date = new Date(genesisDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return `Created ${diffDays} days ago (${date.toLocaleDateString()})`;
};

const calculateInterestScore = (
  sentiment: number,
  marketCap: number,
  volume: number,
  priceChange: number
): number => {
  const sentimentScore = sentiment * 0.3;
  const marketCapScore = Math.min(marketCap / 1000000000, 1) * 0.2;
  const volumeScore = Math.min(volume / 1000000, 1) * 0.3;
  const momentumScore = (Math.abs(priceChange) / 100) * 0.2;
  
  return (sentimentScore + marketCapScore + volumeScore + momentumScore) * 5;
};