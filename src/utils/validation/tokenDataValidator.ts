export const validateTokenData = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    console.warn("Invalid data structure received");
    return false;
  }
  
  if (!Array.isArray(data.pairs)) {
    console.warn("Missing or invalid pairs array");
    return false;
  }
  
  return true;
};

export const validatePairData = (pair: any): boolean => {
  if (!pair || typeof pair !== 'object') {
    return false;
  }

  const requiredFields = ['baseToken', 'priceUsd', 'volume24h'];
  for (const field of requiredFields) {
    if (!(field in pair)) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }

  if (!pair.baseToken?.address || !pair.baseToken?.symbol) {
    console.warn("Missing required token information");
    return false;
  }

  return true;
};

export const validateMarketChartData = (data: any): boolean => {
  if (!data?.prices || !Array.isArray(data.prices)) {
    console.warn("Invalid market chart data structure");
    return false;
  }

  if (data.prices.length === 0) {
    console.warn("Empty price data");
    return false;
  }

  return data.prices.every((point: any) => 
    Array.isArray(point) && 
    point.length === 2 && 
    typeof point[0] === 'number' && 
    typeof point[1] === 'number'
  );
};