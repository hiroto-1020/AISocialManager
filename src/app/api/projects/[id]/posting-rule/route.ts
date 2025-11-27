import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const postingRuleSchema = z.object({
    maxPostsPerDay: z.number().min(1).max(3),
    postingMode: z.enum(["fixed", "random"]),
    fixedTimes: z.string().optional(), // Comma separated "HH:MM"
    imageMode: z.string().default("none"),
});

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const rule = await prisma.postingRule.findUnique({
        where: { projectId: id },
    });

    return NextResponse.json(rule || {});
}

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
        const data = postingRuleSchema.parse(body);

        const rule = await prisma.postingRule.upsert({
            where: { projectId: id },
            update: {
                maxPostsPerDay: data.maxPostsPerDay,
                postingMode: data.postingMode,
                fixedTimes: data.fixedTimes || "",
                imageMode: data.imageMode,
            },
            create: {
                projectId: id,
                maxPostsPerDay: data.maxPostsPerDay,
                postingMode: data.postingMode,
                fixedTimes: data.fixedTimes || "",
                imageMode: data.imageMode,
            },
        });

        return NextResponse.json(rule);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save posting rule" }, { status: 500 });
    }
}
