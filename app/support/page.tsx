import type { Metadata } from "next";
import Footer from "@/components/footer/footer";
import InfoPage from "@/components/info-page";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Support | NABU",
  description:
    "Support options for NABU demos, setup planning, household routines, and companion features.",
};

const sections = [
  {
    title: "Before your demo",
    body: "Share what you want NABU to help with, the size and layout of the home, any connected systems you already use, and the routines that feel hardest to manage. That context helps us shape a useful walkthrough.",
  },
  {
    title: "Setup guidance",
    body: "We can help plan where NABU should operate, which features to enable first, and how to introduce the companion into daily routines without overwhelming the household.",
  },
  {
    title: "Routine and feature questions",
    body: "Support can cover scheduling, reminders, child companion mode expectations, cleaning assistance, household item handling, connectivity, and how NABU adapts to repeated patterns over time.",
  },
  {
    title: "Troubleshooting",
    body: "If something feels off, note what NABU was doing, where it happened, and whether anything changed in the room, network, or routine. Clear context helps us identify whether the issue is setup, environment, or software behavior.",
  },
  {
    title: "Ongoing help",
    body: "As features improve, we can help tune routines, clarify limits, and prepare the home for new capabilities. The support path starts simple: contact us with the goal, the issue, or the next thing you want NABU to do better.",
  },
];

export default function SupportPage() {
  return (
    <main className="overflow-x-hidden bg-[#050505]">
      <Navbar />
      <InfoPage
        eyebrow="Support"
        title="Help for setup, routines, and everyday companion care."
        description="NABU support is built around the real home context: how the space works, what the household needs, and which routines should become easier first."
        highlights={[
          { label: "Response", value: "< 24h" },
          { label: "Help with", value: "Setup and routines" },
          { label: "Best start", value: "Share context" },
        ]}
        sections={sections}
        asideTitle="Need a guided walkthrough?"
        asideBody="A demo is the clearest way to match NABU features with your household routines, floor plan, and support expectations."
        ctaLabel="Book a Demo"
        ctaHref="/book"
      />
      <Footer mode="inline" />
    </main>
  );
}
