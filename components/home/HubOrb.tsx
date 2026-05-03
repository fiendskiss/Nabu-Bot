import { useId } from "react";
import { cn } from "@/lib/utils";

interface HubOrbProps {
  className?: string;
}

function formatSvgNumber(value: number) {
  return Number(value.toFixed(6));
}

function getStarPath(cx: number, cy: number, outer = 2.1, inner = 0.95) {
  const points = Array.from({ length: 8 }, (_, index) => {
    const angle = (-90 + index * 45) * (Math.PI / 180);
    const radius = index % 2 === 0 ? outer : inner;

    return {
      x: formatSvgNumber(cx + Math.cos(angle) * radius),
      y: formatSvgNumber(cy + Math.sin(angle) * radius),
    };
  });

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")
    .concat(" Z");
}

function polarToCartesian(angle: number, radius: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: formatSvgNumber(50 + radius * Math.cos(radians)),
    y: formatSvgNumber(50 + radius * Math.sin(radians)),
  };
}

function describeArc(startAngle: number, endAngle: number, radius: number) {
  const start = polarToCartesian(startAngle, radius);
  const end = polarToCartesian(endAngle, radius);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

const separatorAngles = [45, 135, 225, 315];
const textArcs = [
  { start: 315, end: 405 },
  { start: 45, end: 135 },
  { start: 135, end: 225 },
  { start: 225, end: 315 },
];

export function HubOrb({ className }: HubOrbProps) {
  const idBase = `scroll-orb-${useId().replace(/:/g, "")}`;

  const stars = separatorAngles.map((angle) => {
    const radians = (angle * Math.PI) / 180;
    const radius = 40.5;

    return {
      x: formatSvgNumber(50 + Math.cos(radians) * radius),
      y: formatSvgNumber(50 + Math.sin(radians) * radius),
    };
  });

  return (
    <div
      aria-hidden="true"
      className={cn("relative aspect-square w-36 min-w-[8rem] text-white md:w-40", className)}
    >
      <div className="absolute inset-0 rounded-full border border-white/10 bg-black/45 shadow-[0_18px_36px_rgba(0,0,0,0.42)] backdrop-blur-[3px]" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          {textArcs.map((arc, index) => (
            <path
              key={`${idBase}-${index}`}
              id={`${idBase}-${index}`}
              d={describeArc(arc.start, arc.end, 39.5)}
            />
          ))}
        </defs>

        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="rgba(255,255,255,0.98)"
          strokeWidth="1.35"
        />
        <circle
          cx="50"
          cy="50"
          r="31"
          fill="none"
          stroke="rgba(255,255,255,0.94)"
          strokeWidth="1.2"
        />

        <g style={{ animation: "spin 12s linear infinite", transformOrigin: "50px 50px" }}>
          {stars.map((star, index) => (
            <path
              key={index}
              d={getStarPath(star.x, star.y)}
              fill="rgba(255,255,255,0.98)"
            />
          ))}

          {textArcs.map((_, index) => (
            <text
              key={`label-${index}`}
              fill="rgba(255,255,255,0.98)"
              fontSize="6.85"
              letterSpacing="0.06em"
              className="font-medium lowercase"
              dominantBaseline="middle"
              dy="1.8"
            >
              <textPath href={`#${idBase}-${index}`} startOffset="50%" textAnchor="middle">
                scroll down
              </textPath>
            </text>
          ))}
        </g>

        <g
          stroke="rgba(255,255,255,0.98)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          transform="translate(0 3.2)"
        >
          <path d="M 50 32 L 50 56" />
          <path d="M 41.5 47.5 L 50 56 L 58.5 47.5" />
        </g>
      </svg>
    </div>
  );
}

export default HubOrb;
