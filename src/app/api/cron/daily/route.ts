import { scheduleDailyPosts } from "@/lib/scheduler";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await scheduleDailyPosts();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to schedule posts" }, { status: 500 });
    }
}
