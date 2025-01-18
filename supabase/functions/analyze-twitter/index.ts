import { corsHeaders } from "../_shared/cors.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

interface TwitterAnalysisRequest {
  handle: string;
  scrapeOnly?: boolean;
  tweets?: string[];
}

async function scrapeTweets(handle: string) {
  // Remove @ if present and clean the handle
  const cleanHandle = handle.replace('@', '').trim();
  
  console.log('Starting tweet scraping for:', cleanHandle);
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    const twitterUrl = `https://twitter.com/${cleanHandle}`;
    console.log(`Navigating to ${twitterUrl}`);
    
    await page.goto(twitterUrl, { 
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Wait for tweets to load with a more specific selector
    console.log('Waiting for tweets to load...');
    await page.waitForSelector('article[data-testid="tweet"]', { timeout: 60000 });

    // Scroll a bit to load more tweets
    console.log('Scrolling to load more tweets...');
    await page.evaluate(() => {
      window.scrollBy(0, 2000);
    });
    await page.waitForTimeout(3000);

    console.log('Extracting tweets...');
    const tweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll('article[data-testid="tweet"]');
      return Array.from(tweetElements).slice(0, 10).map(tweet => {
        const tweetText = tweet.querySelector('[data-testid="tweetText"]');
        if (!tweetText) return null;
        
        // Clean up the text
        const text = tweetText.textContent?.trim();
        if (!text) return null;
        
        // Remove URLs and clean up whitespace
        return text.replace(/https?:\/\/\S+/g, '')
                  .replace(/\s+/g, ' ')
                  .trim();
      });
    });

    const validTweets = tweets.filter(Boolean);
    console.log(`Successfully scraped ${validTweets.length} tweets`);
    
    if (validTweets.length === 0) {
      throw new Error('No valid tweets found');
    }
    
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
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { handle, scrapeOnly = false } = await req.json() as TwitterAnalysisRequest;

    if (!handle) {
      throw new Error('Twitter handle is required');
    }

    console.log(`Processing request for handle: ${handle}, scrapeOnly: ${scrapeOnly}`);
    const tweets = await scrapeTweets(handle);

    return new Response(
      JSON.stringify({ tweets }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
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