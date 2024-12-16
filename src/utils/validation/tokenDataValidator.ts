export const validateTokenData = (data: any): boolean => {
  if (!data) {
    console.log("Received null or undefined data");
    return false;
  }
  
  if (!data.pairs && !Array.isArray(data.pairs)) {
    console.log("Invalid pairs property in data:", data);
    return false;
  }
  
  return true;
};

export const validatePairData = (pair: any): boolean => {
  if (!pair || typeof pair !== 'object') {
    console.log("Invalid pair object:", pair);
    return false;
  }

  // Required fields validation
  const requiredFields = {
    'baseToken.address': pair.baseToken?.address,
    'baseToken.symbol': pair.baseToken?.symbol,
    'priceUsd': pair.priceUsd,
    'volume24h': pair.volume24h
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value)
    .map(([field]) => field);

  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields.join(', '));
    return false;
  }

  // Numeric validation
  const numericFields = {
    'volume24h': parseFloat(pair.volume24h),
    'priceChange24h': parseFloat(pair.priceChange24h || '0'),
    'fdv': parseFloat(pair.fdv || '0')
  };

  const invalidNumbers = Object.entries(numericFields)
    .filter(([_, value]) => isNaN(value))
    .map(([field]) => field);

  if (invalidNumbers.length > 0) {
    console.log("Invalid numeric values:", invalidNumbers.join(', '));
    return false;
  }

  return true;
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

  const invalidPoints = data.prices.filter((point: any) => 
    !Array.isArray(point) || 
    point.length !== 2 || 
    typeof point[0] !== 'number' || 
    typeof point[1] !== 'number'
  );

  if (invalidPoints.length > 0) {
    console.log("Invalid price points found:", invalidPoints);
    return false;
  }

  return true;
};