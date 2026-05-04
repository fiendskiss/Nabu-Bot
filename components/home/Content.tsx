'use client'

import { Michroma } from "next/font/google";
import Testimonies from "@/components/use-cases/use-cases";
import FifthSectionShowcase from "@/components/home/FifthSectionShowcase";
import HubOrb from "@/components/home/HubOrb";
import { RadialOrbitalTimelineDemo } from "@/components/home/radial";
import { RobotSpecsSection } from "@/components/ui/Specs";
import { TextScramble } from "@/components/ui/text-scramble";
import { SplineScene } from "@/components/home/splite";
import { useEffect, useRef } from "react";
import LiquidEther from "../bg/LiquidEther";

const ROBOT_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
});

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function rangeProgress(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp((value - start) / (end - start));
}

function fadeWindow(
  value: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number
) {
  if (value <= fadeInStart || value >= fadeOutEnd) return 0;
  if (value < fadeInEnd) return rangeProgress(value, fadeInStart, fadeInEnd);
  if (value <= fadeOutStart) return 1;
  return 1 - rangeProgress(value, fadeOutStart, fadeOutEnd);
}

export function SplineSceneBasic() {
  const sectionRef = useRef<HTMLElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const specsOverlayRef = useRef<HTMLDivElement>(null);
  const sectionThreeRef = useRef<HTMLDivElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const mobileHeroOverlayRef = useRef<HTMLDivElement>(null);
  const mobileOrbRef = useRef<HTMLDivElement>(null);
  const mobileSpecsOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;

    const updateStage = () => {
      frameId = 0;

      if (
        sectionRef.current &&
        robotRef.current &&
        heroOverlayRef.current &&
        orbRef.current &&
        specsOverlayRef.current &&
        sectionThreeRef.current
      ) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollDistance = Math.max(sectionRef.current.offsetHeight - window.innerHeight, 1);
        const rawProgress = (-rect.top) / scrollDistance;
        const progress = clamp(rawProgress);

        const heroOpacity = 1 - rangeProgress(progress, 0.08, 0.3);
        const specsOpacity = fadeWindow(progress, 0.22, 0.4, 0.58, 0.8);
        const sectionThreeOpacity = rangeProgress(progress, 0.7, 0.92);
        const robotOpacity = 1 - rangeProgress(progress, 0.74, 0.94);

        heroOverlayRef.current.style.opacity = heroOpacity.toString();
        heroOverlayRef.current.style.transform = `translate3d(0, ${progress * 48}px, 0)`;

        orbRef.current.style.opacity = heroOpacity.toString();
        orbRef.current.style.transform = `translate3d(0, ${progress * 42}px, 0)`;

        specsOverlayRef.current.style.opacity = specsOpacity.toString();
        specsOverlayRef.current.style.transform = `translate3d(0, ${(1 - specsOpacity) * 48}px, 0)`;

        sectionThreeRef.current.style.opacity = sectionThreeOpacity.toString();
        sectionThreeRef.current.style.transform = `translate3d(0, ${(1 - sectionThreeOpacity) * 56}px, 0)`;
        sectionThreeRef.current.style.pointerEvents =
          sectionThreeOpacity > 0.3 ? "auto" : "none";

        robotRef.current.style.opacity = robotOpacity.toString();
        robotRef.current.style.transform = `scale(${1 - sectionThreeOpacity * 0.04})`;
      }

      if (
        mobileSectionRef.current &&
        mobileHeroOverlayRef.current &&
        mobileOrbRef.current &&
        mobileSpecsOverlayRef.current
      ) {
        const rect = mobileSectionRef.current.getBoundingClientRect();
        const scrollDistance = Math.max(
          mobileSectionRef.current.offsetHeight - window.innerHeight,
          1
        );
        const progress = clamp((-rect.top) / scrollDistance);
        const heroOpacity = 1 - rangeProgress(progress, 0.08, 0.34);
        const specsOpacity = rangeProgress(progress, 0.32, 0.62);

        mobileHeroOverlayRef.current.style.opacity = heroOpacity.toString();
        mobileHeroOverlayRef.current.style.transform = `translate3d(0, ${progress * 36}px, 0)`;

        mobileOrbRef.current.style.opacity = heroOpacity.toString();
        mobileOrbRef.current.style.transform = `translate3d(0, ${progress * 30}px, 0)`;

        mobileSpecsOverlayRef.current.style.opacity = specsOpacity.toString();
        mobileSpecsOverlayRef.current.style.transform = `translate3d(0, ${(1 - specsOpacity) * 36}px, 0)`;
        mobileSpecsOverlayRef.current.style.pointerEvents =
          specsOpacity > 0.35 ? "auto" : "none";
      }
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateStage);
    };

    updateStage();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="relative bg-[#0A0A0A]">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LiquidEther
          mouseForce={20}
          cursorSize={120}
          colors={["#7C3AED", "#5E00FF", "#A855F7"]}
          className="opacity-90"
        />
      </div>

      <section className="relative z-10 lg:hidden">
        <section ref={mobileSectionRef} className="relative h-[220svh]">
          <div
            id="robot-specs-section"
            className="absolute left-0 top-[44%] h-px w-px scroll-mt-24"
            aria-hidden="true"
          />

          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 z-20">
              <div className="absolute bottom-0 left-0 right-0 z-30 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              <div className="absolute bottom-0 left-0 top-0 z-30 w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
              <div className="absolute bottom-0 right-0 top-0 z-30 w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent" />

              <div className="relative z-20 h-full w-full pointer-events-auto">
                <SplineScene scene={ROBOT_SCENE_URL} className="h-full w-full" />
              </div>
            </div>

            <div
              ref={mobileHeroOverlayRef}
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5"
              style={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
            >
              <TextScramble
                as="h1"
                duration={1.6}
                speed={0.04}
                characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                className={`${michroma.className} text-center text-[clamp(3rem,17vw,7rem)] font-normal uppercase leading-[0.88] tracking-[0.08em] text-[#F1EEFF] [text-shadow:0_0_24px_rgba(168,85,247,0.5),0_0_70px_rgba(94,0,255,0.34)]`}
              >
                NABU
              </TextScramble>
            </div>

            <div
              ref={mobileOrbRef}
              className="pointer-events-none absolute bottom-7 left-5 right-5 z-40 flex items-end justify-between gap-5 sm:left-8 sm:right-8"
              style={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
            >
              <div className="flex flex-col gap-1 text-left leading-none">
                <span className="text-[0.8rem] font-medium uppercase tracking-[0.26em] text-[rgba(255,255,255,0.98)] sm:text-[0.95rem]">
                  Your
                </span>
                <span className="text-[0.8rem] font-medium uppercase tracking-[0.26em] text-[rgba(255,255,255,0.98)] sm:text-[0.95rem]">
                  Daily
                </span>
                <span className="text-[0.8rem] font-medium uppercase tracking-[0.26em] text-[rgba(255,255,255,0.98)] sm:text-[0.95rem]">
                  Companion
                </span>
              </div>
              <HubOrb className="w-[7rem] shrink-0 sm:w-[8rem]" />
            </div>

            <div
              ref={mobileSpecsOverlayRef}
              className="absolute inset-0 z-50 pointer-events-none"
              style={{ opacity: 0, transform: "translate3d(0, 36px, 0)" }}
            >
              <RobotSpecsSection showScene={false} interactive compact />
            </div>
          </div>
        </section>

        <section className="relative overflow-visible bg-[#0A0A0A] px-5 pb-20 pt-8 sm:px-8 md:px-10">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
            <div className="text-center md:text-left">
              <p className="mb-4 text-xs uppercase tracking-[0.32em] text-neutral-500 sm:text-sm">
                Features
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
                Built Around Your Daily Life
              </h2>
              <p className="text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
                From managing routines to learning user habits, the system is
                designed to support everyday tasks through simple, connected
                features. Each function works together to provide organized,
                responsive, and personalized assistance inside the home.
              </p>
            </div>

            <RadialOrbitalTimelineDemo heightClassName="h-[30rem] sm:h-[34rem] md:h-[38rem]" />
          </div>
        </section>
      </section>

      <section ref={sectionRef} className="relative z-10 hidden h-[300vh] lg:block">
        <div
          id="robot-specs-section"
          aria-hidden="true"
          className="absolute left-0 top-[32%] h-px w-px scroll-mt-24"
        />
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            ref={robotRef}
            className="absolute inset-0 z-20 origin-center pointer-events-none"
            style={{ opacity: 1, transform: "scale(1)" }}
          >
            <div className="absolute bottom-0 left-0 right-0 z-30 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
            <div className="absolute bottom-0 left-0 top-0 z-30 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
            <div className="absolute bottom-0 right-0 top-0 z-30 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent" />

            <div className="relative z-20 h-full w-full pointer-events-auto">
              <SplineScene scene={ROBOT_SCENE_URL} className="h-full w-full" />
            </div>
          </div>

          <div
            ref={heroOverlayRef}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6"
            style={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          >
            <div className="absolute bottom-6 left-8 sm:bottom-7 sm:left-12 lg:bottom-8 lg:left-20">
              <div className="flex flex-col gap-1 text-left leading-none">
                <span className="text-[0.95rem] font-medium uppercase tracking-[0.32em] text-[rgba(255,255,255,0.98)] sm:text-[1.1rem] lg:text-[1.2rem]">
                  Your
                </span>
                <span className="text-[0.95rem] font-medium uppercase tracking-[0.32em] text-[rgba(255,255,255,0.98)] sm:text-[1.1rem] lg:text-[1.2rem]">
                  Daily
                </span>
                <span className="text-[0.95rem] font-medium uppercase tracking-[0.32em] text-[rgba(255,255,255,0.98)] sm:text-[1.1rem] lg:text-[1.2rem]">
                  Companion
                </span>
              </div>
            </div>

            <div className="flex w-full items-center justify-center">
              <TextScramble
                as="h1"
                duration={1.6}
                speed={0.04}
                characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                className={`${michroma.className} text-center text-[clamp(5.5rem,22vw,18rem)] font-normal uppercase leading-[0.84] tracking-[0.12em] text-[#F1EEFF] [text-shadow:0_0_24px_rgba(168,85,247,0.5),0_0_70px_rgba(94,0,255,0.34)]`}
              >
                NABU
              </TextScramble>
            </div>
          </div>

          <div
            ref={orbRef}
            className="pointer-events-none absolute bottom-4 right-12 z-[90] sm:bottom-5 sm:right-16 md:bottom-6 md:right-24 lg:bottom-7 lg:right-32"
            style={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          >
            <HubOrb className="w-[8rem] sm:w-[8.75rem] md:w-[9.5rem] lg:w-[10rem]" />
          </div>

          <div
            ref={specsOverlayRef}
            className="absolute inset-0 z-40 pointer-events-none"
            style={{ opacity: 0, transform: "translate3d(0, 48px, 0)" }}
          >
            <RobotSpecsSection showScene={false} />
          </div>

          <div
            ref={sectionThreeRef}
            className="absolute inset-0 z-50 pointer-events-none"
            style={{ opacity: 0, transform: "translate3d(0, 56px, 0)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/35 via-[#0A0A0A]/85 to-[#0A0A0A]" />
            <div className="relative flex h-full items-center px-8 py-12">
              <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-10 md:flex-row md:justify-between">
                <div className="hidden h-full w-full md:flex md:w-[54%] md:items-center md:justify-center">
                  <div className="h-full w-full">
                    <RadialOrbitalTimelineDemo />
                  </div>
                </div>

                <div className="w-full max-w-2xl text-center md:ml-auto md:w-[40%] md:text-right">
                  <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
                    Features
                  </p>
                  <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
                    Built Around Your Daily Life
                  </h2>
                  <p className="text-lg leading-8 text-neutral-400 md:ml-auto">
                    From managing routines to learning user habits, the system is 
                    designed to support everyday tasks through simple, connected features. Each function works together to provide organized, responsive, and personalized assistance inside the home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="use-cases"
        className="relative z-20 scroll-mt-24 overflow-hidden bg-[#0A0A0A] md:min-h-screen"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-transparent via-[#0A0A0A]/80 to-[#0A0A0A]" />
        <div className="relative mx-auto flex w-full max-w-[100rem] items-start px-4 pb-8 pt-14 md:min-h-screen md:items-center md:px-6 md:pb-14 md:pt-28">
          <div className="w-full">
            <Testimonies />
          </div>
        </div>
      </section>

      <section className="relative z-20 min-h-screen overflow-hidden bg-[#0A0A0A]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A] to-[#0A0A0A]" />
        <div className="relative mx-auto flex min-h-screen w-full items-center">
          <div className="w-full">
            <FifthSectionShowcase />
          </div>
        </div>
      </section>
    </div>
  );
}
