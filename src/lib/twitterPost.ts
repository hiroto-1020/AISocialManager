import { getXClient } from './xClient';
import type { TwitterApi } from 'twitter-api-v2';
import * as fs from 'fs';
import * as https from 'https';
import * as os from 'os';
import * as path from 'path';

/**
 * Upload media to Twitter and return the media ID
 */
async function uploadMedia(client: TwitterApi, imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        console.log('[TwitterPost] Downloading image from:', imageUrl);
        https.get(imageUrl, (response) => {
            const chunks: Buffer[] = [];
            response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            response.on('end', async () => {
                const buffer = Buffer.concat(chunks);
                console.log('[TwitterPost] Image downloaded. Size:', buffer.length, 'bytes');
                try {
                    // Upload from buffer with explicit mimeType
                    const mediaId = await client.v1.uploadMedia(buffer, { mimeType: 'image/png' });
                    resolve(mediaId);
                } catch (err) {
                    console.error('[TwitterPost] Upload failed:', err);
                    reject(err);
                }
            });
        }).on('error', (err) => {
            console.error('[TwitterPost] Download failed:', err);
            reject(err);
        });
    });
}

/**
 * Post a tweet with optional image
 */
export async function postToTwitter(
    projectId: string,
    text: string,
    imageUrl: string | null
): Promise<string> {
    let client;
    try {
        console.log('[TwitterPost] Getting X client for project:', projectId);
        client = await getXClient(projectId);

        console.log('[TwitterPost] Text to post:', text.substring(0, 50) + '...');
        console.log('[TwitterPost] Image URL:', imageUrl ? 'Yes' : 'No');

        if (imageUrl) {
            console.log('[TwitterPost] Uploading media...');
            const mediaId = await uploadMedia(client, imageUrl);
            console.log('[TwitterPost] Media uploaded, ID:', mediaId);

            console.log('[TwitterPost] Posting tweet with media...');
            const tweet = await client.v2.tweet({
                text,
                media: {
                    media_ids: [mediaId]
                }
            });
            console.log('[TwitterPost] Tweet posted successfully, ID:', tweet.data.id);
            return tweet.data.id;
        } else {
            console.log('[TwitterPost] Posting tweet without media (String Overload)...');
            console.log('[TwitterPost] Content:', text);
            const tweet = await client.v2.tweet(text);
            console.log('[TwitterPost] Tweet posted successfully, ID:', tweet.data.id);
            return tweet.data.id;
        }
    } catch (error: any) {
        console.error('[TwitterPost] Error details:', {
            message: error.message,
            code: error.code,
            data: error.data,
            errors: error.errors,
            rateLimit: error.rateLimit,
        });

        // Enhance error message for 403
        if (error.code === 403 || error.message?.includes('403')) {
            if (error.data?.detail?.includes('You are not allowed to create this Tweet')) {
                throw new Error('ツイートの投稿が拒否されました。同じ内容を連続で投稿しているか、アカウントが制限されている可能性があります。');
            }
            if (error.data?.detail?.includes('Authenticating user is not allowed to create this Tweet')) {
                throw new Error('書き込み権限がありません。Twitter Developer Portalで「Read and Write」に設定し、アクセストークンを再生成して設定し直してください。');
            }
            // Free Tier limitation for trends
            if (error.data?.title === 'UsageCapExceeded' || error.data?.detail?.includes('UsageCapExceeded')) {
                throw new Error('Twitter APIの利用制限(Free Tier)に達したか、許可されていない操作(トレンド取得など)を行いました。');
            }
            // Generic 403 with data
            if (error.data?.detail) {
                throw new Error(`Twitter API Error (403): ${error.data.detail}`);
            }

            // Fallback for any other 403
            throw new Error('Twitter API 403 Forbidden: 権限がありません。Developer Portalで「Read and Write」権限になっているか確認し、必ずアクセストークンを再生成(Regenerate)して設定し直してください。');
        }

        throw error;
    }
}
