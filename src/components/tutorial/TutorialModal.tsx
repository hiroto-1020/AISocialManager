"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

const STEPS = [
    {
        title: "AI Social Manager へようこそ",
        content: "このアプリは、AIを使ってあなたのSNS運用を自動化・効率化する強力なツールです。まずは基本的な使い方を覚えましょう。",
    },
    {
        title: "1. プロジェクトの作成",
        content: "まずは「NEW OPERATION」ボタンから新しいプロジェクトを作成します。プロジェクトは、運用するSNSアカウント単位で作成するのがおすすめです。",
    },
    {
        title: "2. X (Twitter) 連携",
        content: "プロジェクト設定画面で、XのAPIキーとアクセストークンを設定します。これにより、AIがあなたに代わって投稿できるようになります。",
    },
    {
        title: "3. カテゴリの設定",
        content: "「CATEGORIES」で、投稿のテーマやターゲット層を設定します。AIはこの設定に基づいて、適切な文章を生成します。",
    },
    {
        title: "4. 自動投稿の開始",
        content: "設定が完了すると、毎日自動的に投稿スケジュールが組まれます。「LOGS」画面で投稿履歴や予定を確認できます。",
    },
];

export default function TutorialModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
        if (!hasSeenTutorial) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("hasSeenTutorial", "true");
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-lg overflow-hidden rounded-2xl bg-[#0a0a12] border border-cyan-500/50 shadow-[0_0_50px_rgba(0,243,255,0.2)]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-800 p-6">
                            <h2 className="text-xl font-bold text-cyan-400 tracking-wider">
                                SYSTEM TUTORIAL
                            </h2>
                            <button
                                onClick={handleClose}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 min-h-[200px]">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="mb-4 text-2xl font-bold text-white">
                                    {STEPS[currentStep].title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {STEPS[currentStep].content}
                                </p>
                            </motion.div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-gray-800 bg-black/20 p-6">
                            <div className="flex gap-2">
                                {STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-2 w-2 rounded-full transition-all ${i === currentStep ? "bg-cyan-500 w-6" : "bg-gray-700"
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                    className={`rounded px-4 py-2 text-sm font-medium transition-colors ${currentStep === 0
                                            ? "text-gray-600 cursor-not-allowed"
                                            : "text-gray-300 hover:text-white"
                                        }`}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 rounded bg-cyan-600/20 border border-cyan-500 px-6 py-2 text-sm font-bold text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all"
                                >
                                    {currentStep === STEPS.length - 1 ? (
                                        <>
                                            Finish <Check size={16} />
                                        </>
                                    ) : (
                                        <>
                                            Next <ChevronRight size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
