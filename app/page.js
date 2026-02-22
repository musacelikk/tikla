"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const [showDots, setShowDots] = useState(false);

  // 5 saniye sonra "..." göster (merak)
  useEffect(() => {
    const t = setTimeout(() => setShowDots(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleClick = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setTimeout(() => router.push("/surpriz"), 650);
  };

  return (
    <motion.main
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0a] select-none"
      animate={
        isLeaving
          ? {
              x: [0, -5, 5, -4, 4, 0],
              transition: { x: { duration: 0.2, delay: 0.15 } },
            }
          : {}
      }
    >
      {/* Vignette: kenarlar daha koyu */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Hafif noise/grain → sinematik his */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Tıklanınca 0.3s siyah ekran (overlay) */}
      <motion.div
        className="absolute inset-0 bg-black z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLeaving ? 1 : 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      />

      {/* Ortada sadece 1 şey: Buna Tıklama. + Gerçekten. */}
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={isLeaving}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{
          opacity: 1,
          scale: isLeaving ? 0.97 : 1,
          transition: isLeaving
            ? { scale: { duration: 0.15 } }
            : { opacity: { duration: 1.2 }, scale: { duration: 1, ease: "easeOut" } },
        }}
        whileHover={!isLeaving ? { scale: 1.03, filter: "drop-shadow(0 0 20px rgba(255,255,255,0.15))" } : {}}
        whileTap={!isLeaving ? { scale: 0.98 } : {}}
        className="relative z-10 text-center focus:outline-none cursor-pointer"
      >
        <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tight">
          Buna Tıklama.
        </p>
        <p className="text-sm sm:text-base text-neutral-500 mt-2">Gerçekten.</p>
        {showDots && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="block text-neutral-600 text-sm mt-3"
          >
            ...
          </motion.span>
        )}
      </motion.button>
    </motion.main>
  );
}
