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
    title: "Waka Waka",
    role: "Industrial Design Lead",
    imageUrl:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1778152712/6332600648989348443_v1zqqs.jpg",
    summary: "Shapes the physical presence of NABU to feel approachable, calm, and premium in the home.",
  },
  {
    id: 2,
    title: "Shanne Quitlong",
    role: "Robotics Systems Director",
    imageUrl:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1778152712/6332600648989348442_tdzdas.jpg",
    summary: "Leads navigation, actuation, and safety systems that make daily autonomy reliable.",
  },
  {
    id: 3,
    title: "Eebraheem Khalas",
    role: "Applied AI Research Lead",
    imageUrl:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1778152712/6332600648989348444_w4aw7r.jpg",
    summary: "Builds the adaptive intelligence that helps NABU understand context, routines, and tone.",
  },
  {
    id: 4,
    title: "Boom Boom Boom",
    role: "Companion Experience Lead",
    imageUrl:
      "https://res.cloudinary.com/dcmj7quyv/image/upload/v1778152712/6332600648989348441_ny14z8.jpg",
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

function MobileTeamCard({ item }: { item: InteractiveAccordionItem }) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))]">
      <div className="relative h-72 overflow-hidden sm:h-96">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${item.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.04)_0%,rgba(5,5,5,0.2)_42%,rgba(5,5,5,0.82)_100%)]" />
        <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/25 p-2 text-white/90 backdrop-blur-md">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
          {item.title}
        </h3>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#A855F7]">
          {item.role}
        </p>
        <p className="mt-3 text-sm leading-6 text-white/72">
          {item.summary}
        </p>
      </div>
    </article>
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
    <section className="mx-auto flex w-full max-w-[1500px] items-center px-4 py-14 text-white sm:px-8 sm:py-16 lg:min-h-[100svh] lg:px-12">
      <div className="grid w-full items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
        <div className="max-w-[36rem] lg:pr-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neutral-500">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-[0.98] tracking-[-0.04em] sm:text-4xl lg:text-[3.4rem] lg:leading-[0.95] lg:tracking-[-0.05em]">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
            {description}
          </p>
        </div>

        <div className="grid gap-4 lg:hidden">
          {items.map((item) => (
            <MobileTeamCard key={item.id} item={item} />
          ))}
        </div>

        <div className="hidden overflow-x-auto pb-2 lg:block lg:pl-2">
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
