import type { Metadata } from "next";
import Footer from "@/components/footer/footer";
import InfoPage from "@/components/info-page";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Terms of Service | NABU",
  description:
    "Simple service terms for demos, setup, and responsible use of the NABU home companion.",
};

const sections = [
  {
    title: "Using NABU at home",
    body: "NABU is designed to support everyday routines, household organization, guided reminders, and companion features. It should be used as an assistive product, not as a replacement for emergency services, medical care, childcare supervision, or personal judgment.",
  },
  {
    title: "Demo and setup expectations",
    body: "Demo requests, bookings, and contact forms help us understand your space, goals, timeline, and preferred support level. Any recommendations shared during a demo are meant to guide planning until a confirmed setup, hardware scope, and service agreement are in place.",
  },
  {
    title: "Care, access, and safety",
    body: "Users are responsible for providing a safe operating environment, keeping pathways clear, and following setup guidance. NABU features may depend on connectivity, compatible home systems, and regular software updates.",
  },
  {
    title: "Data and personalization",
    body: "Personalization works best when NABU can learn routines, preferences, and household patterns. We keep the experience focused on practical assistance, transparency, and user control over what is shared during support or demo conversations.",
  },
  {
    title: "Changes to the service",
    body: "Features, availability, and support options may change as NABU improves. When changes affect demos, setup, or support expectations, we aim to communicate them clearly through the site or direct follow-up.",
  },
];

export default function TermsPage() {
  return (
    <main className="overflow-x-hidden bg-[#050505]">
      <Navbar />
      <InfoPage
        eyebrow="Terms of Service"
        title="Clear terms for bringing NABU into daily life."
        description="These simple terms explain how NABU should be understood across demos, setup conversations, household assistance, and ongoing support."
        highlights={[
          { label: "Scope", value: "Home assistance" },
          { label: "Use", value: "Responsible care" },
          { label: "Updates", value: "Product evolving" },
        ]}
        sections={sections}
        asideTitle="Built to assist, not replace human care."
        asideBody="NABU can make routines smoother, but important safety, health, and family decisions should always stay with the people in the home."
        ctaLabel="Ask a Question"
        ctaHref="/contact"
      />
      <Footer mode="inline" />
    </main>
  );
}
