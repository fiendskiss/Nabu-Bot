import Link from "next/link";
import BorderGlow from "@/components/BorderGlow";
import DotBackground from "@/components/bg/dot";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: Array<{
    label: string;
    value: string;
  }>;
  sections: Array<{
    title: string;
    body: string;
  }>;
  asideTitle: string;
  asideBody: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function InfoPage({
  eyebrow,
  title,
  description,
  highlights,
  sections,
  asideTitle,
  asideBody,
  ctaLabel,
  ctaHref,
}: InfoPageProps) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#050505] px-6 pb-20 pt-28 text-white sm:px-8 lg:px-12 lg:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <DotBackground className="absolute inset-0 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(96,165,250,0.09),transparent_27%),radial-gradient(circle_at_82%_22%,rgba(168,85,247,0.1),transparent_25%),linear-gradient(180deg,rgba(5,5,5,0.56)_0%,rgba(5,5,5,0.9)_42%,#050505_100%)]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,0.42fr)] lg:gap-12">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[3.15rem] lg:text-[4.15rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#D6DCF8]/72 sm:text-[1.08rem]">
            {description}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <BorderGlow
                key={highlight.label}
                className="h-full rounded-[1.5rem] px-5 py-5"
                borderRadius={24}
                edgeSensitivity={22}
                glowRadius={20}
                glowIntensity={0.36}
                fillOpacity={0.1}
                backgroundColor="rgba(255,255,255,0.02)"
                colors={["#60A5FA", "#A855F7", "#38BDF8"]}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                  {highlight.label}
                </p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">
                  {highlight.value}
                </p>
              </BorderGlow>
            ))}
          </div>

          <div className="mt-8 grid gap-4">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5 backdrop-blur-sm"
              >
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="lg:pt-20">
          <div className="sticky top-28 rounded-[1.75rem] border border-white/10 bg-black/28 p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A7B3FF]/58">
              NABU Companion
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-white">
              {asideTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/64">{asideBody}</p>
            <Link
              href={ctaHref}
              className="mt-6 inline-flex rounded-full border border-white/12 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#EDEDED]"
            >
              {ctaLabel}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
