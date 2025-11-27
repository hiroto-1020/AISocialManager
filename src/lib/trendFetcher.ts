import { TwitterApi } from 'twitter-api-v2';

export async function fetchTrends(client: TwitterApi, query: string): Promise<string[]> {
    try {
        // Search for recent tweets matching the query
        // excluding retweets and replies to get cleaner content
        const searchResult = await client.v2.search(query + ' -is:retweet -is:reply lang:ja', {
            max_results: 10,
            sort_order: 'recency',
            'tweet.fields': ['public_metrics', 'text'],
        });

        if (!searchResult.data || searchResult.data.data.length === 0) {
            return [];
        }

        // Sort by like count to get "trending" or popular content from the recent batch
        const sortedTweets = searchResult.data.data.sort((a, b) => {
            const likesA = a.public_metrics?.like_count || 0;
            const likesB = b.public_metrics?.like_count || 0;
            return likesB - likesA;
        });

        // Return top 3 tweet texts
        return sortedTweets.slice(0, 3).map(tweet => tweet.text);
    } catch (error) {
        console.error('Failed to fetch trends:', error);
        return [];
    }
}
