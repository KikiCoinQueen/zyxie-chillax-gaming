import { MicroCapCoin } from "../types/microCap";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export const fetchMicroCapCoins = async (): Promise<MicroCapCoin[]> => {
  console.log("Fetching micro-cap coins...");
  
  try {
    // First get a complete list of coins with market data
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_asc&per_page=250&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add demo key for higher rate limits
          'x-cg-demo-api-key': 'CG-Demo'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Retrieved", data.length, "coins from CoinGecko");

    // Filter for true micro-caps under $100M
    const microCaps = data
      .filter((coin: any) => {
        const marketCap = parseFloat(coin.market_cap);
        const volume = parseFloat(coin.total_volume);
        const price = parseFloat(coin.current_price);
        
        // Basic validation
        if (!marketCap || !volume || !price) {
          console.log(`Skipping ${coin.symbol}: Invalid data`);
          return false;
        }
        
        // Verify market cap is under 100M and above 10k
        const isValidMarketCap = marketCap < 100000000 && marketCap > 10000;
        // Ensure some trading activity (at least $1000 daily volume)
        const hasVolume = volume > 1000;
        
        if (isValidMarketCap && hasVolume) {
          console.log(
            `Found valid micro-cap: ${coin.symbol.toUpperCase()}`,
            `\n  Market Cap: $${(marketCap / 1000000).toFixed(2)}M`,
            `\n  Volume: $${(volume / 1000).toFixed(2)}K`,
            `\n  Price: $${price.toFixed(6)}`,
            `\n  24h Change: ${coin.price_change_percentage_24h?.toFixed(2)}%`
          );
        }
        
        return isValidMarketCap && hasVolume;
      })
      .map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        marketCap: parseFloat(coin.market_cap),
        volume24h: parseFloat(coin.total_volume),
        priceChange24h: coin.price_change_percentage_24h || 0,
        price: coin.current_price,
        rank: coin.market_cap_rank
      }))
      // Sort by volume/mcap ratio to find most active micro-caps
      .sort((a: MicroCapCoin, b: MicroCapCoin) => 
        (b.volume24h / b.marketCap) - (a.volume24h / a.marketCap)
      )
      .slice(0, 6);

    console.log("Found", microCaps.length, "valid micro-cap coins");
    
    if (microCaps.length === 0) {
      console.log("API Response Sample:", 
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