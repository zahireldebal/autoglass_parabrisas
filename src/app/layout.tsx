import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import './globals.css';
import { business, SITE_URL } from '@/data/business';
import { localBusinessJsonLd, faqJsonLd } from '@/lib/jsonld';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { QuoteModal } from '@/components/quote/QuoteModal';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
});
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const HASH_FIX = `(function(){var h=location.hash;if(h.length<2)return;var moved=false;
['wheel','touchstart','keydown','pointerdown'].forEach(function(e){addEventListener(e,function(){moved=true},{once:true,passive:true})});
function go(){if(moved)return;var el=document.getElementById(decodeURIComponent(h.slice(1)));if(el)el.scrollIntoView({behavior:'instant',block:'start'})}
addEventListener('load',function(){var f=document.fonts&&document.fonts.ready;Promise.resolve(f).then(function(){requestAnimationFrame(go);setTimeout(go,700)})})})()`;

const title = `Autoglass Parabrisas · Cristales automotrices y láminas de seguridad en ${business.city}`;
const description = `Cristales automotrices para todo tipo de vehículo en ${business.city}: parabrisas, lunetas y laterales. Láminas de seguridad Security Film, venta mayorista para talleres y tu parabrisas gratis con el seguro de tu vehículo. Colocación sin costo con la compra del cristal.`;
const ogImage = { url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Autoglass Parabrisas: cristales automotrices y láminas de seguridad en Maldonado' };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: business.name,
  keywords: [
    'cristales automotrices',
    `cambio de parabrisas ${business.city}`,
    'parabrisas Maldonado',
    'lámina de seguridad',
    'Security Film',
    'láminas de seguridad para vehículos',
    'venta mayorista de cristales',
    'parabrisas con seguro',
    'parabrisas gratis con el seguro',
    'luneta',
    'vidrios laterales',
    'cristales para vehículos',
    'Punta del Este',
    'San Carlos',
    'Piriápolis',
    'Rocha',
  ],
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: `${SITE_URL}/`,
    siteName: business.name,
    title,
    description,
    images: [ogImage],
  },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0c1014',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-UY" className={`${barlow.variable} ${barlowCondensed.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca que hay JS: recién ahí se ocultan las entradas animadas */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Enlace directo a una sección (#simulador…): al cargar las fuentes la página se reacomoda y la
            sección queda corrida bajo el menú. Se vuelve a ubicar, salvo que el usuario ya se haya movido. */}
        <script dangerouslySetInnerHTML={{ __html: HASH_FIX }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
        <Providers>
            <Navbar />
            <main id="contenido">{children}</main>
            <Footer />
            <FloatingWhatsApp />
            <QuoteModal />
        </Providers>
      </body>
    </html>
  );
}
