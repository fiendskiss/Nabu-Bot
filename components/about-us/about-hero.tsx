"use client";

import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import BorderGlow from "@/components/BorderGlow";
import { InteractiveHoverButton } from "@/components/button/interactive-hover-button";

const ABOUT_IMAGE =
  "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/footer-illustration_ypbfeo.webp";

const recognitions = [
  {
    title: "Global Innovation",
    description:
      "Recognised in 2024 for redefining intelligent household robotics.",
  },
  {
    title: "Consumer AI Design",
    description:
      "Awarded for seamless integration of adaptive intelligence.",
  },
];

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-[#050505] text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[20%] h-56 w-56 rounded-full bg-[#60A5FA]/8 blur-3xl" />
        <div className="absolute right-[14%] top-[16%] h-72 w-72 rounded-full bg-[#A855F7]/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1500px] items-center px-6 pb-6 pt-20 sm:px-8 lg:px-12">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid w-full items-center gap-6 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-4"
        >
          <motion.div variants={itemVariants} className="max-w-[38rem]">
            <h1 className="max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[3.2rem] lg:text-[3.7rem] xl:text-[4.1rem]">
              Designing Robots That Care for Everyday Life
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-[1.15rem]">
              Built on adaptive intelligence and precision engineering, we
              create home robots that understand routines, anticipate needs,
              and quietly make life easier every single day.
            </p>

            <div className="mt-6">
              <InteractiveHoverButton className="border-white/12 bg-black px-7 py-3 text-base text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.4)] [&>div:first-child>div:first-child]:bg-[linear-gradient(135deg,#7C3AED_0%,#5E00FF_50%,#A855F7_100%)] [&>div:last-child]:text-white">
                <span className="inline-flex items-center gap-2">
                  Contact the Team
                </span>
              </InteractiveHoverButton>
            </div>

            <motion.div
              variants={containerVariants}
              className="mt-8 grid max-w-[46rem] gap-4 sm:grid-cols-2"
            >
              {recognitions.map((item) => (
                <motion.div key={item.title} variants={itemVariants}>
                  <BorderGlow
                    className="h-full max-w-[22rem] px-5 py-5"
                    borderRadius={32}
                    edgeSensitivity={22}
                    glowRadius={24}
                    glowIntensity={0.42}
                    fillOpacity={0.18}
                    backgroundColor="rgba(255, 255, 255, 0.015)"
                    colors={["#60A5FA", "#A855F7", "#38BDF8"]}
                  >
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
                      {item.title}
                    </h2>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">
                      {item.description}
                    </p>
                  </BorderGlow>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative flex min-h-[420px] items-end justify-end overflow-visible lg:min-h-[680px]"
          >
            <div className="pointer-events-none absolute bottom-8 h-48 w-[82%] rounded-full bg-white/6 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-2%] h-[72%] w-[86%] rounded-full bg-gradient-to-t from-[#A855F7]/12 via-transparent to-transparent blur-3xl" />
            <motion.div
              initial={{ opacity: 0, x: 84, y: 40, rotate: -3 }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                rotate: -12.5,
              }}
              transition={{
                duration: 0.9,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10 w-[128%] max-w-none origin-bottom-right xl:w-[138%]"
            >
              <Image
                src={ABOUT_IMAGE}
                alt="Humanoid home robot"
                width={1150}
                height={1220}
                priority
                className="h-auto w-full max-w-none object-contain object-bottom [transform:translateX(18%)_translateY(2%)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
