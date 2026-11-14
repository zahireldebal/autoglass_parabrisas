import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { Services } from '@/components/sections/Services';
import { SimulatorSection } from "@/components/simulator/SimulatorSection";
import { Gallery } from "@/components/sections/Gallery";
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <SimulatorSection />
      <Gallery />
      <Contact />
    </>
  );
}
