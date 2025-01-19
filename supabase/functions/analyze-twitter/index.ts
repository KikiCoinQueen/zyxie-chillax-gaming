import { corsHeaders } from "../_shared/cors.ts";

interface TwitterAnalysisRequest {
  handle: string;
  scrapeOnly?: boolean;
  tweets?: string[];
}

async function scrapeTweets(handle: string) {
  const cleanHandle = handle.replace('@', '').trim();
  console.log('Starting tweet fetch for:', cleanHandle);

  try {
    // Use nitter.net as a Twitter-compatible API
    const response = await fetch(`https://nitter.net/${cleanHandle}/rss`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tweets');
    }

    const text = await response.text();
    
    // Extract tweets from RSS feed using regex
    const tweetMatches = text.match(/<description>(.*?)<\/description>/g) || [];
    const tweets = tweetMatches
      .map(match => {
        const content = match
          .replace('<description>', '')
          .replace('</description>', '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .trim();
        return content;
      })
      .filter(tweet => tweet && !tweet.includes('RT @')) // Filter out retweets
      .slice(0, 10); // Get latest 10 tweets

    console.log(`Successfully fetched ${tweets.length} tweets`);
    
    if (tweets.length === 0) {
      throw new Error('No tweets found');
    }
    
    return tweets;
  } catch (error) {
    console.error('Error during tweet fetching:', error);
    throw error;
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
        JSON.stringify({ error: 'Twitter handle is required', success: false }), 
        { 
          status: 200,
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
        error: error.message || 'Failed to fetch tweets',
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