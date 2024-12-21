import { pipeline } from "@huggingface/transformers";

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
    const classifier = await pipeline(
      "text-classification",
      "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
      { device: "webgpu" }
    );

    const analysisText = `${name} has a price change of ${priceChange}% with market cap of ${marketCap} and volume of ${volume}`;
    const result = await classifier(analysisText);
    const sentiment = Array.isArray(result) ? result[0].score : 0;

    // Simple rule-based analysis
    const riskLevel = getRiskLevel(marketCap, volume, priceChange);
    const recommendation = getRecommendation(sentiment, riskLevel);
    const marketTrend = getMarketTrend(priceChange, volume);

    return {
      sentiment,
      riskLevel,
      recommendation,
      creationDate: estimateCreationDate(marketCap, volume),
      marketTrend
    };
  } catch (error) {
    console.error("Error analyzing coin:", error);
    return {
      sentiment: 0,
      riskLevel: "Unknown",
      recommendation: "Unable to analyze",
      creationDate: "Unknown",
      marketTrend: "Neutral"
    };
  }
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
  // Simple heuristic based on market cap and volume
  const today = new Date();
  if (marketCap < 1000000 && volume < 10000) {
    return "Last 7 days";
  } else if (marketCap < 5000000 && volume < 50000) {
    return "Last 30 days";
  } else if (marketCap < 10000000) {
    return "Last 90 days";
  }
  return "Over 90 days";
};