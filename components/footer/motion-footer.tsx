"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, Mail, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidEther from "@/components/bg/LiquidEther";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  --pill-bg-1: rgba(255, 255, 255, 0.07);
  --pill-bg-2: rgba(255, 255, 255, 0.025);
  --pill-shadow: rgba(3, 7, 18, 0.58);
  --pill-highlight: rgba(255, 255, 255, 0.12);
  --pill-inset-shadow: rgba(5, 10, 24, 0.8);
  --pill-border: rgba(255, 255, 255, 0.1);
  --pill-bg-1-hover: rgba(255, 255, 255, 0.11);
  --pill-bg-2-hover: rgba(255, 255, 255, 0.04);
  --pill-border-hover: rgba(124, 58, 237, 0.45);
  --pill-shadow-hover: rgba(12, 18, 48, 0.76);
  --pill-highlight-hover: rgba(96, 165, 250, 0.24);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(96, 165, 250, 0.18)); }
  15%, 45% { transform: scale(1.08); filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.26)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, rgba(96, 165, 250, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(168, 85, 247, 0.08) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background:
    radial-gradient(circle at 24% 32%, rgba(124, 58, 237, 0.24) 0%, rgba(124, 58, 237, 0) 34%),
    radial-gradient(circle at 76% 26%, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0) 30%),
    radial-gradient(circle at 52% 62%, rgba(168, 85, 247, 0.14) 0%, rgba(168, 85, 247, 0) 42%);
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(168, 85, 247, 0.2) 0%, rgba(96, 165, 250, 0.05) 55%, transparent 72%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(186, 230, 253, 0.92) 40%, rgba(216, 180, 254, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 26px rgba(124, 58, 237, 0.18));
}

.footer-newsletter-card {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%),
    rgba(6, 10, 24, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 30px 90px rgba(1, 4, 20, 0.72),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.footer-newsletter-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.footer-newsletter-input:focus {
  outline: none;
  border-color: rgba(96, 165, 250, 0.55);
  box-shadow:
    0 0 0 4px rgba(56, 189, 248, 0.12),
    0 0 30px rgba(124, 58, 237, 0.18);
}
`;

type MagneticButtonBaseProps = {
  className?: string;
  children?: React.ReactNode;
};

type MagneticButtonAsButtonProps = MagneticButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type MagneticButtonAsAnchorProps = MagneticButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
  };

type MagneticButtonProps =
  | MagneticButtonAsButtonProps
  | MagneticButtonAsAnchorProps;

const MagneticButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  MagneticButtonProps
>(({ as = "button", className, children, ...props }, forwardedRef) => {
  const localRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const element = localRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const handleMouseMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;

        const x = event.clientX - rect.left - halfWidth;
        const y = event.clientY - rect.top - halfHeight;

        gsap.to(element, {
          x: x * 0.4,
          y: y * 0.4,
          rotationX: -y * 0.15,
          rotationY: x * 0.15,
          scale: 1.05,
          ease: "power2.out",
          duration: 0.4,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          ease: "elastic.out(1, 0.3)",
          duration: 1.2,
        });
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, element);

    return () => ctx.revert();
  }, []);

  const assignRef = (node: HTMLButtonElement | HTMLAnchorElement | null) => {
    localRef.current = node;

    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  if (as === "a") {
    const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <a
        ref={assignRef}
        className={cn("cursor-pointer", className)}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      ref={assignRef}
      className={cn("cursor-pointer", className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
});

MagneticButton.displayName = "MagneticButton";

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>System Ready</span>
    <span className="text-[#A855F7]/75">*</span>
    <span>Neural Link</span>
    <span className="text-[#60A5FA]/75">*</span>
    <span>Seamless Living</span>
    <span className="text-[#A855F7]/75">*</span>
    <span>Intelligent Design</span>
    <span className="text-[#60A5FA]/75">*</span>
    <span>process Running</span>
    <span className="text-[#A855F7]/75">*</span>
  </div>
);

type CinematicFooterProps = {
  mode?: "fixed" | "inline";
};

export function CinematicFooter({
  mode = "fixed",
}: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false);
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const isInline = mode === "inline";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      if (isInline) {
        gsap.fromTo(
          giantTextRef.current,
          { y: "6vh", scale: 0.9, opacity: 0 },
          {
            y: "0vh",
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          [headingRef.current, linksRef.current],
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          }
        );

        return;
      }

      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [isInline]);

  useEffect(() => {
    if (!isNewsletterOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNewsletterOpen(false);
        setIsNewsletterSubmitted(false);
        setNewsletterEmail("");
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isNewsletterOpen]);

  const scrollToTop = () => {
    const topAnchor = document.getElementById("page-top");
    topAnchor?.scrollIntoView({ behavior: "smooth", block: "start" });

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });

    const scrollingElement = document.scrollingElement;
    if (scrollingElement instanceof HTMLElement) {
      scrollingElement.scrollTo({ top: 0, behavior: "smooth" });
    }

    let parent = wrapperRef.current?.parentElement ?? null;
    while (parent) {
      const styles = window.getComputedStyle(parent);
      const canScrollY =
        /(auto|scroll|overlay)/.test(styles.overflowY) &&
        parent.scrollHeight > parent.clientHeight;

      if (canScrollY) {
        parent.scrollTo({ top: 0, behavior: "smooth" });
      }

      parent = parent.parentElement;
    }
  };

  const openNewsletter = () => {
    setIsNewsletterSubmitted(false);
    setNewsletterEmail("");
    setNewsletterError("");
    setIsNewsletterOpen(true);
  };

  const closeNewsletter = () => {
    setIsNewsletterOpen(false);
    setIsNewsletterSubmitted(false);
    setNewsletterEmail("");
    setNewsletterError("");
  };

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterError("");
    setIsNewsletterSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("newsletter_submissions").insert({
      email: newsletterEmail.trim(),
    });

    setIsNewsletterSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setIsNewsletterSubmitted(true);
        setNewsletterEmail("");
        return;
      }

      setNewsletterError(error.message);
      return;
    }

    setIsNewsletterSubmitted(true);
    setNewsletterEmail("");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={wrapperRef}
        className={cn(
          "relative w-full",
          isInline ? "min-h-[100svh]" : "h-screen"
        )}
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer
          className={cn(
            "dark left-0 flex w-full flex-col justify-between bg-[#0A0A0A] text-foreground cinematic-footer-wrapper",
            isInline
              ? "relative min-h-[100svh] overflow-hidden"
              : "fixed bottom-0 h-screen overflow-hidden"
          )}
        >
          <div className="absolute inset-0 z-0 bg-[#0A0A0A]" />
          <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
            <LiquidEther
              mouseForce={14}
              cursorSize={96}
              autoIntensity={1.8}
              colors={["#7C3AED", "#5E00FF", "#A855F7"]}
              className="h-full w-full"
            />
          </div>
          <div className="pointer-events-none absolute -left-20 top-[24%] z-0 h-72 w-72 rounded-full bg-[#7C3AED]/18 blur-[120px]" />
          <div className="pointer-events-none absolute right-[-5rem] top-[18%] z-0 h-80 w-80 rounded-full bg-[#38BDF8]/14 blur-[130px]" />
          <div className="pointer-events-none absolute left-1/2 top-[62%] z-0 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-[#A855F7]/10 blur-[140px]" />
          <div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 z-0 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none"
          >
            NABU
          </div>

          <div className="absolute left-0 top-12 z-10 w-full scale-110 overflow-hidden border-y border-white/10 bg-[#09090f]/55 py-4 shadow-2xl backdrop-blur-md -rotate-2">
            <div className="flex w-max animate-footer-scroll-marquee text-xs font-bold uppercase tracking-[0.3em] text-slate-300/72 md:text-sm">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6">
            <h2
              ref={headingRef}
              className="footer-text-glow mb-12 text-center text-5xl font-black tracking-tighter md:text-8xl"
            >
              Want a companion?
            </h2>

            <div
              ref={linksRef}
              className="flex w-full flex-col items-center gap-6"
            >
              <div className="flex w-full flex-wrap justify-center gap-4">
                <MagneticButton
                  as="a"
                  href="/book"
                  className="footer-glass-pill group flex items-center gap-3 rounded-full px-10 py-5 text-sm font-bold text-foreground md:text-base"
                >
                  <CalendarDays className="h-6 w-6 text-[#A855F7] transition-colors group-hover:text-[#A855F7]" />
                  Book a Demo
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href="/contact"
                  className="footer-glass-pill group flex items-center gap-3 rounded-full px-10 py-5 text-sm font-bold text-foreground md:text-base"
                >
                  <Mail className="h-6 w-6 text-[#A855F7] transition-colors group-hover:text-[#A855F7]" />
                  Contact Us
                </MagneticButton>
              </div>

              <div className="mt-2 flex w-full flex-wrap justify-center gap-3 md:gap-6">
                <MagneticButton
                  as="button"
                  type="button"
                  onClick={openNewsletter}
                  className="footer-glass-pill rounded-full border-[#7C3AED]/35 px-6 py-3 text-xs font-medium text-muted-foreground shadow-[0_0_24px_rgba(94,0,255,0.14)] hover:text-foreground md:text-sm"
                >
                  Subscribe to Newsletter
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="/terms"
                  className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
                >
                  Terms of Service
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="/support"
                  className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
                >
                  Support
                </MagneticButton>
              </div>
            </div>
          </div>

          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-6 px-6 pb-8 md:flex-row md:px-12">
            <div className="order-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground md:order-1 md:text-xs">
              Copyright 2026 NABU. All rights reserved.
            </div>

            <div className="footer-glass-pill order-1 flex cursor-default items-center gap-2 rounded-full border-border/50 px-6 py-3 md:order-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:text-xs">
                Crafted with
              </span>
              <span className="animate-footer-heartbeat inline-flex items-center leading-none text-sm font-bold text-[#A855F7] md:text-base">
                care
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:text-xs">
                by
              </span>
              <span className="ml-1 text-xs font-black tracking-normal text-foreground md:text-sm">
                Shanne Quitlong
              </span>
            </div>

            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="footer-glass-pill group order-3 flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <svg
                className="h-5 w-5 transform transition-transform duration-300 group-hover:-translate-y-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </MagneticButton>
          </div>

          <AnimatePresence>
            {isNewsletterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-[#050510]/72 px-4 backdrop-blur-md"
                onClick={closeNewsletter}
              >
                <motion.div
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="footer-newsletter-card relative w-full max-w-md overflow-hidden rounded-[30px] p-6 text-left md:p-7"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent" />
                  <div className="pointer-events-none absolute -left-8 top-8 h-24 w-24 rounded-full bg-[#7C3AED]/30 blur-3xl" />
                  <div className="pointer-events-none absolute -right-8 bottom-6 h-28 w-28 rounded-full bg-[#38BDF8]/20 blur-3xl" />

                  <button
                    type="button"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      closeNewsletter();
                    }}
                    aria-label="Close newsletter popup"
                    className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#60A5FA]/35 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <AnimatePresence mode="wait">
                    {isNewsletterSubmitted ? (
                      <motion.div
                        key="newsletter-success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative z-10 flex flex-col items-start"
                      >
                        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#60A5FA]/25 bg-gradient-to-br from-[#7C3AED]/30 via-[#5E00FF]/25 to-[#38BDF8]/20 text-white shadow-[0_0_26px_rgba(94,0,255,0.18)]">
                          <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#60A5FA]">
                          You are in
                        </p>
                        <h3 className="mt-3 text-3xl font-black text-white">
                          Thanks for subscribing
                        </h3>
                        <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">
                          We will keep you posted with product updates, new
                          features, and launch notes.
                        </p>
                        <button
                          type="button"
                          onClick={closeNewsletter}
                          className="mt-6 inline-flex rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#7C3AED]/35 hover:bg-white/10"
                        >
                          Close
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="newsletter-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleNewsletterSubmit}
                        className="relative z-10"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A855F7]">
                          Newsletter
                        </p>
                        <h3 className="mt-3 max-w-sm text-3xl font-black text-white">
                          Stay in the loop with NABU
                        </h3>
                        <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">
                          Drop your email below and we will send occasional
                          updates on releases, new companion features, and
                          product news.
                        </p>

                        <label
                          htmlFor="footer-newsletter-email"
                          className="mt-6 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400"
                        >
                          Email Address
                        </label>
                        <input
                          id="footer-newsletter-email"
                          type="email"
                          required
                          autoFocus
                          value={newsletterEmail}
                          onChange={(event) =>
                            setNewsletterEmail(event.target.value)
                          }
                          placeholder="you@example.com"
                          className="footer-newsletter-input mt-3 w-full rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-500"
                        />

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <button
                            type="submit"
                            disabled={isNewsletterSubmitting}
                            className="inline-flex flex-1 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5E00FF_0%,#7C3AED_50%,#38BDF8_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(94,0,255,0.22)] transition hover:brightness-110"
                          >
                            {isNewsletterSubmitting ? "Subscribing..." : "Subscribe"}
                          </button>
                          <button
                            type="button"
                            onClick={closeNewsletter}
                            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-[#60A5FA]/35 hover:bg-white/10 hover:text-white"
                          >
                            Maybe later
                          </button>
                        </div>

                        {newsletterError ? (
                          <p className="mt-4 text-sm text-rose-300">
                            {newsletterError}
                          </p>
                        ) : null}
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </footer>
      </div>
    </>
  );
}
