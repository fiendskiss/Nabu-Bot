"use client";

import Image from "next/image";
import BorderGlow from "@/components/BorderGlow";
import { InteractiveHoverButton } from "@/components/button/interactive-hover-button";
import ExpoSectionHeader from "@/components/expo/section-header";

const CTA_IMAGE =
  "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-1_o69brw.webp";

export default function ExpoCta() {
  return (
    <section className="bg-[#050505] px-5 pb-[24vh] pt-[24vh] sm:px-8 lg:px-10 lg:pb-[26vh] lg:pt-[26vh]">
      <BorderGlow
        className="mx-auto max-w-[1280px] p-px"
        borderRadius={32}
        edgeSensitivity={22}
        glowRadius={30}
        glowIntensity={0.42}
        fillOpacity={0.12}
        backgroundColor="rgba(8, 8, 12, 0.94)"
        colors={["#60A5FA", "#A855F7", "#38BDF8"]}
      >
        <div className="overflow-hidden rounded-[calc(2rem-1px)] bg-[rgba(8,8,12,0.96)]">
          <div className="grid min-h-[460px] items-center gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] lg:gap-0">
            <div className="relative z-10 px-7 py-10 sm:px-10 lg:px-14">
              <div className="max-w-[34rem]">
                <ExpoSectionHeader
                  label="Section Three"
                  title="Ready to turn the expo concept into a live campaign?"
                  description="From the first hero frame to the rollout across outdoor, print, and digital placements, we can shape the full system into a presentation-ready direction."
                  className="max-w-[34rem]"
                />

                <div className="mt-10">
                  <InteractiveHoverButton className="border-white/12 bg-black px-7 py-3 text-base text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.4)] [&>div:first-child>div:first-child]:bg-[linear-gradient(135deg,#7C3AED_0%,#5E00FF_50%,#A855F7_100%)] [&>div:last-child]:text-white">
                    <span className="inline-flex items-center gap-2">
                      Schedule a Demo
                    </span>
                  </InteractiveHoverButton>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-[280px] items-end justify-center self-stretch">
              <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_72%_28%,transparent_0%,transparent_30%,rgba(5,5,5,0.14)_58%,rgba(5,5,5,0.52)_100%)]" />
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-28 bg-gradient-to-r from-[#08080c] via-[#08080c]/72 to-transparent lg:block" />
              <Image
                src={CTA_IMAGE}
                alt="Raizel home robot beside a woman"
                width={1200}
                height={900}
                className="h-full w-full object-cover object-center lg:object-right"
              />
            </div>
          </div>
        </div>
      </BorderGlow>
    </section>
  );
}
