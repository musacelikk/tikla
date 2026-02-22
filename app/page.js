"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#0a0a0f] relative overflow-hidden">
      {/* Arka plan hafif parıltı */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,107,157,0.15),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(196,77,255,0.08),transparent)] pointer-events-none" />

      <motion.p
        className="text-neutral-500 text-sm sm:text-base mb-6 md:mb-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Bir sürpriz var...
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Link
          href="/surpriz"
          className="relative block px-8 py-5 sm:px-12 sm:py-6 md:px-16 md:py-7 rounded-2xl text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-white overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, #ff6b9d 0%, #c44dff 50%, #6b5bff 100%)",
            boxShadow: "0 0 40px rgba(255,107,157,0.5), 0 0 80px rgba(196,77,255,0.3)",
          }}
        >
          <span className="relative z-10 flex items-center gap-2 justify-center">
            <span className="animate-pulse">🎁</span>
            TIKLA
            <span className="animate-pulse">🎁</span>
          </span>
          <motion.span
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
            style={{ background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.3), transparent)" }}
            layoutId="shine"
          />
        </Link>
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-60 blur-xl -z-10"
          style={{
            background: "linear-gradient(135deg, #ff6b9d, #c44dff)",
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.p
        className="text-neutral-600 text-xs sm:text-sm mt-6 md:mt-8 text-center max-w-[280px] sm:max-w-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Merak etme, iyi bir sürpriz 🎂
      </motion.p>
    </main>
  );
}
