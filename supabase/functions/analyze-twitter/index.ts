import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRole
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { twitterHandle } = await req.json()
    console.log(`Analyzing Twitter handle: ${twitterHandle}`)

    // Simple sentiment analysis function
    const analyzeSentiment = (text: string) => {
      const bullishWords = ['bullish', 'moon', 'pump', 'buy', 'long']
      const bearishWords = ['bearish', 'dump', 'sell', 'short']
      
      const text_lower = text.toLowerCase()
      const bullishCount = bullishWords.filter(word => text_lower.includes(word)).length
      const bearishCount = bearishWords.filter(word => text_lower.includes(word)).length
      
      return {
        sentiment: (bullishCount - bearishCount) / (bullishCount + bearishCount + 1),
        isBullish: bullishCount > bearishCount
      }
    }

    // Insert or get KOL
    const { data: existingKol, error: kolError } = await supabase
      .from('kols')
      .select()
      .eq('twitter_handle', twitterHandle)
      .single()

    if (kolError && kolError.code !== 'PGRST116') {
      throw kolError
    }

    let kolId
    if (!existingKol) {
      const { data: newKol, error: insertError } = await supabase
        .from('kols')
        .insert([{ twitter_handle: twitterHandle }])
        .select()
        .single()

      if (insertError) throw insertError
      kolId = newKol.id
    } else {
      kolId = existingKol.id
    }

    // Sample tweets for demo
    const sampleTweets = [
      "Just bought more $SOL! This project is going to moon! 🚀",
      "Market looking bullish today, time to accumulate",
      "New partnerships coming soon! Stay tuned! 💪"
    ]

    // Analyze and store tweet data
    const analyses = await Promise.all(sampleTweets.map(async (tweet) => {
      const { sentiment, isBullish } = analyzeSentiment(tweet)
      
      const { data, error: analysisError } = await supabase
        .from('kol_analyses')
        .insert([{
          kol_id: kolId,
          tweet_id: Date.now().toString(),
          tweet_text: tweet,
          sentiment,
          is_bullish: isBullish,
          mentioned_coins: ['SOL']
        }])
        .select()
        .single()

      if (analysisError) throw analysisError
      return data
    }))

    return new Response(JSON.stringify({ success: true, analyses }), {
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