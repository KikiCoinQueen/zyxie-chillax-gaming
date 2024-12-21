import { toast } from "sonner";

export interface CoinAnalysis {
  sentiment: number;
  riskLevel: string;
  recommendation: string;
  marketTrend: string;
  creationDate: string;
  twitterHandle?: string;
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
      recommendation: getRecommendation(name, sentiment, riskLevel, coinData),
      marketTrend: getDetailedMarketTrend(priceChange, volume, marketCap),
      creationDate: getExactCreationDate(coinData?.genesis_date),
      twitterHandle: coinData?.links?.twitter_screen_name,
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
  // Normalize values
  const priceImpact = Math.min(Math.abs(priceChange) / 100, 1) * (priceChange > 0 ? 1 : -1);
  const volumeImpact = Math.min(volume / 1000000, 1);
  const marketCapImpact = Math.min(marketCap / 1000000000, 1);

  // Weighted average
  const rawSentiment = (
    (priceImpact * 0.5) + 
    (volumeImpact * 0.3) + 
    (marketCapImpact * 0.2)
  );

  // Convert to 0-1 range
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

const getExactCreationDate = (genesisDate?: string): string => {
  if (!genesisDate) return "Creation date unknown";
  
  const date = new Date(genesisDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return `Created ${diffDays} days ago (${date.toLocaleDateString()})`;
};

const getRecommendation = (name: string, sentiment: number, risk: string, coinData?: any): string => {
  const marketCap = coinData?.market_data?.market_cap?.usd;
  const volume = coinData?.market_data?.total_volume?.usd;
  
  let analysis = `${name} shows `;
  
  if (sentiment > 0.8) {
    analysis += "strong positive momentum with ";
  } else if (sentiment > 0.6) {
    analysis += "moderate potential but ";
  } else {
    analysis += "concerning signals with ";
  }
  
  if (marketCap) {
    analysis += `a market cap of $${(marketCap / 1000000).toFixed(2)}M and `;
  }
  
  if (volume) {
    analysis += `daily volume of $${(volume / 1000).toFixed(2)}K. `;
  }
  
  analysis += risk === "High" 
    ? "Exercise extreme caution due to high volatility."
    : "Consider thorough research before investing.";
    
  return analysis;
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
