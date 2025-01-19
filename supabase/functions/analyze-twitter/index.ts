import { corsHeaders } from "../_shared/cors.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

interface TwitterAnalysisRequest {
  handle: string;
  scrapeOnly?: boolean;
  tweets?: string[];
}

async function scrapeTweets(handle: string) {
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
      timeout: 15000 // Reduced timeout
    });

    // Check if we're on an error page
    const errorSelector = '[data-testid="error-detail"]';
    const hasError = await page.$(errorSelector);
    if (hasError) {
      const errorText = await page.evaluate(selector => {
        const element = document.querySelector(selector);
        return element ? element.textContent : '';
      }, errorSelector);
      throw new Error(`Twitter error: ${errorText || 'Account not found or private'}`);
    }

    // Wait for tweets to load
    console.log('Waiting for tweets to load...');
    await page.waitForSelector('[data-testid="tweet"]', { 
      timeout: 10000 
    }).catch(() => {
      throw new Error('No tweets found - account might be private or not exist');
    });

    // Scroll a bit to load more tweets
    console.log('Scrolling to load more tweets...');
    await page.evaluate(() => {
      window.scrollBy(0, 1000);
    });
    await page.waitForTimeout(1000);

    console.log('Extracting tweets...');
    const tweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
      return Array.from(tweetElements).slice(0, 10).map(tweet => {
        const tweetText = tweet.querySelector('[data-testid="tweetText"]');
        return tweetText?.textContent?.trim() || null;
      }).filter(Boolean);
    });

    console.log(`Successfully scraped ${tweets.length} tweets`);
    
    if (tweets.length === 0) {
      throw new Error('No tweets found');
    }
    
    return tweets;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  } finally {
    await browser.close().catch(console.error);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { handle, scrapeOnly = false } = await req.json() as TwitterAnalysisRequest;

    if (!handle) {
      return new Response(
        JSON.stringify({ error: 'Twitter handle is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Processing request for handle: ${handle}, scrapeOnly: ${scrapeOnly}`);
    const tweets = await scrapeTweets(handle);

    return new Response(
      JSON.stringify({ tweets, success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to scrape tweets',
        details: error.stack,
        success: false
      }),
      {
        status: 200, // Return 200 even for errors to avoid CORS issues
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});