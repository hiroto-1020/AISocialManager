"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTutorial } from "./TutorialContext";
import { useEffect, useState } from "react";

export default function TutorialOverlay() {
    const { isActive, currentStep, nextStep, endTutorial } = useTutorial();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (isActive && currentStep) {
            const updateRect = () => {
                const element = document.getElementById(currentStep.targetId);
                if (element) {
                    setTargetRect(element.getBoundingClientRect());
                } else {
                    setTargetRect(null);
                }
            };

            updateRect();
            window.addEventListener("resize", updateRect);
            const interval = setInterval(updateRect, 500);

            return () => {
                window.removeEventListener("resize", updateRect);
                clearInterval(interval);
            };
        }
    }, [isActive, currentStep]);

    if (!isActive || !currentStep) return null;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            <AnimatePresence>
                {targetRect && (
                    <motion.div
                        layoutId="spotlight"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute rounded-lg border-2 border-cyan-500"
                        style={{
                            left: targetRect.left - 8,
                            top: targetRect.top - 8,
                            width: targetRect.width + 16,
                            height: targetRect.height + 16,
                            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)", // The cutout effect
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    />
                )}
            </AnimatePresence>

            {/* Instruction Card */}
            <AnimatePresence>
                {targetRect && (
                    <motion.div
                        className="absolute pointer-events-auto max-w-sm rounded-xl bg-[#0a0a12]/90 border border-cyan-500/50 p-6 shadow-2xl backdrop-blur-md"
                        style={{
                            left: targetRect.left,
                            top: targetRect.bottom + 24,
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="mb-2 text-lg font-bold text-cyan-400">{currentStep.title}</h3>
                        <p className="mb-4 text-sm text-gray-300">{currentStep.content}</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={endTutorial}
                                className="text-xs text-gray-500 hover:text-white px-3 py-1"
                            >
                                Skip
                            </button>
                            <button
                                onClick={nextStep}
                                className="rounded bg-cyan-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-cyan-500"
                            >
                                Next
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
