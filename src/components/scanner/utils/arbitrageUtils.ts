export const calculateProfitPotential = (price1: number, price2: number) => {
  const priceDiff = Math.abs(price1 - price2);
  const avgPrice = (price1 + price2) / 2;
  const percentage = (priceDiff / avgPrice) * 100;
  
  // Estimate profit for a $1000 trade
  const tradeAmount = 1000;
  const estimatedProfit = (tradeAmount * percentage) / 100;

  return {
    percentage,
    estimatedProfit,
    buyAt: price1 < price2 ? 1 : 2,
    sellAt: price1 < price2 ? 2 : 1
  };
};