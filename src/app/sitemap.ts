import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/business';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/privacidad/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
