import { TokenData, TrendingCoin } from "@/types/token";

const FALLBACK_API_URL = "https://api.coingecko.com/api/v3/search/trending";
const DEX_SCREENER_API_URL = "https://api.dexscreener.com/latest/dex/tokens/SOL";

export const fetchSolanaTokens = async (useFallback: boolean): Promise<TokenData[]> => {
  try {
    console.log("Attempting to fetch Solana tokens...");
    
    if (useFallback) {
      console.log("Using fallback API...");
      const response = await fetch(FALLBACK_API_URL);
      if (!response.ok) throw new Error("Fallback API failed");
      const data = await response.json();
      return data.coins.slice(0, 6).map((coin: TrendingCoin) => ({
        baseToken: {
          address: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
        },
        priceUsd: (coin.item.price_btc * 40000).toString(),
        volume24h: (coin.item.price_btc * 40000 * 1000000).toString(),
        priceChange24h: coin.item.data?.price_change_percentage_24h || 0,
        liquidity: { usd: 1000000 },
        fdv: coin.item.market_cap_rank * 1000000,
      }));
    }

    const response = await fetch(DEX_SCREENER_API_URL, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("DexScreener API Response:", data);
    
    if (!data?.pairs || data.pairs.length === 0) {
      console.log("No valid data from primary API, switching to fallback");
      throw new Error("No valid data from primary API");
    }
    
    return data.pairs
      .filter((pair: any) => {
        const fdv = parseFloat(pair.fdv);
        const volume = parseFloat(pair.volume24h);
        return fdv && fdv < 10000000 && volume > 1000;
      })
      .sort((a: any, b: any) => parseFloat(b.volume24h) - parseFloat(a.volume24h))
      .slice(0, 6);
  } catch (error) {
    console.error("Error fetching Solana tokens:", error);
    throw error;
  }
};