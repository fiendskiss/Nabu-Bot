'use client';

import { cn } from '@/lib/utils';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
	finalOverlayText?: string;
	finalOverlayClassName?: string;
}

const parallaxScript = `
(() => {
	const root = document.currentScript && document.currentScript.previousElementSibling;
	if (!root || root.dataset.expoParallaxReady === "true") return;
	root.dataset.expoParallaxReady = "true";

	const clamp = (value) => Math.min(1, Math.max(0, value));
	const between = (value, start, end) => clamp((value - start) / (end - start));
	const update = () => {
		if (!root.isConnected) return;

		const rect = root.getBoundingClientRect();
		const distance = Math.max(root.offsetHeight - window.innerHeight, 1);
		const progress = clamp(-rect.top / distance);
		const overlayProgress = between(progress, 0.84, 1);
		const overlayOpacity = between(progress, 0.84, 0.93) * 0.35 + between(progress, 0.93, 1) * 0.65;

		root.style.setProperty("--expo-progress", progress.toFixed(4));
		root.style.setProperty("--expo-overlay-opacity", overlayOpacity.toFixed(4));
		root.style.setProperty("--expo-overlay-y", (2.5 * (1 - overlayProgress)).toFixed(3) + "rem");
		window.requestAnimationFrame(update);
	};

	window.requestAnimationFrame(update);
})();
`;

export function ZoomParallax({
	images,
	finalOverlayText,
	finalOverlayClassName,
}: ZoomParallaxProps) {
	const scales = [4, 5, 6, 5, 6, 8, 9];

	return (
		<>
			<div
				data-expo-parallax
				className="relative h-[300vh] [--expo-overlay-opacity:0] [--expo-overlay-y:2.5rem] [--expo-progress:0]"
			>
				<div className="sticky top-0 h-screen overflow-hidden">
					{images.map(({ src, alt }, index) => {
						const scale = scales[index % scales.length];

						return (
							<div
								key={index}
								style={{ transform: `scale(calc(1 + (var(--expo-progress) * ${scale - 1})))` }}
								className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
							>
								<div className="relative h-[25vh] w-[25vw]">
									<img
										src={src || '/placeholder.svg'}
										alt={alt || `Parallax image ${index + 1}`}
										className="h-full w-full object-cover"
									/>
								</div>
							</div>
						);
					})}

					{finalOverlayText ? (
						<div
							style={{
								opacity: "var(--expo-overlay-opacity)",
								transform: "translateY(var(--expo-overlay-y))",
							}}
							className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6"
						>
							<div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
							<p
								className={cn(
									"relative max-w-4xl text-center text-4xl font-black uppercase leading-[0.9] tracking-[-0.08em] text-white drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl lg:text-7xl",
									finalOverlayClassName,
								)}
							>
								{finalOverlayText}
							</p>
						</div>
					) : null}
				</div>
			</div>
			<script dangerouslySetInnerHTML={{ __html: parallaxScript }} />
		</>
	);
}
