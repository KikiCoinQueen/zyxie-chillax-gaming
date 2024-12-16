export const calculateOpportunityScore = (
  volume24h: string,
  priceChange24h: number,
  fdv: number
) => {
  // Volume score (0-5): Higher volume is better
  const volumeScore = Math.min(parseFloat(volume24h) / 100000, 5);
  
  // Price momentum score (0-5): Based on 24h change
  const priceScore = Math.min(Math.abs(priceChange24h) / 10, 5);
  
  // Social/Market score (0-5): Lower FDV suggests more room for growth
  const socialScore = Math.min((10000000 - fdv) / 1000000, 5);
  
  return {
    volumeScore,
    socialScore,
    priceScore,
    total: (volumeScore + socialScore + priceScore) / 3
  };
};