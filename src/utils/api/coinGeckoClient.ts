import { TokenData, TrendingCoin } from "@/types/token";
import { validateMarketChartData } from "../validation/tokenDataValidator";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const mapTrendingCoinsToTokens = (coins: TrendingCoin[]): TokenData[] => {
  return coins.slice(0, 6).map((coin: TrendingCoin) => ({
    baseToken: {
      address: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
    },
    priceUsd: (coin.item.price_btc * 40000).toString(),
    volume24h: (coin.item.price_btc * 40000 * 1000000).toString(),
    priceChange24h: coin.item.data?.price_change_percentage_24h || 0,
    liquidity: { usd: 1000000 },
    fdv: coin.item.market_cap_rank ? coin.item.market_cap_rank * 1000000 : 5000000,
  }));
};

export const fetchCoinGeckoData = async (): Promise<TokenData[]> => {
  console.log("Fetching from CoinGecko fallback...");
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/search/trending`, {
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data?.coins || !Array.isArray(data.coins)) {
      throw new Error("Invalid data from CoinGecko API");
    }

    const coinIds = data.coins.map((coin: TrendingCoin) => coin.item.id).join(',');
    const priceResponse = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24h_vol=true&include_24h_change=true`,
      {
        signal: AbortSignal.timeout(10000)
      }
    );
    
    if (!priceResponse.ok) {
      return mapTrendingCoinsToTokens(data.coins);
    }
    
    const priceData = await priceResponse.json();
    
    return data.coins.slice(0, 6).map((coin: TrendingCoin) => ({
      baseToken: {
        address: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
      },
      priceUsd: priceData[coin.item.id]?.usd?.toString() || (coin.item.price_btc * 40000).toString(),
      volume24h: priceData[coin.item.id]?.usd_24h_vol?.toString() || 
                (coin.item.price_btc * 40000 * 1000000).toString(),
      priceChange24h: priceData[coin.item.id]?.usd_24h_change || 
                     coin.item.data?.price_change_percentage_24h || 0,
      liquidity: { usd: 1000000 },
      fdv: coin.item.market_cap_rank ? coin.item.market_cap_rank * 1000000 : 5000000,
    }));
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error);
    throw error;
  }
};

export const fetchMarketChart = async (coinId: string, days: number = 2) => {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        signal: AbortSignal.timeout(10000)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("CoinGecko Market Chart API Error:", errorData);
      throw new Error(errorData.status?.error_message || "Failed to fetch price data");
    }
    
    const data = await response.json();
    
    if (!validateMarketChartData(data)) {
      throw new Error("Invalid market chart data structure");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching market chart:", error);
    throw error;
  }
};