import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { getAllArticles } from '@/lib/localwiki';

const C = {
  bg0:    'var(--surface-base)',
  bg1:    'var(--surface-muted)',
  bg2:    'var(--surface-strong)',
  bg3:    'var(--surface-raised)',
  fg0:    'var(--text-secondary)',
  fg1:    'var(--text-tertiary)',
  fg2:    'var(--text-primary)',
  orange: 'var(--accent-peach)',
  blue:   'var(--accent-blue)',
  green:  'var(--accent-green)',
  yellow: 'var(--accent-yellow)',
  mauve:  'var(--accent-mauve)',
};

export default function HomePage() {
  const articles = getAllArticles();

  const grouped = articles.reduce((acc, a) => {
    const dir = a.filepath.split('/')[0];
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(a);
    return acc;
  }, {} as Record<string, typeof articles>);

  const dirLabels: Record<string, string> = {
    companies:   '🏢 公司',
    people:      '👤 人物',
    philosophies:'🧠 思想与哲学',
    techniques:  '⚙️ 技术方法',
    knowledge:   '📚 知识领域',
    patterns:    '🔄 模式与规律',
    eras:        '📅 年代',
    life:        '🌿 生活',
    reading:     '📖 阅读',
  };

  const dirOrder = ['companies','people','philosophies','techniques','knowledge','patterns','eras','life','reading'];
  const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
    const ai = dirOrder.indexOf(a), bi = dirOrder.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div style={{ minHeight: '100vh', background: C.bg0, color: C.fg0, fontFamily: 'inherit', padding: '40px 32px 60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', paddingBottom: 40, maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2em', fontWeight: 700, marginBottom: 8, color: C.fg0 }}>
          📖 Leon 的个人知识库
        </h1>
        <p style={{ color: C.fg2, marginBottom: 28, fontSize: '0.95em' }}>
          思想、人物、公司、方法论——来自书与笔记的知识地图
        </p>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <SearchBar large />
        </div>
      </div>

      {/* Article grid by category */}
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {sortedEntries.map(([dir, arts]) => (
          <div key={dir} style={{ marginBottom: 36 }}>
            <h2 style={{
              fontSize: '0.85em',
              fontWeight: 700,
              color: C.fg2,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              borderBottom: `1px solid var(--box-border-color)`,
              paddingBottom: 6,
              marginBottom: 12,
            }}>
              {dirLabels[dir] || dir}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {arts.map((a) => (
                <Link
                  key={a.slug}
                  href={`/wiki/${encodeURIComponent(a.slug)}`}
                  style={{
                    display: 'block',
                    padding: '8px 12px',
                    border: `1px solid var(--box-border-color)`,
                    color: C.blue,
                    textDecoration: 'none',
                    background: C.bg1,
                    fontSize: '0.9em',
                    lineHeight: 1.4,
                    transition: 'border-color 0.1s, background 0.1s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-blue)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface-strong)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--box-border-color)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface-muted)';
                  }}
                >
                  {a.title}
                  {a.source && (
                    <span style={{ display: 'block', fontSize: '0.8em', color: C.fg2, marginTop: 2 }}>
                      {a.source}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
