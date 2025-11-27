import { scheduleDailyPosts } from "@/lib/scheduler";
import { prisma } from "@/lib/prisma";
import { processScheduledPost } from "@/lib/postingPipeline";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Ensure daily posts are scheduled (idempotent check inside)
        await scheduleDailyPosts();

        const now = new Date();

        // Find pending posts that are due
        const postsToPublish = await prisma.scheduledPost.findMany({
            where: {
                status: 'PENDING',
                scheduledAt: {
                    lte: now,
                },
            },
            take: 5, // Process max 5 at a time to avoid timeouts
        });

        const results = [];
        for (const post of postsToPublish) {
            // Mark as PROCESSING to prevent double execution
            await prisma.scheduledPost.update({
                where: { id: post.id },
                data: { status: 'PROCESSING' },
            });

            // Process asynchronously (fire and forget for this loop, or await if critical)
            // Here we await to ensure reliability in serverless
            try {
                await processScheduledPost(post.id);
                results.push({ id: post.id, status: 'SUCCESS' });
            } catch (err: any) {
                results.push({ id: post.id, status: 'FAILED', error: err.message });
            }
        }

        return NextResponse.json({ success: true, processed: results.length, results });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to dispatch posts" }, { status: 500 });
    }
}
