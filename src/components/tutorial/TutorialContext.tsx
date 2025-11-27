"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type TutorialStep = {
    targetId: string; // ID of the element to highlight
    title: string;
    content: string;
    path: string; // Path where this step is valid
    position?: "top" | "bottom" | "left" | "right";
};

type TutorialContextType = {
    isActive: boolean;
    currentStepIndex: number;
    startTutorial: () => void;
    endTutorial: () => void;
    nextStep: () => void;
    prevStep: () => void;
    currentStep: TutorialStep | null;
};

const TUTORIAL_STEPS: TutorialStep[] = [
    {
        targetId: "dashboard-header",
        title: "ようこそ、司令官",
        content: "これはあなたのAIソーシャル運用司令室です。ここから全ての作戦を指揮します。",
        path: "/dashboard",
        position: "bottom",
    },
    {
        targetId: "new-project-btn",
        title: "作戦の開始",
        content: "まずは新しいプロジェクト（作戦）を作成しましょう。ここをクリックして開始します。",
        path: "/dashboard",
        position: "bottom",
    },
    {
        targetId: "project-name-input",
        title: "コードネーム入力",
        content: "プロジェクトの名称を入力してください。分かりやすい名前（例: 公式アカウント運用）が推奨されます。",
        path: "/projects/new",
        position: "bottom",
    },
    {
        targetId: "create-project-submit",
        title: "承認",
        content: "入力が完了したら、作成ボタンを押してプロジェクトを承認します。",
        path: "/projects/new",
        position: "top",
    },
];

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check if tutorial was already seen
        const seen = localStorage.getItem("hasSeenProTutorial");
        if (!seen) {
            setIsActive(true);
        }
    }, []);

    const startTutorial = () => {
        setIsActive(true);
        setCurrentStepIndex(0);
        if (pathname !== "/dashboard") {
            router.push("/dashboard");
        }
    };

    const endTutorial = () => {
        setIsActive(false);
        localStorage.setItem("hasSeenProTutorial", "true");
    };

    const nextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < TUTORIAL_STEPS.length) {
            const nextStepData = TUTORIAL_STEPS[nextIndex];
            if (nextStepData.path !== pathname) {
                router.push(nextStepData.path);
            }
            setCurrentStepIndex(nextIndex);
        } else {
            endTutorial();
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            const prevIndex = currentStepIndex - 1;
            const prevStepData = TUTORIAL_STEPS[prevIndex];
            if (prevStepData.path !== pathname) {
                router.push(prevStepData.path);
            }
            setCurrentStepIndex(prevIndex);
        }
    };

    const currentStep = isActive ? TUTORIAL_STEPS[currentStepIndex] : null;

    // Auto-redirect if active and on wrong page (simple sync)
    useEffect(() => {
        if (isActive && currentStep && currentStep.path !== pathname) {
            // router.push(currentStep.path);
        }
    }, [isActive, currentStep, pathname]);

    return (
        <TutorialContext.Provider
            value={{
                isActive,
                currentStepIndex,
                startTutorial,
                endTutorial,
                nextStep,
                prevStep,
                currentStep,
            }}
        >
            {children}
        </TutorialContext.Provider>
    );
}

export function useTutorial() {
    const context = useContext(TutorialContext);
    if (context === undefined) {
        throw new Error("useTutorial must be used within a TutorialProvider");
    }
    return context;
}
