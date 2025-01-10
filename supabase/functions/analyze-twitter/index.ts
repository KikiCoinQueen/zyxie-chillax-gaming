import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { handle } = await req.json();
    console.log(`Analyzing Twitter handle: ${handle}`);

    // Simulate tweet data for development
    const mockTweets = [
      {
        id: "1",
        text: "Just analyzed $BTC and $ETH charts. Looking bullish! 🚀 Support levels holding strong. #crypto #trading",
        sentiment: 0.85,
        mentions: ["BTC", "ETH"],
        contracts: ["0x2170Ed0880ac9A755fd29B2688956BD959F933F8"],
        metrics: { likes: 1200, retweets: 300, replies: 150 }
      },
      {
        id: "2",
        text: "New #DeFi protocol launching on $SOL. Interesting tokenomics and strong team backing. DYOR! 📈",
        sentiment: 0.75,
        mentions: ["SOL"],
        contracts: ["0x41848d32f281383f214c69c7c3e4d2eb6baa8f58"],
        metrics: { likes: 800, retweets: 200, replies: 100 }
      },
      {
        id: "3",
        text: "$PEPE showing weakness at resistance. Might need to wait for better entry. #memecoins",
        sentiment: 0.45,
        mentions: ["PEPE"],
        contracts: ["0x6982508145454ce325ddbe47a25d4ec3d2311933"],
        metrics: { likes: 500, retweets: 150, replies: 75 }
      },
      {
        id: "4",
        text: "Accumulating more $ARB and $OP at these levels. Layer 2 narrative getting stronger! 💪",
        sentiment: 0.9,
        mentions: ["ARB", "OP"],
        contracts: [
          "0x912CE59144191C1204E64559FE8253a0e49E6548",
          "0x4200000000000000000000000000000000000042"
        ],
        metrics: { likes: 1500, retweets: 400, replies: 200 }
      },
      {
        id: "5",
        text: "Market sentiment shifting. Keep an eye on $BTC dominance and altcoin ratios. #cryptotrading",
        sentiment: 0.6,
        mentions: ["BTC"],
        contracts: ["0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"],
        metrics: { likes: 1000, retweets: 250, replies: 125 }
      }
    ];

    // Add some randomization to make it feel more dynamic
    const tweets = mockTweets.map(tweet => ({
      ...tweet,
      metrics: {
        likes: tweet.metrics.likes + Math.floor(Math.random() * 100),
        retweets: tweet.metrics.retweets + Math.floor(Math.random() * 50),
        replies: tweet.metrics.replies + Math.floor(Math.random() * 25)
      }
    }));

    console.log(`Generated ${tweets.length} mock tweets for analysis`);

    // Store the analysis in Supabase
    try {
      const { data: kolData, error: kolError } = await supabase
        .from('kols')
        .upsert({
          twitter_handle: handle,
          last_analyzed: new Date().toISOString(),
          name: handle
        })
        .select()
        .single();

      if (kolError) {
        console.error("Error storing KOL:", kolError);
        throw new Error("Failed to store analysis results");
      }

      // Store analyses
      const analysisPromises = tweets.map(tweet => 
        supabase
          .from('kol_analyses')
          .insert({
            kol_id: kolData.id,
            tweet_id: tweet.id,
            tweet_text: tweet.text,
            sentiment: tweet.sentiment,
            is_bullish: tweet.sentiment > 0.6,
            mentioned_coins: tweet.mentions
          })
      );

      await Promise.all(analysisPromises);
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue even if DB storage fails - we still want to return the analysis
    }

    return new Response(
      JSON.stringify({
        tweets,
        summary: {
          totalTweets: tweets.length,
          bullishTweets: tweets.filter(t => t.sentiment > 0.6).length,
          mentionedCoins: Array.from(new Set(tweets.flatMap(t => t.mentions)))
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error analyzing Twitter:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to analyze Twitter data"
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});