import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { Services } from '@/components/sections/Services';
import { SecurityFilm } from '@/components/sections/SecurityFilm';
import { SimulatorSection } from '@/components/simulator/SimulatorSection';
import { HowWeWork } from '@/components/sections/HowWeWork';
import { Insurance } from '@/components/sections/Insurance';
import { Gallery } from '@/components/sections/Gallery';
import { WhyImport } from '@/components/sections/WhyImport';
import { Faq } from '@/components/sections/Faq';
import { Reviews } from '@/components/sections/Reviews';
import { Contact } from '@/components/sections/Contact';
import { faqJsonLd } from '@/lib/jsonld';

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <Hero />
      <TrustBar />
      <Services />
      <SecurityFilm />
      <SimulatorSection />
      <HowWeWork />
      <Insurance />
      <Gallery />
      <WhyImport />
      <Faq />
      <Reviews />
      <Contact />
    </>
  );
}
