import { pipeline } from "@huggingface/transformers";

export interface TokenAnalysis {
  symbol: string;
  riskScore: number;
  sentiment: string;
  recommendation: string;
  confidence: number;
  momentum: number;
  socialScore: number;
}

export interface ClassificationResult {
  label: string;
  score: number;
}

export const initializeClassifier = async () => {
  return await pipeline(
    "text-classification",
    "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
    { device: "webgpu" }
  );
};

export const calculateRiskScore = (token: any): number => {
  const volumeScore = Math.min(parseFloat(token.volume24h) / 100000, 5);
  const volatilityScore = Math.min(Math.abs(token.priceChange24h) / 20, 5);
  const liquidityScore = Math.min(token.liquidity?.usd / 50000, 5) || 0;
  return (volumeScore + volatilityScore + liquidityScore) / 3;
};

export const calculateMomentum = (token: any): number => {
  const priceChange = token.priceChange24h;
  const volume = parseFloat(token.volume24h);
  return Math.min((Math.abs(priceChange) * volume) / 1000000, 5);
};

export const calculateSocialScore = (token: any): number => {
  // Placeholder for social score calculation
  // In a real implementation, this would use social media API data
  return Math.random() * 5;
};

export const generateRecommendation = (
  riskScore: number,
  sentiment: string,
  momentum: number
): string => {
  if (riskScore > 4 && sentiment === "POSITIVE" && momentum > 3) {
    return "Strong Buy Signal 🚀";
  } else if (riskScore > 3 && sentiment === "POSITIVE") {
    return "Consider Buying 📈";
  } else if (riskScore < 2 || sentiment === "NEGATIVE") {
    return "High Risk - Caution ⚠️";
  }
  return "Monitor Closely 👀";
};