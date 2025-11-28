"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        if (!confirm("本当にアカウントを削除しますか？\n作成したプロジェクトや投稿データなど、すべてのデータが完全に削除され、復元できません。")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch("/api/user", {
                method: "DELETE",
            });

            if (res.ok) {
                await signOut({ callbackUrl: "/" });
            } else {
                alert("アカウントの削除に失敗しました。");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error(error);
            alert("エラーが発生しました。");
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen p-6 pt-20 text-white bg-black">
            <header className="mb-8 flex items-center gap-4">
                <Link href="/dashboard" className="rounded-full bg-gray-800 p-2 hover:bg-gray-700 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-bold">設定</h1>
            </header>

            <div className="mx-auto max-w-2xl space-y-8">
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                    <h2 className="mb-4 text-xl font-bold">アカウント情報</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400">名前</label>
                            <div className="text-lg">{session?.user?.name}</div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400">メールアドレス</label>
                            <div className="text-lg">{session?.user?.email}</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-red-900/50 bg-red-950/10 p-6">
                    <div className="mb-4 flex items-center gap-2 text-red-500">
                        <AlertTriangle size={24} />
                        <h2 className="text-xl font-bold">危険なエリア</h2>
                    </div>
                    <p className="mb-6 text-gray-400">
                        アカウントを削除すると、すべてのデータ（プロジェクト、投稿履歴、設定など）が完全に削除されます。この操作は取り消せません。
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                        <Trash2 size={20} />
                        {isDeleting ? "削除中..." : "アカウントを削除する"}
                    </button>
                </div>
            </div>
        </div>
    );
}
