"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";

interface Category {
    id: string;
    name: string;
    targetAudience: string;
    tone: string;
    goal: string;
    ngWords: string;
    trendInspired: boolean;
    trendMode?: string;
    trendSearchQuery?: string;
    hashtags?: string;
    hashtagMode?: string;
    postLength?: string;
    customInstructions?: string;
    useLatestNews?: boolean;
    imagePrompt?: string;
}

export default function CategoriesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Partial<Category>>({
        trendInspired: false,
        trendMode: "topic_only",
        hashtagMode: "auto",
        postLength: "normal",
        useLatestNews: false,
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, [id]);

    const fetchCategories = async () => {
        const res = await fetch(`/api/projects/${id}/categories`);
        if (res.ok) {
            setCategories(await res.json());
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId
            ? `/api/projects/${id}/categories/${editingId}`
            : `/api/projects/${id}/categories`;

        const method = editingId ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setIsCreating(false);
            setEditingId(null);
            setEditingId(null);
            setFormData({ trendInspired: false, trendMode: "topic_only", hashtagMode: "auto", postLength: "normal", useLatestNews: false });
            fetchCategories();
        } else {
            alert("保存に失敗しました");
        }
    };

    const handleEdit = (cat: Category) => {
        setFormData(cat);
        setEditingId(cat.id);
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (catId: string) => {
        if (!confirm("本当にこのカテゴリを削除しますか？")) return;

        const res = await fetch(`/api/projects/${id}/categories/${catId}`, {
            method: "DELETE",
        });

        if (res.ok) {
            fetchCategories();
        } else {
            alert("削除に失敗しました");
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setEditingId(null);
        setFormData({ trendInspired: false, trendMode: "topic_only", hashtagMode: "auto", postLength: "normal", useLatestNews: false });
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neon-blue tracking-widest">CATEGORIES</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (isCreating) handleCancel();
                        else setIsCreating(true);
                    }}
                    className="rounded bg-blue-600/20 border border-blue-500 px-4 py-2 font-bold text-blue-400 hover:bg-blue-500 hover:text-black transition-colors"
                >
                    {isCreating ? "キャンセル" : "カテゴリ追加"}
                </motion.button>
            </div>

            {isCreating && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-8 rounded-xl bg-glass p-6 shadow-2xl border border-gray-800"
                >
                    <h3 className="mb-4 text-lg font-semibold text-gray-300">
                        {editingId ? "カテゴリ編集" : "新規カテゴリ作成"}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">カテゴリ名</label>
                                <input
                                    className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">ターゲット層</label>
                                <input
                                    className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                    value={formData.targetAudience || ""}
                                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">口調 (Tone)</label>
                                <input
                                    className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                    value={formData.tone || ""}
                                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">ゴール (Goal)</label>
                                <input
                                    className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                    value={formData.goal || ""}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">NGワード (カンマ区切り)</label>
                            <input
                                className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                value={formData.ngWords || ""}
                                onChange={(e) => setFormData({ ...formData, ngWords: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">ハッシュタグ設定</label>
                                <div className="flex gap-4 mt-2 mb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="hashtagMode"
                                            value="auto"
                                            checked={formData.hashtagMode === "auto" || !formData.hashtagMode}
                                            onChange={() => setFormData({ ...formData, hashtagMode: "auto" })}
                                            className="text-cyan-500 focus:ring-cyan-500 bg-black/50 border-gray-700"
                                        />
                                        <span className="text-gray-300 text-sm">自動生成</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="hashtagMode"
                                            value="manual"
                                            checked={formData.hashtagMode === "manual"}
                                            onChange={() => setFormData({ ...formData, hashtagMode: "manual" })}
                                            className="text-cyan-500 focus:ring-cyan-500 bg-black/50 border-gray-700"
                                        />
                                        <span className="text-gray-300 text-sm">手動指定</span>
                                    </label>
                                </div>
                                {formData.hashtagMode === "manual" && (
                                    <input
                                        className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        placeholder="例: #AI, #Tech (カンマ区切り)"
                                        value={formData.hashtags || ""}
                                        onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">文字数 (Post Length)</label>
                                <select
                                    className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                    value={formData.postLength || "normal"}
                                    onChange={(e) => setFormData({ ...formData, postLength: e.target.value })}
                                >
                                    <option value="normal">Normal (Auto)</option>
                                    <option value="80">80文字以内 (Strict)</option>
                                    <option value="120">120文字以内 (Strict)</option>
                                    <option value="short">Short (Old)</option>
                                    <option value="long">Long (Old)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">カスタム指示 (Custom Instructions)</label>
                            <textarea
                                className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 h-24"
                                placeholder="例: フレンドリーな口調で、絵文字を多用してください。最後に質問を投げかけてください。"
                                value={formData.customInstructions || ""}
                                onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">画像生成プロンプト (Image Prompt)</label>
                            <textarea
                                className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 h-24"
                                placeholder="例: サイバーパンク風の都市、ネオンカラー、詳細な背景。 (空欄の場合は自動生成)"
                                value={formData.imagePrompt || ""}
                                onChange={(e) => setFormData({ ...formData, imagePrompt: e.target.value })}
                            />
                        </div>

                        <div className="border-t border-gray-800 pt-4 flex flex-col gap-3">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.trendInspired}
                                    onChange={(e) => setFormData({ ...formData, trendInspired: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-700 bg-black/50 text-cyan-500 focus:ring-cyan-500"
                                />
                                <span className="font-medium text-gray-300">トレンド参照を有効にする (X Trends)</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.useLatestNews}
                                    onChange={(e) => setFormData({ ...formData, useLatestNews: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-700 bg-black/50 text-green-500 focus:ring-green-500"
                                />
                                <span className="font-medium text-gray-300">最新ニュースを取得する (Google News)</span>
                            </label>
                        </div>

                        {formData.trendInspired && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-gray-900/50 p-4 rounded border border-gray-800"
                            >
                                <div className="mb-4">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">トレンドモード</label>
                                    <select
                                        className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        value={formData.trendMode}
                                        onChange={(e) => setFormData({ ...formData, trendMode: e.target.value })}
                                    >
                                        <option value="topic_only">トピックのみ参照 (オリジナル投稿)</option>
                                        <option value="quote_with_comment">引用リツイート (コメント付き)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">検索クエリ</label>
                                    <input
                                        className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        placeholder='例: "AI マーケティング" OR #AI'
                                        value={formData.trendSearchQuery || ""}
                                        onChange={(e) => setFormData({ ...formData, trendSearchQuery: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full rounded bg-green-600/20 border border-green-500 py-2 font-bold text-green-400 hover:bg-green-500 hover:text-black transition-colors"
                        >
                            {editingId ? "変更を保存" : "カテゴリを保存"}
                        </motion.button>
                    </form>
                </motion.div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative rounded-xl bg-glass p-4 shadow-lg border border-gray-800 hover:neon-border-pink transition-all group"
                    >
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(cat)}
                                className="rounded bg-blue-500/20 p-1 text-blue-400 hover:bg-blue-500 hover:text-black"
                            >
                                編集
                            </button>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="rounded bg-red-500/20 p-1 text-red-400 hover:bg-red-500 hover:text-black"
                            >
                                削除
                            </button>
                        </div>

                        <h3 className="font-bold text-lg text-white pr-16">{cat.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">ターゲット: {cat.targetAudience}</p>
                        <p className="text-sm text-gray-400">口調: {cat.tone}</p>
                        {cat.trendInspired && (
                            <div className="mt-2 inline-block rounded bg-purple-900/50 border border-purple-500 px-2 py-1 text-xs font-semibold text-purple-300">
                                Trend: {cat.trendMode === 'topic_only' ? 'Topic' : 'Quote'}
                            </div>
                        )}
                        {cat.useLatestNews && (
                            <div className="mt-2 ml-2 inline-block rounded bg-green-900/50 border border-green-500 px-2 py-1 text-xs font-semibold text-green-300">
                                News
                            </div>
                        )}
                    </motion.div>
                ))}
                {categories.length === 0 && !isCreating && (
                    <div className="col-span-full py-8 text-center text-gray-500">
                        カテゴリがまだありません。
                    </div>
                )}
            </div>
        </div>
    );
}
