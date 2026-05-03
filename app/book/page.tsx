"use client";

import BookContent from "@/components/book/book-content";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/Navbar";

export default function Book() {
  return (
    <main className="overflow-x-hidden bg-[#050505]">
      <Navbar />
      <BookContent />
      <Footer mode="inline" />
    </main>
  );
}
