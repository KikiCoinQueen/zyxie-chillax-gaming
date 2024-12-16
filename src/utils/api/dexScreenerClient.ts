import { TokenData } from "@/types/token";
import { validateTokenData, validatePairData } from "../validation/tokenDataValidator";
import { toast } from "sonner";

const DEX_SCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens/SOL";
const BACKUP_API_URL = "https://api.coingecko.com/api/v3/search/trending";

// Enhanced backup data with more realistic values
const BACKUP_PAIRS = [
  {
    baseToken: {
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL"
    },
    priceUsd: "100.00",
    volume24h: "1000000",
    priceChange24h: 5.2,
    liquidity: { usd: 10000000 },
    fdv: 1000000
  },
  {
    baseToken: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      name: "USD Coin",
      symbol: "USDC"
    },
    priceUsd: "1.00",
    volume24h: "500000",
    priceChange24h: 0.1,
    liquidity: { usd: 5000000 },
    fdv: 500000
  }
];

// Cache management with shorter duration for more frequent updates
const CACHE_DURATION = 15000; // 15 seconds
let lastSuccessfulResponse: TokenData[] | null = null;
let lastFetchTime: number | null = null;

const isCacheValid = () => {
  return lastSuccessfulResponse && lastFetchTime && 
         (Date.now() - lastFetchTime) < CACHE_DURATION;
};

export const fetchDexScreenerData = async (): Promise<TokenData[]> => {
  console.log("Attempting to fetch from DexScreener...");
  
  // Check cache first
  if (isCacheValid()) {
    console.log("Using cached data");
    return lastSuccessfulResponse!;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout to 5 seconds

    const response = await fetch(DEX_SCREENER_API_URL, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`DexScreener API failed with status: ${response.status}`);
      throw new Error(`DexScreener API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("DexScreener API response:", data);
    
    if (!data || !data.pairs) {
      console.error("Invalid or empty response from DexScreener");
      throw new Error("Invalid data structure");
    }
    
    const validPairs = data.pairs
      .filter((pair: any) => {
        try {
          return validatePairData(pair) && 
                 parseFloat(pair.volume24h) > 1000 && // Minimum volume requirement
                 parseFloat(pair.fdv) < 10000000; // Maximum FDV requirement
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

    if (validPairs.length === 0) {
      console.warn("No valid pairs found after filtering");
      toast.warning("Limited market data available", {
        description: "Using alternative data sources"
      });
      return await fetchBackupData();
    }

    // Update cache
    lastSuccessfulResponse = validPairs;
    lastFetchTime = Date.now();
    
    console.log("Successfully fetched and processed pairs:", validPairs.length);
    return validPairs;
  } catch (error) {
    console.error("Error fetching from DexScreener:", error);
    
    // Use cache if available and not too old
    if (lastSuccessfulResponse && lastFetchTime && 
        (Date.now() - lastFetchTime) < CACHE_DURATION * 2) {
      toast.warning("Using cached data while refreshing", {
        description: "We're experiencing temporary API issues."
      });
      return lastSuccessfulResponse;
    }
    
    return await fetchBackupData();
  }
};

const fetchBackupData = async (): Promise<TokenData[]> => {
  try {
    console.log("Attempting to fetch backup data from CoinGecko...");
    const response = await fetch(BACKUP_API_URL);
    
    if (!response.ok) {
      throw new Error("Backup API failed");
    }
    
    const data = await response.json();
    if (!data?.coins || !Array.isArray(data.coins)) {
      throw new Error("Invalid backup data structure");
    }

    const backupTokens = data.coins
      .slice(0, 6)
      .map((coin: any) => ({
        baseToken: {
          address: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
        },
        priceUsd: (coin.item.price_btc * 40000).toString(), // Approximate USD value
        volume24h: (coin.item.price_btc * 40000 * 1000000).toString(),
        priceChange24h: coin.item.data?.price_change_percentage_24h || 0,
        liquidity: { usd: 1000000 }, // Default liquidity
        fdv: coin.item.market_cap_rank ? coin.item.market_cap_rank * 1000000 : 5000000,
      }));

    console.log("Successfully fetched backup data:", backupTokens.length);
    toast.info("Using backup data source", {
      description: "Primary API is temporarily unavailable."
    });
    
    return backupTokens;
  } catch (error) {
    console.error("Backup API also failed:", error);
    toast.error("Using fallback data", {
      description: "We're having trouble connecting to our data providers."
    });
    return BACKUP_PAIRS;
  }
};