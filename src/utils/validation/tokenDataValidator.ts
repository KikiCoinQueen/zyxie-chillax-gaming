export const validateTokenData = (data: any): boolean => {
  if (!data) {
    console.log("Received null or undefined data");
    return false;
  }
  
  if (!data.pairs) {
    console.log("No pairs property in data:", data);
    return false;
  }
  
  if (!Array.isArray(data.pairs)) {
    console.log("Pairs is not an array:", data.pairs);
    return false;
  }
  
  if (data.pairs.length === 0) {
    console.log("Empty pairs array received");
    return false;
  }
  
  return true;
};

export const validatePairData = (pair: any): boolean => {
  if (!pair || typeof pair !== 'object') {
    console.log("Invalid pair object:", pair);
    return false;
  }

  const hasRequiredFields = 
    pair.baseToken?.address && 
    typeof pair.baseToken?.address === 'string' &&
    pair.priceUsd &&
    pair.volume24h;

  if (!hasRequiredFields) {
    console.log("Missing required fields in pair:", pair);
    return false;
  }

  const fdv = parseFloat(pair.fdv);
  const volume = parseFloat(pair.volume24h);
  
  if (isNaN(fdv) || isNaN(volume)) {
    console.log("Invalid numeric values in pair:", { fdv, volume });
    return false;
  }
  
  return fdv < 10000000 && volume > 1000;
};

export const validateMarketChartData = (data: any): boolean => {
  if (!data?.prices || !Array.isArray(data.prices)) {
    console.log("Invalid market chart data structure:", data);
    return false;
  }

  if (data.prices.length === 0) {
    console.log("Empty prices array in market chart data");
    return false;
  }

  const hasValidPricePoints = data.prices.every((point: any) => 
    Array.isArray(point) && 
    point.length === 2 && 
    typeof point[0] === 'number' && 
    typeof point[1] === 'number'
  );

  if (!hasValidPricePoints) {
    console.log("Invalid price points in market chart data");
    return false;
  }

  return true;
};