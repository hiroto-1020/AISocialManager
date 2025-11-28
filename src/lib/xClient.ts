import { TwitterApi } from 'twitter-api-v2';
import { decrypt } from './crypto';
import { prisma } from './prisma';

export async function getXClient(projectId: string) {
    const credentials = await prisma.xCredentials.findUnique({
        where: { projectId },
    });

    if (!credentials) {
        throw new Error('No X credentials found for this project');
    }

    const appKey = decrypt(credentials.apiKey);
    const appSecret = decrypt(credentials.apiKeySecret);
    const accessToken = decrypt(credentials.accessToken);
    const accessSecret = decrypt(credentials.accessTokenSecret);

    const client = new TwitterApi({
        appKey,
        appSecret,
        accessToken,
        accessSecret,
    });

    console.log(`[xClient] Initialized client for project ${projectId}`);
    console.log(`[xClient] Access Token Prefix: ${accessToken.substring(0, 5)}...`);

    return client;
}
