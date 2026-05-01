'use client'

import Testimonies from "@/components/use-cases/use-cases";
import FifthSectionShowcase from "@/components/ui/FifthSectionShowcase";
import HubOrb from "@/components/ui/HubOrb";
import { RadialOrbitalTimelineDemo } from "@/components/ui/radial";
import { RobotSpecsSection } from "@/components/ui/Specs";
import { SplineScene } from "@/components/ui/splite";
import { useEffect, useRef } from "react";
import LiquidEther from "../bg/LiquidEther";

const ROBOT_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

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

  useEffect(() => {
    let frameId = 0;

    const updateStage = () => {
      frameId = 0;

      if (
        !sectionRef.current ||
        !robotRef.current ||
        !heroOverlayRef.current ||
        !orbRef.current ||
        !specsOverlayRef.current ||
        !sectionThreeRef.current
      ) {
        return;
      }

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

      <section ref={sectionRef} className="relative z-10 h-[300vh]">
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
            className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center"
            style={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          >
            <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-6xl">
              Interactive 3D
            </h1>
            <p className="mt-4 max-w-lg px-8 text-center text-neutral-300">
              Bring your UI to life with beautiful 3D scenes. Create immersive
              experiences that capture attention and enhance your design.
            </p>
          </div>

          <div
            ref={orbRef}
            className="pointer-events-none absolute bottom-6 right-5 z-[90] sm:bottom-8 sm:right-6 md:bottom-10 md:right-8 lg:bottom-12 lg:right-10"
            style={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          >
            <HubOrb className="w-[8.5rem] sm:w-[9rem] md:w-[9.75rem] lg:w-[10.5rem]" />
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
                    Section Three
                  </p>
                  <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
                    The Robot Hands Off to the Story
                  </h2>
                  <p className="text-lg leading-8 text-neutral-400 md:ml-auto">
                    Once the systems overview is complete, the interface fades
                    into a clean content view so the next section can take over
                    without the robot competing for attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 min-h-screen overflow-hidden bg-[#0A0A0A]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-transparent via-[#0A0A0A]/80 to-[#0A0A0A]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-[100rem] items-center px-4 pb-10 pt-24 md:px-6 md:pb-14 md:pt-28">
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
