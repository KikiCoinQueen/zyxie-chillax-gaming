export const validateTokenData = (data: any): boolean => {
  if (!data) {
    console.error("Received null or undefined data");
    return false;
  }
  
  if (!('pairs' in data)) {
    console.error("Missing pairs property in data:", data);
    return false;
  }
  
  // Allow null pairs, we'll handle that in the client
  return true;
};

export const validatePairData = (pair: any): boolean => {
  if (!pair || typeof pair !== 'object') {
    console.error("Invalid pair object:", pair);
    return false;
  }

  // Required fields
  if (!pair.baseToken?.address) {
    console.error("Missing baseToken or address:", pair);
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

  return true;
};

export const validateMarketChartData = (data: any): boolean => {
  if (!data?.prices || !Array.isArray(data.prices)) {
    console.error("Invalid market chart data structure:", data);
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

  // Check first and last points
  const [first, last] = [data.prices[0], data.prices[data.prices.length - 1]];
  if (!isValidPoint(first) || !isValidPoint(last)) {
    console.error("Invalid price point structure:", { first, last });
    return false;
  }

  return true;
};