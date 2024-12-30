import { pipeline } from "@huggingface/transformers";

export interface TokenAnalysis {
  symbol: string;
  riskScore: number;
  sentiment: string;
  recommendation: string;
  confidence: number;
  momentum: number;
  socialScore: number;
  priceChange: number;
  volume: number;
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
  
  // Enhanced risk calculation with weighted factors
  const volumeWeight = 0.3;
  const volatilityWeight = 0.4;
  const liquidityWeight = 0.3;
  
  return (
    (volumeScore * volumeWeight) +
    (volatilityScore * volatilityWeight) +
    (liquidityScore * liquidityWeight)
  );
};

export const calculateMomentum = (token: any): number => {
  const priceChange = token.priceChange24h;
  const volume = parseFloat(token.volume24h);
  const volumeScore = Math.min(volume / 1000000, 5);
  const priceScore = Math.min(Math.abs(priceChange) / 20, 5);
  
  // Enhanced momentum calculation with trend consideration
  const trendMultiplier = priceChange > 0 ? 1.2 : 0.8;
  return Math.min((priceScore * volumeScore * trendMultiplier), 5);
};

export const calculateSocialScore = (token: any): number => {
  // Enhanced social score with multiple factors
  const baseScore = Math.random() * 3; // Base random score (0-3)
  const volumeBonus = Math.min(parseFloat(token.volume24h) / 1000000, 1); // Volume bonus (0-1)
  const priceBonus = token.priceChange24h > 0 ? 1 : 0; // Price trend bonus
  
  return Math.min(baseScore + volumeBonus + priceBonus, 5);
};

export const generateRecommendation = (
  riskScore: number,
  sentiment: string,
  momentum: number
): string => {
  // Enhanced recommendation logic with more detailed analysis
  if (riskScore > 4) {
    if (sentiment === "POSITIVE" && momentum > 3) {
      return "Strong momentum with high risk - Consider small position 🚀";
    }
    return "High risk detected - Careful analysis required ⚠️";
  }
  
  if (momentum > 4) {
    if (sentiment === "POSITIVE") {
      return "Strong bullish momentum detected 📈";
    }
    return "High volatility - Monitor closely 👀";
  }
  
  if (riskScore < 2 && sentiment === "POSITIVE") {
    return "Lower risk opportunity - Consider entry 🎯";
  }
  
  if (sentiment === "NEGATIVE") {
    return "Bearish signals detected - Caution advised 🔻";
  }
  
  return "Neutral market conditions - Monitor trends 📊";
};