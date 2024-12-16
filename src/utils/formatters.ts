export const formatPercentage = (value: number | undefined | null): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'N/A';
  }
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatMarketCap = (value: number | undefined | null): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'N/A';
  }
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export const getSentimentColor = (sentiment?: number): string => {
  if (!sentiment) return 'text-muted-foreground';
  if (sentiment >= 70) return 'text-green-500';
  if (sentiment >= 40) return 'text-yellow-500';
  return 'text-red-500';
};

export const getCommunityScore = (score?: number): string => {
  if (!score) return 'Low';
  if (score >= 80) return 'Very High';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};