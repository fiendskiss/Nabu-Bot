"use client";

import { CinematicFooter } from "@/components/footer/motion-footer";

type FooterProps = {
  mode?: "fixed" | "inline";
};

export default function Footer({ mode = "fixed" }: FooterProps) {
  return (
    <div className="relative w-full bg-background font-sans selection:bg-white/20 overflow-x-hidden">
      <CinematicFooter mode={mode} />
    </div>
  );
}
