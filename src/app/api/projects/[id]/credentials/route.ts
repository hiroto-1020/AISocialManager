import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const credentialsSchema = z.object({
    apiKey: z.string().optional(),
    apiKeySecret: z.string().optional(),
    accessToken: z.string().optional(),
    accessTokenSecret: z.string().optional(),
    openaiApiKey: z.string().optional(),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { apiKey, apiKeySecret, accessToken, accessTokenSecret, openaiApiKey } = credentialsSchema.parse(body);

        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Update OpenAI API Key if provided
        if (openaiApiKey !== undefined) {
            await prisma.project.update({
                where: { id },
                data: {
                    openaiApiKey: openaiApiKey ? encrypt(openaiApiKey) : null,
                },
            });
        }

        // Update X Credentials if provided (all or nothing for now, or partial if we want)
        // For now, let's assume if any X credential is provided, we update X credentials
        if (apiKey || apiKeySecret || accessToken || accessTokenSecret) {
            // Ensure all X credentials are present if we are creating/updating them
            // Or just update what is provided? The UI sends all 4.
            // Let's keep it simple and expect all 4 if we are touching X credentials, 
            // but since I made them optional in schema, I should check.

            if (apiKey && apiKeySecret && accessToken && accessTokenSecret) {
                await prisma.xCredentials.upsert({
                    where: { projectId: id },
                    update: {
                        apiKey: encrypt(apiKey),
                        apiKeySecret: encrypt(apiKeySecret),
                        accessToken: encrypt(accessToken),
                        accessTokenSecret: encrypt(accessTokenSecret),
                    },
                    create: {
                        projectId: id,
                        apiKey: encrypt(apiKey),
                        apiKeySecret: encrypt(apiKeySecret),
                        accessToken: encrypt(accessToken),
                        accessTokenSecret: encrypt(accessTokenSecret),
                    },
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save credentials" }, { status: 500 });
    }
}

import { decrypt } from "@/lib/crypto";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
            include: { xCredentials: true },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const credentials: any = {
            openaiApiKey: project.openaiApiKey ? decrypt(project.openaiApiKey) : "",
        };

        if (project.xCredentials) {
            credentials.apiKey = decrypt(project.xCredentials.apiKey);
            credentials.apiKeySecret = decrypt(project.xCredentials.apiKeySecret);
            credentials.accessToken = decrypt(project.xCredentials.accessToken);
            credentials.accessTokenSecret = decrypt(project.xCredentials.accessTokenSecret);
        } else {
            credentials.apiKey = "";
            credentials.apiKeySecret = "";
            credentials.accessToken = "";
            credentials.accessTokenSecret = "";
        }

        return NextResponse.json({ credentials });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 });
    }
}
