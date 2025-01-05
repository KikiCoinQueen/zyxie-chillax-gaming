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
  const { pipeline } = await import("@huggingface/transformers");
  return pipeline(
    "text-classification",
    "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
    { device: "webgpu" }
  );
};

export const calculateRiskScore = (token: any): number => {
  const volume = parseFloat(token.volume24h);
  const priceChange = Math.abs(token.priceChange24h);
  const fdv = parseFloat(token.fdv);
  
  let score = 0;
  
  // Volume analysis (0-3 points)
  if (volume > 100000) score += 3;
  else if (volume > 50000) score += 2;
  else if (volume > 10000) score += 1;
  
  // Price volatility (0-3 points)
  if (priceChange > 50) score += 3;
  else if (priceChange > 20) score += 2;
  else if (priceChange > 10) score += 1;
  
  // Market cap analysis (0-4 points)
  if (fdv < 1000000) score += 4;
  else if (fdv < 5000000) score += 3;
  else if (fdv < 10000000) score += 2;
  else if (fdv < 50000000) score += 1;
  
  return score;
};

export const calculateMomentum = (token: any): number => {
  const priceChange = token.priceChange24h;
  const volume = parseFloat(token.volume24h);
  const baseScore = (priceChange + 100) / 200; // Normalize to 0-1
  const volumeMultiplier = Math.min(volume / 100000, 1); // Cap at 100k volume
  return baseScore * volumeMultiplier * 100;
};

export const calculateSocialScore = (token: any): number => {
  // This could be enhanced with real social media data
  const volume = parseFloat(token.volume24h);
  const priceChange = Math.abs(token.priceChange24h);
  
  let score = 0;
  
  // Volume-based social interest
  if (volume > 100000) score += 40;
  else if (volume > 50000) score += 30;
  else if (volume > 10000) score += 20;
  else score += 10;
  
  // Price action social interest
  if (priceChange > 50) score += 60;
  else if (priceChange > 20) score += 40;
  else if (priceChange > 10) score += 20;
  else score += 10;
  
  return Math.min(score, 100);
};

export const generateRecommendation = (
  riskScore: number,
  sentiment: string,
  momentum: number
): string => {
  if (riskScore > 8 && sentiment === "POSITIVE" && momentum > 70) {
    return "Strong Buy 🚀";
  } else if (riskScore > 6 && sentiment === "POSITIVE" && momentum > 50) {
    return "Buy 📈";
  } else if (riskScore < 3 || (sentiment === "NEGATIVE" && momentum < 30)) {
    return "Sell 📉";
  } else {
    return "Hold 🔄";
  }
};