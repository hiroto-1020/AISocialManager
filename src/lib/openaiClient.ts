import OpenAI from 'openai';

export interface GeneratePostParams {
    category: {
        name: string;
        targetAudience: string;
        tone: string;
        goal: string;
        ngWords: string; // Comma separated
        trendInspired: boolean;
        trendMode?: string | null;
        hashtags?: string;
        hashtagMode?: string; // "auto" | "manual"
        postLength?: string; // "short" | "normal" | "long"
        customInstructions?: string;
        useLatestNews?: boolean;
    };
    trendContext?: string[]; // Array of tweet texts or summaries
    newsContext?: string[]; // Array of news articles
    lastPostContent?: string | null;
}

export interface GeneratedContent {
    x_text: string;
    instagram_caption: string;
}

export async function generatePostContent(
    params: GeneratePostParams,
    apiKey: string
): Promise<GeneratedContent> {
    const openai = new OpenAI({
        apiKey: apiKey,
    });

    const { category, trendContext, newsContext, lastPostContent } = params;

    // Determine instructions based on category settings
    let lengthInstruction = "";
    if (category.postLength === 'short') {
        lengthInstruction = "Keep it SHORT and punchy (100 characters or less).";
    } else if (category.postLength === 'long') {
        lengthInstruction = "Write a longer, detailed post (up to 280 characters). Break it into multiple paragraphs with line breaks.";
    } else {
        lengthInstruction = "Moderate length (around 150-200 characters is ideal). Use line breaks to separate thoughts.";
    }

    let hashtagInstruction = "Generate relevant hashtags automatically.";
    if (category.hashtagMode === 'manual' && category.hashtags) {
        hashtagInstruction = `Use EXACTLY these hashtags at the end: ${category.hashtags}`;
    }

    const dateStr = new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    let systemPrompt = `
You are a professional social media manager.
Create a post for X (formerly Twitter) and a caption for Instagram based on the following settings.

Target Audience: ${category.targetAudience}
Tone: ${category.tone}
Goal: ${category.goal}
NG Words: ${category.ngWords}
Current Date: ${dateStr}

Constraints:
1. Length: ${lengthInstruction}
2. Hashtags: ${hashtagInstruction}
3. Formatting: You MUST use line breaks (newlines) frequently to separate sentences and thoughts. Do not write a dense paragraph. Visually spacing out the text is critical.
4. Focus: Focus on a SINGLE specific topic or angle. Do not try to cover multiple unrelated things in one post.
`;

    if (lastPostContent) {
        systemPrompt += `
\nPREVIOUS POST (AVOID SIMILARITY):
The following was the content of the last post. You MUST create something DIFFERENT.
"${lastPostContent}"
Instruction: Do not repeat the same topic, phrasing, or angle as the previous post.
`;
    }

    if (category.customInstructions) {
        systemPrompt += `
\nCustom Instructions from User:
${category.customInstructions}
`;
    }

    systemPrompt += `
Output must be in JSON format:
{
  "x_text": "Text for X",
  "instagram_caption": "Caption for Instagram"
}
`;

    let userPrompt = `Create a post about the category "${category.name}".`;

    if (category.useLatestNews && newsContext && newsContext.length > 0) {
        userPrompt += `
\n\nLatest News Context:
\n${newsContext.join('\n---\n')}
\n
Instruction:
Use the above news information to create a timely and relevant post.
Summarize the key points and add your own perspective based on the category goal.
`;
    }

    if (category.trendInspired && trendContext && trendContext.length > 0) {
        if (category.trendMode === 'topic_only') {
            userPrompt += `
\n\nReference Trends (Tweets):
\n${trendContext.join('\n---\n')}
\n
Instruction:
Analyze the common themes, issues, or excitement points in the above trends.
Based on that analysis, write a COMPLETELY ORIGINAL post from the user's perspective.
DO NOT copy or slightly rewrite the reference tweets.
Focus on the underlying topic but use your own words and thoughts.
`;
        } else if (category.trendMode === 'quote_with_comment') {
            // For quote_with_comment, the context should ideally be a single tweet to quote.
            // But here we generate the COMMENT part.
            userPrompt += `
\n\nReference Tweet to Quote:
\n${trendContext[0]}
\n
Instruction:
Write a comment to accompany a Quote Retweet of the above tweet.
Your comment should add value, express an opinion, or relate it to the category goal.
`;
        }
    }

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('Failed to generate content');

    return JSON.parse(content) as GeneratedContent;
}
