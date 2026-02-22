"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Son sahnede çarpıcı övgüler (köşeden ortaya kayan)
const OVGULER = [
  "Seni çok seviyoruz.",
  "Eşsizsin.",
  "Hep yanındayız.",
  "İyi ki varsın, hep böyle kal.",
  "Nice mutlu yıllara, hep gülümse.",
];

const KONFETI_RENKLER = ["#f9a8d4", "#fde047", "#fef08a", "#ffffff", "#e879f9", "#a78bfa", "#22d3ee", "#34d399"];
function konfeti(confetti, opts = {}) {
  if (!confetti) return;
  confetti({
    particleCount: opts.count ?? 100,
    spread: opts.spread ?? 100,
    origin: opts.origin ?? { y: 0.5, x: 0.5 },
    colors: opts.colors ?? KONFETI_RENKLER,
    scalar: opts.scalar ?? 0.9,
    startVelocity: opts.velocity ?? 45,
    decay: opts.decay ?? 0.96,
    zIndex: 9999,
  });
}

// Mobilde performans için daha az element
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const h = () => setIsMobile(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return isMobile;
}

export default function SurprizPage() {
  const isMobile = useIsMobile();
  const [started, setStarted] = useState(false);
  const [darkOverlay, setDarkOverlay] = useState(1);
  const [scene, setScene] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [showBirthdayText, setShowBirthdayText] = useState(true);
  const [showSignature, setShowSignature] = useState(false);
  const [showComplimentText, setShowComplimentText] = useState(true);
  const confettiRef = useRef(null);
  const timersRef = useRef([]);
  const confettiIntervalRef = useRef(null);

  // Övgü köşeleri: sırayla farklı köşeden gelsin (sol üst, sağ üst, sağ alt, sol alt)
  const KOSE_OFFSET = [
    { x: "-80%", y: "-80%" },
    { x: "80%", y: "-80%" },
    { x: "80%", y: "80%" },
    { x: "-80%", y: "80%" },
  ];

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
      add(() => setScene(2), 1600);

      // İlk cümle temposu baz alındı, sahneler yavaş
      add(() => setScene(3), 3600);
      add(() => setScene(4), 5600);
      add(() => setScene(5), 8600);
      const confettiCount = isMobile ? 120 : 280;
      // 9200ms = İyi ki doğdun anı — müziğin nakaratı / bando bu ana denk getirilebilir
      add(() => {
        setScene(5);
        setShowBirthdayText(true);
        const c = confettiRef.current;
        if (c) {
          const corners = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
          corners.forEach((origin, i) => {
            setTimeout(() => {
              konfeti(c, { count: confettiCount, spread: 130, origin, velocity: 52, decay: 0.97 });
            }, i * 100);
          });
          const fromBottom = [{ x: 0.25, y: 1 }, { x: 0.75, y: 1 }];
          const fromTop = [{ x: 0.25, y: 0 }, { x: 0.75, y: 0 }];
          fromBottom.forEach((origin, i) => {
            setTimeout(() => konfeti(c, { count: confettiCount, spread: 110, origin, velocity: 54, decay: 0.97 }), 450 + i * 80);
          });
          fromTop.forEach((origin, i) => {
            setTimeout(() => konfeti(c, { count: confettiCount, spread: 110, origin, velocity: 54, decay: 0.97 }), 450 + i * 80);
          });
          if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
          confettiIntervalRef.current = setInterval(() => {
            const conf = confettiRef.current;
            if (!conf) return;
            const n = isMobile ? 15 : 35;
            const colors = [KONFETI_RENKLER[Math.floor(Math.random() * KONFETI_RENKLER.length)], KONFETI_RENKLER[Math.floor(Math.random() * KONFETI_RENKLER.length)]];
            konfeti(conf, { count: n + Math.floor(Math.random() * 20), spread: 70, origin: { x: 0.1, y: 1 }, velocity: 28, decay: 0.98, colors });
            konfeti(conf, { count: n + Math.floor(Math.random() * 20), spread: 70, origin: { x: 0.9, y: 1 }, velocity: 28, decay: 0.98, colors });
          }, 2000);
        }
      }, 9200);

      add(() => setShowBirthdayText(false), 9200 + 2800);
      // Alt yazı döngüsü (sahne 4’ten sonra)
      add(() => setSubtitleIndex(0), 12200);
      add(() => setSubtitleIndex(1), 14200);
      add(() => setSubtitleIndex(2), 16200);
      add(() => setSubtitleIndex(3), 18200);
      add(() => setSubtitleIndex(4), 20200);
      add(() => setShowComplimentText(false), 22800);
      add(() => setShowSignature(true), 22800 + 900);
    };
    run();
  }, [add, isMobile]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    };
  }, []);

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
  const [partyFireflies] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: `p-${i}`,
      left: (i * 2.7) % 96,
      delay: (i * 0.4) % 5,
      duration: 6 + (i % 5),
      size: 1.5 + (i % 3),
      opacity: 0.12 + (i % 5) * 0.06,
    }))
  );
  const firefliesToShow = scene === 5
    ? (isMobile ? partyFireflies.slice(0, 18) : partyFireflies)
    : (isMobile ? fireflies.slice(0, 4) : fireflies);

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

      {/* Pastel ışıklar — sahne 5’te hız 3x, opacity %40 */}
      <motion.div
        className={`absolute rounded-full pointer-events-none w-[80%] max-w-[500px] h-[60%] -top-[20%] -left-[20%] ${isMobile ? "blur-[60px]" : "blur-[120px]"}`}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
        animate={{
          scale: [1, 1.2, 1],
          backgroundColor: "#f9a8d4",
          opacity: scene === 5 ? 0.4 : 0.18,
        }}
        transition={{
          scale: { duration: scene === 5 ? 4 : 12, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.8 },
        }}
      />
      <motion.div
        className={`absolute rounded-full pointer-events-none w-[70%] max-w-[400px] h-[50%] -top-[10%] -right-[25%] ${isMobile ? "blur-[60px]" : "blur-[120px]"}`}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
        animate={{
          scale: [1, 1.15, 1],
          backgroundColor: "#fde047",
          opacity: scene === 5 ? 0.4 : 0.14,
        }}
        transition={{
          scale: { duration: scene === 5 ? 4.7 : 14, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.8 },
        }}
      />
      {!isMobile && (
        <motion.div
          className="absolute rounded-full blur-[100px] pointer-events-none w-[50%] max-w-[280px] h-[40%] bottom-[-10%] left-1/2 -translate-x-1/2"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
          animate={{
            scale: [1, 1.18, 1],
            backgroundColor: "#e879f9",
            opacity: scene === 5 ? 0.35 : 0.1,
          }}
          transition={{
            scale: { duration: scene === 5 ? 3.7 : 11, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.8 },
          }}
        />
      )}
      {/* Sahne 5: mor ve turkuaz soft hüzme */}
      <AnimatePresence>
        {scene === 5 && (
          <>
            <motion.div
              className={`absolute rounded-full pointer-events-none w-[40%] max-w-[220px] h-[35%] top-[-5%] right-[10%] ${isMobile ? "blur-[80px]" : "blur-[100px]"}`}
              style={{ background: "#a78bfa", willChange: "opacity", transform: "translateZ(0)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.12, 0.22, 0.12] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className={`absolute rounded-full pointer-events-none w-[35%] max-w-[200px] h-[30%] bottom-[5%] left-[5%] ${isMobile ? "blur-[80px]" : "blur-[100px]"}`}
              style={{ background: "#22d3ee", willChange: "opacity", transform: "translateZ(0)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </AnimatePresence>

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
            transition={{ duration: isMobile ? 3.5 : 2.5, repeat: Infinity, ease: "easeInOut" }}
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
                transition={{ duration: 0.5, exit: { duration: 0.35 } }}
              >
                Bugün özel bir gün...
              </motion.p>
            )}

            {scene === 2 && (
              <motion.p
                key="s2"
                className="absolute inset-0 flex items-center justify-center z-10 px-4 font-serif text-4xl sm:text-5xl md:text-6xl text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, exit: { duration: 0.25 } }}
                style={{
                  textShadow: "0 0 30px rgba(253, 224, 71, 0.4), 0 0 60px rgba(251, 191, 36, 0.2)",
                  color: "#fef3c7",
                }}
              >
                Bahar Hanım
              </motion.p>
            )}

            {scene === 3 && (
              <motion.p
                key="s3"
                className="absolute inset-0 flex items-center justify-center z-10 px-4 text-center text-white/90 text-lg sm:text-xl font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, exit: { duration: 0.25 } }}
              >
                Özel biri var bu ekranda.
              </motion.p>
            )}

            {scene === 4 && (
              <motion.div
                key="s4"
                className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center text-white/90 text-base sm:text-lg font-light gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, exit: { duration: 0.25 } }}
              >
                <p>Bugün her şey senin için.</p>
                <p>İşte o sen misin?</p>
              </motion.div>
            )}

            {scene === 5 && (
              <motion.div
                key="s5"
                className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {showBirthdayText && (
                    <motion.div
                      key="birthday"
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                      <motion.div
                        className="absolute w-[140%] h-[120%] rounded-full pointer-events-none"
                        style={{
                          background: "radial-gradient(circle, rgba(253,224,71,0.25) 0%, rgba(251,191,36,0.08) 40%, transparent 70%)",
                          filter: "blur(25px)",
                        }}
                        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.p
                        className="font-serif text-3xl sm:text-4xl md:text-5xl relative z-10 text-center"
                        animate={{
                          color: ["#fef3c7", "#ffffff", "#fef3c7"],
                          textShadow: [
                            "0 0 28px rgba(253, 224, 71, 0.4), 0 2px 20px rgba(0,0,0,0.2)",
                            "0 0 36px rgba(255, 255, 255, 0.35), 0 2px 20px rgba(0,0,0,0.2)",
                            "0 0 28px rgba(253, 224, 71, 0.4), 0 2px 20px rgba(0,0,0,0.2)",
                          ],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        İyi ki doğdun Bahar Hanım
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!showBirthdayText && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {showComplimentText && (
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={subtitleIndex}
                          className="absolute inset-0 flex items-center justify-center text-white/95 text-lg sm:text-xl font-serif px-4 text-center"
                          style={{
                            textShadow: "0 0 20px rgba(253, 224, 71, 0.3), 0 2px 12px rgba(0,0,0,0.3)",
                            color: "#fef3c7",
                          }}
                          initial={{
                            opacity: 0,
                            scale: 0.5,
                            x: KOSE_OFFSET[subtitleIndex % 4].x,
                            y: KOSE_OFFSET[subtitleIndex % 4].y,
                          }}
                          animate={{
                            opacity: 1,
                            scale: [0.5, 1.2, 1],
                            x: 0,
                            y: [0, -8, 0],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            opacity: { duration: 0.5 },
                            scale: { duration: 0.7, times: [0, 0.6, 1], ease: "easeOut" },
                            x: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
                            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                            exit: { duration: 0.8, ease: "easeInOut" },
                          }}
                        >
                          {OVGULER[subtitleIndex]}
                        </motion.p>
                      </AnimatePresence>
                    )}
                    {showSignature && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center px-4"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                      >
                        <Image
                          src="/imza.png"
                          alt="İmza"
                          width={320}
                          height={240}
                          className="object-contain w-[min(90vw,380px)] h-auto max-h-[55vh]"
                          unoptimized
                        />
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Yıldız tozu — sahne 5’te 40 adet, hızlı yükseliş */}
          {started && (
            <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden" aria-hidden style={{ contain: "layout style paint" }}>
              {firefliesToShow.map((f) => (
                <motion.div
                  key={f.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${f.left}%`,
                    width: f.size,
                    height: f.size,
                    bottom: "-2%",
                    opacity: f.opacity,
                    willChange: "transform",
                  }}
                  initial={{ y: 0 }}
                  animate={{ y: "-120vh" }}
                  transition={{
                    duration: scene === 5 ? f.duration : (isMobile ? 28 : f.duration),
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
