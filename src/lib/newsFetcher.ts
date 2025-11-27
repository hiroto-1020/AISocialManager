import Parser from 'rss-parser';

const parser = new Parser();

export async function fetchLatestNews(query: string): Promise<string[]> {
    try {
        // Google News RSS URL for the query
        // hl=ja&gl=JP&ceid=JP:ja ensures Japanese results
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ja&gl=JP&ceid=JP:ja`;

        const feed = await parser.parseURL(feedUrl);

        // Return top 3 news items with title and snippet (if available)
        return feed.items.slice(0, 3).map(item => {
            return `Title: ${item.title}\nLink: ${item.link}\nSnippet: ${item.contentSnippet || item.content || "No snippet"}`;
        });
    } catch (error) {
        console.error("Failed to fetch news:", error);
        return [];
    }
}
