"use client";

import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "@/components/home/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Routine",
    date: "Task-scheduling",
    content: "Manages daily routines with built-in scheduling, helping organize tasks and maintain a consistent household flow.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2,3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Memory",
    date: "Learns habits",
    content: "Stores and recalls user preferences, routines, and interactions to deliver personalized and continuously improving assistance over time.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3, 4],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Sync",
    date: "Smart control",
    content: "Seamlessly connects with home systems and adapts through intelligent software, enabling responsive and automated assistance.",
    category: "Development",
    icon: Code,
    relatedIds: [1, 2, 4, 5],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Adapt",
    date: "User adaptive",
    content: "Built to understand and adapt to user needs, providing intuitive interaction and personalized assistance in everyday tasks.”",
    category: "Testing",
    icon: User,
    relatedIds: [2,3,4],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "Respond",
    date: "Assistance",
    content: "Responds instantly to tasks and commands, offering reliable support exactly when it’s needed.",
    category: "Release",
    icon: Clock,
    relatedIds: [3,4],
    status: "pending" as const,
    energy: 10,
  },
];

export function RadialOrbitalTimelineDemo({
  className,
  heightClassName,
}: {
  className?: string;
  heightClassName?: string;
}) {
  return (
    <>
      <RadialOrbitalTimeline
        timelineData={timelineData}
        className={className}
        heightClassName={heightClassName}
      />
    </>
  );
}

const radialDemoExports = {
  RadialOrbitalTimelineDemo,
};

export default radialDemoExports;
