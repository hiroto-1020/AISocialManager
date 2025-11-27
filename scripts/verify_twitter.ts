import { PrismaClient } from '@prisma/client';
import { TwitterApi } from 'twitter-api-v2';
import * as crypto from 'crypto';

// Re-implement decrypt since we can't easily import from lib in this standalone script context without ts-node setup issues sometimes
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-must-be-32-bytes-long!'; // Fallback for safety, but user should have env
const IV_LENGTH = 16;

function decrypt(text: string): string {
    if (!text) return '';
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption failed:', error);
        return text;
    }
}

const prisma = new PrismaClient();

async function verifyCredentials() {
    const projectId = 'cmibufety0001jo062an8khsk'; // From user logs

    console.log(`Checking credentials for project: ${projectId}`);

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { xCredentials: true },
    });

    if (!project || !project.xCredentials) {
        console.error('❌ No credentials found in database!');
        return;
    }

    const apiKey = decrypt(project.xCredentials.apiKey);
    const apiKeySecret = decrypt(project.xCredentials.apiKeySecret);
    const accessToken = decrypt(project.xCredentials.accessToken);
    const accessTokenSecret = decrypt(project.xCredentials.accessTokenSecret);

    console.log('Credentials decrypted.');
    console.log(`API Key: ${apiKey.substring(0, 5)}...`);
    console.log(`Access Token: ${accessToken.substring(0, 10)}...`);

    const client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiKeySecret,
        accessToken: accessToken,
        accessSecret: accessTokenSecret,
    });

    try {
        console.log('Attempting to post a test tweet...');
        const tweet = await client.v2.tweet(`Test verification tweet ${Date.now()}`);
        console.log('✅ SUCCESS! Tweet posted.');
        console.log('Tweet ID:', tweet.data.id);
    } catch (error: any) {
        console.error('❌ FAILED to post tweet.');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        if (error.data) {
            console.error('Error details:', JSON.stringify(error.data, null, 2));
        }

        if (error.code === 403) {
            console.log('\n--- DIAGNOSIS ---');
            console.log('A 403 Forbidden error usually means your Access Token does not have "Write" permissions.');
            console.log('Even if you updated the App Permissions in the Developer Portal, OLD TOKENS DO NOT UPDATE AUTOMATICALLY.');
            console.log('You MUST regenerate the Access Token and Secret in the Developer Portal and update them in this app.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

verifyCredentials();
