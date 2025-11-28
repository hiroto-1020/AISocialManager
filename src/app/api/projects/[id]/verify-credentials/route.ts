import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getXClient } from "@/lib/xClient";

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
        const client = await getXClient(id);

        // 1. Check current user info (Verify Token Validity)
        const me = await client.v2.me();

        // 2. Check Token Permissions (if possible via API, otherwise infer from success)
        // v2.me() only requires Read.

        // 3. Try a dry-run tweet (or just assume write if configured)
        // There isn't a perfect "check write permission" endpoint without writing.

        return NextResponse.json({
            success: true,
            message: "Credentials are valid (Read Access Confirmed)",
            user: me.data
        });

    } catch (error: any) {
        console.error("Verification failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.data || error,
            code: error.code
        }, { status: 500 });
    }
}
