import { corsHeaders } from "../_shared/cors.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

interface TwitterAnalysisRequest {
  handle: string;
  scrapeOnly?: boolean;
  tweets?: string[];
}

async function scrapeTweets(handle: string) {
  console.log('Starting tweet scraping for:', handle);
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    console.log(`Navigating to https://twitter.com/${handle}`);
    await page.goto(`https://twitter.com/${handle}`, { 
      waitUntil: 'networkidle0',
      timeout: 60000 // Increased timeout to 60 seconds
    });

    // Wait for tweets to load
    console.log('Waiting for tweets to load...');
    await page.waitForSelector('[data-testid="tweet"]', { timeout: 60000 });

    // Scroll a bit to load more tweets
    console.log('Scrolling to load more tweets...');
    await page.evaluate(() => {
      window.scrollBy(0, 2000);
    });
    await page.waitForTimeout(3000);

    console.log('Extracting tweets...');
    const tweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
      return Array.from(tweetElements).slice(0, 10).map(tweet => {
        const tweetText = tweet.querySelector('[data-testid="tweetText"]');
        if (!tweetText) return null;
        
        // Clean up the text
        const text = tweetText.textContent?.trim();
        if (!text) return null;
        
        // Remove URLs
        return text.replace(/https?:\/\/\S+/g, '')
                  .replace(/\s+/g, ' ')
                  .trim();
      });
    });

    const validTweets = tweets.filter(tweet => tweet && tweet.length > 0);
    console.log(`Successfully scraped ${validTweets.length} tweets:`, validTweets);
    
    return validTweets;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw new Error(`Failed to scrape tweets: ${error.message}`);
  } finally {
    console.log('Closing browser...');
    await browser.close();
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { handle, scrapeOnly } = await req.json() as TwitterAnalysisRequest;

    if (!handle) {
      throw new Error('Twitter handle is required');
    }

    console.log(`Processing request for handle: ${handle}, scrapeOnly: ${scrapeOnly}`);
    const tweets = await scrapeTweets(handle);
    
    if (!tweets.length) {
      throw new Error('No tweets found');
    }

    // If scrapeOnly is true, return just the tweets
    if (scrapeOnly) {
      return new Response(
        JSON.stringify({ tweets }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, just return the tweets without AI analysis
    return new Response(
      JSON.stringify({ tweets }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});