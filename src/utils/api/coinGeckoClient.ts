import { TokenData, TrendingCoin } from "@/types/token";
import { validateMarketChartData } from "../validation/tokenDataValidator";
import { fetchWithRetry, handleApiError } from "./apiHelpers";
import { BACKUP_PAIRS } from "./backupData";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchCoinGeckoData = async (): Promise<TokenData[]> => {
  console.log("Fetching from CoinGecko...");
  
  try {
    const data = await fetchWithRetry<{ coins: TrendingCoin[] }>(
      `${COINGECKO_BASE_URL}/search/trending`
    );
    
    if (!data?.coins || !Array.isArray(data.coins)) {
      console.warn("Invalid data from CoinGecko API");
      return BACKUP_PAIRS;
    }

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
      fdv: coin.item.market_cap_rank ? coin.item.market_cap_rank * 1000000 : 5000000,
    }));
  } catch (error) {
    handleApiError(error, "CoinGecko");
    return BACKUP_PAIRS;
  }
};

export const fetchMarketChart = async (coinId: string, days: number = 2) => {
  try {
    const data = await fetchWithRetry(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!validateMarketChartData(data)) {
      throw new Error("Invalid market chart data structure");
    }
    
    return data;
  } catch (error) {
    handleApiError(error, "CoinGecko Market Chart");
    throw error;
  }
};

export const fetchCoinDetails = async (coinId: string) => {
  try {
    return await fetchWithRetry(
      `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
  } catch (error) {
    handleApiError(error, "CoinGecko Coin Details");
    return null;
  }
};