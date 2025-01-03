import { MicroCapCoin } from "../types/microCap";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export const fetchMicroCapCoins = async (): Promise<MicroCapCoin[]> => {
  console.log("Fetching micro-cap coins...");
  
  try {
    // Get coins sorted by market cap ascending to prioritize smaller caps
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_asc&per_page=250&sparkline=false&price_change_percentage=24h&x_cg_demo_api_key=CG-Demo`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Retrieved", data.length, "coins from CoinGecko");

    // Filter and map the coins
    const microCaps = data
      .filter((coin: any) => {
        // Basic data validation
        if (!coin?.market_cap || !coin?.total_volume || !coin?.current_price) {
          return false;
        }

        const marketCap = parseFloat(coin.market_cap);
        const volume = parseFloat(coin.total_volume);
        
        // Market cap under 100M and above 10k
        const isValidMarketCap = marketCap < 100000000 && marketCap > 10000;
        // At least $100 daily volume
        const hasVolume = volume > 100;
        
        if (isValidMarketCap && hasVolume) {
          console.log(
            `Found micro-cap: ${coin.symbol.toUpperCase()}`,
            `\n  Market Cap: $${(marketCap / 1000000).toFixed(2)}M`,
            `\n  Volume: $${(volume / 1000).toFixed(2)}K`
          );
          return true;
        }
        return false;
      })
      .map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        priceChange24h: coin.price_change_percentage_24h || 0,
        price: coin.current_price,
        rank: coin.market_cap_rank
      }))
      .sort((a: MicroCapCoin, b: MicroCapCoin) => 
        (b.volume24h / b.marketCap) - (a.volume24h / a.marketCap)
      )
      .slice(0, 6);

    console.log("Found", microCaps.length, "valid micro-cap coins");
    
    if (microCaps.length === 0) {
      console.log("First 5 coins from API:", 
        data.slice(0, 5).map((c: any) => ({
          symbol: c.symbol,
          marketCap: c.market_cap,
          volume: c.total_volume
        }))
      );
    }
    
    return microCaps;
  } catch (error) {
    console.error("Error fetching micro-cap coins:", error);
    throw error;
  }
};