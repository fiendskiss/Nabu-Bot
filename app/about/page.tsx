"use client";

import Navbar from "@/components/navbar/Navbar";
import AboutHero from "@/components/about-us/about-hero";
import AboutSections from "@/components/about-us/about-sections";
import Footer from "@/components/footer/footer";

export default function About() {
  return (
    <main className="overflow-x-hidden bg-[#050505]">
      <Navbar />
      <AboutHero />
      <AboutSections />
      <Footer mode="inline" />
    </main>
  );
}
