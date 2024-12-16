export const validateTokenData = (data: any): boolean => {
  if (!data) {
    console.error("Received null or undefined data");
    return false;
  }
  
  if (!Array.isArray(data.pairs)) {
    console.error("Invalid pairs property in data:", data);
    return false;
  }
  
  return true;
};

export const validatePairData = (pair: any): boolean => {
  if (!pair || typeof pair !== 'object') {
    console.error("Invalid pair object:", pair);
    return false;
  }

  // Required fields validation with detailed logging
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
    console.error("Missing required fields:", missingFields.join(', '));
    return false;
  }

  // Numeric validation with detailed logging
  const numericFields = {
    'volume24h': parseFloat(pair.volume24h),
    'priceChange24h': parseFloat(pair.priceChange24h || '0'),
    'fdv': parseFloat(pair.fdv || '0')
  };

  const invalidNumbers = Object.entries(numericFields)
    .filter(([_, value]) => isNaN(value))
    .map(([field]) => field);

  if (invalidNumbers.length > 0) {
    console.error("Invalid numeric values:", invalidNumbers.join(', '));
    return false;
  }

  // Additional validation for reasonable values
  if (parseFloat(pair.volume24h) < 0) {
    console.error("Invalid negative volume:", pair.volume24h);
    return false;
  }

  if (parseFloat(pair.priceUsd) < 0) {
    console.error("Invalid negative price:", pair.priceUsd);
    return false;
  }

  return true;
};

export const validateMarketChartData = (data: any): boolean => {
  if (!data?.prices || !Array.isArray(data.prices)) {
    console.error("Invalid market chart data structure:", data);
    return false;
  }

  if (data.prices.length === 0) {
    console.error("Empty prices array in market chart data");
    return false;
  }

  const invalidPoints = data.prices.filter((point: any) => 
    !Array.isArray(point) || 
    point.length !== 2 || 
    typeof point[0] !== 'number' || 
    typeof point[1] !== 'number'
  );

  if (invalidPoints.length > 0) {
    console.error("Invalid price points found:", invalidPoints);
    return false;
  }

  return true;
};