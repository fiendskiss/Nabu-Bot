'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

export function Spotlight({
  className,
  size = 400,
  springOptions = { stiffness: 120, damping: 20 },
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const left = useTransform(mouseX, (x) => x - size / 2);
  const top = useTransform(mouseY, (y) => y - size / 2);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    parent.style.position = 'relative';
    parent.style.overflow = 'hidden';

    parent.addEventListener('mousemove', handleMouseMove);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full',
        'bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(255,255,255,0.4),transparent_70%)]',
        'blur-2xl opacity-70',
        className
      )}
      style={{
        width: size,
        height: size,
        left,
        top,
        zIndex: 50,
      }}
    />
  );
}