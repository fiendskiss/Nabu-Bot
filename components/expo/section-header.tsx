"use client";

import { cn } from "@/lib/utils";

interface ExpoSectionHeaderProps {
  label: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
}

export default function ExpoSectionHeader({
  label,
  title,
  description,
  align = "left",
  className,
}: ExpoSectionHeaderProps) {
  return (
    <div
      className={cn(
        "relative z-10",
        align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl",
        className,
      )}
    >
      <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
        {label}
      </p>
      <h2 className="mt-4 text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[3.1rem] lg:text-[3.9rem]">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-[#D6DCF8]/72 sm:text-[1.05rem]">
        {description}
      </p>
    </div>
  );
}
