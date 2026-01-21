import Hero from "@/components/Hero";
import ForCreators from "@/components/ForCreators";
import YourHome from "@/components/YourHome";
import HowItWorks from "@/components/HowItWorks";
import AICompatibility from "@/components/AICompatibility";
import BeyondBasics from "@/components/BeyondBasics";
import Pricing from "@/components/Pricing";
import Trust from "@/components/Trust";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <ForCreators />
      <YourHome />
      <HowItWorks />
      <AICompatibility />
      <BeyondBasics />
      <Pricing />
      <Trust />
      <FAQ />
      <Footer />
    </main>
  );
}
