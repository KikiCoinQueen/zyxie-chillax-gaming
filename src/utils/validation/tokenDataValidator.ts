export const validateTokenData = (data: any): boolean => {
  if (!data) {
    console.error("Received null or undefined data");
    return false;
  }
  
  // Check if data has the pairs property
  if (!('pairs' in data)) {
    console.error("Missing pairs property in data:", data);
    return false;
  }
  
  // Allow null pairs, as we'll handle that in the client
  return true;
};

export const validatePairData = (pair: any): boolean => {
  if (!pair || typeof pair !== 'object') {
    console.error("Invalid pair object:", pair);
    return false;
  }

  // Check for minimum required data
  if (!pair.baseToken || !pair.baseToken.address) {
    console.error("Missing baseToken or address:", pair);
    return false;
  }

  // Allow missing or invalid numeric values, we'll handle them with defaults
  const volume = parseFloat(pair.volume24h || '0');
  const priceChange = parseFloat(pair.priceChange24h || '0');
  const fdv = parseFloat(pair.fdv || '0');

  if (isNaN(volume) || isNaN(priceChange) || isNaN(fdv)) {
    console.warn("Invalid numeric values in pair, using defaults:", {
      volume,
      priceChange,
      fdv
    });
  }

  return true;
};

export const validateMarketChartData = (data: any): boolean => {
  if (!data) {
    console.error("Received null or undefined market chart data");
    return false;
  }

  if (!data.prices || !Array.isArray(data.prices)) {
    console.error("Invalid market chart data structure:", data);
    return false;
  }

  if (data.prices.length === 0) {
    console.warn("Empty prices array in market chart data");
    return false;
  }

  // Check first and last points to validate structure
  const [first, last] = [data.prices[0], data.prices[data.prices.length - 1]];
  const isValidPoint = (point: any) => 
    Array.isArray(point) && 
    point.length === 2 && 
    typeof point[0] === 'number' && 
    typeof point[1] === 'number';

  if (!isValidPoint(first) || !isValidPoint(last)) {
    console.error("Invalid price point structure:", { first, last });
    return false;
  }

  return true;
};