"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const METIN = "Bahar Hanım iyi ki doğdun";

const CONFIG = {
  flash: 320,
  showContent: 480,
  textReveal: 900,
  corners: 1100,
  emojiStart: 400,
  emojiEnd: 2200,
  ease: [0.25, 0.1, 0.25, 1],
};

// Pasta ve arka plana uyumlu renkler: pembe, sarı, teal, beyaz
const RENKLER = [
  "#f472b6",
  "#fb7185",
  "#fef08a",
  "#fde047",
  "#5eead4",
  "#2dd4bf",
  "#ffffff",
  "#f9a8d4",
  "#a78bfa",
];

function konfeti(confetti, opts = {}) {
  if (!confetti) return;
  confetti({
    particleCount: opts.count ?? 120,
    spread: opts.spread ?? 100,
    origin: opts.origin ?? { y: 0.5, x: 0.5 },
    colors: RENKLER,
    scalar: opts.scalar ?? 0.9,
    startVelocity: opts.velocity ?? 42,
    zIndex: 9999,
  });
}

const KOSE = [
  { text: "İyi ki doğdun!", side: "left", vertical: "top", place: "12%", d: 0 },
  { text: "Nice mutlu yıllara!", side: "right", vertical: "top", place: "14%", d: 0.05 },
  { text: "Bugün senin günün.", side: "left", vertical: "bottom", place: "20%", d: 0.1 },
  { text: "Kutlama modu açık 🥳", side: "right", vertical: "bottom", place: "18%", d: 0.08 },
];

export default function SurprizPage() {
  const [flash, setFlash] = useState(true);
  const [content, setContent] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [cornersVisible, setCornersVisible] = useState(false);
  const [emojiVisible, setEmojiVisible] = useState(false);
  const timersRef = useRef([]);

  const add = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
  };

  useEffect(() => {
    const run = async () => {
      const confetti = (await import("canvas-confetti")).default;
      konfeti(confetti, { count: 200, spread: 360, scalar: 1, velocity: 50 });
      add(() => konfeti(confetti, { count: 50, origin: { x: 0.2, y: 0.4 } }), 200);
      add(() => konfeti(confetti, { count: 50, origin: { x: 0.8, y: 0.4 } }), 350);
      add(() => konfeti(confetti, { count: 60, origin: { y: 0.6 } }), 600);
      add(() => konfeti(confetti, { count: 60, origin: { y: 0.6 } }), 1000);

      add(() => setContent(true), CONFIG.showContent);
      add(() => setTextVisible(true), CONFIG.textReveal);
      add(() => setCornersVisible(true), CONFIG.corners);
      add(() => setEmojiVisible(true), CONFIG.emojiStart);
      add(() => setEmojiVisible(false), CONFIG.emojiEnd);
    };
    run();
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setFlash(false), CONFIG.flash);
    return () => clearTimeout(id);
  }, []);

  return (
    <main
      className="min-h-[100dvh] h-[100dvh] w-full relative overflow-hidden flex flex-col items-center justify-center bg-[#0f766e]"
      style={{
        minHeight: "100dvh",
        height: "100dvh",
        padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      }}
      role="main"
      aria-label="Doğum günü kutlaması"
    >
      {/* Beyaz flash */}
      <motion.div
        className="fixed inset-0 z-[10000] bg-white pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: flash ? 1 : 0 }}
        transition={{ duration: 0.28, ease: CONFIG.ease }}
      />

      {/* Arka plan: pastanın arka planına uyumlu mat teal + hafif doku */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0f766e 0%, #0d9488 40%, #14b8a6 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* İçerik: pasta + metin */}
      <AnimatePresence>
        {content && (
          <motion.section
            className="relative z-10 flex flex-col items-center justify-center px-4 flex-1 w-full max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: CONFIG.ease }}
          >
            {/* Pasta görseli */}
            <motion.div
              className="relative w-[min(72vw,280px)] mb-6"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.1 }}
            >
              <img
                src="/cake.webp"
                alt="Doğum günü pastası"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Başlık */}
            <AnimatePresence>
              {textVisible && (
                <motion.h1
                  className="text-center text-2xl sm:text-3xl md:text-4xl font-black text-white px-2"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: CONFIG.ease }}
                  style={{
                    textShadow: "0 2px 20px rgba(0,0,0,0.2), 0 0 40px rgba(253,224,71,0.15)",
                  }}
                >
                  {METIN}
                </motion.h1>
              )}
            </AnimatePresence>
            {textVisible && (
              <motion.p
                className="mt-3 text-white/90 text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Bugün her şey senin için 🎂
              </motion.p>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Köşe yazıları */}
      {cornersVisible &&
        KOSE.map((item, i) => (
          <motion.p
            key={i}
            className={`absolute text-sm sm:text-base font-semibold text-white/95 ${
              item.side === "left" ? "left-4 sm:left-6" : "right-4 sm:right-6"
            }`}
            style={{
              [item.vertical]: item.place,
            }}
            initial={{ opacity: 0, x: item.side === "left" ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: item.d, ease: CONFIG.ease }}
          >
            {item.text}
          </motion.p>
        ))}

      {/* Emoji yağmuru */}
      {emojiVisible && (
        <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden" aria-hidden>
          {["🎂", "🎉", "✨", "🎈", "🎁", "🥳", "💖"].flatMap((emoji, i) =>
            Array.from({ length: 6 }, (_, j) => (
              <motion.span
                key={`${i}-${j}`}
                className="absolute text-2xl sm:text-3xl select-none"
                initial={{
                  top: "-8%",
                  left: `${10 + (i * 12 + j * 4) % 80}%`,
                  opacity: 0.85,
                }}
                animate={{ top: "108%", opacity: 0.15 }}
                transition={{
                  duration: 1.4,
                  delay: j * 0.06 + i * 0.04,
                  ease: "easeIn",
                }}
              >
                {emoji}
              </motion.span>
            ))
          )}
        </div>
      )}
    </main>
  );
}
