"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Key, Layers, Activity, Settings, ChevronRight, Copy, Check } from "lucide-react";

export default function HelpPage() {
    const [activeTab, setActiveTab] = useState("start");

    const tabs = [
        { id: "start", label: "はじめに", icon: <BookOpen size={18} /> },
        { id: "api", label: "X API 連携ガイド", icon: <Key size={18} /> },
        { id: "project", label: "プロジェクト管理", icon: <Layers size={18} /> },
        { id: "category", label: "カテゴリ設定", icon: <Settings size={18} /> },
        { id: "logs", label: "ログ確認", icon: <Activity size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-black/90 p-6 pt-16 md:p-12 text-white">
            <div className="mx-auto max-w-6xl">
                <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-gray-200 hover:text-white transition-colors z-10 relative">
                    <ArrowLeft size={20} />
                    ダッシュボードに戻る
                </Link>

                <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
                    {/* Sidebar */}
                    <div className="space-y-2">
                        <h2 className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                            MANUAL INDEX
                        </h2>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${activeTab === tab.id
                                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="min-h-[600px] rounded-2xl bg-gray-900/80 p-6 md:p-8 border border-gray-800 overflow-hidden">
                        {activeTab === "start" && <GettingStartedContent />}
                        {activeTab === "api" && <ApiGuideContent />}
                        {activeTab === "project" && <ProjectGuideContent />}
                        {activeTab === "category" && <CategoryGuideContent />}
                        {activeTab === "logs" && <LogsGuideContent />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function GettingStartedContent() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-6 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                AI Social Manager へようこそ
            </h1>
            <p className="mb-8 text-lg text-gray-300 leading-relaxed">
                このアプリケーションは、最先端のAI技術を活用して、あなたのSNS運用を自動化・最適化するための司令室です。
                <br />
                面倒な投稿作成やスケジュール管理から解放され、あなたは「戦略」に集中することができます。
            </p>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-black/40 p-6 border border-gray-800">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                        1
                    </div>
                    <h3 className="mb-2 font-bold text-white">プロジェクト作成</h3>
                    <p className="text-sm text-gray-400">運用するアカウントごとにプロジェクトを作成します。</p>
                </div>
                <div className="rounded-xl bg-black/40 p-6 border border-gray-800">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                        2
                    </div>
                    <h3 className="mb-2 font-bold text-white">API連携</h3>
                    <p className="text-sm text-gray-400">X (Twitter) と連携し、AIが投稿できるようにします。</p>
                </div>
                <div className="rounded-xl bg-black/40 p-6 border border-gray-800">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                        3
                    </div>
                    <h3 className="mb-2 font-bold text-white">自動運用開始</h3>
                    <p className="text-sm text-gray-400">カテゴリを設定すれば、あとはAIにお任せです。</p>
                </div>
            </div>

            <div className="mt-12 border-t border-gray-800 pt-8">
                <h3 className="mb-4 text-xl font-bold text-white">チュートリアル</h3>
                <p className="mb-4 text-gray-400">
                    もう一度チュートリアルを見たい場合は、以下のボタンを押してください。
                    ダッシュボードに移動し、ツアーが再開されます。
                </p>
                <button
                    onClick={() => {
                        localStorage.removeItem("hasSeenProTutorial");
                        window.location.href = "/dashboard";
                    }}
                    className="rounded bg-cyan-600/20 border border-cyan-500 px-6 py-3 font-bold text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all whitespace-nowrap"
                >
                    チュートリアルをリセットして再開
                </button>
            </div>
        </motion.div>
    );
}

function ApiGuideContent() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-2 text-3xl font-black text-white">X API 連携完全ガイド</h1>
            <p className="mb-8 text-gray-400">
                ここが一番の難関ですが、この通りに進めれば必ず設定できます。
            </p>

            <div className="space-y-12">
                <Step
                    number={1}
                    title="Developer Portal にアクセス"
                    content={
                        <>
                            <p className="mb-4">
                                まずは X の開発者ポータルにアクセスし、ログインします。
                            </p>
                            <a
                                href="https://developer.twitter.com/en/portal/dashboard"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500"
                            >
                                Developer Portal を開く <ChevronRight size={16} />
                            </a>
                        </>
                    }
                />

                <Step
                    number={2}
                    title="プロジェクトとアプリの作成"
                    content={
                        <>
                            <p className="mb-4">
                                ダッシュボードの左メニューから <strong>Projects & Apps</strong> を選択し、
                                あなたのプロジェクト（または Default project）の下にあるアプリを選択するか、
                                <strong>Add App</strong> で新規作成します。
                            </p>
                            <div className="rounded-lg border border-gray-700 bg-black/50 p-4 text-xs text-gray-400 font-mono">
                                Projects & Apps {">"} [Your Project] {">"} [App Name]
                            </div>
                        </>
                    }
                />

                <Step
                    number={3}
                    title="User authentication settings (重要)"
                    content={
                        <>
                            <p className="mb-4">
                                アプリの設定画面で <strong>User authentication settings</strong> の <strong>Edit</strong> をクリックします。
                            </p>
                            <ul className="list-disc pl-5 space-y-4 text-gray-300">
                                <li>
                                    <strong>App permissions</strong>: <span className="text-cyan-400">Read and Write</span> を選択
                                    <div className="mt-2 rounded-lg border border-gray-700 overflow-hidden">
                                        <img src="/help/app_permissions.png" alt="App permissions設定" className="w-full" />
                                    </div>
                                </li>
                                <li>
                                    <strong>Type of App</strong>: <span className="text-cyan-400">Web App, Automated App or Bot</span> を選択
                                    <div className="mt-2 rounded-lg border border-gray-700 overflow-hidden">
                                        <img src="/help/type_of_app.png" alt="Type of App設定" className="w-full" />
                                    </div>
                                </li>
                                <li>
                                    <strong>Callback URI / Redirect URL</strong>: <code className="bg-gray-800 px-1 py-0.5 rounded">http://localhost:3000/api/auth/callback/twitter</code> (重要: パスまで正確に)
                                </li>
                                <li>
                                    <strong>Website URL</strong>: <code className="bg-gray-800 px-1 py-0.5 rounded">https://example.com</code> (localhostがエラーになる場合はこちら)
                                </li>
                            </ul>
                            <p className="mt-4 text-sm text-yellow-500">
                                ※ Callback URI は <code className="text-cyan-400">/api/auth/callback/twitter</code> まで含める必要があります。
                            </p>
                        </>
                    }
                />

                <Step
                    number={4}
                    title="Keys and Tokens の取得"
                    content={
                        <>
                            <p className="mb-4">
                                設定を保存したら、上部タブの <strong>Keys and Tokens</strong> をクリックします。
                            </p>
                            <div className="space-y-6">
                                <div className="rounded-lg bg-gray-900 p-4 border border-gray-800">
                                    <h4 className="mb-2 font-bold text-white">1. API Key and Secret</h4>
                                    <p className="text-sm text-gray-400 mb-2">"Consumer Keys" の Regenerate をクリック</p>
                                    <div className="mb-2 rounded-lg border border-gray-700 overflow-hidden">
                                        <img src="/help/consumer_keys.png" alt="Consumer Keys" className="w-full" />
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-gray-800 px-2 py-1 rounded text-pink-400">API Key</span>
                                        <span className="text-xs bg-gray-800 px-2 py-1 rounded text-pink-400">API Key Secret</span>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-gray-900 p-4 border border-gray-800">
                                    <h4 className="mb-2 font-bold text-white">2. Access Token and Secret</h4>
                                    <p className="text-sm text-gray-400 mb-2">"Authentication Tokens" の Regenerate をクリック</p>
                                    <div className="mb-2 rounded-lg border border-gray-700 overflow-hidden">
                                        <img src="/help/access_tokens.png" alt="Access Tokens" className="w-full" />
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-gray-800 px-2 py-1 rounded text-green-400">Access Token</span>
                                        <span className="text-xs bg-gray-800 px-2 py-1 rounded text-green-400">Access Token Secret</span>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4">
                                これら4つの値をコピーして、本アプリのプロジェクト設定画面に入力してください。
                            </p>
                        </>
                    }
                />

                <Step
                    number={5}
                    title="OpenAI API Key の設定 (推奨)"
                    content={
                        <>
                            <p className="mb-4">
                                画像生成機能やツイート内容の生成機能を使用するには、OpenAI API Key の設定が必要です。
                                <br />以下の手順でキーを取得し、プロジェクト設定画面に入力してください。
                            </p>
                            <ol className="list-decimal pl-5 space-y-4 text-gray-300">
                                <li>
                                    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                        OpenAI Platform
                                    </a> にアクセスし、ログインします。
                                </li>
                                <li>
                                    "Create new secret key" をクリックしてキーを作成します。
                                    <div className="mt-2 mb-2 rounded-lg border border-gray-700 overflow-hidden max-w-xs">
                                        <img src="/help/openai_create_key_button.png" alt="Create new secret key button" className="w-full" />
                                    </div>
                                </li>
                                <li>
                                    表示された画面で、任意の名前（例: My App）を入力し、Project、Permissionsはそのままで大丈夫ですので "Create secret key" をクリックします。
                                    <div className="mt-2 mb-2 rounded-lg border border-gray-700 overflow-hidden max-w-md">
                                        <img src="/help/openai_create_key_modal.png" alt="Create new secret key modal" className="w-full" />
                                    </div>
                                </li>
                                <li>
                                    表示されたキー（sk-...）をコピーします。
                                </li>
                                <li>
                                    本アプリのプロジェクト設定画面にある「AI設定」の「OpenAI API Key」欄に貼り付けて保存します。
                                </li>
                            </ol>
                            <p className="mt-4 text-sm text-yellow-500">
                                ※ キーが設定されていない場合、画像生成を含む投稿はエラーになります。
                            </p>
                        </>
                    }
                />
            </div>
        </motion.div>
    );
}

function ProjectGuideContent() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProjects(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-6 text-3xl font-black text-white">プロジェクト管理</h1>
            <p className="text-gray-300 mb-4">
                プロジェクトは「1つのSNSアカウント」に対応します。
                例えば、個人のアカウントとブランドのアカウントを運用する場合、2つのプロジェクトを作成します。
            </p>

            <div className="mb-8 rounded-xl bg-cyan-900/20 border border-cyan-500/30 p-6">
                <h3 className="font-bold text-cyan-400 mb-4">クイックアクセス</h3>
                {loading ? (
                    <p className="text-sm text-gray-400">読み込み中...</p>
                ) : projects.length > 0 ? (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-300">以下のプロジェクトの設定画面に直接移動できます：</p>
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className="block rounded bg-black/40 border border-gray-700 p-3 hover:border-cyan-500 hover:bg-cyan-900/20 transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white group-hover:text-cyan-400">{project.name}</span>
                                    <ChevronRight size={16} className="text-gray-500 group-hover:text-cyan-400" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-300 mb-3">まだプロジェクトがありません。</p>
                        <Link
                            href="/projects/new"
                            className="inline-flex items-center gap-2 rounded bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-500"
                        >
                            プロジェクトを作成する <ChevronRight size={16} />
                        </Link>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <section>
                    <h3 className="mb-4 text-xl font-bold text-white border-b border-gray-800 pb-2">機能ガイド</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-cyan-400 mb-2">投稿ルール設定</h4>
                            <p className="text-sm text-gray-400">
                                1日の投稿回数（最大3回）や、時間指定・ランダム投稿の設定ができます。
                                <br />※API制限を守るため、1日3回を上限としています。
                            </p>
                        </div>
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-yellow-400 mb-2">今すぐ投稿</h4>
                            <p className="text-sm text-gray-400">
                                予約時間を待たずに、即座にAIに投稿を作成・実行させることができます。
                                上限に達している場合は実行できません。
                            </p>
                        </div>
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-green-400 mb-2">重複投稿防止</h4>
                            <p className="text-sm text-gray-400">
                                AIは前回の投稿内容を記憶しており、連続して似たような内容が投稿されるのを自動的に防ぎます。
                            </p>
                        </div>
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-purple-400 mb-2">使用カテゴリ選択</h4>
                            <p className="text-sm text-gray-400">
                                作成したカテゴリの中から、自動投稿に使用するものを1つ選択できます。
                            </p>
                        </div>
                    </div>
                </section>

                <div className="rounded-xl bg-blue-900/20 border border-blue-500/30 p-6">
                    <h3 className="font-bold text-blue-400 mb-2">Tips</h3>
                    <p className="text-sm text-gray-300">
                        プロジェクトごとにAPIキーを設定するため、全く異なるアカウントでも安全に管理できます。
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

function CategoryGuideContent() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-6 text-3xl font-black text-white">カテゴリ設定</h1>
            <p className="text-gray-300 mb-6">
                AIがどのような投稿をするかは、この「カテゴリ」で決まります。
                プロジェクトごとに複数のカテゴリを作成でき、それぞれ異なるターゲットや目的を設定できます。
            </p>

            <div className="space-y-8">
                <section>
                    <h3 className="mb-4 text-xl font-bold text-cyan-400 border-b border-gray-800 pb-2">設定項目</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-white mb-2">ターゲット層 (Target Audience)</h4>
                            <p className="text-sm text-gray-400">
                                誰に向けた投稿かを具体的に指定します。
                                <br />例：「20代のエンジニア」「節約志向の主婦」「最新ガジェット好き」
                            </p>
                        </div>
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-white mb-2">口調 (Tone)</h4>
                            <p className="text-sm text-gray-400">
                                投稿の雰囲気や言葉遣いを指定します。
                                <br />例：「フレンドリーで絵文字多め」「専門的で硬め」「ユーモアを交えて」
                            </p>
                        </div>
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-white mb-2">ゴール (Goal)</h4>
                            <p className="text-sm text-gray-400">
                                その投稿で何を達成したいかを指定します。
                                <br />例：「フォロワーを増やす」「ブログへの誘導」「商品の認知拡大」
                            </p>
                        </div>
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-white mb-2">NGワード</h4>
                            <p className="text-sm text-gray-400">
                                投稿に含めてはいけない言葉を指定します。
                                <br />競合他社名や、炎上リスクのある言葉などを設定します。
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="mb-4 text-xl font-bold text-pink-400 border-b border-gray-800 pb-2">トレンド・ニュース機能</h3>
                    <div className="space-y-4">
                        <div className="rounded-lg bg-pink-900/20 border border-pink-500/30 p-4">
                            <h4 className="font-bold text-pink-300 mb-2">トレンドを取り入れる</h4>
                            <p className="text-sm text-gray-300 mb-2">
                                X (Twitter) のトレンドを検索し、それに関連した投稿を作成します。
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                                <li><strong>検索クエリ</strong>: トレンドを探すキーワード（例：「AI 技術」）</li>
                                <li><strong>トレンドモード</strong>: 「ニュース解説」「意見・感想」など</li>
                            </ul>
                        </div>
                        <div className="rounded-lg bg-green-900/20 border border-green-500/30 p-4">
                            <h4 className="font-bold text-green-300 mb-2">最新ニュースを使用</h4>
                            <p className="text-sm text-gray-300">
                                Google News から最新記事を取得し、それを元に投稿を作成します。
                                <br />時事ネタや業界ニュースを自動で発信するのに最適です。
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="mb-4 text-xl font-bold text-purple-400 border-b border-gray-800 pb-2">高度な設定</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-white mb-2">カスタム指示書</h4>
                            <p className="text-sm text-gray-400">
                                AIへの追加指示を自由に記述できます。
                                <br />例：「必ず『〜だワン』という語尾にして」「絵文字は使わないで」
                            </p>
                        </div>
                        <div className="rounded-lg bg-black/40 p-4 border border-gray-800">
                            <h4 className="font-bold text-white mb-2">画像生成プロンプト</h4>
                            <p className="text-sm text-gray-400">
                                生成される画像のスタイルを指定できます。
                                <br />例：「サイバーパンク風のイラスト」「水彩画風」「ミニマルなデザイン」
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
}

function LogsGuideContent() {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-6 text-3xl font-black text-white">ログ確認 (LOGS)</h1>
            <p className="text-gray-300 mb-6">
                AIが作成・投稿した履歴を確認できる画面です。
                投稿が成功したか、失敗したか、どのような内容だったかを一覧で確認できます。
            </p>

            <div className="space-y-6">
                <div className="rounded-xl bg-glass p-6 border border-gray-800">
                    <h3 className="font-bold text-white mb-4">ステータスの意味</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="rounded bg-green-500/20 px-2 py-1 text-xs font-bold text-green-400 border border-green-500/50">SUCCESS</span>
                            <p className="text-sm text-gray-400">投稿が正常に完了しました。</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="rounded bg-red-500/20 px-2 py-1 text-xs font-bold text-red-400 border border-red-500/50">FAILED</span>
                            <p className="text-sm text-gray-400">投稿に失敗しました。エラーメッセージを確認してください。</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="rounded bg-yellow-500/20 px-2 py-1 text-xs font-bold text-yellow-400 border border-yellow-500/50">PENDING</span>
                            <p className="text-sm text-gray-400">投稿待ち、または生成中です。</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-blue-900/20 border border-blue-500/30 p-6">
                        <h3 className="font-bold text-blue-400 mb-2">詳細確認</h3>
                        <p className="text-sm text-gray-300">
                            ログの行をクリックすると、投稿された画像や全文を確認できます。
                        </p>
                    </div>
                    <div className="rounded-xl bg-purple-900/20 border border-purple-500/30 p-6">
                        <h3 className="font-bold text-purple-400 mb-2">トレンド情報の確認</h3>
                        <p className="text-sm text-gray-300">
                            「トレンド」列が省略されている場合、クリックすると参照したトレンドやニュースの全文が表示されます。
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function Step({ number, title, content }: { number: number; title: string; content: React.ReactNode }) {
    return (
        <div className="relative pl-10">
            <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-900 border border-cyan-500 text-cyan-400 font-bold">
                {number}
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
            <div className="text-gray-300 leading-relaxed text-sm">
                {content}
            </div>
        </div>
    );
}
