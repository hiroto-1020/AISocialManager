import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getXClient } from "@/lib/xClient";
import { decrypt } from "@/lib/crypto";

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

        // Fetch raw credentials to show prefix
        const creds = await prisma.xCredentials.findUnique({ where: { projectId: id } });
        let tokenPrefix = "N/A";
        if (creds && creds.accessToken) {
            try {
                const decrypted = decrypt(creds.accessToken);
                tokenPrefix = decrypted.substring(0, 5) + "...";
            } catch (e) {
                tokenPrefix = "Decrypt Error";
            }
        }

        // 1. Check current user info (Verify Token Validity)
        const me = await client.v2.me();

        return NextResponse.json({
            success: true,
            message: "Credentials are valid (Read Access Confirmed)",
            user: me.data,
            tokenPrefix: tokenPrefix
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
