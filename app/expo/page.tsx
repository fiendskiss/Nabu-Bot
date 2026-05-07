import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Section1 from "@/components/expo/section1";
import Section2 from "@/components/expo/section2";
import ExpoCta from "@/components/expo/cta";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "NABU Expo 2026 | See the Robot in Action",
  description:
    "Visit NABU Expo 2026 at Lyceum-Northwestern University to watch the home companion robot in a live demo.",
};

export default function Expo() {
  return (
    <main className="overflow-x-clip bg-[#050505]">
      <Navbar />
      <Section1 />
      <Section2 />
      <ExpoCta />
      <Footer mode="inline" />    
    </main>
  );
}
