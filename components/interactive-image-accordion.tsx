"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export interface InteractiveAccordionItem {
  id: number;
  title: string;
  role: string;
  imageUrl: string;
  summary: string;
}

interface InteractiveImageAccordionProps {
  items?: InteractiveAccordionItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

const defaultItems: InteractiveAccordionItem[] = [
  {
    id: 1,
    title: "Ari Velasco",
    role: "Industrial Design Lead",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    summary: "Shapes the physical presence of NABU to feel approachable, calm, and premium in the home.",
  },
  {
    id: 2,
    title: "Mika Reyes",
    role: "Robotics Systems Director",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    summary: "Leads navigation, actuation, and safety systems that make daily autonomy reliable.",
  },
  {
    id: 3,
    title: "Sana Ibrahim",
    role: "Applied AI Research Lead",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
    summary: "Builds the adaptive intelligence that helps NABU understand context, routines, and tone.",
  },
  {
    id: 4,
    title: "Noah Lim",
    role: "Companion Experience Lead",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
    summary: "Designs the human side of the product, from onboarding to long-term trust and comfort.",
  },
];

interface AccordionItemProps {
  item: InteractiveAccordionItem;
  isActive: boolean;
  onMouseEnter: () => void;
}

function AccordionItem({
  item,
  isActive,
  onMouseEnter,
}: AccordionItemProps) {
  return (
    <div
      className={`relative h-[420px] overflow-hidden rounded-[24px] border border-white/10 transition-all duration-700 ease-in-out ${
        isActive ? "w-[420px]" : "w-[78px]"
      }`}
      onMouseEnter={onMouseEnter}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.3)_30%,rgba(5,5,5,0.85)_100%)]" />

      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex justify-end">
          <div className="rounded-full border border-white/15 bg-black/25 p-2 text-white/90 backdrop-blur-md">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="relative min-h-[7rem]">
          {isActive ? (
            <div className="max-w-[18rem]">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#A855F7]">
                {item.role}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/78">
                {item.summary}
              </p>
            </div>
          ) : (
            <span className="absolute bottom-14 left-1/2 -translate-x-1/2 rotate-90 whitespace-nowrap text-base font-semibold tracking-[-0.03em] text-white">
              {item.title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function LandingAccordionItem({
  items = defaultItems,
  eyebrow = "Team",
  title = "Meet the people shaping the NABU companion experience.",
  description = "A multidisciplinary team across robotics, AI, and industrial design working toward a more human home robot.",
}: InteractiveImageAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className="mx-auto flex min-h-[100svh] w-full max-w-[1500px] items-center px-6 py-14 text-white sm:px-8 sm:py-16 lg:px-12">
      <div className="grid w-full items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
        <div className="max-w-[36rem] lg:pr-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-[0.95] tracking-[-0.05em] sm:text-4xl lg:text-[3.4rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
            {description}
          </p>
        </div>

        <div className="overflow-x-auto pb-2 lg:pl-2">
          <div className="flex min-w-max items-center gap-4">
            {items.map((item, index) => (
              <AccordionItem
                key={item.id}
                item={item}
                isActive={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
