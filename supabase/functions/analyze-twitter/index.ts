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

    // Launch browser in headless mode
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Navigate to Twitter profile
      await page.goto(`https://twitter.com/${handle}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      console.log("Waiting for tweets to load...");
      await page.waitForSelector('article[data-testid="tweet"]', { timeout: 5000 });

      // Scrape tweets
      const tweets = await page.evaluate(() => {
        const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
        return Array.from(tweetElements, tweet => {
          // Get tweet text
          const textElement = tweet.querySelector('[data-testid="tweetText"]');
          const tweetText = textElement ? textElement.textContent : '';

          // Get metrics
          const likesElement = tweet.querySelector('[data-testid="like"]');
          const retweetsElement = tweet.querySelector('[data-testid="retweet"]');
          const repliesElement = tweet.querySelector('[data-testid="reply"]');

          // Extract crypto mentions using regex
          const cryptoRegex = /\$([A-Za-z0-9]+)/g;
          const mentions = Array.from(tweetText.matchAll(cryptoRegex), match => match[1]);

          // Simple sentiment analysis based on keywords
          const bullishKeywords = ['bull', 'moon', 'pump', 'long', 'buy', 'support', 'break', '🚀', '💎', '📈'];
          const bearishKeywords = ['bear', 'dump', 'short', 'sell', 'resistance', 'down', '📉'];
          
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
            contracts: [], // We don't extract contract addresses for now
            metrics: {
              likes: parseInt(likesElement?.textContent || '0'),
              retweets: parseInt(retweetsElement?.textContent || '0'),
              replies: parseInt(repliesElement?.textContent || '0')
            }
          };
        });
      });

      console.log(`Successfully scraped ${tweets.length} tweets`);

      await browser.close();

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