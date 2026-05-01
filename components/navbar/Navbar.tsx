"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import GooeyNav from "@/components/navbar/GooeyNav";

const GlassSurface = dynamic(() => import("@/components/GlassSurface"), {
  ssr: false,
});

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#" },
    { label: "Use Cases", href: "/#" },
    { label: "About us", href: "/about" },
    { label: "Expo", href: "/expo" },
    { label: "FAQs", href: "/faq" },
    { label: "Book a Demo", href: "/book" },
    { label: "Contact Us", href: "/contact" },
  ];

  const activeIndex = navItems.findIndex(item => item.href === pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3">
      <GlassSurface
        borderRadius={999}
        blur={20}
        opacity={0.18}
        borderWidth={1}
        style={{
          width: "auto",
          height: "auto",
          minWidth: "fit-content",
        }}
      >
        <div className="flex items-center gap-8 px-5 py-2">
          <Image
            src="/myriad dark.png"
            alt="Brand Logo"
            width={36}
            height={36}
            className="object-contain"
            priority
          />

          <GooeyNav
            items={navItems}
            particleCount={12}
            particleDistances={[80, 10]}
            particleR={80}
            initialActiveIndex={activeIndex === -1 ? 0 : activeIndex}
            animationTime={500}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>
      </GlassSurface>
    </header>
  );
}
