"use client";

import type { ComponentProps } from "react";
import { DottedSurface } from "@/components/dotted-surface";

type DotBackgroundProps = Omit<ComponentProps<"div">, "ref">;

export default function DotBackground({ className, ...props }: DotBackgroundProps) {
  return (
    <DottedSurface
      className={className ?? "absolute inset-0 h-full w-full"}
      {...props}
    />
  );
}
