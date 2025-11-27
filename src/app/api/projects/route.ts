import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const projectSchema = z.object({
    name: z.string().min(1),
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name } = projectSchema.parse(body);

        const project = await prisma.project.create({
            data: {
                name,
                userId: session.user.id,
                postingRule: {
                    create: {
                        postingMode: "fixed",
                        imageMode: "text_only",
                    },
                },
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}
