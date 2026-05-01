import Navbar from "@/components/navbar/Navbar";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer/footer";

export default function Faq() {
    return (
        <main className="bg-[#050505]">
            <Navbar />
            <FAQSection />
            <Footer mode="inline" />
        </main>
    );
}
