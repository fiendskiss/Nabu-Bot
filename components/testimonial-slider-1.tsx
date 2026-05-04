"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define the type for a single review
type Review = {
  id: string | number;
  name: string;
  affiliation: string;
  quote: string;
  imageSrc: string;
  thumbnailSrc: string;
};

// Define the props for the slider component
interface TestimonialSliderProps {
  reviews: Review[];
  /** Optional class name for the container */
  className?: string;
}

/**
 * A reusable, animated testimonial slider component.
 * It uses framer-motion for animations and is styled with
 * shadcn/ui theme variables.
 */
export const TestimonialSlider = ({
  reviews,
  className,
}: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // 'direction' helps framer-motion understand slide direction (next vs. prev)
  const [direction, setDirection] = useState<"left" | "right">("right");

  const activeReview = reviews[currentIndex];

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleThumbnailClick = (index: number) => {
    // Determine direction for animation
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  // Get the next 3 reviews for the thumbnails, excluding the current one
  const thumbnailReviews = reviews
    .filter((_, i) => i !== currentIndex)
    .slice(0, 3);

  // Animation variants for the main image
  const imageVariants = {
    enter: (direction: "left" | "right") => ({
      y: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { y: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      y: direction === "right" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  // Animation variants for the text content
  const textVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 50 : -50,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn(
        "relative mx-auto flex h-full w-full max-w-[84rem] overflow-hidden bg-transparent px-0 py-4 text-neutral-400 sm:px-2 md:min-h-[580px] md:px-10 md:py-10",
        className
      )}
    >
      <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        {/* === Left Column: Meta and Thumbnails === */}
        <div className="order-3 flex flex-col justify-end md:col-span-2 md:order-1">
          {/* Thumbnail Navigation */}
          <div className="flex justify-center gap-2 md:mt-0 md:justify-start md:space-x-2">
            {thumbnailReviews.map((review) => {
              // Find the original index to navigate to
              const originalIndex = reviews.findIndex(
                (r) => r.id === review.id
              );
              return (
                <button
                  key={review.id}
                  onClick={() => handleThumbnailClick(originalIndex)}
                  className="h-16 w-14 shrink-0 overflow-hidden rounded-md opacity-70 transition-opacity duration-300 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-transparent sm:h-20 sm:w-16 md:h-24 md:w-20"
                  aria-label={`View review from ${review.name}`}
                >
                  <img
                    src={review.thumbnailSrc}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* === Center Column: Main Image === */}
        <div className="relative order-1 h-[22rem] min-h-0 overflow-hidden rounded-lg sm:h-[26rem] md:col-span-4 md:order-2 md:min-h-[420px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={activeReview.imageSrc}
              alt={activeReview.name}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} // Cubic bezier for smooth ease
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>

        {/* === Right Column: Text and Navigation === */}
        <div className="order-2 flex flex-col justify-start md:col-span-5 md:order-3 md:justify-between md:pl-8">
          {/* Text Content */}
          <div className="relative overflow-visible pt-1 md:min-h-[200px] md:overflow-hidden md:pt-14">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm sm:tracking-[0.35em]">
                  {activeReview.affiliation}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-white sm:text-xl">
                  {activeReview.name}
                </h3>
                <blockquote className="mt-4 text-base font-medium leading-7 text-neutral-400 sm:text-lg sm:leading-8 md:mt-6 md:text-3xl md:leading-snug">
                  &ldquo;{activeReview.quote}&rdquo;
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 flex items-center justify-center space-x-2 md:mt-0 md:justify-start">
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full border-muted-foreground/50 md:h-12 md:w-12"
              onClick={handlePrev}
              aria-label="Previous review"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-11 w-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 md:h-12 md:w-12"
              onClick={handleNext}
              aria-label="Next review"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
