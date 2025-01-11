import { corsHeaders } from '../_shared/cors.ts'

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const requestBody = await req.json().catch(() => {
      throw new Error('Invalid request body')
    })

    console.log('Request body:', requestBody)

    if (!requestBody.endpoint) {
      throw new Error('Endpoint is required')
    }

    const { endpoint, params } = requestBody

    // Construct URL with parameters
    const url = new URL(endpoint, COINGECKO_BASE_URL)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    console.log(`Making request to CoinGecko: ${url.toString()}`)

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`CoinGecko API error: ${response.status}`)
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    // Ensure we can parse the response as JSON
    const data = await response.json().catch(() => {
      throw new Error('Invalid JSON response from CoinGecko')
    })

    console.log('CoinGecko response:', JSON.stringify(data).slice(0, 200) + '...')

    return new Response(JSON.stringify(data), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      },
      status: 200,
    })

  } catch (error) {
    console.error('Error in CoinGecko function:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: error.stack || 'No stack trace available'
      }), 
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500,
      }
    )
  }
})