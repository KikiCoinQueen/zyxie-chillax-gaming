import { CoinDetails, CoinGeckoResponse } from "@/types/coin";
import { TokenData } from "@/types/token";
import { fetchWithRetry, handleApiError } from "./apiHelpers";
import { BACKUP_PAIRS } from "./backupData";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const validateTokenData = (data: any): boolean => {
  return (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.coins) &&
    data.coins.length > 0 &&
    data.coins.every((coin: any) => 
      coin.item &&
      typeof coin.item.id === 'string' &&
      typeof coin.item.name === 'string' &&
      typeof coin.item.symbol === 'string'
    )
  );
};

export const fetchCoinGeckoData = async (): Promise<TokenData[]> => {
  console.log("Fetching from CoinGecko...");
  
  try {
    // First fetch trending coins
    const trendingData = await fetchWithRetry<CoinGeckoResponse>(
      `${COINGECKO_BASE_URL}/search/trending`
    );
    
    if (!validateTokenData(trendingData)) {
      console.warn("Invalid data structure from CoinGecko API:", trendingData);
      return BACKUP_PAIRS;
    }

    // Fetch detailed data for each coin to get accurate market caps
    const detailedCoins = await Promise.all(
      trendingData.coins.map(async (coin) => {
        try {
          const details = await fetchWithRetry<any>(
            `${COINGECKO_BASE_URL}/coins/${coin.item.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
          );

          if (!details?.market_data?.market_cap?.usd) {
            console.log(`No market cap data for ${coin.item.name}`);
            return null;
          }

          const marketCap = details.market_data.market_cap.usd;
          console.log(`${coin.item.name} market cap: $${marketCap}`);

          // Filter for micro caps under 100M
          if (marketCap > 100000000) {
            console.log(`Skipping ${coin.item.name} - market cap too high: $${marketCap}`);
            return null;
          }

          // Filter out dead tokens
          if (marketCap < 10000) {
            console.log(`Skipping ${coin.item.name} - market cap too low: $${marketCap}`);
            return null;
          }

          return {
            baseToken: {
              id: coin.item.id,
              address: coin.item.id,
              name: coin.item.name,
              symbol: coin.item.symbol,
              thumb: coin.item.thumb,
            },
            priceUsd: details.market_data.current_price.usd.toString(),
            volume24h: details.market_data.total_volume.usd.toString(),
            priceChange24h: details.market_data.price_change_percentage_24h || 0,
            liquidity: { usd: details.market_data.total_volume.usd || 0 },
            fdv: marketCap,
            marketCap: marketCap,
            rank: coin.item.market_cap_rank || 999,
            lastUpdated: new Date().toISOString(),
            confidence: 0.8
          };
        } catch (error) {
          console.error(`Error fetching details for ${coin.item.name}:`, error);
          return null;
        }
      })
    );

    // Filter out null values and sort by market cap
    const validCoins = detailedCoins
      .filter((coin): coin is TokenData => coin !== null)
      .sort((a, b) => a.marketCap - b.marketCap)
      .slice(0, 6);

    if (validCoins.length === 0) {
      console.log("No valid micro-cap coins found, using backup pairs");
      return BACKUP_PAIRS;
    }

    console.log("Found valid micro-cap coins:", validCoins.map(c => `${c.baseToken.name}: $${c.marketCap}`));
    return validCoins;
  } catch (error) {
    console.error("Error fetching CoinGecko data:", error);
    handleApiError(error, "CoinGecko");
    return BACKUP_PAIRS;
  }
};

export const fetchCoinDetails = async (coinId: string): Promise<CoinDetails | null> => {
  try {
    console.log(`Fetching details for coin: ${coinId}`);
    return await fetchWithRetry<CoinDetails>(
      `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
  } catch (error) {
    console.error(`Error fetching details for coin ${coinId}:`, error);
    handleApiError(error, "CoinGecko Coin Details");
    return null;
  }
};

export const fetchMarketChart = async (coinId: string): Promise<any> => {
  try {
    console.log(`Fetching market chart for coin: ${coinId}`);
    return await fetchWithRetry(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=7`
    );
  } catch (error) {
    console.error(`Error fetching market chart for coin ${coinId}:`, error);
    handleApiError(error, "CoinGecko Market Chart");
    return null;
  }
};