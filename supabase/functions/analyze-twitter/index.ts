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

    // Use nitter.net as an alternative to Twitter API
    const response = await fetch(`https://nitter.net/${handle}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Twitter profile: ${response.status}`);
    }

    const html = await response.text();
    console.log("Fetched HTML length:", html.length);
    
    // Extract tweets using basic parsing
    const tweets = html
      .split('<div class="tweet-content">')
      .slice(1)
      .map(section => {
        const tweetEnd = section.indexOf('</div>');
        const tweet = section.substring(0, tweetEnd).trim();
        
        // Basic sentiment analysis
        const bullishKeywords = ['bull', 'moon', 'pump', 'buy', 'long', 'support', 'break', 'up'];
        const bearishKeywords = ['bear', 'dump', 'sell', 'short', 'resistance', 'down'];
        
        const bullishCount = bullishKeywords.filter(word => 
          tweet.toLowerCase().includes(word)
        ).length;
        const bearishCount = bearishKeywords.filter(word => 
          tweet.toLowerCase().includes(word)
        ).length;
        
        // Calculate sentiment score (0-1)
        const totalKeywords = bullishCount + bearishCount;
        const sentiment = totalKeywords === 0 ? 0.5 : 
          (bullishCount / (bullishCount + bearishCount));

        // Extract coin mentions ($BTC, $ETH, etc)
        const coinRegex = /\$[A-Z]+/g;
        const mentions = tweet.match(coinRegex) || [];

        return {
          id: Math.random().toString(36).substring(7),
          text: tweet,
          sentiment,
          mentions: mentions.map(m => m.substring(1)) // Remove $ prefix
        };
      })
      .slice(0, 10); // Get last 10 tweets

    console.log(`Analyzed ${tweets.length} tweets`);

    if (tweets.length === 0) {
      throw new Error("No tweets found for analysis");
    }

    return new Response(
      JSON.stringify({
        tweets,
        stats: {
          totalTweets: tweets.length,
          averageSentiment: tweets.reduce((acc, t) => acc + t.sentiment, 0) / tweets.length,
          topMentions: Array.from(new Set(tweets.flatMap(t => t.mentions)))
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
        error: error.message 
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