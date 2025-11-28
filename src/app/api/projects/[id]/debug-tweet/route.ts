import { NextResponse } from "next/server";
import { auth } from "@/auth";
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

        const text = `Debug Tweet ${Date.now()}`;
        console.log("Attempting debug tweet:", text);

        const result = await client.v2.tweet(text);

        return NextResponse.json({
            success: true,
            message: "Tweet posted successfully",
            data: result.data
        });

    } catch (error: any) {
        console.error("Debug tweet failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.data || error,
            code: error.code
        }, { status: 500 });
    }
}
