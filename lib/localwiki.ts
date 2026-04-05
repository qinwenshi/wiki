import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const WIKI_DIR = process.env.WIKI_DIR || path.join(process.cwd(), 'content');

export interface LocalArticle {
  slug: string;
  filepath: string;
  title: string;
  type: string;
  description?: string;
  source?: string;
  related?: string[];
  tags?: string[];
  content: string;
}

export interface ArticleIndex {
  [slug: string]: string;
}

export function buildArticleIndex(): ArticleIndex {
  const index: ArticleIndex = {};
  const subdirs = fs.readdirSync(WIKI_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const dir of subdirs) {
    const dirPath = path.join(WIKI_DIR, dir);
    const files = fs.readdirSync(dirPath).filter(
      (f) => f.endsWith('.md') && !f.startsWith('_')
    );
    for (const file of files) {
      const slug = file.replace(/\.md$/, '');
      index[slug] = `${dir}/${file}`;
    }
  }
  return index;
}

export async function getArticle(
  slug: string
): Promise<{ article: LocalArticle; html: string } | null> {
  const index = buildArticleIndex();
  const filepath = index[slug];
  if (!filepath) return null;

  const fullPath = path.join(WIKI_DIR, filepath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(raw);

  const article: LocalArticle = {
    slug,
    filepath,
    title: data.title || slug,
    type: data.type || '',
    description: data.description,
    source: data.source,
    related: data.related,
    tags: data.tags,
    content,
  };

  const html = await markdownToHtml(content);
  return { article, html };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  // 1. Extract mermaid blocks before remark processing
  const mermaidBlocks: string[] = [];
  const withPlaceholders = markdown.replace(
    /```mermaid\n([\s\S]*?)```/g,
    (_, code) => {
      const idx = mermaidBlocks.length;
      mermaidBlocks.push(code);
      return `MERMAID_PLACEHOLDER_${idx}`;
    }
  );

  // 2. Convert [[wikilinks]] to markdown links
  const withLinks = withPlaceholders.replace(
    /\[\[([^\]]+)\]\]/g,
    (_, name) => `[${name}](/wiki/${encodeURIComponent(name)})`
  );

  // 3. Run through remark pipeline
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(withLinks);

  let html = result.toString();

  // 4. Proxy all external images through /api/image-proxy to bypass rate limits
  html = html.replace(
    /<img([^>]*?)src="(https?:\/\/[^"]+)"([^>]*?)>/g,
    (_, before, src, after) => {
      const proxied = `/api/image-proxy?url=${encodeURIComponent(src)}`;
      return `<img${before}src="${proxied}"${after}>`;
    }
  );

  // 5. Restore mermaid blocks as div.mermaid
  mermaidBlocks.forEach((code, idx) => {
    html = html.replace(
      `<p>MERMAID_PLACEHOLDER_${idx}</p>`,
      `<div class="mermaid">${code}</div>`
    );
    // Fallback if remark wrapped it differently
    html = html.replace(
      `MERMAID_PLACEHOLDER_${idx}`,
      `<div class="mermaid">${code}</div>`
    );
  });

  return html;
}

export function getAllArticles(): LocalArticle[] {
  const index = buildArticleIndex();
  const articles: LocalArticle[] = [];

  for (const [slug, filepath] of Object.entries(index)) {
    const fullPath = path.join(WIKI_DIR, filepath);
    try {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const { data, content } = matter(raw);
      articles.push({
        slug,
        filepath,
        title: data.title || slug,
        type: data.type || '',
        description: data.description,
        source: data.source,
        related: data.related,
        tags: data.tags,
        content,
      });
    } catch {
      // skip unreadable files
    }
  }

  return articles;
}

export function searchArticles(
  query: string
): Array<{ slug: string; title: string; excerpt: string }> {
  const q = query.toLowerCase();
  const articles = getAllArticles();
  const results: Array<{ slug: string; title: string; excerpt: string }> = [];

  for (const article of articles) {
    const inTitle = article.title.toLowerCase().includes(q);
    const inContent = article.content.toLowerCase().includes(q);
    if (!inTitle && !inContent) continue;

    let excerpt = '';
    if (inContent) {
      const idx = article.content.toLowerCase().indexOf(q);
      const start = Math.max(0, idx - 80);
      const end = Math.min(article.content.length, idx + 120);
      excerpt = article.content.slice(start, end).replace(/\n+/g, ' ').trim();
      if (start > 0) excerpt = '…' + excerpt;
      if (end < article.content.length) excerpt += '…';
    } else {
      excerpt = article.content.slice(0, 200).replace(/\n+/g, ' ').trim() + '…';
    }

    results.push({ slug: article.slug, title: article.title, excerpt });
    if (results.length >= 10) break;
  }

  return results;
}

export function getBacklinks(slug: string): string[] {
  const articles = getAllArticles();
  const backlinks: string[] = [];

  for (const article of articles) {
    if (article.slug === slug) continue;
    // Check [[slug]] references in content or in related frontmatter
    const hasWikilink = article.content.includes(`[[${slug}]]`);
    const hasRelated = Array.isArray(article.related) &&
      article.related.some((r) => r.includes(slug));
    if (hasWikilink || hasRelated) {
      backlinks.push(article.slug);
    }
  }

  return backlinks;
}
