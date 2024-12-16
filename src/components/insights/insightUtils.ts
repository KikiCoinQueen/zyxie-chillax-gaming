import { TokenInsight } from "./types";

export const calculateRiskScore = (token: TokenInsight): number => {
  const volumeScore = Math.min(parseFloat(token.volume24h) / 10000, 5);
  const liquidityScore = Math.min(token.liquidity.usd / 50000, 5);
  const volatilityScore = Math.min(Math.abs(token.priceChange24h) / 20, 5);
  
  return Math.round((volumeScore + liquidityScore + volatilityScore) / 3);
};

export const getRiskLabel = (score: number): string => {
  if (score <= 2) return "Low Risk";
  if (score <= 3) return "Medium Risk";
  return "High Risk";
};

export const getRiskColor = (score: number): string => {
  if (score <= 2) return "text-green-500";
  if (score <= 3) return "text-yellow-500";
  return "text-red-500";
};