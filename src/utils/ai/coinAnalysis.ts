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
    
    return {
      sentiment,
      riskLevel,
      recommendation: generateSmartRecommendation(name, marketCap, priceChange, volume, coinData),
      marketTrend: getDetailedMarketTrend(priceChange, volume, marketCap),
      creationDate: getExactCreationDate(coinData?.genesis_date),
      twitterHandle: coinData?.links?.twitter_screen_name,
      coingeckoUrl: `https://www.coingecko.com/en/coins/${coinData?.id}`,
      interestScore
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
      interestScore: 0
    };
  }
};

const calculateSentiment = (priceChange: number, volume: number, marketCap: number): number => {
  const priceImpact = Math.min(Math.abs(priceChange) / 100, 1) * (priceChange > 0 ? 1 : -1);
  const volumeImpact = Math.min(volume / 1000000, 1);
  const marketCapImpact = Math.min(marketCap / 1000000000, 1);

  const rawSentiment = (
    (priceImpact * 0.5) + 
    (volumeImpact * 0.3) + 
    (marketCapImpact * 0.2)
  );

  return (rawSentiment + 1) / 2;
};

const getRiskLevel = (marketCap: number, volume: number, priceChange: number): string => {
  if (marketCap < 1000000 || Math.abs(priceChange) > 50) return "Very High";
  if (marketCap < 5000000 || Math.abs(priceChange) > 30) return "High";
  if (marketCap < 10000000 || Math.abs(priceChange) > 20) return "Medium";
  return "Low";
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
  const potentialRetrace = mcapInMillions * 0.8; // 20% retrace target
  
  let analysis = `${name} is ${coinData?.categories?.join(', ') || 'a crypto'} project `;
  
  // Add project description if available
  if (coinData?.description?.en) {
    const description = coinData.description.en.split('.')[0];
    analysis += `focusing on ${description}. `;
  }
  
  // Market cap analysis
  if (marketCap < 5000000) {
    analysis += `At just $${mcapInMillions.toFixed(2)}M market cap, this is a very early-stage project. `;
  } else if (marketCap < 20000000) {
    analysis += `With a $${mcapInMillions.toFixed(2)}M market cap, there's still room for growth. `;
  }
  
  // Volume analysis
  if (dailyVolRatio > 0.3) {
    analysis += `High trading activity (${(dailyVolRatio * 100).toFixed(1)}% of mcap) indicates strong interest. `;
  }
  
  // Price action analysis
  if (priceChange > 20) {
    analysis += `After a ${priceChange.toFixed(1)}% surge, consider waiting for a retrace to $${potentialRetrace.toFixed(2)}M mcap. `;
  } else if (priceChange < -20) {
    analysis += `Currently down ${Math.abs(priceChange).toFixed(1)}%, could be a good entry if fundamentals check out. `;
  }
  
  // Social metrics if available
  if (coinData?.community_data) {
    const { twitter_followers, telegram_channel_user_count } = coinData.community_data;
    if (twitter_followers > 10000 || telegram_channel_user_count > 5000) {
      analysis += `Strong social presence with ${twitter_followers?.toLocaleString() || 0} Twitter followers. `;
    }
  }
  
  // Development activity if available
  if (coinData?.developer_data?.stars > 100) {
    analysis += `Active development with ${coinData.developer_data.stars} GitHub stars. `;
  }
  
  // Risk assessment
  const riskLevel = getRiskLevel(marketCap, volume, priceChange);
  analysis += `Risk level: ${riskLevel}. `;
  
  // Trading suggestion
  if (riskLevel === "Very High") {
    analysis += "Only trade with funds you can afford to lose completely.";
  } else if (riskLevel === "High") {
    analysis += "Consider small position sizes and strict stop losses.";
  } else {
    analysis += "Standard risk management rules apply.";
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