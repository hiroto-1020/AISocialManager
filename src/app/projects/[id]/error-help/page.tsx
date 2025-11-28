"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ErrorHelpPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const errors = [
        {
            code: "403 Forbidden",
            title: "権限エラー (Permission Denied)",
            cause: "Twitter APIの書き込み権限がない、または投稿内容が制限（文字数など）を超えています。",
            solution: [
                "Developer Portalで「User authentication settings」が「Read and Write」になっているか確認してください。",
                "設定を変更した場合は、必ず「Regenerate」でアクセストークンを再生成し、アプリに再設定してください。",
                "投稿内容が長すぎる可能性があります。カテゴリ設定で「文字数」を「80文字」や「120文字」に設定してみてください。",
                "同じ内容を連続で投稿しようとすると拒否されることがあります。"
            ]
        },
        {
            code: "429 Too Many Requests",
            title: "API制限 (Rate Limit Exceeded)",
            cause: "短時間に多くのリクエストを送りすぎました。または1日の投稿上限に達しました。",
            solution: [
                "Twitter API (Free Tier) は、24時間で50ツイートまでしか投稿できません。",
                "しばらく時間を置いてから（数時間〜24時間後）再試行してください。",
                "アプリの「投稿設定」で「1日の最大投稿数」を減らすことをお勧めします。"
            ]
        },
        {
            code: "401 Unauthorized",
            title: "認証エラー (Invalid Credentials)",
            cause: "API KeyやAccess Tokenが間違っているか、無効になっています。",
            solution: [
                "Developer Portalから正しいKeyとTokenをコピーし、アプリの設定画面で再入力してください。",
                "コピペの際に余計なスペースが入っていないか確認してください。"
            ]
        },
        {
            code: "Trend Fetch Error",
            title: "トレンド取得エラー",
            cause: "Free Tierではトレンド検索APIが使用できません。",
            solution: [
                "カテゴリ設定で「トレンド参照」をOFFにするか、無視して投稿されます。",
                "（現在は自動的にスキップされるように修正されています）"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-red-500 tracking-widest">TROUBLESHOOTING</h2>
                <Link
                    href={`/projects/${id}`}
                    className="rounded bg-gray-800 border border-gray-700 px-4 py-2 font-bold text-gray-300 hover:bg-gray-700 transition-colors"
                >
                    戻る
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {errors.map((err, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-xl bg-glass p-6 shadow-lg border border-red-900/30"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-red-900/50 text-red-200 px-2 py-1 rounded text-xs font-mono border border-red-800">
                                {err.code}
                            </span>
                            <h3 className="font-bold text-lg text-red-400">{err.title}</h3>
                        </div>

                        <p className="text-gray-300 mb-4 text-sm">{err.cause}</p>

                        <div className="bg-black/50 p-4 rounded border border-gray-800">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">対処方法:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                                {err.solution.map((sol, j) => (
                                    <li key={j}>{sol}</li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-6 rounded-xl bg-blue-900/10 border border-blue-900/30">
                <h3 className="text-lg font-bold text-blue-400 mb-2">それでも解決しない場合</h3>
                <p className="text-gray-400 text-sm">
                    上記を試しても解決しない場合は、Twitter Developer Portalのアカウントステータス（凍結されていないかなど）を確認してください。<br />
                    また、アプリの「デバッグ情報」にある「強制ツイートテスト」を試すことで、問題の切り分け（アプリの問題か、アカウントの問題か）が可能です。
                </p>
            </div>
        </div>
    );
}
