import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { Services } from '@/components/sections/Services';
import { SecurityFilm } from '@/components/sections/SecurityFilm';
import { SimulatorSection } from '@/components/simulator/SimulatorSection';
import { HowWeWork } from '@/components/sections/HowWeWork';
import { Gallery } from '@/components/sections/Gallery';
import { WhyImport } from '@/components/sections/WhyImport';
import { Faq } from '@/components/sections/Faq';
import { Reviews } from '@/components/sections/Reviews';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <SecurityFilm />
      <SimulatorSection />
      <HowWeWork />
      <Gallery />
      <WhyImport />
      <Faq />
      <Reviews />
      <Contact />
    </>
  );
}
