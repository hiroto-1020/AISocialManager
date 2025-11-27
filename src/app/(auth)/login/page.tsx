"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("アクセス拒否: 認証情報が無効です");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("システムエラーが発生しました");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <motion.div
                className="w-full max-w-md overflow-hidden rounded-2xl bg-glass p-8 shadow-2xl neon-border-blue"
            >
                <h2 className="mb-6 text-center text-3xl font-bold tracking-widest text-neon-blue">
                    SYSTEM LOGIN
                </h2>
                {error && (
                    <motion.div
                        initial={{ x: -10 }}
                        animate={{ x: 0 }}
                        className="mb-4 border border-red-500 bg-red-900/20 p-2 text-center text-red-400"
                    >
                        {error}
                    </motion.div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                            Identity (Email)
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="agent@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                            Access Code (Password)
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full rounded bg-cyan-600/20 border border-cyan-500 py-3 font-bold text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors"
                    >
                        AUTHENTICATE
                    </motion.button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    アクセス権限がありませんか？{" "}
                    <Link href="/signup" className="text-neon-pink hover:underline">
                        アクセス権を申請 (Signup)
                    </Link>
                </p>
                <div className="mt-8 flex justify-center gap-4 text-xs text-gray-600">
                    <Link href="/terms" className="hover:text-gray-400">利用規約</Link>
                    <span>|</span>
                    <Link href="/privacy" className="hover:text-gray-400">プライバシーポリシー</Link>
                </div>
            </motion.div>
        </div>
    );
}
