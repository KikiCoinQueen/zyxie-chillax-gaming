import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TwitterAnalysisRequest {
  handle: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { handle } = await req.json() as TwitterAnalysisRequest;

    if (!handle) {
      throw new Error('Twitter handle is required');
    }

    console.log('Analyzing Twitter handle:', handle);

    // First, check if KOL exists or create new one
    const { data: existingKol, error: kolError } = await supabase
      .from('kols')
      .select()
      .eq('twitter_handle', handle)
      .single();

    let kolId;

    if (kolError) {
      // Create new KOL
      const { data: newKol, error: createError } = await supabase
        .from('kols')
        .insert([
          { twitter_handle: handle, name: handle }
        ])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      kolId = newKol.id;
    } else {
      kolId = existingKol.id;
    }

    // Generate sample tweets analysis
    // Note: In a real implementation, this would fetch actual tweets from Twitter API
    const sampleTweets = [
      {
        id: '1',
        text: `Just analyzed $SOL and $ETH - both looking bullish! 🚀`,
        sentiment: 0.8,
        is_bullish: true,
        mentioned_coins: ['SOL', 'ETH']
      },
      {
        id: '2',
        text: `Market looking shaky today. $BTC needs to hold support.`,
        sentiment: 0.4,
        is_bullish: false,
        mentioned_coins: ['BTC']
      }
    ];

    // Store analyses in database
    const { error: analysisError } = await supabase
      .from('kol_analyses')
      .insert(
        sampleTweets.map(tweet => ({
          kol_id: kolId,
          tweet_id: tweet.id,
          tweet_text: tweet.text,
          sentiment: tweet.sentiment,
          is_bullish: tweet.is_bullish,
          mentioned_coins: tweet.mentioned_coins
        }))
      );

    if (analysisError) {
      throw analysisError;
    }

    // Update KOL's last analyzed timestamp
    await supabase
      .from('kols')
      .update({ last_analyzed: new Date().toISOString() })
      .eq('id', kolId);

    // Fetch all analyses for this KOL
    const { data: analyses, error: fetchError } = await supabase
      .from('kol_analyses')
      .select('*')
      .eq('kol_id', kolId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    return new Response(
      JSON.stringify({
        kol: { id: kolId, handle },
        tweets: analyses
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});