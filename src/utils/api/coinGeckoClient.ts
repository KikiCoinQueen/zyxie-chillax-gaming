import { CoinDetails, CoinGeckoResponse } from "@/types/coin";
import { TokenData } from "@/types/token";
import { fetchWithRetry, handleApiError } from "./apiHelpers";
import { BACKUP_PAIRS } from "./backupData";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchCoinGeckoData = async (): Promise<TokenData[]> => {
  console.log("Fetching from CoinGecko...");
  
  try {
    const data = await fetchWithRetry<CoinGeckoResponse>(
      `${COINGECKO_BASE_URL}/search/trending`
    );
    
    if (!data?.coins || !Array.isArray(data.coins)) {
      console.warn("Invalid data from CoinGecko API");
      return BACKUP_PAIRS;
    }

    return data.coins.slice(0, 6).map((coin) => ({
      baseToken: {
        id: coin.item.id,
        address: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        thumb: coin.item.thumb,
      },
      priceUsd: (coin.item.price_btc ? (coin.item.price_btc * 40000).toString() : "0"),
      volume24h: (coin.item.price_btc ? (coin.item.price_btc * 40000 * 1000000).toString() : "0"),
      priceChange24h: coin.item.data?.price_change_percentage_24h || 0,
      liquidity: { usd: coin.item.data?.market_cap || 0 },
      fdv: coin.item.data?.market_cap || 0,
      marketCap: coin.item.data?.market_cap || 0,
      rank: coin.item.market_cap_rank || 999
    }));
  } catch (error) {
    handleApiError(error, "CoinGecko");
    return BACKUP_PAIRS;
  }
};

export const fetchCoinDetails = async (coinId: string): Promise<CoinDetails | null> => {
  try {
    return await fetchWithRetry<CoinDetails>(
      `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
  } catch (error) {
    handleApiError(error, "CoinGecko Coin Details");
    return null;
  }
};

export const fetchMarketChart = async (coinId: string): Promise<any> => {
  try {
    return await fetchWithRetry(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=7`
    );
  } catch (error) {
    handleApiError(error, "CoinGecko Market Chart");
    return null;
  }
};