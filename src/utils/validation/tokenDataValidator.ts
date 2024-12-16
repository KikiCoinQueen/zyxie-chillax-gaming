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
  
  // Allow empty arrays but log them
  if (data.pairs.length === 0) {
    console.log("Empty pairs array received");
    return true;
  }
  
  return true;
};

export const validatePairData = (pair: any): boolean => {
  if (!pair || typeof pair !== 'object') {
    console.log("Invalid pair object:", pair);
    return false;
  }

  // Check for required fields with detailed logging
  const requiredFields = {
    'baseToken.address': pair.baseToken?.address,
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

  // Validate numeric values
  const numericFields = {
    'fdv': parseFloat(pair.fdv),
    'volume24h': parseFloat(pair.volume24h),
    'priceChange24h': parseFloat(pair.priceChange24h || '0')
  };

  const invalidNumbers = Object.entries(numericFields)
    .filter(([_, value]) => isNaN(value))
    .map(([field]) => field);

  if (invalidNumbers.length > 0) {
    console.log("Invalid numeric values:", invalidNumbers.join(', '));
    return false;
  }

  // Business logic validation
  const fdv = numericFields.fdv;
  const volume = numericFields.volume24h;
  
  if (fdv >= 10000000) {
    console.log("FDV too high:", fdv);
    return false;
  }
  
  if (volume <= 1000) {
    console.log("Volume too low:", volume);
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