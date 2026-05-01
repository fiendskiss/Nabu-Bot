"use client"

import type { ReactNode } from "react"
import { useCallback, useEffect, useRef } from "react"

interface CosmicSpectrumProps {
  color?:
    | "original"
    | "blue-pink"
    | "blue-orange"
    | "sunset"
    | "purple"
    | "monochrome"
    | "pink-purple"
    | "blue-black"
    | "beige-black"
  blur?: boolean
  scoped?: boolean
  heroContent?: ReactNode
  mainContent?: ReactNode
  spacerClassName?: string
  mainContentPositionClassName?: string
  mainContentRevealAt?: number
}

export function CosmicSpectrum({
  color = "original",
  blur = false,
  scoped = false,
  heroContent,
  mainContent,
  spacerClassName,
  mainContentPositionClassName,
  mainContentRevealAt,
}: CosmicSpectrumProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const colorThemes = {
    original: ["#340B05", "#0358F7", "#5092C7", "#E1ECFE", "#FFD400", "#FA3D1D", "#FD02F5", "#FFC0FD"],
    "blue-pink": ["#1E3A8A", "#3B82F6", "#A855F7", "#EC4899", "#F472B6", "#F9A8D4", "#FBCFE8", "#FDF2F8"],
    "blue-orange": ["#1E40AF", "#3B82F6", "#60A5FA", "#FFFFFF", "#FED7AA", "#FB923C", "#EA580C", "#9A3412"],
    sunset: ["#FEF3C7", "#FCD34D", "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F", "#451A03"],
    purple: ["#F3E8FF", "#E9D5FF", "#D8B4FE", "#C084FC", "#A855F7", "#9333EA", "#7C3AED", "#6B21B6"],
    monochrome: ["#1A1A1A", "#404040", "#666666", "#999999", "#CCCCCC", "#E5E5E5", "#F5F5F5", "#FFFFFF"],
    "pink-purple": ["#FDF2F8", "#FCE7F3", "#F9A8D4", "#F472B6", "#EC4899", "#BE185D", "#831843", "#500724"],
    "blue-black": ["#000000", "#0F172A", "#1E293B", "#334155", "#475569", "#64748B", "#94A3B8", "#CBD5E1"],
    "beige-black": ["#FEF3C7", "#F59E0B", "#D97706", "#92400E", "#451A03", "#1C1917", "#0C0A09", "#000000"],
  }

  const darkThemes = ["blue-black", "beige-black", "monochrome"]
  const isDarkTheme = darkThemes.includes(color)
  const resolvedMainContentRevealAt = mainContentRevealAt ?? (mainContent ? 0.52 : 0.9)

  const setupAnimations = useCallback(() => {
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger

    if (!gsap || !ScrollTrigger) return

    // Hero animations
    const heroTl = gsap.timeline({ delay: 0.5 })

    // Title animation
    const titleChars = document.querySelectorAll(".hero-title .char")
    if (titleChars.length > 0) {
      gsap.set(titleChars, { opacity: 0, filter: "blur(8px)", x: -20 })
      heroTl.to(
        titleChars,
        {
          opacity: 1,
          filter: "blur(0px)",
          x: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: "power2.out",
        },
        0,
      )
    }

    // Nav items animation
    const navItems = document.querySelectorAll(".hero-nav-item")
    navItems.forEach((item) => {
      gsap.set(item, { opacity: 0, y: 30, filter: "blur(8px)" })
      heroTl.to(
        item,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
        },
        0.4,
      )
    })

    // Text content animation
    const textElements = document.querySelectorAll(".hero-text")
    textElements.forEach((textEl, index) => {
      gsap.set(textEl, { opacity: 0, y: 50, clipPath: "inset(0 0 100% 0)" })
      heroTl.to(
        textEl,
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power2.out",
        },
        0.8 + index * 0.2,
      )
    })

    // Scroll hint animation
    const scrollHintChars = document.querySelectorAll(".scroll-hint .char")
    if (scrollHintChars.length > 0) {
      gsap.set(scrollHintChars, { opacity: 0, filter: "blur(3px)" })
      gsap.to(scrollHintChars, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: { each: 0.08, repeat: -1, yoyo: true },
        ease: "sine.inOut",
        delay: 1,
      })
    }

    // Scroll-triggered animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".animation-section",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
      },
    })

    const wavelengthLabels = Array.from(document.querySelectorAll(".wavelength-label"))
    const mainTitle = document.querySelector(".main-title")
    const mainContentReveal = document.querySelector(".main-content-reveal")
    const initialRevealTargets =
      mainContent || !mainTitle
        ? wavelengthLabels
        : [...wavelengthLabels, mainTitle]
    const delayedRevealTargets = mainContent
      ? wavelengthLabels
      : mainTitle
        ? [...wavelengthLabels, mainTitle]
        : wavelengthLabels

    gsap.set(initialRevealTargets, {
      opacity: 0,
      y: mainContent ? 10 : 30,
      scale: mainContent ? 0.96 : 1,
      filter: mainContent ? "blur(18px)" : "blur(8px)",
    })
    gsap.set(".svg-container", {
      filter: mainContent ? "blur(28px)" : "blur(12px)",
    })
    if (mainContent && mainTitle) {
      gsap.set(mainTitle, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      })
    }
    if (mainContentReveal) {
      gsap.set(mainContentReveal, {
        opacity: 0,
        y: 28,
        filter: "blur(18px)",
      })

      ScrollTrigger.create({
        trigger: ".animation-section",
        start: "top 72%",
        once: true,
        onEnter: () => {
          gsap.to(mainContentReveal, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            ease: "power2.out",
          })
        },
      })
    }

    tl.to(
      ".svg-container",
      {
        opacity: mainContent ? 0.55 : 1,
        duration: 0.01,
      },
      0,
    )
      .to(".text-grid", { opacity: 1, duration: 0.01 }, 0)
      .to(
        ".svg-container",
        {
          transform: "scaleY(0.05) translateY(-30px)",
          duration: 0.3,
          ease: "power2.out",
        },
        0,
      )
      .to(
        ".svg-container",
        {
          transform: "scaleY(1) translateY(0px)",
          duration: 1.2,
          ease: "power2.out",
        },
        0.3,
      )
      .to(
        ".svg-container",
        {
          opacity: 1,
          filter: mainContent ? "blur(6px)" : "blur(0px)",
          duration: 0.45,
          ease: "power2.out",
        },
        0.95,
      )
      .to(
        ".nav-bottom-left, .nav-bottom-right, .nav-bottom-center",
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        0.2,
      )
    if (!mainContent) {
      tl.to(
        ".main-title",
        {
          opacity: 0.55,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.28,
          ease: "power2.out",
        },
        resolvedMainContentRevealAt,
      )
    }
    if (delayedRevealTargets.length > 0) {
      tl.to(
        delayedRevealTargets,
        {
          duration: 0.8,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          stagger: 0.08,
          ease: "power2.out",
        },
        0.9,
      )
    }

    tl
      .to(".level-5", { y: "-25vh", duration: 0.8, ease: "power2.out" }, 0.9)
      .to(".level-4", { y: "-20vh", duration: 0.8, ease: "power2.out" }, 0.9)
      .to(".level-3", { y: "-15vh", duration: 0.8, ease: "power2.out" }, 0.9)
      .to(".level-2", { y: "-10vh", duration: 0.8, ease: "power2.out" }, 0.9)
      .to(".level-1", { y: "-5vh", duration: 0.8, ease: "power2.out" }, 0.9)

    // Refresh on resize
    window.addEventListener("resize", () => ScrollTrigger.refresh())
  }, [mainContent, resolvedMainContentRevealAt])

  useEffect(() => {
    // Load external scripts
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const initializeAnimations = async () => {
      try {
        await Promise.all([
          loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"),
          loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"),
          loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"),
        ])

        // Wait a bit for scripts to be ready
        setTimeout(() => {
          if (window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger)
            setupAnimations()
          }
        }, 100)
      } catch (error) {
        console.error("Failed to load GSAP:", error)
      }
    }

    initializeAnimations()
  }, [setupAnimations])

  const splitText = (text: string, className = "") => {
    return text.split("").map((char, index) => (
      <span key={index} className={`char ${className}`}>
        {char === " " ? "\u00A0" : char}
      </span>
    ))
  }

  const currentColors = colorThemes[color]
  const wrapperClassName = scoped ? "min-h-[320vh]" : "min-h-screen"
  const gradientClassName = scoped
    ? "absolute top-20 left-0 w-screen h-screen"
    : "fixed top-20 left-0 w-screen h-screen"
  const hintClassName = scoped
    ? "absolute bottom-8 left-1/2 transform -translate-x-1/2"
    : "fixed bottom-8 left-1/2 transform -translate-x-1/2"
  const animationShellClassName = scoped
    ? "sticky top-0 h-screen z-10"
    : "fixed bottom-0 left-0 right-0 h-screen z-10"
  const resolvedMainContentPositionClassName =
    mainContentPositionClassName ??
    (mainContent
      ? "bottom-[8vh] sm:bottom-[10vh] lg:bottom-[12vh]"
      : "bottom-1/2 translate-y-1/2")
  const mainContentWidthClassName = mainContent
    ? "w-full px-6 sm:px-8"
    : ""
  const resolvedSpacerClassName = spacerClassName ?? "h-[50vh]"

  return (
    <div ref={containerRef} className={`relative overflow-x-hidden ${wrapperClassName}`}>
      {/* Gradient Overlay */}
      <div
        className={`gradient-overlay pointer-events-none z-[5] opacity-0 transition-opacity duration-600 ${gradientClassName}`}
        style={{ filter: "blur(60px)" }}
      />
 

      {/* Hero Section */}
      <section className="h-screen w-full p-8 flex flex-col justify-center relative">
        {heroContent ? (
          heroContent
        ) : (
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="hero-title bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              {splitText("Cosmos Spectrum")}
            </h1>
            <p className="hero-text mt-4 max-w-lg px-8 text-center text-neutral-300 mx-auto">
              Scroll to explore the full spectrum reveal.
            </p>
          </div>
        )}
      </section>

       <div className={`nav-bottom-center z-[1000] pointer-events-auto text-xs uppercase tracking-wide transition-colors duration-300 scroll-hint ${hintClassName}`}>
            {splitText("Scroll to explore")}
          </div>
      <div className={resolvedSpacerClassName} />

      {/* Animation Section */}
      <div className="animation-section h-screen relative">
        <div className={animationShellClassName}>
          {/* SVG Container */}
          <div
            className="svg-container absolute bottom-0 left-0 right-0 h-screen opacity-0 z-[15] pointer-events-none"
            style={{
              transformOrigin: "bottom",
              transform: "scaleY(0.05) translateY(100vh)",
              willChange: "transform, opacity, filter",
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 1567 584" preserveAspectRatio="none" fill="none">
              <g clipPath="url(#clip)" filter={blur ? "url(#blur)" : undefined}>
                <path d="M1217 584H1395V184H1217V584Z" fill="url(#grad0)" />
                <path d="M1043 584H1221V104H1043V584Z" fill="url(#grad1)" />
                <path d="M350 584H172L172 184H350L350 584Z" fill="url(#grad2)" />
                <path d="M524 584H346L346 104H524L524 584Z" fill="url(#grad3)" />
                <path d="M699 584H520L520 54H699L699 584Z" fill="url(#grad4)" />
                <path d="M868 584H1047V54H868V584Z" fill="url(#grad5)" />
                <path d="M872 584H695L695 0H872L872 584Z" fill="url(#grad6)" />
                <path d="M176 585H-2L-2 295H176L176 585Z" fill="url(#grad7)" />
                <path d="M1391 584H1569V294H1391V584Z" fill="url(#grad8)" />
              </g>
              <defs>
                <filter
                  id="blur"
                  x="-30"
                  y="-30"
                  width="1627"
                  height="644"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="24" result="effect1_foregroundBlur" />
                </filter>
                {Array.from({ length: 9 }, (_, i) => (
                  <linearGradient
                    key={i}
                    id={`grad${i}`}
                    x1="50%"
                    y1="100%"
                    x2="50%"
                    y2="0%"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={currentColors[0]} />
                    <stop offset="0.182709" stopColor={currentColors[1]} />
                    <stop offset="0.283673" stopColor={currentColors[2]} />
                    <stop offset="0.413484" stopColor={currentColors[3]} />
                    <stop offset="0.586565" stopColor={currentColors[4]} />
                    <stop offset="0.682722" stopColor={currentColors[5]} />
                    <stop offset="0.802892" stopColor={currentColors[6]} />
                    <stop offset="1" stopColor={currentColors[7]} stopOpacity="0" />
                  </linearGradient>
                ))}
                <clipPath id="clip">
                  <rect width="1567" height="584" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Main Title */}
          <div
            className={`main-title absolute left-1/2 transform translate-x-[-50%] text-center text-xs leading-relaxed z-20 opacity-0 transition-colors duration-300 pointer-events-auto ${resolvedMainContentPositionClassName} ${mainContentWidthClassName}`}
            style={{ color: isDarkTheme ? "#ffffff" : "#333" }}
          >
            {mainContent ? (
              <div className="main-content-reveal">{mainContent}</div>
            ) : (
              <>
                Where Design Becomes Communication
                <br />
                Across the World
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-title {
            font-size: 12vw !important;
            margin-top: 2rem !important;
          }
          .hero-content {
            flex-direction: column !important;
            gap: 1.5rem !important;
            margin-top: 2rem !important;
          }
          .hero-text-content {
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          .hero-text {
            width: 100% !important;
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  )
}
