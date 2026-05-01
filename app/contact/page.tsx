import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";
import ContactSpectrumSection from "@/components/contact/contact-spectrum-section";

export default function Contact() {
  return (
    <main > 
      <Navbar />
      <ContactSpectrumSection />
      <Footer mode="inline" />
    </main>
  );
}
