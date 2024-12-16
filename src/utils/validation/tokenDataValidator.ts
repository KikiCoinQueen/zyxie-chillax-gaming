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
  const hasRequiredFields = 
    pair.baseToken?.address && 
    pair.baseToken?.name && 
    pair.baseToken?.symbol &&
    pair.priceUsd &&
    pair.volume24h;

  const fdv = parseFloat(pair.fdv);
  const volume = parseFloat(pair.volume24h);
  
  return hasRequiredFields && 
         !isNaN(fdv) && 
         !isNaN(volume) && 
         fdv < 10000000 && 
         volume > 1000;
};

export const validateMarketChartData = (data: any): boolean => {
  if (!data?.prices || !Array.isArray(data.prices)) {
    console.log("Invalid market chart data structure:", data);
    return false;
  }
  return true;
};