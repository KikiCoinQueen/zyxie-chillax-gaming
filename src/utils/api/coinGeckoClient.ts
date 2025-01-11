import { CoinDetails, CoinGeckoResponse } from "@/types/coin";
import { TokenData } from "@/types/token";
import { fetchWithRetry, handleApiError } from "./apiHelpers";
import { BACKUP_PAIRS } from "./backupData";
import { supabase } from "@/integrations/supabase/client";

const validateTokenData = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    console.warn("Invalid data structure received");
    return false;
  }
  
  if (!Array.isArray(data.coins)) {
    console.warn("Missing or invalid coins array");
    return false;
  }
  
  return true;
};

export const fetchCoinGeckoData = async (): Promise<TokenData[]> => {
  try {
    console.log("Fetching trending coins from CoinGecko...");
    
    const { data, error } = await supabase.functions.invoke('coingecko', {
      body: { endpoint: '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false' }
    });

    if (error) {
      console.error("Error fetching CoinGecko data:", error);
      return BACKUP_PAIRS;
    }

    if (!Array.isArray(data)) {
      console.warn("Invalid response from CoinGecko markets endpoint:", data);
      return BACKUP_PAIRS;
    }

    // Filter for coins under 100M market cap
    const microCapCoins = data.filter(coin => {
      const marketCap = coin.market_cap;
      return marketCap && marketCap < 100000000 && marketCap > 10000;
    });

    console.log(`Found ${microCapCoins.length} coins under 100M market cap`);

    // Get detailed data for each micro-cap coin
    const detailedCoins = await Promise.all(
      microCapCoins.slice(0, 10).map(async (coin) => {
        try {
          const { data: details, error: detailsError } = await supabase.functions.invoke('coingecko', {
            body: { endpoint: `/coins/${coin.id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true` }
          });

          if (detailsError || !details?.market_data?.current_price?.usd) {
            console.log(`No price data for ${coin.name}, skipping`);
            return null;
          }

          const marketCap = details.market_data.market_cap.usd;
          console.log(`Verified market cap for ${coin.name}: $${marketCap.toLocaleString()}`);

          if (marketCap > 100000000) {
            console.log(`${coin.name} market cap too high: $${marketCap.toLocaleString()}`);
            return null;
          }

          return {
            baseToken: {
              id: coin.id,
              address: coin.id,
              name: coin.name,
              symbol: coin.symbol.toUpperCase(),
              thumb: coin.image
            },
            priceUsd: details.market_data.current_price.usd.toString(),
            volume24h: details.market_data.total_volume.usd.toString(),
            priceChange24h: details.market_data.price_change_percentage_24h || 0,
            liquidity: { 
              usd: details.market_data.total_volume.usd || 0 
            },
            fdv: marketCap,
            marketCap: marketCap,
            rank: coin.market_cap_rank || 999,
            lastUpdated: new Date().toISOString(),
            confidence: 0.9
          } as TokenData;
        } catch (error) {
          console.error(`Error fetching details for ${coin.name}:`, error);
          return null;
        }
      })
    );

    // Filter out nulls and sort by market cap
    const validCoins = detailedCoins
      .filter((coin): coin is TokenData => coin !== null)
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 6);

    if (validCoins.length === 0) {
      console.log("No valid micro-cap coins found, using backup pairs");
      return BACKUP_PAIRS;
    }

    console.log("Found valid micro-cap coins:", 
      validCoins.map(c => `${c.baseToken.name}: $${c.marketCap.toLocaleString()}`).join(', ')
    );
    
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