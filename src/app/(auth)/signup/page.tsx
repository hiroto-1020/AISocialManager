"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "登録に失敗しました");
            }

            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <motion.div
                className="w-full max-w-md overflow-hidden rounded-2xl bg-glass p-8 shadow-2xl neon-border-pink"
            >
                <h2 className="mb-6 text-center text-3xl font-bold tracking-widest text-neon-pink">
                    NEW AGENT REGISTRATION
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
                            Codename (Name)
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-3 text-white placeholder-gray-600 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                            Comms Channel (Email)
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-3 text-white placeholder-gray-600 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                            Security Key (Password)
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded bg-black/50 border border-gray-700 p-3 text-white placeholder-gray-600 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full rounded bg-pink-600/20 border border-pink-500 py-3 font-bold text-pink-400 hover:bg-pink-500 hover:text-black transition-colors"
                    >
                        REGISTER
                    </motion.button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    既に認証済みですか？{" "}
                    <Link href="/login" className="text-neon-blue hover:underline">
                        ログイン (Login)
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
