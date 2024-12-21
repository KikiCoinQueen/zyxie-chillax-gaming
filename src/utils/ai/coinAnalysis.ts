import { toast } from "sonner";

export interface CoinAnalysis {
  sentiment: number;
  riskLevel: string;
  recommendation: string;
  creationDate: string;
  marketTrend: string;
}

export const analyzeCoin = async (
  name: string,
  priceChange: number,
  marketCap: number,
  volume: number
): Promise<CoinAnalysis> => {
  try {
    // Simple rule-based sentiment analysis
    const sentiment = calculateSentiment(priceChange, volume, marketCap);
    const riskLevel = getRiskLevel(marketCap, volume, priceChange);
    
    return {
      sentiment,
      riskLevel,
      recommendation: getRecommendation(sentiment, riskLevel),
      creationDate: estimateCreationDate(marketCap, volume),
      marketTrend: getMarketTrend(priceChange, volume)
    };
  } catch (error) {
    console.error("Error analyzing coin:", error);
    toast.error("Failed to analyze coin, using fallback analysis");
    
    // Fallback analysis
    const fallbackSentiment = priceChange > 0 ? 0.75 : 0.25;
    const riskLevel = getRiskLevel(marketCap, volume, priceChange);
    
    return {
      sentiment: fallbackSentiment,
      riskLevel,
      recommendation: getRecommendation(fallbackSentiment, riskLevel),
      creationDate: estimateCreationDate(marketCap, volume),
      marketTrend: getMarketTrend(priceChange, volume)
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

const getRecommendation = (sentiment: number, risk: string): string => {
  if (sentiment > 0.8 && risk !== "Very High") return "Strong Potential";
  if (sentiment > 0.6 && risk !== "Very High") return "Worth Watching";
  if (sentiment > 0.4) return "DYOR";
  return "Caution";
};

const getMarketTrend = (priceChange: number, volume: number): string => {
  if (priceChange > 20 && volume > 100000) return "Strong Uptrend";
  if (priceChange > 10 && volume > 50000) return "Uptrend";
  if (priceChange < -20 && volume > 100000) return "Strong Downtrend";
  if (priceChange < -10 && volume > 50000) return "Downtrend";
  return "Sideways";
};

const estimateCreationDate = (marketCap: number, volume: number): string => {
  if (marketCap < 1000000 && volume < 10000) {
    return "Last 7 days";
  } else if (marketCap < 5000000 && volume < 50000) {
    return "Last 30 days";
  } else if (marketCap < 10000000) {
    return "Last 90 days";
  }
  return "Over 90 days";
};