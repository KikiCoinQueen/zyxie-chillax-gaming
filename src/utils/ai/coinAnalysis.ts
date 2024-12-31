import { toast } from "sonner";
import { CoinDetails } from "@/types/coin";

export interface CoinAnalysis {
  gemScore: number;
  gemClassification: string;
  marketMetrics: {
    mcapRank: string;
    volumeQuality: string;
    momentum: string;
  };
  keyMetrics: {
    marketCap: string;
    volume24h: string;
    volumeToMcap: string;
  };
  riskLevel: string;
  recommendation: string;
  potentialCatalysts: string[];
  riskFactors: string[];
  technicalAnalysis: string;
  communityInsight: string;
  investmentHorizon: string;
  interestScore: number;
  twitterHandle?: string;
  coingeckoUrl?: string;
  communityMetrics: {
    score: number;
    label: string;
  };
}

const calculateGemScore = (marketCap: number, volume: number, priceChange: number): number => {
  // Heavily favor lower market caps (under $5M gets highest score)
  const mcapScore = Math.max(0, 1 - (marketCap / 5000000)) * 50;
  
  // Higher volume relative to mcap is better (looking for active trading)
  const volumeToMcap = volume / marketCap;
  const volumeScore = Math.min(volumeToMcap * 100, 30);
  
  // Price momentum (both positive and negative can be interesting)
  const momentumScore = Math.min(Math.abs(priceChange), 100) / 5;
  
  return Math.min(mcapScore + volumeScore + momentumScore, 100);
};

const getGemClassification = (gemScore: number): string => {
  if (gemScore >= 85) return "🌟 Hidden Gem";
  if (gemScore >= 70) return "💎 Micro Gem";
  if (gemScore >= 55) return "✨ Early Find";
  return "📊 Standard";
};

export const analyzeCoin = async (
  name: string,
  priceChange: number,
  marketCap: number,
  volume: number,
  coinData?: CoinDetails
): Promise<CoinAnalysis> => {
  try {
    // Only analyze coins under $10M market cap
    if (marketCap > 10000000) {
      throw new Error("Market cap too high for gem analysis");
    }

    const gemScore = calculateGemScore(marketCap, volume, priceChange);
    const gemClass = getGemClassification(gemScore);
    
    const volumeToMcap = volume / marketCap;
    const liquidityScore = Math.min(volumeToMcap * 100, 100);
    
    const analysis: CoinAnalysis = {
      gemScore,
      gemClassification: gemClass,
      marketMetrics: {
        mcapRank: marketCap < 1000000 ? "Micro Cap" : marketCap < 5000000 ? "Low Cap" : "Mid Cap",
        volumeQuality: liquidityScore > 50 ? "High" : liquidityScore > 20 ? "Medium" : "Low",
        momentum: priceChange > 20 ? "Strong" : priceChange > 0 ? "Positive" : "Negative"
      },
      keyMetrics: {
        marketCap: `$${(marketCap / 1000000).toFixed(2)}M`,
        volume24h: `$${(volume / 1000).toFixed(0)}K`,
        volumeToMcap: `${(volumeToMcap * 100).toFixed(1)}%`
      },
      riskLevel: marketCap < 1000000 ? "Very High" : marketCap < 5000000 ? "High" : "Medium",
      recommendation: generateRecommendation(name, marketCap, priceChange, volume, gemScore),
      potentialCatalysts: identifyCatalysts(coinData, priceChange, gemScore),
      riskFactors: identifyRiskFactors(marketCap, volume, priceChange),
      technicalAnalysis: generateTechnicalAnalysis(priceChange, volume, marketCap),
      communityInsight: analyzeCommunityGrowth(coinData),
      investmentHorizon: determineInvestmentHorizon(gemScore, marketCap),
      interestScore: calculateInterestScore(volume, marketCap, priceChange),
      twitterHandle: coinData?.links?.twitter_screen_name,
      coingeckoUrl: coinData?.id ? `https://www.coingecko.com/en/coins/${coinData.id}` : undefined,
      communityMetrics: analyzeCommunityMetrics(coinData)
    };

    return analysis;
  } catch (error) {
    console.error("Error analyzing coin:", error);
    toast.error("Failed to analyze coin data");
    throw error;
  }
};

const generateRecommendation = (
  name: string,
  marketCap: number,
  priceChange: number,
  volume: number,
  gemScore: number
): string => {
  const mcapInMillions = marketCap / 1000000;
  const volumeToMcap = volume / marketCap;
  
  if (gemScore >= 85) {
    return `${name} shows exceptional potential as a micro-cap gem with only $${mcapInMillions.toFixed(2)}M mcap and strong ${volumeToMcap.toFixed(2)}x volume/mcap ratio. High risk, high potential.`;
  } else if (gemScore >= 70) {
    return `${name} presents an interesting early opportunity at $${mcapInMillions.toFixed(2)}M mcap. Monitor volume and community growth closely.`;
  } else if (gemScore >= 55) {
    return `${name} shows promise but requires careful analysis. Current mcap: $${mcapInMillions.toFixed(2)}M. Watch for catalysts.`;
  }
  return `${name} appears stable but may lack immediate growth catalysts. DYOR.`;
};

const identifyCatalysts = (coinData: CoinDetails | undefined, priceChange: number, gemScore: number): string[] => {
  const catalysts: string[] = [];
  
  if (gemScore >= 70) {
    catalysts.push("High gem potential score");
  }
  
  if (priceChange > 20) {
    catalysts.push("Strong upward momentum");
  }
  
  if (coinData?.community_data?.twitter_followers && coinData.community_data.twitter_followers > 1000) {
    catalysts.push("Growing social presence");
  }
  
  if (coinData?.developer_data?.stars && coinData.developer_data.stars > 50) {
    catalysts.push("Active development");
  }
  
  return catalysts;
};

const identifyRiskFactors = (marketCap: number, volume: number, priceChange: number): string[] => {
  const risks: string[] = [];
  
  if (marketCap < 1000000) {
    risks.push("Extremely low market cap - high manipulation risk");
  }
  
  if (volume < marketCap * 0.1) {
    risks.push("Low trading volume relative to market cap");
  }
  
  if (Math.abs(priceChange) > 50) {
    risks.push("High price volatility");
  }
  
  return risks;
};

const generateTechnicalAnalysis = (priceChange: number, volume: number, marketCap: number): string => {
  const volumeToMcap = volume / marketCap;
  
  if (priceChange > 20 && volumeToMcap > 0.3) {
    return "Strong buying pressure with healthy volume. Watch for continuation.";
  } else if (priceChange < -20 && volumeToMcap > 0.3) {
    return "Heavy selling pressure. Consider waiting for stabilization.";
  }
  return "Neutral technical indicators. Monitor for breakout signals.";
};

const analyzeCommunityGrowth = (coinData?: CoinDetails): string => {
  const followers = coinData?.community_data?.twitter_followers || 0;
  
  if (followers > 10000) {
    return "Strong and established community presence";
  } else if (followers > 1000) {
    return "Growing community with potential for expansion";
  }
  return "Early-stage community. Growth opportunity.";
};

const determineInvestmentHorizon = (gemScore: number, marketCap: number): string => {
  if (marketCap < 1000000 && gemScore > 80) {
    return "Short to medium term - High risk, high reward potential";
  } else if (marketCap < 5000000 && gemScore > 60) {
    return "Medium term - Monitor for catalysts";
  }
  return "Long term - Requires patience and careful position management";
};

const calculateInterestScore = (volume: number, marketCap: number, priceChange: number): number => {
  const volumeScore = Math.min(volume / marketCap, 1) * 2;
  const priceScore = Math.min(Math.abs(priceChange) / 20, 1) * 2;
  const mcapScore = Math.max(0, 1 - (marketCap / 10000000)) * 1;
  
  return Math.min(volumeScore + priceScore + mcapScore, 5);
};

const analyzeCommunityMetrics = (coinData?: CoinDetails): { score: number; label: string } => {
  if (!coinData?.community_data) {
    return { score: 0, label: "Early Stage" };
  }
  
  const { twitter_followers, telegram_channel_user_count } = coinData.community_data;
  const socialScore = (twitter_followers || 0) / 1000 + (telegram_channel_user_count || 0) / 500;
  
  return {
    score: Math.min(socialScore, 100),
    label: socialScore > 50 ? "Strong" : socialScore > 20 ? "Growing" : "Early Stage"
  };
};