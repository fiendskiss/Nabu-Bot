'use client'

import { AnimatePresence, motion } from "framer-motion";
import { Text_03 } from "@/components/ui/Text_03";
import { SplineScene } from "@/components/home/splite";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const stats = [
  { label: "Height", value: "5'8" },
  { label: "Weight", value: "48KG" },
  { label: "Payload", value: "18KG" },
  { label: "Battery life", value: "12HR" },
  { label: "Speed", value: "1.20M/S" },
  { label: "System", value: "ELECTRIC" },
];

type DotSide = "left" | "right";

interface HotspotDot {
  id: string;
  label: string;
  description: string;
  top: string;
  left: string;
  side: DotSide;
  lineWidth?: string;
}

const hotspots: HotspotDot[] = [
  {
    id: "head",
    label: "Intelligent Core",
    description:
      "The central processing unit powers the robot's decision-making, AI behavior, and complex task execution.",
    top: "12%",
    left: "50%",
    side: "right",
  },
  {
    id: "chest",
    label: "Power Cell",
    description:
      "A high-density electric power cell provides up to 12 hours of continuous operation per charge cycle.",
    top: "42%",
    left: "50%",
    side: "right",
    lineWidth: "w-72",
  },
  {
    id: "arm",
    label: "Precision Actuator",
    description:
      "Hydraulic-electric hybrid actuators deliver 18KG payload capacity with sub-millimeter positional accuracy.",
    top: "52%",
    left: "100%",
    side: "right",
  },
  {
    id: "leg",
    label: "Locomotion System",
    description:
      "Adaptive bipedal locomotion allows the robot to navigate complex terrain at speeds up to 1.20M/S.",
    top: "78%",
    left: "30%",
    side: "right",
    lineWidth: "w-64",
  },
];

function Hotspot({
  dot,
  isActive,
  onOpen,
  onClose,
  onToggle,
  compact = false,
}: {
  dot: HotspotDot;
  isActive: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  compact?: boolean;
}) {
  const isRight = dot.side === "right";

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: dot.top,
        left: dot.left,
        transform: "translate(-50%, -50%)",
        zIndex: 70,
      }}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        onMouseEnter={compact ? undefined : onOpen}
        onMouseLeave={compact ? undefined : onClose}
        onFocus={onOpen}
        onBlur={onClose}
        aria-pressed={isActive}
        className={`pointer-events-auto relative z-10 flex cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-125 ${
          compact ? "h-10 w-10" : "h-8 w-8"
        }`}
      >
        <span
          className={`pointer-events-none absolute inset-0 animate-ping rounded-full ${
            isActive ? "bg-[#A855F7]/50" : "bg-white/30"
          }`}
        />
        <span
          className={`rounded-full shadow-[0_0_16px_4px_rgba(255,255,255,0.42)] ${
            compact ? "h-5 w-5" : "h-4 w-4"
          } ${isActive ? "bg-[#E9D5FF]" : "bg-white/90"}`}
        />
      </button>

      {!compact && (
        <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ originX: isRight ? 0 : 1 }}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            className={`pointer-events-auto absolute top-1/2 flex -translate-y-1/2 items-center ${
              isRight ? "left-4 flex-row" : "right-4 flex-row-reverse"
            }`}
          >
            <div className={`h-px ${dot.lineWidth ?? "w-40"} bg-white/60`} />

            <motion.div
              initial={{ opacity: 0, x: isRight ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRight ? -10 : 10 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="w-56 rounded-xl border border-white/10 bg-black/70 p-4 shadow-xl backdrop-blur-md"
            >
              <p className="mb-1 text-sm font-semibold text-white">
                {dot.label}
              </p>
              <p className="text-xs leading-relaxed text-neutral-400">
                {dot.description}
              </p>
              <Link
                href="/book"
                className="mt-3 rounded-full border border-[#A855F7]/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-3 py-1 text-xs text-white shadow-[0_0_0_1px_rgba(96,165,250,0.16),0_0_18px_rgba(124,58,237,0.24),0_0_30px_rgba(96,165,250,0.14)] transition-colors hover:bg-white/10"
              >
                Learn more
              </Link>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      )}
    </div>
  );
}

export function RobotSpecsSection({
  interactive = true,
  scene,
  showScene = true,
  compact = false,
}: {
  interactive?: boolean;
  scene?: string;
  showScene?: boolean;
  compact?: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const openHotspot = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setActiveId(id);
  };

  const toggleHotspot = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setActiveId((current) => (current === id ? null : id));
  };

  const closeHotspot = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setActiveId((current) => (current === id ? null : current));
      closeTimeoutRef.current = null;
    }, 120);
  };

  if (compact) {
    const activeHotspot = hotspots.find((dot) => dot.id === activeId) ?? hotspots[0];

    return (
      <section className="relative w-full px-4 pb-14 pt-10 pointer-events-none sm:px-6 md:px-8">
        <div className="mx-auto mb-10 w-full max-w-md pointer-events-auto">
          <div
            className={`relative h-[32rem] overflow-visible sm:h-[36rem] ${
              showScene && scene
                ? "overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                : ""
            }`}
          >
            {showScene && scene ? (
              <>
              <div className="absolute inset-x-0 bottom-0 z-30 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-y-0 left-0 z-30 w-12 bg-gradient-to-r from-black via-black/70 to-transparent" />
              <div className="absolute inset-y-0 right-0 z-30 w-12 bg-gradient-to-l from-black via-black/70 to-transparent" />
              <SplineScene scene={scene} className="h-full w-full scale-[1.08]" />
              </>
            ) : null}

            <div className="pointer-events-none absolute inset-0 z-40">
              {hotspots.map((dot) => (
                <Hotspot
                  key={dot.id}
                  dot={dot}
                  isActive={activeId === dot.id}
                  onOpen={() => openHotspot(dot.id)}
                  onClose={() => closeHotspot(dot.id)}
                  onToggle={() => toggleHotspot(dot.id)}
                  compact
                />
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/65 p-4 text-white shadow-xl backdrop-blur-md">
            <p className="mb-1 text-sm font-semibold">{activeHotspot.label}</p>
            <p className="text-xs leading-relaxed text-neutral-400">
              {activeHotspot.description}
            </p>
            <Link
              href="/book"
              className="mt-3 inline-flex rounded-full border border-[#A855F7]/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-3 py-1 text-xs text-white shadow-[0_0_0_1px_rgba(96,165,250,0.16),0_0_18px_rgba(124,58,237,0.24),0_0_30px_rgba(96,165,250,0.14)] transition-colors hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-x-5 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="group transition-opacity duration-700"
              style={{
                opacity: 1,
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="h-px w-full bg-white/10" />
              <div className="flex min-h-24 flex-col justify-center gap-1 py-4">
                <p className="text-xs tracking-wide text-neutral-500 sm:text-sm">
                  {stat.label}
                </p>
                <Text_03
                  text={stat.value}
                  className="!w-auto !justify-start !text-left !text-xl font-bold text-white sm:!text-2xl"
                />
              </div>
            </div>
          ))}
          <div className="col-span-2 h-px w-full bg-white/10 sm:col-span-3" />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-6 py-20 pointer-events-none md:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-3 lg:items-center">
        <div
          className={
            interactive
              ? "order-2 flex flex-col pointer-events-auto lg:order-1"
              : "order-2 flex flex-col pointer-events-none lg:order-1"
          }
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="group transition-opacity duration-700"
              style={{
                opacity: 1,
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="h-px w-full bg-white/10" />
              <div className="flex flex-col gap-1 py-4">
                <p className="text-sm tracking-wide text-neutral-500">
                  {stat.label}
                </p>
                <Text_03
                  text={stat.value}
                  className="!w-auto !justify-start !text-left !text-2xl font-bold text-white"
                />
              </div>
            </div>
          ))}
          <div className="h-px w-full bg-white/10" />
        </div>

        <div
          className={
            interactive
              ? `order-1 relative min-h-[480px] w-full ${
                  showScene ? "pointer-events-auto" : "pointer-events-none"
                } lg:order-2 lg:min-h-[680px]`
              : "order-1 relative min-h-[480px] w-full pointer-events-none lg:order-2 lg:min-h-[680px]"
          }
        >
          {showScene && scene ? (
            <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
              <div className="absolute inset-x-0 bottom-0 z-30 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-y-0 left-0 z-30 w-16 bg-gradient-to-r from-black via-black/70 to-transparent" />
              <div className="absolute inset-y-0 right-0 z-30 w-16 bg-gradient-to-l from-black via-black/70 to-transparent" />
              <SplineScene scene={scene} className="h-full w-full scale-[1.08]" />
            </div>
          ) : null}

          <div className="pointer-events-none absolute inset-0">
            {hotspots.map((dot) => (
              <Hotspot
                key={dot.id}
                dot={dot}
                isActive={activeId === dot.id}
                onOpen={() => openHotspot(dot.id)}
                onClose={() => closeHotspot(dot.id)}
                onToggle={() => toggleHotspot(dot.id)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
