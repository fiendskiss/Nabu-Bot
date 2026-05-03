import * as React from "react";
import { TestimonialSlider } from "@/components/testimonial-slider-1";

// 1. Define the review data
const reviews = [
  {
    id: 1,
    name: "Precision support for elevated household tasks",
    affiliation: "Use Cases",
    quote:
      "Helps users safely change and install ceiling lights, assisting with household maintenance tasks that require reach, stability, and precision.",
    // Image from the provided screenshot
    imageSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-5_qbgmyd.webp",
    thumbnailSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-5_qbgmyd.webp",
  },
  {
    id: 2,
    name: "Use Cases",
    affiliation: "Autonomous Cleaning",
    quote:
      "Performs routine floor vacuuming and surface cleaning, navigating through rooms efficiently while maintaining a consistently clean living space.",
    // Image from the provided screenshot
    imageSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-2_bhgzhy.webp",
    thumbnailSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-2_bhgzhy.webp",
  },
  {
    id: 3,
    name: "Use Cases",
    affiliation: "Laundry Support",
    quote:
      "Assists in folding clothes after washing, helping organize laundry and reduce time spent on repetitive household chores.",
    // Thumbnail from the provided screenshot
    imageSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-1_o69brw.webp",
    thumbnailSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-1_o69brw.webp",
  },
  {
    id: 4,
    name: "Use Cases",
    affiliation: "Child Companion Mode",
    quote:
      "Engages with children through safe interactive play, providing companionship, entertainment, and supervised activity support.",
    // Thumbnail from the provided screenshot
    imageSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-3_bsw1cy.webp",
    thumbnailSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-3_bsw1cy.webp",
  },
  {
    id: 5,
    name: "Use Cases",
    affiliation: "Daily Household Assistance",
    quote:
      "Supports users by holding and organizing items such as towels and household essentials, improving convenience during daily routines and multitasking.",
    imageSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-4_l888ei.webp",
    thumbnailSrc:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195921/image-4_l888ei.webp",
  },
];

// 2. Render the component with the data
export default function TestimonialSliderDemo() {
  return (
    <div className="h-full w-full">
      <TestimonialSlider reviews={reviews} className="h-full w-full bg-transparent" />
    </div>
  );
}
