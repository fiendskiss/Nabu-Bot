import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";
import ContactSpectrumSection from "@/components/contact/contact-spectrum-section";

export const metadata: Metadata = {
  title: "Contact the NABU Team",
  description:
    "Contact the NABU team with questions about demos, setup, household routines, support, and the companion robot experience.",
};

export default function Contact() {
  return (
    <main > 
      <Navbar />
      <ContactSpectrumSection />
      <Footer mode="inline" />
    </main>
  );
}
