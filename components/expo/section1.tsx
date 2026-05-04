'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import Lenis from '@studio-freight/lenis'
import { ZoomParallax } from "@/components/expo/zoom-parallax";
import ExpoSectionHeader from "@/components/expo/section-header";

export default function DefaultDemo() {

	React.useEffect( () => {
        const lenis = new Lenis()
       
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    },[])


	const images = [
		{
			src: 'https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195933/maneken-11AU096_irkjn2.jpg',
			alt: 'NABU expo campaign display on a building',
		},
		{
			src: 'https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195933/maneken-11USA074_n72ylt.jpg',
			alt: 'NABU expo poster on an outdoor display',
		},
		{
			src: 'https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195933/maneken-OOH2_hh2edp.jpg',
			alt: 'NABU expo large-format event billboard',
		},
		{
			src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Open venue walkway for the NABU expo',
		},
		{
			src: 'https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195932/maneken-11USA047_dgmg6d.jpg',
			alt: 'NABU expo street-level poster placement',
		},
		{
			src: 'https://res.cloudinary.com/dcmj7quyv/image/upload/v1777195932/maneken-PS93_uek1nw.jpg',
			alt: 'NABU expo printed event poster',
		},
		{
			src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
			alt: 'Campus path leading to the NABU expo venue',
		},
	];

	return (
		<main className="min-h-screen w-full">
			<div className="relative flex min-h-[56vh] items-center justify-center px-6 pb-10 pt-28 sm:px-8 lg:px-12">
				{/* Radial spotlight */}
				<div
					aria-hidden="true"
					className={cn(
						'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
						'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
						'blur-[30px]',
					)}
				/>
				<ExpoSectionHeader
					label="NABU Expo 2026"
					title="See NABU move, listen, and assist in a live home demo."
					description="Join us on November 25, 2026 at Lyceum-Northwestern University for an in-person walkthrough of NABU's companion routines, household support, and family-focused safety behaviors."
					align="center"
					className="max-w-5xl"
				/>
			</div>
			<ZoomParallax
				images={images}
				finalOverlayText="Meet the robot who will become your family."
			/>
			<div className="h-[50vh]"/>
		</main>
	);
}
