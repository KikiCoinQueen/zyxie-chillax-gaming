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

  let browser;
  try {
    const { handle } = await req.json();
    
    if (!handle) {
      throw new Error('No Twitter handle provided');
    }

    console.log(`Analyzing Twitter handle: ${handle}`);

    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const twitterUrl = `https://twitter.com/${handle}`;
    console.log(`Navigating to ${twitterUrl}`);
    
    await page.goto(twitterUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for tweets to load
    await page.waitForSelector('article[data-testid="tweet"]', { timeout: 10000 });
    
    // Scroll to load more tweets
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(1000);
    }

    // Extract tweets
    const tweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
      return Array.from(tweetElements, tweet => {
        const textElement = tweet.querySelector('div[data-testid="tweetText"]');
        const text = textElement ? textElement.textContent : '';
        
        const statsElement = tweet.querySelector('div[role="group"]');
        const stats = statsElement ? statsElement.textContent : '';
        
        const timeElement = tweet.querySelector('time');
        const timestamp = timeElement ? timeElement.getAttribute('datetime') : '';
        
        return {
          text,
          stats,
          timestamp,
          id: tweet.getAttribute('data-tweet-id') || crypto.randomUUID()
        };
      });
    });

    console.log(`Found ${tweets.length} tweets`);

    // Simple sentiment analysis
    const analyzedTweets = tweets.map(tweet => {
      const text = tweet.text.toLowerCase();
      
      // Crypto-specific sentiment analysis
      const bullishTerms = ['bull', 'moon', 'pump', 'buy', 'long', 'support', 'breakout'];
      const bearishTerms = ['bear', 'dump', 'sell', 'short', 'resistance', 'breakdown'];
      
      const bullishCount = bullishTerms.filter(term => text.includes(term)).length;
      const bearishCount = bearishTerms.filter(term => text.includes(term)).length;
      
      const sentiment = (bullishCount - bearishCount) / (bullishCount + bearishCount + 1);
      
      // Extract mentioned coins (simple regex for cashtags)
      const mentions = text.match(/\$[a-zA-Z]+/g) || [];
      
      return {
        ...tweet,
        sentiment: sentiment + 0.5, // Normalize to 0-1 range
        mentions: mentions.map(m => m.substring(1).toUpperCase()),
        is_bullish: sentiment > 0
      };
    });

    await browser.close();

    return new Response(
      JSON.stringify({
        success: true,
        tweets: analyzedTweets,
        stats: {
          total_tweets: analyzedTweets.length,
          average_sentiment: analyzedTweets.reduce((acc, t) => acc + t.sentiment, 0) / analyzedTweets.length,
          bullish_tweets: analyzedTweets.filter(t => t.is_bullish).length
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
    
    if (browser) {
      await browser.close();
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
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