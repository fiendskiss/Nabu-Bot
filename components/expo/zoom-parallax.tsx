'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
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

export function ZoomParallax({
	images,
	finalOverlayText,
	finalOverlayClassName,
}: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
	const overlayOpacity = useTransform(scrollYProgress, [0.84, 0.93, 1], [0, 0.35, 1]);
	const overlayY = useTransform(scrollYProgress, [0.84, 1], ['2.5rem', '0rem']);
	const mobileOverlayOpacity = useTransform(scrollYProgress, [0.62, 0.78, 0.96], [0, 0.85, 1]);
	const mobileOverlayY = useTransform(scrollYProgress, [0.62, 0.96], ['1.5rem', '0rem']);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[260svh] md:h-[300vh]">
			<div className="sticky top-0 h-[100svh] overflow-hidden md:h-screen">
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[22svh] [&>div]:!left-[14vw] [&>div]:!h-[24svh] [&>div]:!w-[54vw] md:[&>div]:!-top-[30vh] md:[&>div]:!left-[5vw] md:[&>div]:!h-[30vh] md:[&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[8svh] [&>div]:!-left-[27vw] [&>div]:!h-[34svh] [&>div]:!w-[42vw] md:[&>div]:!-top-[10vh] md:[&>div]:!-left-[25vw] md:[&>div]:!h-[45vh] md:[&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[29vw] [&>div]:!h-[26svh] [&>div]:!w-[48vw] md:[&>div]:!left-[27.5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[24svh] [&>div]:!left-[13vw] [&>div]:!h-[23svh] [&>div]:!w-[48vw] md:[&>div]:!top-[27.5vh] md:[&>div]:!left-[5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[23svh] [&>div]:!-left-[26vw] [&>div]:!h-[23svh] [&>div]:!w-[56vw] md:[&>div]:!top-[27.5vh] md:[&>div]:!-left-[22.5vw] md:[&>div]:!h-[25vh] md:[&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[17svh] [&>div]:!left-[31vw] [&>div]:!h-[17svh] [&>div]:!w-[34vw] md:[&>div]:!top-[22.5vh] md:[&>div]:!left-[25vw] md:[&>div]:!h-[15vh] md:[&>div]:!w-[15vw]' : ''} `}
						>
							<div className="relative h-[31svh] w-[76vw] overflow-hidden rounded-[18px] md:h-[25vh] md:w-[25vw] md:overflow-visible md:rounded-none">
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-cover"
								/>
							</div>
						</motion.div>
					);
				})}

				{finalOverlayText ? (
					<motion.div
						style={{ opacity: overlayOpacity, y: overlayY }}
						className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center px-6 md:flex"
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
					</motion.div>
				) : null}

				{finalOverlayText ? (
					<motion.div
						style={{ opacity: mobileOverlayOpacity, y: mobileOverlayY }}
						className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 md:hidden"
					>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-transparent" />
						<p
							className={cn(
								"relative max-w-[21rem] text-center text-[2.3rem] font-black uppercase leading-[0.92] tracking-[-0.045em] text-white drop-shadow-[0_12px_32px_rgba(0,0,0,0.6)] min-[390px]:text-[2.55rem]",
								finalOverlayClassName,
							)}
						>
							{finalOverlayText}
						</p>
					</motion.div>
				) : null}
			</div>
		</div>
	);
}
