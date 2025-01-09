import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { handle } = await req.json()
    console.log(`Analyzing Twitter handle: ${handle}`)

    // Use nitter.net as an alternative to Twitter API
    const response = await fetch(`https://nitter.net/${handle}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch Twitter profile: ${response.status}`)
    }

    const html = await response.text()
    console.log("Fetched HTML length:", html.length)
    
    // Extract tweets using basic parsing
    const tweets = html
      .split('<div class="tweet-content">')
      .slice(1)
      .map(section => {
        const tweetEnd = section.indexOf('</div>')
        const tweet = section.substring(0, tweetEnd).trim()
        
        // Basic sentiment analysis
        const bullishKeywords = ['bull', 'moon', 'pump', 'buy', 'long', 'support', 'break', 'up']
        const bearishKeywords = ['bear', 'dump', 'sell', 'short', 'resistance', 'down']
        
        const isBullish = bullishKeywords.some(word => tweet.toLowerCase().includes(word))
        const isBearish = bearishKeywords.some(word => tweet.toLowerCase().includes(word))
        
        // Extract potential coin mentions ($BTC, $ETH, etc)
        const coinRegex = /\$[A-Z]+/g
        const mentionedCoins = tweet.match(coinRegex) || []

        return {
          text: tweet,
          sentiment: isBullish ? 0.8 : isBearish ? 0.2 : 0.5,
          isBullish,
          mentionedCoins
        }
      })
      .slice(0, 10) // Get last 10 tweets

    console.log(`Analyzed ${tweets.length} tweets`)

    return new Response(
      JSON.stringify({
        success: true,
        tweets,
        summary: {
          totalTweets: tweets.length,
          bullishTweets: tweets.filter(t => t.isBullish).length,
          mentionedCoins: [...new Set(tweets.flatMap(t => t.mentionedCoins))]
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error analyzing Twitter:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        errorDetail: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    )
  }
})