import { TokenData } from "@/types/token";
import { validateTokenData, validatePairData } from "../validation/tokenDataValidator";
import { toast } from "sonner";

const DEX_SCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens/SOL";

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
  }
];

export const fetchDexScreenerData = async (): Promise<TokenData[]> => {
  console.log("Attempting to fetch from DexScreener...");
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
    
    if (!validateTokenData(data)) {
      console.log("Invalid data structure, using backup data");
      toast.warning("Using backup data due to API issues", {
        description: "We're experiencing some temporary issues with our data provider."
      });
      return BACKUP_PAIRS;
    }
    
    const validPairs = data.pairs
      .filter(validatePairData)
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
      console.log("No valid pairs found, using backup data");
      toast.warning("Using backup data due to data quality issues", {
        description: "We're working on improving our data quality."
      });
      return BACKUP_PAIRS;
    }

    return validPairs;
  } catch (error) {
    console.error("Error fetching from DexScreener:", error);
    toast.error("Data fetch failed, using backup data", {
      description: "We'll retry fetching fresh data soon."
    });
    return BACKUP_PAIRS;
  }
};