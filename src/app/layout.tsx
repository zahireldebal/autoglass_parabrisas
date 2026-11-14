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

const title = `Autoglass Parabrisas · Parabrisas, Cristales y Polarizado en ${business.city}`;
const description = `Cambio de parabrisas en ${business.city}, lunetas, vidrios laterales, polarizado de autos y láminas de seguridad. Importador directo de cristales automotrices: colocación gratis con la compra y a domicilio sin costo. Cotizá por WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: business.name,
  keywords: [
    `cambio de parabrisas ${business.city}`,
    'parabrisas Maldonado',
    'polarizado de autos',
    'láminas de seguridad',
    'cristales automotrices',
    'luneta',
    'vidrios laterales',
    'Punta del Este',
    'San Carlos',
    'Piriápolis',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: '/',
    siteName: business.name,
    title,
    description,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Autoglass Parabrisas, Maldonado' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
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
