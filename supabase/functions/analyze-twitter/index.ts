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

    // Launch browser with minimal options
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Set longer timeout and viewport
      await page.setDefaultNavigationTimeout(30000);
      await page.setViewport({ width: 1280, height: 800 });
      
      // Navigate to Twitter profile
      await page.goto(`https://twitter.com/${handle}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      console.log("Waiting for tweets to load...");
      await page.waitForSelector('[data-testid="tweet"]', { timeout: 10000 });

      // Scroll to load more tweets
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await page.waitForTimeout(1000);
      }

      // Scrape tweets
      const tweets = await page.evaluate(() => {
        const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
        return Array.from(tweetElements, tweet => {
          const textElement = tweet.querySelector('[data-testid="tweetText"]');
          const tweetText = textElement ? textElement.textContent : '';

          const likesElement = tweet.querySelector('[data-testid="like"]');
          const retweetsElement = tweet.querySelector('[data-testid="retweet"]');

          // Extract crypto mentions
          const cryptoRegex = /\$([A-Za-z0-9]+)/g;
          const mentions = Array.from(tweetText.matchAll(cryptoRegex), match => match[1]);

          // Enhanced sentiment analysis
          const bullishKeywords = ['bull', 'moon', 'pump', 'long', 'buy', 'support', 'break', '🚀', '💎', '📈', 'accumulate', 'dip'];
          const bearishKeywords = ['bear', 'dump', 'short', 'sell', 'resistance', 'down', '📉', 'exit', 'sell'];
          
          let sentiment = 0.5;
          const lowerText = tweetText.toLowerCase();
          
          bullishKeywords.forEach(word => {
            if (lowerText.includes(word)) sentiment += 0.1;
          });
          
          bearishKeywords.forEach(word => {
            if (lowerText.includes(word)) sentiment -= 0.1;
          });
          
          sentiment = Math.max(0, Math.min(1, sentiment));

          return {
            text: tweetText,
            sentiment,
            mentions,
            metrics: {
              likes: parseInt(likesElement?.textContent || '0'),
              retweets: parseInt(retweetsElement?.textContent || '0')
            }
          };
        });
      });

      await browser.close();
      console.log(`Successfully scraped ${tweets.length} tweets`);

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
      console.error('Error during scraping:', error);
      await browser.close();
      throw error;
    }

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