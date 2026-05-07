"use client";

import { cn } from "@/lib/utils";

const expoWords = [
  "LIVE DEMO",
  "VOICE CONTROL",
  "HOME TASKS",
  "FAMILY ROUTINES",
  "SAFETY CHECKS",
];

const NAV_OFFSET = "5.75rem";
const VISIBLE_HEIGHT = `calc(100svh - ${NAV_OFFSET})`;
const ROW_HEIGHT = `calc((100svh - ${NAV_OFFSET}) * ${1 / expoWords.length})`;

const sectionProgressScript = `
(() => {
	const root = document.currentScript && document.currentScript.previousElementSibling;
	if (!root || root.dataset.expoSectionReady === "true") return;
	root.dataset.expoSectionReady = "true";

	const words = Array.from(root.querySelectorAll("[data-expo-word]"));
	const highlights = Array.from(root.querySelectorAll("[data-expo-highlight]"));
	const clamp = (value) => Math.min(1, Math.max(0, value));
	const update = () => {
		if (!root.isConnected) return;

		const rect = root.getBoundingClientRect();
		const distance = Math.max(root.offsetHeight - window.innerHeight, 1);
		const progress = clamp(-rect.top / distance);
		const activeIndex = Math.min(words.length - 1, Math.max(0, Math.round(progress * (words.length - 1))));
		const highlightY = (progress * (words.length - 1) * 100).toFixed(3) + "%";
		const scale = (0.985 + Math.min(1, progress / 0.075) * 0.015).toFixed(4);

		root.style.setProperty("--expo-section-scale", scale);
		root.style.setProperty("--expo-highlight-y", highlightY);
		highlights.forEach((element) => {
			element.style.transform = "translateY(" + highlightY + ")";
		});
		words.forEach((word, index) => {
			if (index === activeIndex) {
				word.style.color = "rgb(255, 255, 255)";
				word.style.textShadow = "0 0 20px rgba(255,255,255,0.12)";
			} else {
				word.style.color = "rgba(167, 179, 255, 0.18)";
				word.style.textShadow = "none";
			}
		});

		window.requestAnimationFrame(update);
	};

	window.requestAnimationFrame(update);
})();
`;

export default function Section2() {
  return (
    <section className="relative bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] hidden h-64 w-64 rounded-full bg-[#60A5FA]/10 blur-[140px] sm:block" />
        <div className="absolute right-[8%] top-[24%] hidden h-72 w-72 rounded-full bg-[#A855F7]/12 blur-[160px] sm:block" />
        <div className="absolute left-1/2 top-[62%] hidden h-80 w-80 -translate-x-1/2 rounded-full bg-[#7C3AED]/8 blur-[180px] sm:block" />
      </div>

      <div
        data-expo-section
        className="relative min-h-[240vh] [--expo-highlight-y:0%] [--expo-section-scale:0.985]"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div
            style={{
              opacity: 1,
              transform: "scale(var(--expo-section-scale))",
            }}
            className="relative h-full origin-center transform-gpu"
          >
            <div className="pointer-events-none absolute right-6 top-[calc(5.75rem-1.25rem)] z-20 sm:right-8 lg:right-12">
              <p className="text-right text-sm uppercase tracking-[0.35em] text-neutral-500">
                Demo Focus
              </p>
            </div>

            <div
              data-expo-highlight
              style={{
                top: NAV_OFFSET,
                transform: "translateY(var(--expo-highlight-y))",
              }}
              className="pointer-events-none absolute inset-x-[7%] z-0 hidden h-[24svh] rounded-[44px] bg-[linear-gradient(90deg,rgba(96,165,250,0.14),rgba(168,85,247,0.22),rgba(96,165,250,0.14))] blur-3xl sm:block"
            />

            <div
              className="relative z-10 w-full pt-[5.75rem]"
              style={{ minHeight: `calc(${VISIBLE_HEIGHT} + ${NAV_OFFSET})` }}
            >
              {expoWords.map((word, index) => (
                <div
                  key={word}
                  className="relative flex items-center justify-center px-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-white/6 last:after:hidden"
                  style={{ height: ROW_HEIGHT }}
                >
                  <span
                    data-expo-word
                    className={cn(
                      "pb-[0.03em] text-center text-[2rem] font-black uppercase leading-none tracking-normal transition-colors duration-300 min-[380px]:text-[2.35rem] sm:text-[4.2rem] md:text-[5.4rem] lg:text-[6.5rem] xl:text-[7.5rem]",
                      index === 0
                        ? "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                        : "text-[#A7B3FF]/18",
                    )}
                  >
                    {word}
                  </span>
                </div>
              ))}
            </div>

            <div
              data-expo-highlight
              className="pointer-events-none absolute left-0 right-0 z-[5] transform-gpu overflow-hidden border-y border-white/10 bg-[linear-gradient(90deg,rgba(96,165,250,0.12),rgba(124,58,237,0.22),rgba(96,165,250,0.12))] shadow-[0_0_24px_rgba(96,165,250,0.08)] will-change-transform sm:shadow-[0_0_60px_rgba(96,165,250,0.08)]"
              style={{
                top: NAV_OFFSET,
                transform: "translateY(var(--expo-highlight-y))",
                height: ROW_HEIGHT,
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(96,165,250,0.08)_0%,rgba(168,85,247,0.12)_50%,rgba(96,165,250,0.08)_100%)]" />
            </div>
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: sectionProgressScript }} />
    </section>
  );
}
