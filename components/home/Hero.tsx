"use client";

import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";

export default function () {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [splineReady, setSplineReady] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const splineRef = useRef<any>(null);

  // Trigger Spline mount after user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Once Spline loads, start playing
  function onSplineLoad(splineApp: any) {
    splineRef.current = splineApp;
    setSplineReady(true);
    splineApp.play(); // starts the animation
  }

  return (
    <main className="relative">

      {/* ── HERO SECTION ── */}
      <section
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden"
        // Add your background here, e.g. bg-black or a gradient
      >
        {/* Background layer */}
        <div className="absolute inset-0 bg-black z-0" />

        {/* Spline layer — only mounts after scroll */}
        {hasScrolled && (
          <div className="absolute inset-0 z-10">
            <Spline
              scene="https://prod.spline.design/Jb6f59oc1egd2yxV/scene.splinecode"
              onLoad={onSplineLoad}
            />
          </div>
        )}

        {/* Hero content — sits above Spline */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-bold">Your Heading</h1>
          <p className="mt-4 text-lg text-white/70">Your subheading here</p>
        </div>
      </section>

      {/* ── OTHER SECTIONS ── */}
      <section className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <p>More content below</p>
      </section>

    </main>
  );
}