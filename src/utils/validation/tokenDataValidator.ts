export const validateTokenData = (data: any): boolean => {
  if (!data) {
    console.warn("Received null or undefined data");
    return false;
  }
  
  if (!('pairs' in data)) {
    console.warn("Missing pairs property in data:", data);
    return false;
  }
  
  return true;
};

export const validatePairData = (pair: any): boolean => {
  if (!pair || typeof pair !== 'object') {
    console.warn("Invalid pair object:", pair);
    return false;
  }

  // Required fields with fallbacks
  if (!pair.baseToken?.address) {
    console.warn("Missing baseToken or address:", pair);
    return false;
  }

  // Ensure numeric fields have valid defaults
  const numericFields = ['volume24h', 'priceChange24h', 'fdv', 'priceUsd'];
  numericFields.forEach(field => {
    const value = parseFloat(pair[field] || '0');
    if (isNaN(value)) {
      console.warn(`Invalid ${field} value in pair, using default:`, pair);
      pair[field] = '0';
    }
  });

  // Ensure required objects exist
  if (!pair.baseToken.symbol) {
    pair.baseToken.symbol = "UNKNOWN";
  }
  
  if (!pair.baseToken.name) {
    pair.baseToken.name = pair.baseToken.symbol;
  }

  if (!pair.liquidity) {
    pair.liquidity = { usd: 0 };
  }

  return true;
};

export const validateMarketChartData = (data: any): boolean => {
  if (!data?.prices || !Array.isArray(data.prices)) {
    console.warn("Invalid market chart data structure:", data);
    return false;
  }

  if (data.prices.length === 0) {
    console.warn("Empty prices array in market chart data");
    return false;
  }

  const isValidPoint = (point: any) => 
    Array.isArray(point) && 
    point.length === 2 && 
    typeof point[0] === 'number' && 
    typeof point[1] === 'number';

  const [first, last] = [data.prices[0], data.prices[data.prices.length - 1]];
  if (!isValidPoint(first) || !isValidPoint(last)) {
    console.warn("Invalid price point structure:", { first, last });
    return false;
  }

  return true;
};