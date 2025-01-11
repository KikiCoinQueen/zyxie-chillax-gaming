import { corsHeaders } from '../_shared/cors.ts'

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { endpoint, params } = await req.json()
    console.log(`Proxying CoinGecko request to: ${endpoint}`)

    const url = new URL(endpoint, COINGECKO_BASE_URL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value as string)
      })
    }

    const response = await fetch(url.toString())
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})