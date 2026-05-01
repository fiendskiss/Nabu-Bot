"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const leftWords = ["delivering", "inspiring", "advancing", "engineering"];

const rightItems = [
  {
    title: "Evolution",
    description: "Improving with every iteration.",
  },
  {
    title: "Advancement",
    description: "Driving robotics into the future.",
  },
  {
    title: "Empowerment",
    description: "Enhancing human capability.",
  },
  {
    title: "Reliability",
    description: "Performing consistently under pressure.",
  },
  {
    title: "Precision",
    description: "Built with exacting engineering.",
  },
  {
    title: "Creativity",
    description: "Ideas shaped into smart machines.",
  },
  {
    title: "Dedication",
    description: "Committed to meaningful innovation.",
  },
  {
    title: "Breakthroughs",
    description: "Setting new tech benchmarks.",
  },
];

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

const wheelRowHeight = 112;
const wheelItems = [...rightItems, ...rightItems, ...rightItems];

export default function FifthSectionShowcase() {
  const [leftIndex, setLeftIndex] = useState(1);
  const [rightIndex, setRightIndex] = useState(rightItems.length + 4);
  const [wheelAnimated, setWheelAnimated] = useState(true);

  useEffect(() => {
    const leftTimer = window.setInterval(() => {
      setLeftIndex((current) => wrapIndex(current + 1, leftWords.length));
    }, 2600);

    const rightTimer = window.setInterval(() => {
      setRightIndex((current) => current + 1);
    }, 1250);

    return () => {
      window.clearInterval(leftTimer);
      window.clearInterval(rightTimer);
    };
  }, []);

  const currentWord = leftWords[leftIndex];

  useEffect(() => {
    if (rightIndex < rightItems.length * 2) {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setWheelAnimated(false);
      setRightIndex((current) => current - rightItems.length);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setWheelAnimated(true);
        });
      });
    }, 420);

    return () => {
      window.clearTimeout(resetTimer);
    };
  }, [rightIndex]);

  const wheelOffset = wheelRowHeight - rightIndex * wheelRowHeight;

  return (
    <div className="w-full px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid min-h-[70vh] w-full max-w-[102rem] grid-cols-1 gap-12 lg:grid-cols-[1.05fr_auto_1fr] lg:items-center">
        <div className="relative flex min-h-[24rem] flex-col justify-center">
          <p className="absolute top-0 left-0 text-sm font-medium uppercase tracking-[0.24em] text-neutral-500">
            About Us
          </p>

          <div className="flex flex-nowrap items-baseline gap-3 whitespace-nowrap md:gap-5 lg:gap-6">
            <p className="text-4xl font-semibold leading-[0.98] tracking-tight text-white md:text-[3.9rem] lg:text-[4.7rem]">
              We are
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <p className="text-5xl font-medium leading-none tracking-tight text-neutral-500 md:text-[4.35rem] lg:text-[5rem]">
                  {currentWord}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden lg:flex">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] shadow-[0_0_0_4px_rgba(124,58,237,0.08),0_10px_30px_rgba(0,0,0,0.4)]">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#A855F7]/45 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.35),rgba(94,0,255,0.14)_45%,rgba(0,0,0,0.95)_100%)] shadow-[inset_0_2px_6px_rgba(255,255,255,0.12),0_0_18px_rgba(124,58,237,0.28)]">
              <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#A855F7]/25" />
              <span className="pointer-events-none absolute inset-[4px] animate-ping rounded-full border border-[#5E00FF]/35 opacity-70 [animation-delay:300ms]" />
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/5 lg:border-t-0">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/92 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/92 to-transparent" />

          <div className="relative h-[336px] overflow-hidden md:h-[360px]">
            <motion.div
              animate={{ y: wheelOffset }}
              transition={
                wheelAnimated
                  ? { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0 }
              }
              className="relative"
            >
              {wheelItems.map((item, index) => {
                const distance = Math.abs(index - rightIndex);
                const isCentered = distance === 0;

                return (
                  <div
                    key={`${item.title}-${index}`}
                    className="grid h-28 grid-cols-1 items-center gap-3 border-b border-white/6 md:grid-cols-[1.1fr_1fr] md:gap-8"
                  >
                    <motion.p
                      animate={{
                        opacity: isCentered ? 1 : distance === 1 ? 0.5 : 0.22,
                        scale: isCentered ? 1 : 0.94,
                      }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className={`text-3xl tracking-tight md:text-[3rem] ${
                        isCentered ? "font-semibold text-white" : "font-medium text-neutral-500"
                      }`}
                    >
                      {item.title}
                    </motion.p>

                    <motion.p
                      animate={{
                        opacity: isCentered ? 1 : distance === 1 ? 0.46 : 0.18,
                        scale: isCentered ? 1 : 0.97,
                      }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className={`text-base md:text-2xl ${
                        isCentered ? "text-neutral-300" : "text-neutral-600"
                      }`}
                    >
                      {item.description}
                    </motion.p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
