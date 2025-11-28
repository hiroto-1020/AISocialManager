"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [apiKey, setApiKey] = useState("");
    const [apiKeySecret, setApiKeySecret] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [accessTokenSecret, setAccessTokenSecret] = useState("");
    const [openaiApiKey, setOpenaiApiKey] = useState("");
    const [message, setMessage] = useState("");
    const [testResult, setTestResult] = useState<any>(null);
    const [isPosting, setIsPosting] = useState(false);

    const [postingRule, setPostingRule] = useState({
        maxPostsPerDay: 3,
        postingMode: "fixed",
        fixedTimes: ["12:00", "18:00", "21:00"],
        imageMode: "none",
    });

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/projects/${id}/credentials`)
            .then((res) => res.json())
            .then((data) => {
                if (data.credentials) {
                    setApiKey(data.credentials.apiKey || "");
                    setApiKeySecret(data.credentials.apiKeySecret || "");
                    setAccessToken(data.credentials.accessToken || "");
                    setAccessTokenSecret(data.credentials.accessTokenSecret || "");
                    setOpenaiApiKey(data.credentials.openaiApiKey || "");
                }
            })
            .catch((err) => console.error(err));

        fetch(`/api/projects/${id}/posting-rule`)
            .then((res) => res.json())
            .then((data) => {
                if (data.id) {
                    setPostingRule({
                        maxPostsPerDay: data.maxPostsPerDay || 3,
                        postingMode: data.postingMode || "fixed",
                        fixedTimes: data.fixedTimes ? data.fixedTimes.split(",") : ["12:00", "18:00", "21:00"],
                        imageMode: data.imageMode || "none",
                    });
                }
            })
            .catch((err) => console.error(err));

        fetch(`/api/projects/${id}/categories`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            })
            .catch((err) => console.error(err));
    }, [id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("保存中...");
        const res = await fetch(`/api/projects/${id}/credentials`, {
            method: "POST",
            body: JSON.stringify({ apiKey, apiKeySecret, accessToken, accessTokenSecret, openaiApiKey }),
        });
        if (res.ok) {
            setMessage("保存しました！");
        } else {
            setMessage("保存に失敗しました。");
        }
    };

    const handleTest = async () => {
        setMessage("接続テスト中...");
        setTestResult(null);
        const res = await fetch(`/api/projects/${id}/test-x-credentials`, {
            method: "POST",
        });
        const data = await res.json();
        if (res.ok) {
            setMessage("接続成功！");
            setTestResult(data.data);
        } else {
            setMessage("接続失敗: " + data.error);
        }
    };

    const handleSaveRules = async () => {
        const res = await fetch(`/api/projects/${id}/posting-rule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                maxPostsPerDay: postingRule.maxPostsPerDay,
                postingMode: postingRule.postingMode,
                fixedTimes: postingRule.fixedTimes.join(","),
                imageMode: postingRule.imageMode,
            }),
        });
        if (res.ok) {
            alert("投稿ルールを保存しました");
        } else {
            alert("保存に失敗しました");
        }
    };

    const handlePostNow = async () => {
        if (!confirm("今すぐ投稿を生成して予約/投稿しますか？")) return;
        setIsPosting(true);
        try {
            const res = await fetch(`/api/projects/${id}/post-now`, { method: "POST" });
            if (res.ok) {
                alert("投稿処理を開始しました。ログを確認してください。");
            } else if (res.status === 429) {
                const data = await res.json();
                const { hours, minutes } = data.resetTime;
                alert(`本日の投稿上限に達しました。\nあと ${hours}時間 ${minutes}分 で回復します。`);
            } else {
                const data = await res.json();
                alert("処理の開始に失敗しました: " + (data.details || data.error || "不明なエラー"));
            }
        } catch (error) {
            console.error(error);
            alert("通信エラーが発生しました");
        } finally {
            setIsPosting(false);
        }
    };

    const handleCategoryChange = async (cat: any) => {
        const oldCategories = [...categories];
        setCategories(prev => prev.map(c => ({ ...c, isActive: c.id === cat.id })));

        console.log("Category data:", cat);

        const res = await fetch(`/api/projects/${id}/categories/${cat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: cat.name || "",
                targetAudience: cat.targetAudience || "",
                tone: cat.tone || "",
                goal: cat.goal || "",
                ngWords: cat.ngWords || "",
                trendInspired: cat.trendInspired ?? false,
                trendMode: cat.trendMode || null,
                trendSearchQuery: cat.trendSearchQuery || null,
                isActive: true,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Update failed:", errorData);
            setCategories(oldCategories);
            alert("更新に失敗しました: " + (errorData.error || "不明なエラー"));
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-4 md:p-8">
            <motion.div className="mx-auto max-w-4xl rounded-xl bg-glass p-4 md:p-8 shadow-2xl border border-gray-800">
                <h1 className="mb-6 text-2xl font-bold text-neon-blue tracking-widest">プロジェクト設定</h1>

                <div className="mb-12 border-b border-gray-800 pb-8">
                    <h2 className="mb-4 text-xl font-semibold text-gray-300">投稿ルール設定</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                1日の投稿回数 (最大3回)
                            </label>
                            <select
                                className="block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none"
                                value={postingRule.maxPostsPerDay}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setPostingRule(prev => ({
                                        ...prev,
                                        maxPostsPerDay: val,
                                        fixedTimes: Array(val).fill("").map((_, i) => prev.fixedTimes[i] || "12:00")
                                    }));
                                }}
                            >
                                <option value={1}>1回</option>
                                <option value={2}>2回</option>
                                <option value={3}>3回</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                投稿モード
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="postingMode"
                                        value="fixed"
                                        checked={postingRule.postingMode === "fixed"}
                                        onChange={() => setPostingRule({ ...postingRule, postingMode: "fixed" })}
                                        className="text-cyan-500 focus:ring-cyan-500 bg-black/50 border-gray-700"
                                    />
                                    <span className="text-gray-300">時間指定</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="postingMode"
                                        value="random"
                                        checked={postingRule.postingMode === "random"}
                                        onChange={() => setPostingRule({ ...postingRule, postingMode: "random" })}
                                        className="text-cyan-500 focus:ring-cyan-500 bg-black/50 border-gray-700"
                                    />
                                    <span className="text-gray-300">ランダム (時間帯はお任せ)</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                画像生成
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="imageMode"
                                        value="none"
                                        checked={postingRule.imageMode === "none"}
                                        onChange={() => setPostingRule({ ...postingRule, imageMode: "none" })}
                                        className="text-cyan-500 focus:ring-cyan-500 bg-black/50 border-gray-700"
                                    />
                                    <span className="text-gray-300">なし (テキストのみ)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="imageMode"
                                        value="with_image"
                                        checked={postingRule.imageMode === "with_image"}
                                        onChange={() => setPostingRule({ ...postingRule, imageMode: "with_image" })}
                                        className="text-cyan-500 focus:ring-cyan-500 bg-black/50 border-gray-700"
                                    />
                                    <span className="text-gray-300">あり (AI画像生成)</span>
                                </label>
                            </div>
                        </div>

                        {postingRule.postingMode === "fixed" && (
                            <div className="space-y-3 bg-gray-900/30 p-4 rounded border border-gray-800">
                                <p className="text-xs text-gray-400 mb-2">投稿時間を指定してください</p>
                                {Array.from({ length: postingRule.maxPostsPerDay }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-sm text-cyan-400 font-bold">#{i + 1}</span>
                                        <input
                                            type="time"
                                            className="rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none"
                                            value={postingRule.fixedTimes[i] || ""}
                                            onChange={(e) => {
                                                const newTimes = [...postingRule.fixedTimes];
                                                newTimes[i] = e.target.value;
                                                setPostingRule({ ...postingRule, fixedTimes: newTimes });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveRules}
                            className="rounded bg-purple-600/20 border border-purple-500 px-4 py-2 text-purple-400 font-bold hover:bg-purple-500 hover:text-black transition-colors"
                        >
                            ルールを保存
                        </motion.button>
                    </div>
                </div>

                <div className="mb-12 border-b border-gray-800 pb-8">
                    <h2 className="mb-4 text-xl font-semibold text-gray-300">使用カテゴリ設定</h2>
                    <p className="mb-4 text-sm text-gray-400">
                        自動投稿に使用するカテゴリを選択してください。チェックが入っているカテゴリから投稿が生成されます。
                    </p>
                    <div className="space-y-3 bg-gray-900/30 p-4 rounded border border-gray-800">
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <label key={cat.id} className={`flex items-center gap-3 cursor-pointer p-3 rounded border transition-all ${cat.isActive ? 'bg-cyan-900/20 border-cyan-500' : 'border-gray-800 hover:bg-white/5'}`}>
                                    <input
                                        type="radio"
                                        name="activeCategory"
                                        checked={!!cat.isActive}
                                        onChange={() => handleCategoryChange(cat)}
                                        className="h-5 w-5 text-cyan-500 focus:ring-cyan-500 bg-black/50 border-gray-700"
                                    />
                                    <div>
                                        <div className={`font-bold ${cat.isActive ? 'text-cyan-400' : 'text-white'}`}>{cat.name}</div>
                                        <div className="text-xs text-gray-500">{cat.targetAudience}</div>
                                    </div>
                                </label>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">カテゴリがまだありません。</p>
                        )}
                    </div>
                </div>

                <div className="mb-12 border-b border-gray-800 pb-8">
                    <h2 className="mb-4 text-xl font-semibold text-gray-300">X API設定</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">API Key</label>
                            <input
                                className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                type="password"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">API Key Secret</label>
                            <input
                                className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                value={apiKeySecret}
                                onChange={(e) => setApiKeySecret(e.target.value)}
                                type="password"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Access Token</label>
                            <input
                                className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                value={accessToken}
                                onChange={(e) => setAccessToken(e.target.value)}
                                type="password"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Access Token Secret</label>
                            <input
                                className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                value={accessTokenSecret}
                                onChange={(e) => setAccessTokenSecret(e.target.value)}
                                type="password"
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-800">
                            <h3 className="mb-4 text-sm font-bold text-gray-400">AI設定 (Optional)</h3>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">OpenAI API Key</label>
                                <p className="text-xs text-gray-500 mb-2">設定すると、システム共通キーの代わりにこのキーが使用されます（画像生成など）。</p>
                                <input
                                    className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                    value={openaiApiKey}
                                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                                    type="password"
                                    placeholder="sk-..."
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="rounded bg-blue-600/20 border border-blue-500 px-4 py-2 text-blue-400 font-bold hover:bg-blue-500 hover:text-black transition-colors"
                        >
                            設定を保存
                        </motion.button>
                    </form>

                    <div className="mt-6">
                        <h3 className="mb-2 text-sm font-bold text-gray-400">接続テスト</h3>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleTest}
                            className="rounded bg-green-600/20 border border-green-500 px-4 py-2 text-green-400 font-bold hover:bg-green-500 hover:text-black transition-colors"
                        >
                            X 接続テストを実行
                        </motion.button>
                        {message && <p className="mt-4 font-medium text-cyan-400">{message}</p>}
                        {testResult && (
                            <div className="mt-4 rounded bg-black/50 border border-gray-700 p-4 overflow-auto">
                                <pre className="text-xs text-green-400 font-mono">{JSON.stringify(testResult, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-12 border-b border-gray-800 pb-8">
                    <h2 className="mb-4 text-xl font-semibold text-gray-300">手動アクション</h2>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-yellow-900/10 border border-yellow-500/30 p-4">
                        <div>
                            <h3 className="font-bold text-yellow-500">今すぐ投稿</h3>
                            <p className="text-sm text-gray-400">スケジュールを待たずに、即座に投稿を生成して予約/投稿します。</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePostNow}
                            disabled={isPosting}
                            className={`w-full sm:w-auto rounded px-4 py-2 font-bold text-black transition-colors ${isPosting ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500'}`}
                        >
                            {isPosting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    実行中...
                                </span>
                            ) : (
                                "実行する"
                            )}
                        </motion.button>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <Link href={`/projects/${id}/categories`} className="w-full">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-lg font-black text-white shadow-lg hover:from-cyan-500 hover:to-blue-500"
                        >
                            カテゴリ設定へ進む →
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
