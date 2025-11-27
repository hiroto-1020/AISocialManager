import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const logs = await prisma.postLog.findMany({
        where: { projectId: id },
        orderBy: { postedAt: 'desc' },
        include: { category: true },
        take: 50,
    });

    return NextResponse.json(logs);
}
