import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.user.delete({
            where: {
                id: session.user.id,
            },
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Failed to delete user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
