export interface ImageProvider {
    generateImage(prompt: string, apiKey?: string): Promise<string | null>;
}

export class NoneImageProvider implements ImageProvider {
    async generateImage(prompt: string): Promise<string | null> {
        console.log('Skipping image generation (Mode: None)');
        return null;
    }
}

export class GeminiImageProvider implements ImageProvider {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateImage(prompt: string): Promise<string | null> {
        try {
            console.log('Gemini (Imagen 3) Image Generation requested:', prompt);

            const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-preview-06-06:predict?key=${this.apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    instances: [{ prompt: prompt }],
                    parameters: { sampleCount: 1 }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            // Imagen returns base64 encoded image
            const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

            return base64Image || null;
        } catch (error) {
            console.error("Gemini image generation failed:", error);
            return null;
        }
    }
}

import OpenAI from 'openai';

export class OpenAIImageProvider implements ImageProvider {
    async generateImage(prompt: string, apiKey?: string): Promise<string | null> {
        try {
            if (!apiKey) {
                throw new Error('OpenAI API key is required for image generation');
            }

            const openai = new OpenAI({ apiKey });

            console.log('OpenAI (DALL-E 3) Image Generation requested:', prompt);
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                quality: "standard",
                response_format: "url",
            });

            return response.data?.[0]?.url || null;
        } catch (error) {
            console.error("OpenAI image generation failed:", error);
            return null;
        }
    }
}

export function getImageProvider(providerName: 'none' | 'gemini' | 'openai' = 'none'): ImageProvider {
    console.log(`[Debug] getImageProvider called with: ${providerName}`);
    if (providerName === 'gemini') {
        if (process.env.GEMINI_API_KEY) {
            console.log('[Debug] GEMINI_API_KEY found, returning GeminiImageProvider');
            return new GeminiImageProvider(process.env.GEMINI_API_KEY);
        } else {
            console.error('[Debug] GEMINI_API_KEY is MISSING in environment variables!');
        }
    }
    if (providerName === 'openai') {
        return new OpenAIImageProvider();
    }
    return new NoneImageProvider();
}
