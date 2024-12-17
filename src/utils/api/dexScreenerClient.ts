import { TokenData } from "@/types/token";
import { validateTokenData, validatePairData } from "../validation/tokenDataValidator";
import { fetchBackupData } from "./backupDataFetcher";
import { 
  getCachedData, 
  setCachedData, 
  handleApiError,
  fetchWithTimeout,
  retryWithExponentialBackoff
} from "./apiHelpers";

const DEX_SCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens/SOL";
let lastSuccessfulResponse: TokenData[] | null = null;
let lastFetchTime: number | null = null;

export const fetchDexScreenerData = async (): Promise<TokenData[]> => {
  console.log("Attempting to fetch from DexScreener...");
  
  const cachedData = getCachedData<TokenData[]>("dexscreener");
  if (cachedData) {
    console.log("Using cached data");
    return cachedData;
  }
  
  try {
    const response = await retryWithExponentialBackoff(async () => {
      const res = await fetchWithTimeout(DEX_SCREENER_API_URL, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("DexScreener API error response:", errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res;
    });
    
    const data = await response.json();
    console.log("DexScreener API response:", data);
    
    if (!validateTokenData(data)) {
      console.warn("Invalid data structure from DexScreener, attempting fallback");
      return await fetchBackupData();
    }
    
    const validPairs = data.pairs
      ?.filter((pair: any) => {
        try {
          return validatePairData(pair) && 
                 parseFloat(pair.volume24h) > 1000 && 
                 parseFloat(pair.fdv) < 10000000;
        } catch (error) {
          console.error("Error validating pair:", error);
          return false;
        }
      })
      .sort((a: any, b: any) => parseFloat(b.volume24h) - parseFloat(a.volume24h))
      .slice(0, 6)
      .map((pair: any) => ({
        baseToken: {
          address: pair.baseToken.address,
          name: pair.baseToken.name || "Unknown Token",
          symbol: pair.baseToken.symbol || "???",
        },
        priceUsd: pair.priceUsd || "0.00",
        volume24h: pair.volume24h || "0",
        priceChange24h: parseFloat(pair.priceChange24h || "0"),
        liquidity: { usd: pair.liquidity?.usd || 0 },
        fdv: parseFloat(pair.fdv || "0"),
      }));

    if (!validPairs?.length) {
      console.warn("No valid pairs found after filtering");
      return await fetchBackupData();
    }

    lastSuccessfulResponse = validPairs;
    lastFetchTime = Date.now();
    setCachedData("dexscreener", validPairs);
    
    console.log("Successfully fetched and processed pairs:", validPairs.length);
    return validPairs;
  } catch (error) {
    handleApiError(error, "DexScreener");
    
    if (lastSuccessfulResponse && lastFetchTime && 
        (Date.now() - lastFetchTime) < 30000) {
      console.log("Using cached data due to API error");
      return lastSuccessfulResponse;
    }
    
    return await fetchBackupData();
  }
};