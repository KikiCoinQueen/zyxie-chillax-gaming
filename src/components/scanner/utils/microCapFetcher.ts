import { MicroCapCoin } from "../types/microCap";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export const fetchMicroCapCoins = async (): Promise<MicroCapCoin[]> => {
  console.log("Fetching micro-cap coins...");
  
  try {
    // First get a complete list of coins with market data
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Retrieved", data.length, "coins from CoinGecko");

    // Filter for true micro-caps under $100M
    const microCaps = data
      .filter((coin: any) => {
        const marketCap = coin.market_cap;
        const volume = coin.total_volume;
        
        // Verify market cap is under 100M and above 10k
        const isValidMarketCap = marketCap && marketCap < 100000000 && marketCap > 10000;
        // Ensure some trading activity
        const hasVolume = volume && volume > 10000;
        
        if (isValidMarketCap) {
          console.log(`${coin.symbol}: Market Cap $${(marketCap / 1000000).toFixed(2)}M`);
        }
        
        return isValidMarketCap && hasVolume;
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
      .sort((a: MicroCapCoin, b: MicroCapCoin) => a.marketCap - b.marketCap)
      .slice(0, 6);

    console.log("Found", microCaps.length, "valid micro-cap coins");
    return microCaps;
  } catch (error) {
    console.error("Error fetching micro-cap coins:", error);
    throw error;
  }
};