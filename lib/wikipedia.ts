import * as cheerio from 'cheerio';

export interface ArticleSummary {
  title: string;
  displaytitle: string;
  description?: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
  content_urls?: { desktop: { page: string } };
}

export async function fetchArticleSummary(title: string): Promise<ArticleSummary | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { next: { revalidate: 3600 }, headers: { 'User-Agent': 'WikiClone/1.0' } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchArticleHtml(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`,
      { next: { revalidate: 3600 }, headers: { 'User-Agent': 'WikiClone/1.0', 'Accept': 'text/html' } }
    );
    if (!res.ok) return null;
    const html = await res.text();
    return processArticleHtml(html);
  } catch {
    return null;
  }
}

function processArticleHtml(html: string): string {
  const $ = cheerio.load(html, { xmlMode: false });

  // Remove base tag
  $('base').remove();

  // Remove edit section links
  $('span.mw-editsection').remove();
  $('.mw-editsection').remove();

  // Rewrite internal wiki links
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('./')) {
      // Parsoid uses relative ./Article_Name format
      const articleName = href.slice(2).split('#')[0];
      const hash = href.includes('#') ? '#' + href.split('#')[1] : '';
      $(el).attr('href', `/wiki/${articleName}${hash}`);
    } else if (href.startsWith('/wiki/')) {
      // Already absolute wiki link
      $(el).attr('href', href);
    } else if (href.startsWith('#')) {
      // Anchor link, keep as is
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      // External link, add target blank
      $(el).attr('target', '_blank').attr('rel', 'noopener noreferrer');
    }
  });

  // Rewrite images to go through our proxy
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src') || '';
    const srcset = $(el).attr('srcset') || '';

    if (src.includes('wikimedia.org') || src.includes('wikipedia.org')) {
      const proxied = `/api/image-proxy?url=${encodeURIComponent(src)}`;
      $(el).attr('src', proxied);
    } else if (src.startsWith('//')) {
      const fullUrl = 'https:' + src;
      $(el).attr('src', `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`);
    }

    // Clear srcset to avoid browser loading original URLs
    if (srcset) {
      $(el).removeAttr('srcset');
    }
  });

  // Also handle <source> tags in <picture> elements
  $('source[srcset]').each((_, el) => {
    $(el).removeAttr('srcset');
  });

  // Get the body content
  const body = $('body').html() || $('section').first().parent().html() || '';
  return body || $.html();
}

export interface SearchResult {
  title: string;
  description?: string;
  url: string;
}

export async function searchWikipedia(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=10&format=json&origin=*`,
      { headers: { 'User-Agent': 'WikiClone/1.0' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    // OpenSearch format: [query, titles[], descriptions[], urls[]]
    const titles: string[] = data[1] || [];
    const descriptions: string[] = data[2] || [];
    const urls: string[] = data[3] || [];
    return titles.map((title, i) => ({
      title,
      description: descriptions[i],
      url: urls[i],
    }));
  } catch {
    return [];
  }
}
