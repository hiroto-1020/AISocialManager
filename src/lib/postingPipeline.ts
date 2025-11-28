import { prisma } from './prisma';
import { generatePostContent } from './openaiClient';
import { getImageProvider } from './imageProvider';
import { postToTwitter } from './twitterPost';
import { decrypt } from './crypto';
import { fetchTrends } from './trendFetcher';
import { fetchLatestNews } from './newsFetcher';

const DAILY_POST_LIMIT = 3;

interface GeneratePostParams {
    category: {
        name: string;
        targetAudience: string;
        tone: string;
        goal: string;
        ngWords: string;
        trendInspired: boolean;
        trendMode?: string | null;
        hashtags?: string;
        hashtagMode?: string;
        postLength?: string;
        customInstructions?: string;
        useLatestNews?: boolean;
    };
    trendContext?: string[];
    newsContext?: string[];
    lastPostContent?: string | null;
}

interface GeneratedContent {
    x_text: string;
}

/**
 * Process a scheduled post
 */
export async function processScheduledPost(scheduledPostId: string) {
    try {
        const scheduledPost = await prisma.scheduledPost.findUnique({
            where: { id: scheduledPostId },
            include: {
                category: true,
                project: {
                    include: {
                        xCredentials: true,
                        postingRule: true,
                    },
                },
            },
        });

        if (!scheduledPost) {
            throw new Error('Scheduled post not found');
        }

        const { project, category } = scheduledPost;

        // Safety Check: Daily Limit (only count successful posts)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayPostCount = await prisma.postLog.count({
            where: {
                projectId: project.id,
                status: 'SUCCESS',
                postedAt: {
                    gte: today,
                },
            },
        });

        if (todayPostCount >= DAILY_POST_LIMIT) {
            await prisma.scheduledPost.update({
                where: { id: scheduledPostId },
                data: { status: 'FAILED' },
            });
            throw new Error('Daily limit reached');
        }

        // Check for duplicates (based on recent posts)
        const recentPosts = await prisma.postLog.findMany({
            where: {
                categoryId: category.id,
                postedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                },
            },
            orderBy: { postedAt: 'desc' },
            take: 5,
        });

        // Check if OpenAI API key is set
        if (!project.openaiApiKey) {
            await prisma.scheduledPost.update({
                where: { id: scheduledPostId },
                data: { status: 'FAILED' },
            });
            throw new Error('OpenAI API Key が設定されていません。プロジェクト設定画面で OpenAI API Key を設定してください。');
        }

        const decryptedOpenAIKey = decrypt(project.openaiApiKey);

        // Prepare context
        let trendContext: string[] = [];
        let newsContext: string[] = [];

        if (category.trendInspired && category.trendMode) {
            console.log('[Debug] Trend fetching is temporarily disabled for debugging 403 error.');
            /*
            const xClient = await import('./xClient').then(m => m.getXClient(project.id));
            const trends = await fetchTrends(xClient, category.trendSearchQuery || 'trending');
            if (trends && trends.length > 0) {
                trendContext = trends.slice(0, 5);
            }
            */
        }

        if (category.useLatestNews) {
            const news = await fetchLatestNews(category.name);
            if (news && news.length > 0) {
                newsContext = news.slice(0, 3);
            }
        }

        const lastPostContent = recentPosts.length > 0 ? recentPosts[0].content : null;

        const params: GeneratePostParams = {
            category: {
                name: category.name,
                targetAudience: category.targetAudience || '',
                tone: category.tone || 'professional',
                goal: category.goal || '',
                ngWords: category.ngWords || '',
                trendInspired: category.trendInspired || false,
                trendMode: category.trendMode,
                hashtags: category.hashtags || '',
                hashtagMode: category.hashtagMode || 'auto',
                postLength: category.postLength || 'normal',
                customInstructions: category.customInstructions || '',
                useLatestNews: category.useLatestNews || false,
            },
            trendContext,
            newsContext,
            lastPostContent,
        };

        console.log('[Debug] Generating post content with OpenAI...');
        const content: GeneratedContent = await generatePostContent(params, decryptedOpenAIKey);
        console.log(`[Debug] Generated content (length): ${content.x_text.length}`);

        let imageUrl: string | null = null;

        // Image generation if needed
        if (project.postingRule?.imageMode === 'with_image') {
            console.log('[Debug] Attempting to generate image with OpenAI (DALL-E 3)...');

            let imagePrompt = `Create a high-quality, engaging image suitable for a social media post.
Context: The image should visually represent or summarize the following text: "${content.x_text}".
Style: The image should be eye-catching and professional.`;

            if (category.imagePrompt || category.customInstructions) {
                imagePrompt += `\nSpecific User Instructions: ${category.imagePrompt || category.customInstructions}`;
            } else {
                imagePrompt += `\nGuidance: Use a style that matches the tone of the text (e.g., if the text is futuristic, use a cyberpunk style; if it's calm, use a minimalist style).`;
            }

            console.log(`[Debug] Final Image Prompt: ${imagePrompt}`);

            const imageProvider = getImageProvider('openai');
            imageUrl = await imageProvider.generateImage(imagePrompt, decryptedOpenAIKey);
            console.log(`[Debug] Generated Image URL (length): ${imageUrl?.length || 0}`);
        } else {
            console.log('[Debug] Image generation skipped (mode not with_image)');
        }

        // Post to Twitter
        if (!project.xCredentials) {
            await prisma.scheduledPost.update({
                where: { id: scheduledPostId },
                data: { status: 'FAILED' },
            });
            throw new Error('X credentials not found');
        }

        console.log('[Debug] Posting to Twitter...');
        const tweetId = await postToTwitter(project.id, content.x_text, imageUrl);
        console.log(`[Debug] Tweet posted successfully: ${tweetId}`)

            ;

        // Log the post
        await prisma.postLog.create({
            data: {
                projectId: project.id,
                categoryId: category.id,
                content: content.x_text,
                imageUrl,
                status: 'SUCCESS',
                platform: 'x',
                trendSource: trendContext.length > 0 ? trendContext.join(' | ') : null,
            },
        });

        // Update scheduled post status
        await prisma.scheduledPost.update({
            where: { id: scheduledPostId },
            data: { status: 'POSTED' },
        });

        console.log('[Success] Scheduled post processed successfully');
    } catch (error: any) {
        console.error('Posting failed:', error);

        try {
            const scheduledPost = await prisma.scheduledPost.findUnique({
                where: { id: scheduledPostId },
            });

            if (scheduledPost) {
                await prisma.postLog.create({
                    data: {
                        projectId: scheduledPost.projectId,
                        categoryId: scheduledPost.categoryId,
                        content: '',
                        status: 'FAILED',
                        platform: 'x',
                        error: error.message,
                    },
                });

                await prisma.scheduledPost.update({
                    where: { id: scheduledPostId },
                    data: { status: 'FAILED' },
                });
            }
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }

        throw error;
    }
}

/**
 * Process an immediate post (post now)
 */
export async function processImmediatePost(projectId: string) {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                xCredentials: true,
                postingRule: true,
                categories: {
                    take: 1,
                },
            },
        });

        if (!project) {
            throw new Error('Project not found');
        }

        if (project.categories.length === 0) {
            throw new Error('No categories found. Please create at least one category.');
        }

        const category = project.categories[0];

        // Safety Check: Daily Limit (only count successful posts)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayPostCount = await prisma.postLog.count({
            where: {
                projectId: project.id,
                status: 'SUCCESS',
                postedAt: {
                    gte: today,
                },
            },
        });

        if (todayPostCount >= DAILY_POST_LIMIT) {
            throw new Error('Daily limit reached');
        }

        // Check for duplicates (based on recent posts)
        const recentPosts = await prisma.postLog.findMany({
            where: {
                categoryId: category.id,
                postedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                },
            },
            orderBy: { postedAt: 'desc' },
            take: 5,
        });

        // Check if OpenAI API key is set
        if (!project.openaiApiKey) {
            throw new Error('OpenAI API Key が設定されていません。プロジェクト設定画面で OpenAI API Key を設定してください。');
        }

        const decryptedOpenAIKey = decrypt(project.openaiApiKey);

        // Prepare context
        let trendContext: string[] = [];
        let newsContext: string[] = [];

        if (category.trendInspired && category.trendMode) {
            const xClient = await import('./xClient').then(m => m.getXClient(project.id));
            const trends = await fetchTrends(xClient, category.trendSearchQuery || 'trending');
            if (trends && trends.length > 0) {
                trendContext = trends.slice(0, 5);
            }
        }

        if (category.useLatestNews) {
            const news = await fetchLatestNews(category.name);
            if (news && news.length > 0) {
                newsContext = news.slice(0, 3);
            }
        }

        const lastPostContent = recentPosts.length > 0 ? recentPosts[0].content : null;

        const params: GeneratePostParams = {
            category: {
                name: category.name,
                targetAudience: category.targetAudience || '',
                tone: category.tone || 'professional',
                goal: category.goal || '',
                ngWords: category.ngWords || '',
                trendInspired: category.trendInspired || false,
                trendMode: category.trendMode,
                hashtags: category.hashtags || '',
                hashtagMode: category.hashtagMode || 'auto',
                postLength: category.postLength || 'normal',
                customInstructions: category.customInstructions || '',
                useLatestNews: category.useLatestNews || false,
            },
            trendContext,
            newsContext,
            lastPostContent,
        };

        console.log('[Debug] Generating post content with OpenAI...');
        const content: GeneratedContent = await generatePostContent(params, decryptedOpenAIKey);
        console.log(`[Debug] Generated content (length): ${content.x_text.length}`);

        let imageUrl: string | null = null;

        // Image generation if needed
        if (project.postingRule?.imageMode === 'with_image') {
            console.log('[Debug] Attempting to generate image with OpenAI (DALL-E 3)...');

            let imagePrompt = `Create a high-quality, engaging image suitable for a social media post.
Context: The image should visually represent or summarize the following text: "${content.x_text}".
Style: The image should be eye-catching and professional.`;

            if (category.imagePrompt || category.customInstructions) {
                imagePrompt += `\nSpecific User Instructions: ${category.imagePrompt || category.customInstructions}`;
            } else {
                imagePrompt += `\nGuidance: Use a style that matches the tone of the text (e.g., if the text is futuristic, use a cyberpunk style; if it's calm, use a minimalist style).`;
            }

            console.log(`[Debug] Final Image Prompt: ${imagePrompt}`);

            const imageProvider = getImageProvider('openai');
            imageUrl = await imageProvider.generateImage(imagePrompt, decryptedOpenAIKey);
            console.log(`[Debug] Generated Image URL (length): ${imageUrl?.length || 0}`);
        } else {
            console.log('[Debug] Image generation skipped (mode not with_image)');
        }

        // Post to Twitter
        if (!project.xCredentials) {
            throw new Error('X credentials not found');
        }

        console.log('[Debug] Posting to Twitter...');
        const tweetId = await postToTwitter(project.id, content.x_text, imageUrl);
        console.log(`[Debug] Tweet posted successfully: ${tweetId}`);

        // Log the post
        await prisma.postLog.create({
            data: {
                projectId: project.id,
                categoryId: category.id,
                content: content.x_text,
                imageUrl,
                status: 'SUCCESS',
                platform: 'x',
                trendSource: trendContext.length > 0 ? trendContext.join(' | ') : null,
            },
        });

        console.log('[Success] Immediate post processed successfully');

        return { tweetId };
    } catch (error: any) {
        console.error('Posting failed:', error);

        try {
            await prisma.postLog.create({
                data: {
                    projectId: projectId,
                    categoryId: null,
                    content: '',
                    status: 'FAILED',
                    platform: 'x',
                    error: error.message,
                },
            });
        } catch (logError) {
            console.error('Failed to log error:', String(logError));
        }

        throw error;
    }
}
