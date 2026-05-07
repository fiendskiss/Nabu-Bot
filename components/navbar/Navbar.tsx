"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import AdminAuthButton from "@/components/admin/admin-auth-button";
import GooeyNav from "@/components/navbar/GooeyNav";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
        className="lg:!w-auto lg:!max-w-none lg:!min-w-fit"
        borderRadius={999}
        blur={20}
        opacity={0.18}
        borderWidth={1}
        style={{
          width: "calc(100vw - 2rem)",
          maxWidth: "calc(100vw - 2rem)",
          height: "auto",
          minWidth: 0,
        }}
      >
        <div className="flex w-full items-center justify-between gap-4 px-4 py-2 lg:w-auto lg:justify-center lg:gap-5 lg:px-5">
          <Image
            src="https://res.cloudinary.com/dcmj7quyv/image/upload/v1777640213/Untitled_devbu3.png"
            alt="Brand Logo"
            width={65}
            height={65}
            className="h-12 w-12 object-contain lg:h-[65px] lg:w-[65px]"
            priority
          />

          <div className="hidden lg:block">
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
          </div>

          <div className="hidden lg:block">
            <AdminAuthButton />
          </div>

          <Sheet>
            <SheetTrigger
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:border-white/24 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(22rem,86vw)] border-white/10 bg-[#0A0A0A]/95 p-6 text-white backdrop-blur-xl"
            >
              <SheetHeader className="mb-8 text-left">
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = item.href === currentHref;

                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={`rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                          isActive
                            ? "bg-white text-black"
                            : "text-white/76 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>

              <div className="mt-8 border-t border-white/10 pt-6">
                <SheetClose asChild>
                  <div>
                    <AdminAuthButton />
                  </div>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </GlassSurface>
    </header>
  );
}
