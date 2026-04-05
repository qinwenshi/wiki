'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from './SearchBar';

interface WikiLayoutProps {
  title: string;
  articleTitle: string;
  children: React.ReactNode;
}

const NAV = [
  {
    label: '🧠 哲学思想',
    items: [
      { slug: '金字塔原理', label: '金字塔原理' },
      { slug: '逻辑思维框架', label: '逻辑思维框架' },
      { slug: '产品思维', label: '产品思维' },
      { slug: '哲学与认知', label: '哲学与认知' },
    ],
  },
  {
    label: '⚙️ 技术方法',
    items: [
      { slug: '协同过滤算法', label: '协同过滤算法' },
      { slug: '推荐系统工程实践', label: '推荐系统工程' },
      { slug: '评分预测与模型融合', label: '评分预测与融合' },
      { slug: '写作结构技术', label: '写作结构技术' },
    ],
  },
  {
    label: '📚 知识领域',
    items: [
      { slug: '推荐系统概论', label: '推荐系统概论' },
      { slug: '历史与文明', label: '历史与文明' },
      { slug: '科技与互联网', label: '科技与互联网' },
      { slug: '经济与投资', label: '经济与投资' },
      { slug: '语言与文化', label: '语言与文化' },
    ],
  },
  {
    label: '👤 人物',
    items: [
      { slug: '王兴', label: '王兴' },
      { slug: '时事与社会', label: '时事与社会' },
    ],
  },
  {
    label: '📅 年代',
    items: [
      { slug: '2007-2010早期探索', label: '2007–2010 早期' },
      { slug: '2011-2015美团崛起', label: '2011–2015 美团' },
      { slug: '2016-2020成熟期', label: '2016–2020 成熟' },
    ],
  },
  {
    label: '🌿 生活',
    items: [
      { slug: '生活与饮食', label: '生活与饮食' },
      { slug: '其他观察', label: '其他观察' },
    ],
  },
  {
    label: '📖 阅读',
    items: [
      { slug: '阅读与书单', label: '阅读与书单' },
    ],
  },
];

export default function WikiLayout({ title, articleTitle, children }: WikiLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (slug: string) =>
    pathname === `/wiki/${encodeURIComponent(slug)}` ||
    pathname === `/wiki/${slug}`;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* ── Header ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid #e2e8f0',
        background: '#1a1a2e',
        height: 52,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: 16,
      }}>
        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="切换侧边栏"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', fontSize: '1.1em', padding: '4px 6px', borderRadius: 4, flexShrink: 0 }}
        >
          ☰
        </button>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontSize: '1.4em', lineHeight: 1 }}>📖</span>
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: '0.95em', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.02em' }}>Leon 的个人知识库</div>
            <div style={{ fontSize: '0.65em', color: '#718096', letterSpacing: '0.05em' }}>PERSONAL WIKI</div>
          </div>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 480 }}>
          <SearchBar />
        </div>

        {/* Article count badge */}
        <span style={{ fontSize: '0.75em', color: '#718096', flexShrink: 0 }}>22 篇文章</span>
      </header>

      <div style={{ display: 'flex' }}>
        {/* ── Left Sidebar ── */}
        {sidebarOpen && (
          <nav style={{
            width: 200,
            flexShrink: 0,
            padding: '12px 0',
            borderRight: '1px solid #e2e8f0',
            minHeight: 'calc(100vh - 52px)',
            background: '#fafafa',
            overflowY: 'auto',
            position: 'sticky',
            top: 52,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 52px)',
          }}>
            {/* Home link */}
            <div style={{ padding: '0 12px 8px' }}>
              <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 8px',
                borderRadius: 5,
                textDecoration: 'none',
                fontSize: '0.85em',
                color: pathname === '/' ? '#1a1a2e' : '#4a5568',
                fontWeight: pathname === '/' ? 600 : 400,
                background: pathname === '/' ? '#e9ecf7' : 'transparent',
              }}>
                🏠 <span>首页</span>
              </Link>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', margin: '0 12px 8px' }} />

            {/* Category groups */}
            {NAV.map((group) => (
              <div key={group.label} style={{ marginBottom: 4 }}>
                <div style={{
                  padding: '4px 20px',
                  fontSize: '0.7em',
                  fontWeight: 700,
                  color: '#a0aec0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: 8,
                }}>
                  {group.label}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: '0 8px' }}>
                  {group.items.map((item) => {
                    const active = isActive(item.slug);
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/wiki/${encodeURIComponent(item.slug)}`}
                          style={{
                            display: 'block',
                            padding: '4px 12px',
                            borderRadius: 5,
                            textDecoration: 'none',
                            fontSize: '0.82em',
                            color: active ? '#1a1a2e' : '#4a5568',
                            fontWeight: active ? 600 : 400,
                            background: active ? '#e9ecf7' : 'transparent',
                            borderLeft: active ? '3px solid #3366cc' : '3px solid transparent',
                            transition: 'background 0.1s',
                          }}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        )}

        {/* ── Main Content ── */}
        <main style={{ flex: 1, padding: '28px 40px', maxWidth: 900, minWidth: 0 }}>
          {/* Source badge */}
          <h1 style={{
            fontSize: '1.85em',
            fontWeight: 700,
            color: '#1a1a2e',
            margin: '0 0 20px',
            paddingBottom: 12,
            borderBottom: '2px solid #e2e8f0',
            lineHeight: 1.3,
          }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {children}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid #e2e8f0',
        padding: '16px 24px',
        background: '#fafafa',
        fontSize: '0.8em',
        color: '#a0aec0',
        textAlign: 'center',
      }}>
        Leon 的个人知识库 · 40 篇文章 · 王兴 · 张一鸣 · 张小龙 · 王慧文 · 俞军 · 段永平 · 格鲁夫 · 维特根斯坦
      </footer>
    </div>
  );
}
