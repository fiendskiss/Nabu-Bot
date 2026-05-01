"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { ReactNode, useRef } from "react";
import BorderGlow from "@/components/BorderGlow";
import MagicBento, { BentoCardProps } from "@/components/MagicBento";
import { LandingAccordionItem } from "@/components/interactive-image-accordion";

const Globe3DDemo = dynamic(() => import("@/components/about-us/3d-globe-demo"), {
  ssr: false,
});

const capabilityCards: BentoCardProps[] = [
  {
    color: "#060010",
    label: "Perception",
    title: "Room Awareness",
    description: "Maps rooms, movement, and habits to respond naturally.",
  },
  {
    color: "#060010",
    label: "Safety",
    title: "Gentle Navigation",
    description: "Moves with caution around people, pets, and furniture.",
  },
  {
    color: "#060010",
    label: "Assistance",
    title: "Daily Support",
    description: "Handles reminders, check-ins, and light household routines.",
  },
  {
    color: "#060010",
    label: "Learning",
    title: "Adaptive Intelligence",
    description: "Improves with each interaction to match your home rhythm.",
  },
  {
    color: "#060010",
    label: "Connection",
    title: "Family Sync",
    description: "Keeps every member informed with seamless household updates.",
  },
  {
    color: "#060010",
    label: "Privacy",
    title: "Protected by Design",
    description: "Built with local-first controls and transparent permissions.",
  },
];

const principles = [
  {
    title: "Human-First Design",
    description:
      "Every interaction is shaped to feel calm, intuitive, and reassuring in real homes.",
  },
  {
    title: "Reliable Everyday Autonomy",
    description:
      "From navigation to reminders, the system is engineered to stay useful without demanding attention.",
  },
  {
    title: "Trust Through Transparency",
    description:
      "We design for clear consent, visible status, and privacy controls that people can actually understand.",
  },
];

const milestones = [
  { value: "24/7", label: "companion readiness" },
  { value: "99.2%", label: "routine task consistency" },
  { value: "12+", label: "core home assistance flows" },
];

const journeyTimeline = [
  {
    step: "01",
    title: "First Companion Vision",
    description:
      "The team defined the core idea: a household robot that feels calm, helpful, and emotionally readable.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    step: "02",
    title: "Navigation and Home Mapping",
    description:
      "Early systems focused on safe movement, compact-room behavior, and awareness around people and furniture.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  },
  {
    step: "03",
    title: "Adaptive Intelligence Layer",
    description:
      "Context memory, routine learning, and companion dialogue were combined into one evolving experience stack.",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
  },
];

function ScrollFadeSection({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function JourneyTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 35%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#050505] py-14 text-white sm:py-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[18%] h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-[120px]" />
        <div className="absolute right-[12%] bottom-[14%] h-80 w-80 rounded-full bg-[#38BDF8]/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500"
          >
            Journey
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl lg:text-[3.4rem]"
          >
            Explore the milestones behind the NABU platform.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base"
          >
            Each stage reveals as you scroll through the section, showing how
            the platform moved from concept to a more complete home companion
            system.
          </motion.p>
        </div>

        <div className="mt-10 hidden lg:block">
          <div className="grid grid-cols-3 gap-8">
            {journeyTimeline.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex justify-center"
              >
                <div className="relative h-[11rem] w-[11rem] overflow-hidden rounded-[26px] border border-white/10 bg-[#09090f] shadow-[0_24px_50px_rgba(0,0,0,0.28)]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,10,0.04)_0%,rgba(6,6,10,0.12)_45%,rgba(6,6,10,0.34)_100%)]" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative mt-8">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
            <motion.div
              style={{ scaleX: lineScale, transformOrigin: "left center" }}
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,#7C3AED_0%,#A855F7_50%,#60A5FA_100%)]"
            />
            <div className="relative grid grid-cols-3 gap-8">
              {journeyTimeline.map((item, index) => (
                <motion.div
                  key={`${item.step}-marker`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.08 + index * 0.16,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex justify-start"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#A855F7]/35 bg-[linear-gradient(180deg,rgba(124,58,237,0.24),rgba(96,165,250,0.16))] text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.18)]">
                    {item.step}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-8">
            {journeyTimeline.map((item, index) => (
              <motion.div
                key={`${item.step}-copy`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.7,
                  delay: 0.14 + index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="max-w-[22rem]"
              >
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:hidden">
          {journeyTimeline.map((item, index) => (
            <motion.div
              key={`${item.step}-mobile`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.65,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px] border border-white/10">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#A855F7]/35 bg-[linear-gradient(180deg,rgba(124,58,237,0.24),rgba(96,165,250,0.16))] text-xs font-semibold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default function AboutSections() {
  return (
    <>
      <ScrollFadeSection className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#050505] py-14 text-white sm:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-[#60A5FA]/8 blur-3xl" />
          <div className="absolute right-[10%] bottom-16 h-72 w-72 rounded-full bg-[#A855F7]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-8 px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500">
              What Powers NABU
            </p>
            <h2 className="mt-3 text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl lg:text-[3.5rem]">
              A capability stack designed for calm, helpful autonomy.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              This next section brings together the intelligence layers that
              make NABU feel less like a machine and more like a dependable
              presence in the home.
            </p>
          </div>

          <div className="flex justify-center">
            <MagicBento
              cards={capabilityCards}
              sectionClassName="max-w-[78rem] p-0"
              cardsContainerClassName="w-full px-0"
              particleCount={10}
              spotlightRadius={260}
              glowColor="124, 58, 237"
              enableTilt={false}
              enableMagnetism
            />
          </div>
        </div>
      </ScrollFadeSection>

      <ScrollFadeSection className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#050505] py-14 text-white sm:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[16%] top-24 h-48 w-48 rounded-full bg-[#38BDF8]/10 blur-3xl" />
          <div className="absolute right-[12%] bottom-20 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-8 px-6 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500">
                Built for Real Homes
              </p>
              <h2 className="mt-3 text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl lg:text-[3.5rem]">
                Robotics that feel intentional in everyday spaces.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                We focus on practical usefulness over spectacle, blending
                adaptive software, safe movement, and approachable design into a
                robot that belongs in daily life.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {milestones.map((item) => (
                  <BorderGlow
                    key={item.label}
                    className="h-full px-4 py-4"
                    borderRadius={24}
                    edgeSensitivity={18}
                    glowRadius={22}
                    glowIntensity={0.35}
                    fillOpacity={0.16}
                    backgroundColor="rgba(255, 255, 255, 0.015)"
                    colors={["#60A5FA", "#A855F7", "#38BDF8"]}
                  >
                    <div className="text-2xl font-black tracking-[-0.05em] text-white sm:text-3xl">
                      {item.value}
                    </div>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
                      {item.label}
                    </p>
                  </BorderGlow>
                ))}
              </div>
            </div>

            <BorderGlow
              className="self-end px-3 py-3 lg:px-4 lg:py-4"
              borderRadius={30}
              edgeSensitivity={20}
              glowRadius={26}
              glowIntensity={0.38}
              fillOpacity={0.16}
              backgroundColor="rgba(255, 255, 255, 0.015)"
              colors={["#60A5FA", "#A855F7", "#38BDF8"]}
            >
              <div className="flex h-[21rem] items-center justify-center overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.12),transparent_55%),#060010] sm:h-[28rem]">
                <div className="h-full w-full">
                  <Globe3DDemo />
                </div>
              </div>
            </BorderGlow>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {principles.map((item) => (
              <BorderGlow
                key={item.title}
                className="h-full px-5 py-5"
                borderRadius={26}
                edgeSensitivity={20}
                glowRadius={24}
                glowIntensity={0.4}
                fillOpacity={0.18}
                backgroundColor="rgba(255, 255, 255, 0.015)"
                colors={["#60A5FA", "#A855F7", "#38BDF8"]}
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {item.description}
                </p>
              </BorderGlow>
            ))}
          </div>
        </div>
      </ScrollFadeSection>

      <JourneyTimelineSection />

      <ScrollFadeSection className="relative overflow-hidden bg-[#050505] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[14%] top-16 h-60 w-60 rounded-full bg-[#60A5FA]/8 blur-3xl" />
          <div className="absolute right-[10%] bottom-10 h-72 w-72 rounded-full bg-[#A855F7]/10 blur-3xl" />
        </div>

        <div className="relative">
          <LandingAccordionItem />
        </div>
      </ScrollFadeSection>
    </>
  );
}
