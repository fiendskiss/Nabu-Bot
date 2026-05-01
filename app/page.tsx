"use client";

import Navbar from "@/components/navbar/Navbar";
import { AnimatedTestimonialsBasic } from "@/components/testimonials";
import { SplineSceneBasic } from "@/components/ui/hero";
import Demo from "@/components/footer/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <SplineSceneBasic />
      <AnimatedTestimonialsBasic />
      <Demo />
    </main>
  );
}
