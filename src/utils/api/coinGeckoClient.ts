import { supabase } from "@/integrations/supabase/client";

export const fetchCoinGeckoData = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('coingecko', {
      body: {
        endpoint: '/coins/markets',
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: '250',
          sparkline: 'false'
        }
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error)
    throw error
  }
}

export const fetchCoinDetails = async (coinId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('coingecko', {
      body: {
        endpoint: `/coins/${coinId}`,
        params: {
          localization: 'false',
          tickers: 'false',
          community_data: 'false',
          developer_data: 'false'
        }
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching coin details:', error)
    throw error
  }
}

export const fetchMarketChart = async (coinId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('coingecko', {
      body: {
        endpoint: `/coins/${coinId}/market_chart`,
        params: {
          vs_currency: 'usd',
          days: '7',
          interval: 'daily'
        }
      }
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching market chart:', error)
    throw error
  }
}