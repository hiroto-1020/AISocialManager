import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(1),
    targetAudience: z.string().min(1),
    tone: z.string().min(1),
    goal: z.string().min(1),
    ngWords: z.string().optional(),
    trendInspired: z.boolean(),
    trendMode: z.string().optional().nullable(),
    trendSearchQuery: z.string().optional().nullable(),
    hashtags: z.string().optional(),
    hashtagMode: z.enum(["auto", "manual"]).default("auto"),
    postLength: z.enum(["short", "normal", "long"]).default("normal"),
    customInstructions: z.string().optional(),
    useLatestNews: z.boolean().default(false),
    imagePrompt: z.string().optional(),
    isActive: z.boolean().optional().default(true),
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
        const data = categorySchema.parse(body);

        // Ensure only one category is active
        if (data.isActive) {
            await prisma.category.updateMany({
                where: { projectId: id },
                data: { isActive: false },
            });
        }

        const category = await prisma.category.create({
            data: {
                projectId: id,
                name: data.name,
                targetAudience: data.targetAudience,
                tone: data.tone,
                goal: data.goal,
                ngWords: data.ngWords || "",
                trendInspired: data.trendInspired,
                trendMode: data.trendMode,
                trendSearchQuery: data.trendSearchQuery,
                hashtags: data.hashtags || "",
                hashtagMode: data.hashtagMode,
                postLength: data.postLength,
                customInstructions: data.customInstructions,
                useLatestNews: data.useLatestNews,
                imagePrompt: data.imagePrompt,
                isActive: data.isActive,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const categories = await prisma.category.findMany({
        where: { projectId: id },
        orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
}
