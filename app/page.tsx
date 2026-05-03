"use client";

import Navbar from "@/components/navbar/Navbar";
import { AnimatedTestimonialsBasic } from "@/components/home/testimonials";
import { SplineSceneBasic } from "@/components/home/Content";
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
