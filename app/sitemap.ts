import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/localwiki';

const BASE_URL = 'https://wiki.tokbook.cn';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/wiki/${encodeURIComponent(a.slug)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...articleUrls,
  ];
}
