import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openrouterKey = Deno.env.get('OPENROUTER_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TwitterAnalysisRequest {
  handle: string;
}

async function scrapeTweets(handle: string) {
  console.log('Starting tweet scraping for:', handle);
  const browser = await puppeteer.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Set a longer timeout and handle modern Twitter
    await page.setDefaultNavigationTimeout(30000);
    console.log(`Navigating to https://twitter.com/${handle}`);
    await page.goto(`https://twitter.com/${handle}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for tweets to load and handle modern Twitter structure
    console.log('Waiting for tweets to load...');
    await page.waitForSelector('[data-testid="tweet"]', { timeout: 30000 });

    // Scroll a bit to load more tweets
    await page.evaluate(() => {
      window.scrollBy(0, 1000);
    });
    await page.waitForTimeout(2000);

    console.log('Extracting tweets...');
    const tweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll('[data-testid="tweet"]');
      return Array.from(tweetElements).slice(0, 10).map(tweet => {
        // Handle modern Twitter text structure
        const textElement = tweet.querySelector('[data-testid="tweetText"]') || 
                          tweet.querySelector('[lang]'); // Backup selector
        return textElement ? textElement.textContent?.trim() : '';
      });
    });

    const validTweets = tweets.filter(tweet => tweet && tweet.length > 0);
    console.log(`Successfully scraped ${validTweets.length} tweets`);
    return validTweets;
  } catch (error) {
    console.error('Error scraping tweets:', error);
    throw new Error(`Failed to scrape tweets: ${error.message}`);
  } finally {
    await browser.close();
  }
}

async function analyzeTweets(tweets: string[]) {
  console.log('Analyzing tweets with OpenRouter');
  const tweetText = tweets.join('\n\n');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': supabaseUrl,
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [{
          role: 'system',
          content: 'You are an expert crypto analyst. Analyze these tweets and provide insights about: sentiment (bullish/bearish), mentioned cryptocurrencies, and overall trading style. Be concise but thorough.'
        }, {
          role: 'user',
          content: `Analyze these tweets and provide a structured analysis:\n\n${tweetText}`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI Analysis completed successfully');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing tweets:', error);
    throw new Error(`Failed to analyze tweets: ${error.message}`);
  }
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

    // Scrape and analyze tweets
    const tweets = await scrapeTweets(handle);
    if (!tweets.length) {
      throw new Error('No tweets found for analysis');
    }

    const analysis = await analyzeTweets(tweets);

    // Calculate overall sentiment based on AI analysis
    const overallSentiment = analysis.toLowerCase().includes('bullish') ? 0.8 : 
                            analysis.toLowerCase().includes('bearish') ? 0.2 : 0.5;

    // Store analyses in database
    const { error: analysisError } = await supabase
      .from('kol_analyses')
      .insert(
        tweets.map((tweet, index) => ({
          kol_id: kolId,
          tweet_id: `${Date.now()}-${index}`,
          tweet_text: tweet,
          sentiment: overallSentiment,
          is_bullish: overallSentiment > 0.5,
          mentioned_coins: (tweet.match(/\$[A-Za-z]+/g) || []).map(coin => coin.substring(1))
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
        tweets: analyses,
        aiAnalysis: analysis
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