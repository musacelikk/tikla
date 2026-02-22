"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function konfetiPatlama(confetti) {
  if (!confetti) return;
  const count = 200;
  const defaults = { origin: { y: 0.6 }, zIndex: 9999 };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ["#ff6b9d", "#c44dff", "#6b5bff", "#00ff88", "#ffd93d"] });
  fire(0.2, { spread: 60, colors: ["#ff6b9d", "#c44dff", "#6b5bff"] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#ffd93d", "#00ff88", "#ff6b9d"] });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

function merkezPatlama(confetti) {
  if (!confetti) return;
  const scalar = 2;
  confetti({
    particleCount: 80,
    scalar,
    spread: 100,
    origin: { y: 0.5, x: 0.5 },
    colors: ["#ff6b9d", "#c44dff", "#6b5bff", "#00ff88", "#ffd93d", "#ff9f43"],
    shapes: ["circle", "square"],
  });
}

export default function SurprizPage() {
  const [mounted, setMounted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const confettiRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    let t1, t2, t3, t4, t5;
    const run = async () => {
      const confetti = (await import("canvas-confetti")).default;
      confettiRef.current = confetti;

      // İlk dev patlama
      konfetiPatlama(confetti);
      merkezPatlama(confetti);

      t1 = setTimeout(() => konfetiPatlama(confetti), 400);
      t2 = setTimeout(() => setShowMessage(true), 300);
      t3 = setTimeout(() => {
        merkezPatlama(confetti);
        konfetiPatlama(confetti);
      }, 800);
      t4 = setTimeout(() => setShowExtra(true), 1200);
      t5 = setTimeout(() => {
        konfetiPatlama(confetti);
        merkezPatlama(confetti);
      }, 1800);
    };
    run();
    return () => {
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-neutral-500"
        >
          Yükleniyor...
        </motion.p>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#0a0a0f] overflow-hidden">
      {/* Arka plan gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(255,107,157,0.2), transparent 60%), radial-gradient(ellipse 80% 60% at 20% 80%, rgba(196,77,255,0.15), transparent 50%)",
        }}
      />

      <AnimatePresence>
        {showMessage && (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative z-10 text-center"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 md:mb-6 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Doğum günün kutlu olsun! 🎂
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-neutral-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Nice mutlu yıllara! 🎉
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExtra && (
          <motion.div
            key="extra"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {["🎂", "🎉", "✨", "🎈", "🎁", "💖"].map((emoji, i) => (
              <motion.span
                key={emoji}
                className="text-3xl sm:text-4xl md:text-5xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.3, rotate: 15 }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ekstra akan metinler - ekranın kenarlarında */}
      {showExtra && (
        <>
          <motion.p
            className="absolute left-2 sm:left-4 top-1/4 text-sm sm:text-base text-pink-400/80 font-semibold -rotate-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            🎂 Kutlu olsun!
          </motion.p>
          <motion.p
            className="absolute right-2 sm:right-4 top-1/3 text-sm sm:text-base text-purple-400/80 font-semibold rotate-12"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            Nice yıllara! 🎉
          </motion.p>
          <motion.p
            className="absolute left-3 sm:left-6 bottom-1/3 text-sm sm:text-base text-amber-400/80 font-semibold -rotate-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            ✨ Senin günün!
          </motion.p>
          <motion.p
            className="absolute right-3 sm:right-6 bottom-1/4 text-sm sm:text-base text-cyan-400/80 font-semibold rotate-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            🎁 Sürpriz!
          </motion.p>
        </>
      )}
    </main>
  );
}
