import { TokenData } from "@/types/token";
import { validateTokenData, validatePairData } from "../validation/tokenDataValidator";

const DEX_SCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens/SOL";

export const fetchDexScreenerData = async (): Promise<TokenData[]> => {
  console.log("Attempting to fetch from DexScreener...");
  try {
    const response = await fetch(DEX_SCREENER_API_URL, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`DexScreener API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("DexScreener API response:", data);
    
    if (!validateTokenData(data)) {
      throw new Error("Invalid data structure from DexScreener");
    }
    
    return data.pairs
      .filter(validatePairData)
      .sort((a: any, b: any) => parseFloat(b.volume24h) - parseFloat(a.volume24h))
      .slice(0, 6)
      .map((pair: any) => ({
        baseToken: {
          address: pair.baseToken.address,
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol,
        },
        priceUsd: pair.priceUsd,
        volume24h: pair.volume24h,
        priceChange24h: parseFloat(pair.priceChange24h),
        liquidity: { usd: pair.liquidity.usd },
        fdv: parseFloat(pair.fdv),
      }));
  } catch (error) {
    console.error("Error fetching from DexScreener:", error);
    throw error;
  }
};