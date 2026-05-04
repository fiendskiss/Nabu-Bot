import type { Metadata } from "next";
import BookContent from "@/components/book/book-content";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Book a Private NABU Demo",
  description:
    "Schedule a private demo with the NABU team and see how the home companion robot can support everyday routines.",
};

export default function Book() {
  return (
    <main className="overflow-x-hidden bg-[#050505]">
      <Navbar />
      <BookContent />
      <Footer mode="inline" />
    </main>
  );
}
