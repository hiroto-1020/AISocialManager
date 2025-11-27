import { auth } from "@/auth";
import { getXClient } from "@/lib/xClient";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const client = await getXClient(id);
        const me = await client.v2.me();
        return NextResponse.json({ success: true, data: me.data });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "Failed to connect to X" },
            { status: 500 }
        );
    }
}
