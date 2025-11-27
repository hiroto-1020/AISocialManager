"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
            <h2 className="mb-4 text-2xl font-bold text-red-500">ダッシュボードでエラーが発生しました</h2>
            <p className="mb-4 text-gray-400">{error.message}</p>
            <button
                onClick={() => reset()}
                className="rounded bg-cyan-600 px-4 py-2 font-bold text-white hover:bg-cyan-500"
            >
                再試行
            </button>
        </div>
    );
}
