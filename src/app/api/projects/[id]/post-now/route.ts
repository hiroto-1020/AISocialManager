import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { processImmediatePost } from "@/lib/postingPipeline";

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

        // Check if project exists and belongs to user
        const project = await prisma.project.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Trigger the immediate post processing
        // This function handles generation, posting, and logging
        const result = await processImmediatePost(id);

        return NextResponse.json({
            success: true,
            message: "Immediate post processed successfully",
            tweetId: result.tweetId
        });
    } catch (error: any) {
        console.error("Immediate post error:", error);

        if (error.message === 'Daily limit reached') {
            // Calculate time until next midnight JST
            const now = new Date();
            const jstOffset = 9 * 60; // JST is UTC+9
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const jstNow = new Date(utc + (3600000 * 9));

            const tomorrowJst = new Date(jstNow);
            tomorrowJst.setDate(tomorrowJst.getDate() + 1);
            tomorrowJst.setHours(0, 0, 0, 0);

            const diffMs = tomorrowJst.getTime() - jstNow.getTime();
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            return NextResponse.json({
                error: "Daily limit reached",
                resetTime: { hours, minutes }
            }, { status: 429 });
        }

        return NextResponse.json({
            error: "Failed to process immediate post",
            details: error.message
        }, { status: 500 });
    }
}
