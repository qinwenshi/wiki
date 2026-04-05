import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import WikiLayout from '@/components/WikiLayout';
import BacklinksPanel from '@/components/BacklinksPanel';
import MermaidRenderer from '@/components/MermaidRenderer';
import { getArticle, getBacklinks } from '@/lib/localwiki';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugParts } = await params;
  const slug = decodeURIComponent(slugParts.join('/'));
  const result = await getArticle(slug);
  return {
    title: result ? `${result.article.title} - Leon 的个人知识库` : `${slug} - Leon 的个人知识库`,
    description: result?.article.description || '',
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug: slugParts } = await params;
  const slug = decodeURIComponent(slugParts.join('/'));
  const result = await getArticle(slug);
  if (!result) notFound();

  const { article, html } = result;
  const backlinks = getBacklinks(slug);

  return (
    <WikiLayout title={article.title} articleTitle={slug}>
      <article>
        {article.source && (
          <div style={{ background: '#f8f9fa', border: '1px solid #a2a9b1', borderRadius: 2, padding: '8px 12px', marginBottom: 16, fontSize: '0.9em', color: '#54595d' }}>
            📖 来源：{article.source}
          </div>
        )}
        <div
          className="mw-parser-output wiki-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <MermaidRenderer />
      </article>
      <BacklinksPanel backlinks={backlinks} slug={slug} />
    </WikiLayout>
  );
}
