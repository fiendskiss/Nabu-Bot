"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import AdminAuthButton from "@/components/admin/admin-auth-button";
import GooeyNav from "@/components/navbar/GooeyNav";

const GlassSurface = dynamic(() => import("@/components/GlassSurface"), {
  ssr: false,
});

export default function Navbar() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#robot-specs-section" },
    { label: "Use Cases", href: "/#use-cases" },
    { label: "About us", href: "/about" },
    { label: "Expo", href: "/expo" },
    { label: "FAQs", href: "/faq" },
    { label: "Book a Demo", href: "/book" },
    { label: "Contact Us", href: "/contact" },
  ];

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);

    updateHash();
    window.addEventListener("hashchange", updateHash);

    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const currentHref = pathname === "/" && hash ? `/${hash}` : pathname;
  const activeIndex = navItems.findIndex(item => item.href === currentHref);

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
        <div className="flex items-center gap-5 px-5 py-2">
          <Image
            src="https://res.cloudinary.com/dcmj7quyv/image/upload/v1777640213/Untitled_devbu3.png"
            alt="Brand Logo"
            width={65}
            height={65}
            className="object-contain"
            priority
          />

          <GooeyNav
            items={navItems}
            particleCount={12}
            particleDistances={[80, 10]}
            particleR={80}
            initialActiveIndex={activeIndex}
            animationTime={500}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />

          <AdminAuthButton />
        </div>
      </GlassSurface>
    </header>
  );
}
