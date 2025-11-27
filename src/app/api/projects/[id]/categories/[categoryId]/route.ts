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
    isActive: z.boolean().optional(),
});

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, categoryId } = await params;
        const body = await req.json();

        console.log("PUT request body:", JSON.stringify(body));

        const data = categorySchema.parse(body);

        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (data.isActive) {
            await prisma.$transaction([
                prisma.category.updateMany({
                    where: { projectId: id, id: { not: categoryId } },
                    data: { isActive: false },
                }),
                prisma.category.update({
                    where: { id: categoryId },
                    data: {
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
                        isActive: true,
                    },
                }),
            ]);

            const updatedCategory = await prisma.category.findUnique({ where: { id: categoryId } });
            return NextResponse.json(updatedCategory);
        } else {
            const category = await prisma.category.update({
                where: { id: categoryId },
                data: {
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
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation errors:", JSON.stringify(error.issues));
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
        }
        console.error("PUT category error:", error instanceof Error ? error.message : "Unknown error");
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, categoryId } = await params;

        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.category.delete({
            where: { id: categoryId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE category error:", error instanceof Error ? error.message : "Unknown error");
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
