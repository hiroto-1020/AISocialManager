const { PrismaClient } = require('@prisma/client');
const { TwitterApi } = require('twitter-api-v2');
const crypto = require('crypto');

// Fallback key - in a real app this comes from process.env
// We need to make sure we use the SAME key as the app.
// If the app uses a specific key in .env, we need to load it.
// We can try to load dotenv.
// require('dotenv').config();

const ENCRYPTION_KEY = process.env.CREDENTIALS_ENCRYPTION_KEY || 'default-key-must-be-32-bytes-long!'; 
console.log('Encryption Key Length:', ENCRYPTION_KEY.length); 
const IV_LENGTH = 16;

function decrypt(text) {
    if (!text) return '';
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption failed:', error.message);
        return text;
    }
}

const prisma = new PrismaClient();

async function verifyCredentials() {
    const projectId = 'cmibufety0001jo062an8khsk'; // From user logs

    console.log(`Checking credentials for project: ${projectId}`);

    try {
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

        console.log('Attempting to download and upload media (mimicking app behavior)...');
        
        // Use a real image URL (placeholder)
        const imageUrl = 'https://placehold.co/600x400/png';
        const https = require('https');
        const fs = require('fs');
        const path = require('path');
        const os = require('os');

        const tempFilePath = path.join(os.tmpdir(), `verify_image_${Date.now()}.png`);
        const file = fs.createWriteStream(tempFilePath);

        await new Promise((resolve, reject) => {
            https.get(imageUrl, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlinkSync(tempFilePath);
                reject(err);
            });
        });

        console.log('Image downloaded to:', tempFilePath);

        // Upload media (v1.1)
        const mediaId = await client.v1.uploadMedia(tempFilePath);
        console.log('✅ Media uploaded. ID:', mediaId);
        
        // Clean up
        fs.unlinkSync(tempFilePath);

        console.log('Attempting to post a test tweet with media...');
        const tweet = await client.v2.tweet({
            text: `Test verification tweet with media ${Date.now()}`,
            media: { media_ids: [mediaId] }
        });
        
        console.log('✅ SUCCESS! Tweet posted.');
        console.log('Tweet ID:', tweet.data.id);

    } catch (error) {
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
