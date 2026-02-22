"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUBTITLES = [
  "Nice mutlu yıllara.",
  "Bugün her şey senin için.",
  "İyi ki varsın.",
  "Kutlamak güzel.",
];

function konfeti(confetti, opts = {}) {
  if (!confetti) return;
  confetti({
    particleCount: opts.count ?? 100,
    spread: opts.spread ?? 100,
    origin: opts.origin ?? { y: 0.5, x: 0.5 },
    colors: opts.colors ?? ["#f9a8d4", "#fde047", "#fef08a", "#ffffff", "#e879f9"],
    scalar: opts.scalar ?? 0.9,
    startVelocity: opts.velocity ?? 45,
    decay: opts.decay ?? 0.96,
    zIndex: 9999,
  });
}

export default function SurprizPage() {
  const [started, setStarted] = useState(false);
  const [darkOverlay, setDarkOverlay] = useState(1);
  const [scene, setScene] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const confettiRef = useRef(null);
  const timersRef = useRef([]);

  const add = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
  }, []);

  const runTimeline = useCallback(() => {
    const run = async () => {
      const confetti = (await import("canvas-confetti")).default;
      confettiRef.current = confetti;

      setStarted(true);
      setScene(1);

      // Karanlıktan aydınlığa yumuşak fade-in (flash yok)
      add(() => setDarkOverlay(0), 0);

      // Sahne 1: "Bugün özel bir gün..." belirir → kaybolur
      add(() => setScene(2), 4200);

      // Sahne 2: "İyi ki doğdun"
      add(() => setScene(3), 7200);

      // Sahne 3: "Bahar Hanım" + ilk konfeti patlaması (merkezden güçlü)
      add(() => {
        setScene(3);
        const c = confettiRef.current;
        if (c) {
          konfeti(c, { count: 180, spread: 100, origin: { x: 0.3, y: 0.5 }, velocity: 52 });
          konfeti(c, { count: 180, spread: 100, origin: { x: 0.7, y: 0.5 }, velocity: 52 });
        }
      }, 10200);

      add(() => setScene(4), 10800);
      // Alt yazı döngüsü (sahne 4’ten sonra)
      add(() => setSubtitleIndex(0), 10800);
      add(() => setSubtitleIndex(1), 15800);
      add(() => setSubtitleIndex(2), 20800);
      add(() => setSubtitleIndex(3), 25800);

      // İkinci patlama: altın yapraklar, yukarıdan yavaş
      add(() => {
        const c = confettiRef.current;
        if (c) {
          konfeti(c, {
            count: 120,
            spread: 60,
            origin: { y: 0, x: 0.5 },
            colors: ["#fde047", "#fef08a", "#facc15", "#eab308", "#fef3c7"],
            velocity: 22,
            scalar: 1,
            decay: 0.98,
          });
        }
      }, 12500);
    };
    run();
  }, [add]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // Firefly / yıldız tozu (sadece started sonrası, çok hafif)
  const [fireflies] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 5 + (i * 7.3) % 88,
      delay: i * 1.2,
      duration: 18 + (i % 5),
      size: 2 + (i % 3),
      opacity: 0.15 + (i % 4) * 0.08,
    }))
  );

  return (
    <main
      className="min-h-[100dvh] h-[100dvh] w-full relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        minHeight: "100dvh",
        height: "100dvh",
        padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      }}
      role="main"
      aria-label="Doğum günü kutlaması"
    >
      {/* Arka plan: koyu gece mavisi / mürdüm */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0f0f1a 0%, #1a1625 50%, #16213e 100%)",
        }}
      />

      {/* 2–3 yavaş nefes alan pastel ışık (düşük opaklık) */}
      <motion.div
        className="absolute rounded-full blur-[120px] pointer-events-none w-[80%] max-w-[500px] h-[60%] -top-[20%] -left-[20%]"
        style={{ background: "#f9a8d4", opacity: 0.18 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full blur-[120px] pointer-events-none w-[70%] max-w-[400px] h-[50%] -top-[10%] -right-[25%]"
        style={{ background: "#fde047", opacity: 0.14 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full blur-[100px] pointer-events-none w-[50%] max-w-[280px] h-[40%] bottom-[-10%] left-1/2 -translate-x-1/2"
        style={{ background: "#e879f9", opacity: 0.1 }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Karanlıktan aydınlığa yumuşak fade — sadece "Başla" tıklandıktan sonra */}
      <motion.div
        className="fixed inset-0 z-[10001] bg-[#0f0f1a] pointer-events-none"
        initial={false}
        animate={{ opacity: started ? darkOverlay : 0 }}
        transition={{ duration: 2.8, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Başlamak için dokun */}
      {!started && (
        <motion.button
          type="button"
          onClick={runTimeline}
          className="relative z-20 flex flex-col items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            className="text-5xl sm:text-6xl"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ✉️
          </motion.span>
          <span className="text-white/90 text-sm sm:text-base font-medium tracking-wide">
            Başlamak için dokun
          </span>
        </motion.button>
      )}

      {/* Sahne içerikleri */}
      {started && (
        <>
          {/* Sahne 1: Bugün özel bir gün... */}
          <AnimatePresence mode="wait">
            {scene === 1 && (
              <motion.p
                key="s1"
                className="absolute inset-0 flex items-center justify-center text-white/80 text-base sm:text-lg font-light tracking-wide z-10 px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, exit: { duration: 1 } }}
              >
                Bugün özel bir gün...
              </motion.p>
            )}

            {scene === 2 && (
              <motion.p
                key="s2"
                className="absolute inset-0 flex items-center justify-center z-10 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, exit: { duration: 0.6 } }}
              >
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-white">
                  İyi ki doğdun
                </span>
              </motion.p>
            )}

            {(scene === 4 || scene === 3) && (
              <motion.div
                key="s3"
                className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl text-white">
                  İyi ki doğdun
                </span>
                <motion.span
                  className="mt-2 font-serif text-4xl sm:text-5xl md:text-6xl text-white"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{
                    textShadow:
                      "0 0 30px rgba(253, 224, 71, 0.4), 0 0 60px rgba(251, 191, 36, 0.2), 0 2px 20px rgba(0,0,0,0.3)",
                    color: "#fef3c7",
                  }}
                >
                  Bahar Hanım
                </motion.span>

                {/* Alt yazı döngüsü (sahne 4’ten sonra) */}
                {scene === 4 && (
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={subtitleIndex}
                      className="mt-6 text-white/70 text-sm sm:text-base font-light"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {SUBTITLES[subtitleIndex]}
                    </motion.p>
                  </AnimatePresence>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sahne 3’te sadece “Bahar Hanım” henüz (İyi ki doğdun + isim birlikte sonra) */}
          {/* Yıldız tozu / firefly */}
          {started && (
            <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden" aria-hidden>
              {fireflies.map((f) => (
                <motion.div
                  key={f.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${f.left}%`,
                    width: f.size,
                    height: f.size,
                    bottom: "-2%",
                    opacity: f.opacity,
                  }}
                  initial={{ y: 0 }}
                  animate={{ y: "-120vh" }}
                  transition={{
                    duration: f.duration,
                    delay: f.delay,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
