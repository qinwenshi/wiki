import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { getAllArticles } from '@/lib/localwiki';

export default function HomePage() {
  const articles = getAllArticles();

  const grouped = articles.reduce((acc, a) => {
    const dir = a.filepath.split('/')[0];
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(a);
    return acc;
  }, {} as Record<string, typeof articles>);

  const dirLabels: Record<string, string> = {
    philosophies: '🧠 思想与哲学',
    patterns: '🔄 模式与规律',
    techniques: '⚙️ 技术方法',
    knowledge: '📚 知识领域',
    people: '👤 人物',
    eras: '📅 年代',
    life: '🌿 生活',
    reading: '📖 阅读',
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
        <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: 8 }}>📖 Leon 的个人知识库</h1>
        <p style={{ color: '#54595d', marginBottom: 24 }}>
          基于王兴饭否合集 · 金字塔原理2 · 推荐系统实践
        </p>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <SearchBar large />
        </div>
      </div>

      {/* Article grid by category */}
      {Object.entries(grouped).map(([dir, arts]) => (
        <div key={dir} style={{ marginBottom: 32 }}>
          <h2 style={{ borderBottom: '1px solid #a2a9b1', paddingBottom: 6, marginBottom: 12 }}>
            {dirLabels[dir] || dir}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {arts.map((a) => (
              <Link
                key={a.slug}
                href={`/wiki/${encodeURIComponent(a.slug)}`}
                style={{ display: 'block', padding: '10px 14px', border: '1px solid #a2a9b1', borderRadius: 3, color: '#3366cc', textDecoration: 'none', background: 'white', fontSize: '0.95em' }}
              >
                {a.title}
                {a.source && (
                  <span style={{ display: 'block', fontSize: '0.8em', color: '#54595d', marginTop: 2 }}>
                    {a.source}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
