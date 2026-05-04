"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"
import { motion, useAnimation, useInView, easeOut, easeInOut,} from "framer-motion"
import { useEffect, useRef, useState } from "react"


export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export interface AnimatedTestimonialsProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: Testimonial[]
  autoRotateInterval?: number
  trustedCompanies?: string[]
  trustedCompaniesTitle?: string
  className?: string
}

export function AnimatedTestimonials({
  title = "Loved by modern households",
  subtitle = "Real experiences from households who have integrated the Robot Home Companion into their daily lives. Designed to simplify routines, enhance comfort, and provide reliable support across everyday tasks, the robot continues to earn trust through consistent performance and intelligent assistance.",
  badgeText = "Trusted by families who value convenience, safety, and efficiency at home",
  testimonials = [],
  autoRotateInterval = 6000,
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Refs for scroll animations
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  }

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Auto rotate testimonials
  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [autoRotateInterval, testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`overflow-hidden bg-[#0A0A0A] pb-36 pt-24 text-white md:py-24 ${className || ""}`}
    >
      <div className="px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-16 w-full md:grid-cols-2 lg:gap-24"
        >
          {/* Left side: Heading and navigation */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <div className="space-y-6">
              {badgeText && (
                <div className="inline-flex items-center rounded-full border border-[#A855F7]/25 bg-[#A855F7]/10 px-3 py-1 text-sm font-medium text-[#E9D5FF]">
                  <Star className="mr-1 h-3.5 w-3.5 fill-[#A855F7] text-[#A855F7]" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">{title}</h2>

              <p className="max-w-[600px] text-slate-300 md:text-xl/relaxed">{subtitle}</p>

              <div className="flex items-center gap-3 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === index ? "w-10 bg-[#A855F7]" : "w-2.5 bg-white/25"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side: Testimonial cards */}
          <motion.div variants={itemVariants} className="relative min-h-[520px] md:mr-10 md:min-h-[400px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  scale: activeIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5, ease: easeInOut }}
                style={{ zIndex: activeIndex === index ? 10 : 0 }}
              >
                <div className="md:hidden">
                  <div className="flex min-h-[374px] flex-col rounded-xl border border-white/10 bg-[#111111] px-8 py-10 text-white shadow-lg">
                    <div className="flex gap-2">
                      {Array(testimonial.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ))}
                    </div>

                    <p className="mt-9 text-xl font-semibold leading-9 text-white">
                      {testimonial.content}
                    </p>
                  </div>

                  <Separator className="mx-8 mt-7 bg-white/10" />

                  <div className="mt-5 flex items-center gap-4 px-8">
                    <Avatar className="h-14 w-14 border border-white/10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-white/10 text-white">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold leading-tight text-white">{testimonial.name}</h3>
                      <p className="text-base text-slate-300">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden h-full flex-col rounded-xl border border-white/10 bg-[#111111] p-8 text-white shadow-lg md:flex">
                  <div className="mb-6 flex gap-2">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      ))}
                  </div>

                  <div className="relative mb-6 flex-1">
                    <p className="relative z-10 text-lg font-medium leading-relaxed text-white">
                      {testimonial.content}
                    </p>
                  </div>

                  <Separator className="my-4 bg-white/10" />

                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-white/10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-white/10 text-white">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-sm text-slate-300">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-xl bg-primary/5"></div>
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-xl bg-primary/5"></div>
          </motion.div>
        </motion.div>


      </div>
    </section>
  )
}
