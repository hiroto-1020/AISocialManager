"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";

interface PostLog {
    id: string;
    postedAt: string;
    content: string;
    imageUrl?: string;
    status: string;
    platform: string;
    error?: string;
    category?: {
        name: string;
    };
    trendSource?: string;
}

export default function LogsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [logs, setLogs] = useState<PostLog[]>([]);
    const [selectedLog, setSelectedLog] = useState<PostLog | null>(null);

    useEffect(() => {
        fetchLogs();
    }, [id]);

    const fetchLogs = async () => {
        const res = await fetch(`/api/projects/${id}/logs`);
        if (res.ok) {
            setLogs(await res.json());
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h2 className="mb-6 text-2xl font-bold text-neon-blue tracking-widest">POST LOGS</h2>
            <div className="mb-2 text-right text-xs text-gray-500 md:hidden">
                ← 横にスクロールできます →
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-glass shadow-2xl">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                                日時 (Date)
                            </th>
                            <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                                カテゴリ (Category)
                            </th>
                            <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                                内容 (Content)
                            </th>
                            <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                                トレンド (Trend)
                            </th>
                            <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                                ステータス (Status)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-transparent">
                        {logs.map((log, i) => (
                            <motion.tr
                                key={log.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="hover:bg-white/5 transition-colors"
                            >
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                    {new Date(log.postedAt).toLocaleString('ja-JP')}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                                    {log.category?.name || "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    <div
                                        className="max-w-xs truncate cursor-pointer hover:text-cyan-400 transition-colors"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        {log.content}
                                    </div>
                                    {log.imageUrl && (
                                        <a href={log.imageUrl} target="_blank" className="text-xs text-cyan-400 hover:underline hover:text-cyan-300">
                                            [画像を表示]
                                        </a>
                                    )}
                                    {log.error && (
                                        <div className="text-xs text-red-400 mt-1">{log.error}</div>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                                    {log.trendSource ? (
                                        <span
                                            className="inline-block max-w-[150px] truncate cursor-pointer hover:text-cyan-400 transition-colors"
                                            title="クリックで詳細を表示"
                                            onClick={() => setSelectedLog(log)}
                                        >
                                            {log.trendSource}
                                        </span>
                                    ) : "-"}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-bold leading-5 ${log.status === "SUCCESS"
                                            ? "bg-green-900/30 text-green-400 border border-green-500/50"
                                            : log.status === "PENDING"
                                                ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/50"
                                                : "bg-red-900/30 text-red-400 border border-red-500/50"
                                            }`}
                                    >
                                        {log.status}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    ログが見つかりません。
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setSelectedLog(null)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl rounded-xl bg-gray-900 border border-gray-700 p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="mb-4 text-xl font-bold text-white">投稿詳細</h3>
                        <div className="mb-4 rounded bg-black/50 p-4 text-gray-300 whitespace-pre-wrap font-mono text-sm border border-gray-800">
                            {selectedLog.content}
                        </div>
                        {selectedLog.trendSource && (
                            <div className="mb-4">
                                <h4 className="text-sm font-bold text-gray-400 mb-1">参照トレンド:</h4>
                                <div className="rounded bg-purple-900/20 p-3 text-purple-300 text-sm border border-purple-500/30">
                                    {selectedLog.trendSource}
                                </div>
                            </div>
                        )}
                        {selectedLog.imageUrl && (
                            <div className="mb-4">
                                <img src={selectedLog.imageUrl} alt="Generated" className="max-h-64 rounded border border-gray-800" />
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="rounded bg-gray-800 px-4 py-2 text-sm font-bold text-gray-300 hover:bg-gray-700 transition-colors"
                            >
                                閉じる
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div >
    );
}
