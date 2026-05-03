"use client";

import { useMemo, useState } from "react";
import BorderGlow from "@/components/BorderGlow";
import DotBackground from "@/components/bg/dot";

const quickFacts = [
  { label: "Average response", value: "< 24h" },
  { label: "Best for", value: "Daily home routines" },
  { label: "Support level", value: "Guided setup" },
];

const supportCards = [
  {
    title: "Home Fit Planning",
    description:
      "We help map NABU features to the household routines, rooms, and moments where support matters most.",
  },
  {
    title: "Companion Setup",
    description:
      "From reminders to child companion mode, we keep setup focused, calm, and easy to understand.",
  },
  {
    title: "Ongoing Care",
    description:
      "We stay close after the first conversation so routines, updates, and support questions stay connected.",
  },
];

const faqs = [
  {
    q: "What is NABU designed to help with?",
    a: "NABU is designed as a home companion that supports everyday routines, reminders, household organization, cleaning assistance, child companion moments, and simple connected-home interactions.",
  },
  {
    q: "Is NABU a replacement for human care or supervision?",
    a: "No. NABU can assist with routines and companionship, but it should not replace adult supervision, emergency services, medical care, or important household decisions.",
  },
  {
    q: "What happens during a demo?",
    a: "A demo is a guided walkthrough of NABU's core features, the types of routines it can support, and how setup could work in your home. It also helps us understand your floor plan, needs, and priorities.",
  },
  {
    q: "Can NABU adapt to different household routines?",
    a: "Yes. The concept is built around repeated patterns, preferences, and daily schedules so NABU can become more useful as the household establishes clear routines.",
  },
  {
    q: "What kind of home setup does NABU need?",
    a: "NABU works best with clear pathways, stable connectivity, and a defined first set of tasks. During setup, we help identify where it should operate and which features should be enabled first.",
  },
  {
    q: "How does support work after the first conversation?",
    a: "Support can help with setup questions, routine tuning, troubleshooting context, and understanding feature limits. The best starting point is to share what NABU was doing and what changed in the environment.",
  },
  {
    q: "How is household data handled conceptually?",
    a: "NABU's personalization depends on routine and preference context, so the experience should stay transparent and user-controlled. Demo and support conversations focus only on the details needed to plan or improve assistance.",
  },
  {
    q: "What should we share before booking?",
    a: "Share the routines you want help with, the rooms NABU would use most, any connected systems in the home, and your main concerns around setup, safety, or daily use.",
  },
];

export default function FAQSection() {
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return faqs;

    return faqs.filter(({ q, a }) =>
      `${q} ${a}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <DotBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.08),transparent_28%),radial-gradient(circle_at_75%_22%,rgba(168,85,247,0.09),transparent_24%),linear-gradient(180deg,rgba(5,5,5,0.72)_0%,rgba(5,5,5,0.86)_30%,#050505_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1520px] flex-col px-6 pb-20 pt-28 sm:px-8 lg:px-12 lg:pt-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                FAQ
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[3.1rem] lg:text-[4.15rem]">
                Answers for bringing NABU into everyday home routines.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#D6DCF8]/74 sm:text-[1.08rem]">
                A quick overview of how NABU works as a companion, what a demo
                can cover, and how support stays tied to the real needs of the
                home.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {quickFacts.map((fact) => (
                <BorderGlow
                  key={fact.label}
                  className="h-full rounded-[1.5rem] px-5 py-5"
                  borderRadius={24}
                  edgeSensitivity={22}
                  glowRadius={20}
                  glowIntensity={0.38}
                  fillOpacity={0.12}
                  backgroundColor="rgba(255,255,255,0.02)"
                  colors={["#60A5FA", "#A855F7", "#38BDF8"]}
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                    {fact.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {fact.value}
                  </p>
                </BorderGlow>
              ))}
            </div>

            <div className="mt-8 grid gap-4">
              {supportCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5 backdrop-blur-sm"
                >
                  <h2 className="text-lg font-semibold tracking-[-0.03em] text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-4 backdrop-blur-md sm:p-5">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
                    Common Questions
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Search through common questions about setup, routines,
                    safety, support, and daily companion use.
                  </p>
                </div>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="h-11 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/35 sm:max-w-[18rem]"
                />
              </div>

              <div className="mt-5 grid gap-3">
                {filteredFaqs.map((item, index) => (
                  <FAQItem
                    key={item.q}
                    q={item.q}
                    a={item.a}
                    index={index + 1}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                  Still deciding?
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                  Start with the routines you want to make easier.
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  A short list of household tasks, rooms, and concerns gives us
                  enough context to shape the first walkthrough.
                </p>
              </div>

              <BorderGlow
                className="rounded-[1.5rem] px-5 py-5"
                borderRadius={24}
                edgeSensitivity={20}
                glowRadius={20}
                glowIntensity={0.36}
                fillOpacity={0.1}
                backgroundColor="rgba(255,255,255,0.02)"
                colors={["#60A5FA", "#A855F7", "#38BDF8"]}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                  Best next step
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                  Share the home context, the priority routines, and the support
                  questions.
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Once we have that, we can quickly tell you what a useful demo
                  should cover and which setup steps matter first.
                </p>
              </BorderGlow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  q,
  a,
  index,
}: {
  q: string;
  a: string;
  index: number;
}) {
  const [open, setOpen] = useState(index === 1);

  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-5 py-5 transition hover:border-white/20">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-3">
          <span className="pt-0.5 text-xs text-white/35">
            {String(index).padStart(2, "0")}
          </span>
          <h3 className="text-base font-semibold leading-6 text-white sm:text-lg">
            {q}
          </h3>
        </div>
        <span className="mt-0.5 text-xl leading-none text-white/55">
          {open ? "-" : "+"}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,margin] duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
          open ? "mt-4 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden pl-7">
          <p className="max-w-2xl text-sm leading-6 text-white/65">{a}</p>
        </div>
      </div>
    </div>
  );
}
