"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Settings, Activity, Zap, Trash2 } from "lucide-react";

interface Project {
    id: string;
    name: string;
    description?: string;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await fetch("/api/projects");
            if (res.ok) {
                setProjects(await res.json());
            }
        };
        if (session) fetchProjects();
    }, [session]);

    const handleDelete = async (projectId: string, projectName: string) => {
        if (!confirm(`本当に「${projectName}」を削除しますか？この操作は取り消せません。`)) {
            return;
        }

        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setProjects(projects.filter((p) => p.id !== projectId));
            } else {
                alert("削除に失敗しました");
            }
        } catch (error) {
            console.error(error);
            alert("エラーが発生しました");
        }
    };

    return (
        <div className="min-h-screen p-6 pt-20 text-white">
            <header id="dashboard-header" className="mb-8 flex flex-col gap-6 border-b border-gray-800 pb-6 md:mb-12 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 md:text-4xl">
                        ダッシュボード
                    </h1>
                    <p className="text-sm text-gray-500 md:text-base">ようこそ、 {session?.user?.name} さん</p>
                    <Link href="/help" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-800/50 px-3 py-1.5 text-xs font-bold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all md:px-4 md:py-2 md:text-sm">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] md:w-5 md:h-5 md:text-xs">?</span>
                        <span>使い方が分からない場合はこちら</span>
                    </Link>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <Link href="/settings">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-full bg-gray-800 p-3 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                            title="設定"
                        >
                            <Settings size={20} className="md:w-6 md:h-6" />
                        </motion.button>
                    </Link>
                    <Link href="/projects/new" className="flex-1 md:flex-none">
                        <motion.button
                            id="new-project-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-500/10 px-4 py-3 font-bold text-cyan-400 ring-1 ring-cyan-500 hover:bg-cyan-500 hover:text-black transition-all md:w-auto md:px-6"
                        >
                            <Plus size={18} />
                            <span className="text-sm md:text-base">新規プロジェクト</span>
                        </motion.button>
                    </Link>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        className="group relative overflow-hidden rounded-xl bg-glass p-6 transition-all hover:neon-border-blue border border-gray-800"
                    >
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/20 transition-all" />

                        <div className="relative z-10">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="rounded-full bg-gray-800 p-2 text-cyan-400">
                                    <Activity size={20} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDelete(project.id, project.name)}
                                        className="rounded-full p-2 text-gray-500 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                                        title="プロジェクトを削除"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="mb-2 text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                {project.name}
                            </h2>
                            <p className="mb-6 text-sm text-gray-400 line-clamp-2">
                                {project.description || "説明なし"}
                            </p>

                            <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                                <div className="text-xs text-gray-500">
                                    ステータス: <span className="text-green-500">稼働中</span>
                                </div>
                                <Link href={`/projects/${project.id}`}>
                                    <button className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                        管理画面へ
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 bg-black/50 py-20 text-center">
                        <Zap size={48} className="mb-4 text-gray-700" />
                        <h3 className="text-lg font-medium text-gray-400">プロジェクトがありません</h3>
                        <p className="text-gray-600">新しいプロジェクトを作成して開始してください。</p>
                    </div>
                )}
            </div>
        </div>
    );
}
