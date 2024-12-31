import { toast } from "sonner";

const calculateGemScore = (marketCap: number, volume: number, priceChange: number): number => {
  // Lower market cap (under $10M) gets higher score
  const mcapScore = Math.max(0, 1 - (marketCap / 10000000)) * 40;
  
  // Higher volume relative to mcap is better
  const volumeToMcap = volume / marketCap;
  const volumeScore = Math.min(volumeToMcap * 100, 30);
  
  // Price momentum
  const momentumScore = Math.min(Math.max(priceChange, -100), 100) / 3.33;
  
  return Math.min(mcapScore + volumeScore + momentumScore, 100);
};

const getGemClassification = (gemScore: number): string => {
  if (gemScore >= 80) return "🌟 Hidden Gem";
  if (gemScore >= 60) return "💎 Potential Gem";
  if (gemScore >= 40) return "✨ Promising";
  return "📊 Standard";
};

export const analyzeCoin = async (
  name: string,
  priceChange: number,
  marketCap: number,
  volume: number,
  coinData?: any
): Promise<CoinAnalysis> => {
  try {
    const gemScore = calculateGemScore(marketCap, volume, priceChange);
    const gemClass = getGemClassification(gemScore);
    
    const volumeToMcap = volume / marketCap;
    const liquidityScore = Math.min(volumeToMcap * 100, 100);
    
    const analysis = {
      gemScore,
      gemClassification: gemClass,
      marketMetrics: {
        mcapRank: marketCap < 1000000 ? "Micro Cap" : marketCap < 10000000 ? "Low Cap" : "Mid Cap",
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
  
  let analysis = `${name} `;
  
  if (gemScore >= 80) {
    analysis += `shows exceptional potential with a ${mcapInMillions.toFixed(2)}M market cap and strong ${volumeToMcap.toFixed(2)}x volume/mcap ratio. Consider for high-risk allocation.`;
  } else if (gemScore >= 60) {
    analysis += `presents interesting opportunities at ${mcapInMillions.toFixed(2)}M mcap. Monitor volume and community growth.`;
  } else if (gemScore >= 40) {
    analysis += `shows some promise but requires careful analysis. Current mcap: ${mcapInMillions.toFixed(2)}M.`;
  } else {
    analysis += `appears stable but may lack immediate growth catalysts. DYOR.`;
  }
  
  return analysis;
};

const identifyCatalysts = (coinData: any, priceChange: number, gemScore: number): string[] => {
  const catalysts: string[] = [];
  
  if (gemScore >= 60) {
    catalysts.push("High gem potential score");
  }
  
  if (priceChange > 20) {
    catalysts.push("Strong price momentum");
  }
  
  if (coinData?.community_data?.twitter_followers > 10000) {
    catalysts.push("Active social presence");
  }
  
  if (coinData?.developer_data?.stars > 100) {
    catalysts.push("Active development");
  }
  
  return catalysts;
};

const analyzeCommunityMetrics = (coinData: any): any => {
  if (!coinData?.community_data) return { score: 0, label: "No data" };
  
  const { twitter_followers, telegram_channel_user_count } = coinData.community_data;
  const socialScore = (twitter_followers || 0) / 1000 + (telegram_channel_user_count || 0) / 500;
  
  return {
    score: Math.min(socialScore, 100),
    label: socialScore > 50 ? "Strong" : socialScore > 20 ? "Growing" : "Early"
  };
};

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
  communityMetrics: {
    score: number;
    label: string;
  };
}