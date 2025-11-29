import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const posts = await prisma.scheduledPost.findMany({
        where: { projectId: id },
        include: { category: true },
        orderBy: { scheduledAt: 'desc' },
        take: 20
    });

    return NextResponse.json({ posts });
}
