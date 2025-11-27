"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const schema = z.object({
    name: z.string().min(1, "Project name is required"),
});

type FormData = z.infer<typeof schema>;

export default function NewProjectPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setError(null);
        console.log("Submitting project:", data);
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                console.log("Project created successfully");
                router.push("/dashboard");
                router.refresh();
            } else {
                const errorData = await res.json();
                console.error("Failed to create project:", errorData);
                setError(errorData.error || "Failed to create project");
            }
        } catch (error) {
            console.error("Network error:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-glass p-8 shadow-2xl neon-border-blue"
            >
                <h1 className="mb-6 text-center text-2xl font-bold tracking-widest text-cyan-400">
                    INITIATE NEW OPERATION
                </h1>
                {error && (
                    <div className="mb-4 rounded bg-red-500/20 p-3 text-center text-sm text-red-400 border border-red-500/50">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-gray-400">
                            OPERATION NAME
                        </label>
                        <input
                            id="project-name-input"
                            {...register("name")}
                            type="text"
                            placeholder="Project Alpha"
                            className="w-full rounded-lg bg-gray-900/50 border border-gray-800 p-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link
                            href="/dashboard"
                            className="rounded-lg px-6 py-3 text-sm font-bold text-gray-500 hover:text-white transition-colors"
                        >
                            CANCEL
                        </Link>
                        <button
                            id="create-project-submit"
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-cyan-600 px-8 py-3 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)]"
                        >
                            {isSubmitting ? "INITIALIZING..." : "INITIATE"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
