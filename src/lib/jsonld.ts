import { business, SITE_URL } from '@/data/business';
import { faq } from '@/data/faq';
import { services } from '@/data/services';

const DAY_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['AutoRepair', 'LocalBusiness'],
    '@id': `${SITE_URL}/#negocio`,
    name: business.name,
    alternateName: 'Autoglass Maldonado',
    description: business.description,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/img/logo-320.png`,
    telephone: `+${business.whatsapp}`,
    contactPoint: [
      { '@type': 'ContactPoint', telephone: `+${business.whatsapp}`, contactType: 'customer service', availableLanguage: 'es' },
      { '@type': 'ContactPoint', telephone: business.phone, contactType: 'customer service', availableLanguage: 'es' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
    hasMap: business.mapsUrl,
    openingHoursSpecification: business.hours
      .filter((h) => h.open)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${DAY_SCHEMA[h.day]}`,
        opens: h.open,
        closes: h.close,
      })),
    areaServed: business.homeServiceZones.map((z) => ({ '@type': 'City', name: z })),
    sameAs: [business.instagram.url, business.mapsUrl],
    paymentAccepted: 'Tarjeta de crédito, tarjeta de débito, efectivo',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.google.rating,
      reviewCount: business.google.reviewCount,
      bestRating: 5,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de cristales automotrices',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.description, areaServed: business.city },
      })),
    },
  };
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq
      .filter((f) => !f.a.includes('[CONFIRMAR'))
      .map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
