"use client";

import Navbar from "@/components/navbar/Navbar";
import Section1 from "@/components/expo/section1";
import Section2 from "@/components/expo/section2";
import ExpoCta from "@/components/expo/cta";
import Footer from "@/components/footer/footer";


export default function Expo() {
  return (
    <main className=" bg-[#050505]">
      <Navbar />
      <Section1 />
      <Section2 />
      <ExpoCta />
      <Footer mode="inline" />    
    </main>
  );
}
