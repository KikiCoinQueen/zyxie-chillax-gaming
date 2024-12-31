import { TokenData } from "@/types/token";
import { validateTokenData } from "../validation/tokenDataValidator";
import { toast } from "sonner";

const DEX_SCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens/SOL";
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

const fetchWithRetry = async (url: string, retries = MAX_RETRIES, delay = INITIAL_DELAY): Promise<Response> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const fetchDexScreenerData = async (): Promise<TokenData[]> => {
  try {
    console.log("Fetching from DexScreener...");
    const response = await fetchWithRetry(DEX_SCREENER_API_URL);
    const data = await response.json();
    
    if (!validateTokenData(data)) {
      throw new Error("Invalid data structure from DexScreener");
    }
    
    return data.pairs
      .filter((pair: any) => {
        const volume = parseFloat(pair.volume24h);
        const fdv = parseFloat(pair.fdv);
        // Only include pairs with:
        // - Volume > $10k
        // - FDV < $100M
        // - FDV > $10k (filter out dead tokens)
        return !isNaN(volume) && 
               !isNaN(fdv) && 
               volume > 10000 && 
               fdv < 100000000 &&
               fdv > 10000;
      })
      .map((pair: any) => ({
        baseToken: {
          address: pair.baseToken.address,
          name: pair.baseToken.name || pair.baseToken.symbol || "Unknown Token",
          symbol: pair.baseToken.symbol?.toUpperCase() || "???",
        },
        priceUsd: pair.priceUsd || "0",
        volume24h: pair.volume24h || "0",
        priceChange24h: parseFloat(pair.priceChange24h || "0"),
        liquidity: { usd: pair.liquidity?.usd || 0 },
        fdv: parseFloat(pair.fdv || "0"),
      }))
      .slice(0, 6);
  } catch (error) {
    console.error("DexScreener fetch failed:", error);
    toast.error("Failed to fetch from primary source", {
      description: "Switching to backup data source"
    });
    throw error;
  }
};