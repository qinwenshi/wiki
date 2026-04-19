'use client';

import React, { useState, useEffect } from 'react';
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
    label: '🏢 公司',
    items: [
      { slug: '美团', label: '美团' },
      { slug: '字节跳动', label: '字节跳动' },
      { slug: '步步高', label: '步步高' },
      { slug: 'OPPO', label: 'OPPO' },
      { slug: 'vivo', label: 'vivo' },
      { slug: '小霸王', label: '小霸王' },
      { slug: '英特尔', label: '英特尔' },
    ],
  },
  {
    label: '👤 人物',
    items: [
      { slug: '王兴', label: '王兴' },
      { slug: '张一鸣', label: '张一鸣' },
      { slug: '张小龙', label: '张小龙' },
      { slug: '王慧文', label: '王慧文' },
      { slug: '俞军', label: '俞军' },
      { slug: '段永平', label: '段永平' },
      { slug: '安迪·格鲁夫', label: '安迪·格鲁夫' },
      { slug: '维特根斯坦', label: '维特根斯坦' },
      { slug: '巴菲特', label: '巴菲特' },
      { slug: '查理·芒格', label: '查理·芒格' },
      { slug: '黄峥', label: '黄峥' },
      { slug: '本杰明·格雷厄姆', label: '本杰明·格雷厄姆' },
      { slug: '理查德·费曼', label: '理查德·费曼' },
    ],
  },
  {
    label: '🧠 哲学思想',
    items: [
      { slug: '俞军产品方法论', label: '俞军产品方法论' },
      { slug: '王慧文产品课', label: '王慧文产品课' },
      { slug: '微信产品哲学', label: '微信产品哲学' },
      { slug: '产品与算法思维', label: '产品与算法思维' },
      { slug: '段永平投资哲学', label: '段永平投资哲学' },
      { slug: '价值投资', label: '价值投资' },
      { slug: '金字塔原理', label: '金字塔原理' },
      { slug: '费曼学习法', label: '费曼学习法' },
      { slug: '维特根斯坦哲学', label: '维特根斯坦哲学' },
      { slug: '战略思维', label: '战略思维' },
      { slug: '历史类比思维', label: '历史类比思维' },
      { slug: '创业与商业', label: '创业与商业' },
      { slug: '供需关系与产品设计', label: '供需关系' },
      { slug: '用户价值模型', label: '用户价值模型' },
      { slug: '逻辑思维框架', label: '逻辑思维框架' },
      { slug: '产品思维', label: '产品思维' },
      { slug: '吴军投资观', label: '吴军投资观' },
      { slug: '吴军创业观', label: '吴军创业观' },
      { slug: '吴军产品观', label: '吴军产品观' },
    ],
  },
  {
    label: '⚙️ 技术方法',
    items: [
      { slug: '协同过滤算法', label: '协同过滤算法' },
      { slug: '推荐系统工程实践', label: '推荐系统工程' },
      { slug: '评分预测与模型融合', label: '评分预测与融合' },
      { slug: '高产出管理', label: '高产出管理' },
      { slug: 'OKR', label: 'OKR' },
      { slug: '20-70-10人才梯队管理', label: '20-70-10 人才梯队' },
      { slug: '4E1P招聘框架', label: '4E1P 招聘框架' },
      { slug: '写作结构技术', label: '写作结构技术' },
      { slug: '财务报表分析框架', label: '财务报表分析框架' },
      { slug: '分析阅读方法', label: '分析阅读方法' },
      { slug: '产品分层框架', label: '产品分层框架' },
      { slug: '吴军职场方法论', label: '吴军职场方法论' },
      { slug: '拒绝伪工作', label: '拒绝伪工作' },
      { slug: '吴军沟通方法论', label: '吴军沟通方法论' },
    ],
  },
  {
    label: '📚 知识领域',
    items: [
      { slug: '推荐系统概论', label: '推荐系统概论' },
      { slug: '财务报表基础', label: '财务报表基础' },
      { slug: '饭否文化与社区', label: '饭否文化与社区' },
      { slug: '经济与投资', label: '经济与投资' },
      { slug: '科技与互联网', label: '科技与互联网' },
      { slug: '人工智能观察', label: '人工智能观察' },
      { slug: '历史与文明', label: '历史与文明' },
      { slug: '时事与社会', label: '时事与社会' },
      { slug: '语言与文化', label: '语言与文化' },
    ],
  },
  {
    label: '🔁 模式',
    items: [
      { slug: '历史类比思维', label: '历史类比思维' },
    ],
  },
  {
    label: '📅 年代',
    items: [
      { slug: '2007-2010早期探索', label: '2007–2010 早期' },
      { slug: '2011-2015美团崛起', label: '2011–2015 美团' },
      { slug: '2016-2020成熟期', label: '2016–2020 成熟' },
      { slug: '海内', label: '海内（2007）' },
    ],
  },
  {
    label: '📖 书籍精读',
    items: [
      { slug: '格鲁夫给经理人的第一课', label: '格鲁夫给经理人的第一课' },
      { slug: '赢', label: '赢（韦尔奇）' },
      { slug: '好战略坏战略', label: '好战略坏战略' },
      { slug: '穷查理宝典', label: '穷查理宝典' },
      { slug: '创新者的窘境', label: '创新者的窘境' },
      { slug: '学会提问', label: '学会提问' },
      { slug: '必然', label: '必然（凯文·凯利）' },
      { slug: '奇点临近', label: '奇点临近（库兹韦尔）' },
      { slug: '见识', label: '见识（吴军）' },
      { slug: '零售的哲学', label: '零售的哲学（铃木敏文）' },
    ],
  },
  {
    label: '🌿 生活',
    items: [
      { slug: '生活与饮食', label: '生活与饮食' },
      { slug: '其他观察', label: '其他观察' },
      { slug: '阅读与书单', label: '阅读与书单' },
      { slug: 'github精选项目', label: 'GitHub 精选项目' },
    ],
  },
];

export default function WikiLayout({ title, articleTitle, children }: WikiLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // 移动端默认收起，桌面端默认展开
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setSidebarOpen(!isMobile);
    const handler = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, minWidth: 0 }}>
          <span style={{ fontSize: '1.4em', lineHeight: 1, flexShrink: 0 }}>📖</span>
          <div className="logo-text" style={{ lineHeight: 1.25, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.95em', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>Leon 的个人知识库</div>
            <div style={{ fontSize: '0.65em', color: '#718096', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>PERSONAL WIKI</div>
          </div>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 480 }}>
          <SearchBar />
        </div>

        {/* Article count badge */}
        <span className="article-count-badge" style={{ fontSize: '0.75em', color: '#718096', flexShrink: 0, whiteSpace: 'nowrap' }}>24 篇文章</span>
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
        Leon 的个人知识库 · 50 篇文章 · 8位人物 · 3家公司 · 14篇哲学思想
      </footer>
    </div>
  );
}
