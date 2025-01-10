import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { handle } = await req.json();
    console.log(`Scraping Twitter handle: ${handle}`);

    // Launch browser
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Navigate to Twitter profile
    await page.goto(`https://twitter.com/${handle}`);
    await page.waitForTimeout(2000); // Wait for content to load

    // Scrape tweets
    const tweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
      return Array.from(tweetElements).map((tweet) => {
        const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.textContent || '';
        const likes = tweet.querySelector('[data-testid="like"]')?.textContent || '0';
        const retweets = tweet.querySelector('[data-testid="retweet"]')?.textContent || '0';
        const replies = tweet.querySelector('[data-testid="reply"]')?.textContent || '0';
        
        // Extract crypto mentions using regex
        const cryptoRegex = /\$([A-Za-z0-9]+)/g;
        const mentions = [...tweetText.matchAll(cryptoRegex)].map(match => match[1]);
        
        // Simple sentiment analysis based on keywords
        const bullishKeywords = ['bull', 'moon', 'pump', 'long', 'buy', 'support', 'break'];
        const bearishKeywords = ['bear', 'dump', 'short', 'sell', 'resistance', 'down'];
        
        let sentiment = 0.5; // neutral by default
        const lowerText = tweetText.toLowerCase();
        
        bullishKeywords.forEach(word => {
          if (lowerText.includes(word)) sentiment += 0.1;
        });
        
        bearishKeywords.forEach(word => {
          if (lowerText.includes(word)) sentiment -= 0.1;
        });
        
        // Clamp sentiment between 0 and 1
        sentiment = Math.max(0, Math.min(1, sentiment));

        return {
          id: tweet.getAttribute('data-tweet-id') || crypto.randomUUID(),
          text: tweetText,
          sentiment,
          mentions,
          contracts: [], // We don't have contract addresses from scraping
          metrics: {
            likes: parseInt(likes) || 0,
            retweets: parseInt(retweets) || 0,
            replies: parseInt(replies) || 0
          }
        };
      });
    });

    await browser.close();
    console.log(`Scraped ${tweets.length} tweets from ${handle}`);

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