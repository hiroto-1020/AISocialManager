"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />

      <motion.div
        className="relative z-10 text-center"
      >
        <h1 className="mb-6 text-6xl font-black tracking-tighter md:text-8xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">AI</span>
          <span className="ml-4 text-white text-shadow-lg">SOCIAL</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">MANAGER</span>
        </h1>

        <p className="mb-12 text-xl text-gray-400 md:text-2xl whitespace-nowrap">
          <span className="text-neon-blue">次世代AI</span> でデジタルプレゼンスを自動化。
        </p>

        <div className="flex justify-center gap-6">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 243, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-full bg-cyan-500/10 px-8 py-4 font-bold text-cyan-400 ring-1 ring-cyan-500 transition-all hover:bg-cyan-500 hover:text-black"
            >
              <span className="relative z-10">システム起動 (LOGIN)</span>
            </motion.button>
          </Link>

          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 0, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-full bg-pink-500/10 px-8 py-4 font-bold text-pink-400 ring-1 ring-pink-500 transition-all hover:bg-pink-500 hover:text-black"
            >
              <span className="relative z-10">ID作成 (SIGNUP)</span>
            </motion.button>
          </Link>
        </div>

        <div className="mt-16 flex justify-center gap-6 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">利用規約</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">プライバシーポリシー</Link>
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
      </div>
    </div>
  );
}
