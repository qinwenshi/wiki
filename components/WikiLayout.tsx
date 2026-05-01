'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchModal from './SearchModal';
import { useVimKeys } from '../hooks/useVimKeys';

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
      { slug: '全球史观与文明演化', label: '全球史观与文明演化' },
      { slug: '时事与社会', label: '时事与社会' },
      { slug: '语言与文化', label: '语言与文化' },
      { slug: '信息熵', label: '信息熵' },
      { slug: '最大熵原理', label: '最大熵原理' },
      { slug: '动态规划', label: '动态规划' },
      { slug: '布隆过滤器', label: '布隆过滤器' },
      { slug: 'TF-IDF', label: 'TF-IDF' },
      { slug: '卷积神经网络', label: '卷积神经网络' },
      { slug: '注意力机制与Transformer', label: '注意力机制与Transformer' },
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
      { slug: '数学之美', label: '数学之美（吴军）' },
      { slug: '动手学深度学习', label: '动手学深度学习（李沐）' },
      { slug: '全球通史', label: '全球通史（斯塔夫里阿诺斯）' },
      { slug: '全球通史-章节笔记', label: '全球通史——章节笔记' },
      { slug: '第五项修炼', label: '第五项修炼（彼得·圣吉）' },
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useVimKeys({ openSearch: () => setSearchOpen(true), scrollTarget: contentRef });

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setSidebarOpen(!isMobile);
    const handler = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (!sidebarOpen || !navRef.current) return;
    const active = navRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (active) {
      active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [sidebarOpen, pathname]);

  const isActive = (slug: string) =>
    pathname === `/wiki/${encodeURIComponent(slug)}` ||
    pathname === `/wiki/${slug}`;

  const C = {
    bg0:    'var(--surface-base)',
    bg1:    'var(--surface-muted)',
    bg2:    'var(--surface-strong)',
    bg3:    'var(--surface-raised)',
    fg0:    'var(--text-secondary)',
    fg1:    'var(--text-tertiary)',
    fg2:    'var(--text-primary)',
    yellow: 'var(--accent-yellow)',
    blue:   'var(--accent-blue)',
    sky:    'var(--accent-sky)',
    green:  'var(--accent-green)',
    orange: 'var(--accent-peach)',
    mauve:  'var(--accent-mauve)',
    teal:   'var(--accent-teal)',
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg0, fontFamily: 'inherit', paddingTop: 8, paddingLeft: 8, paddingRight: 8 }}>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Header (topbar) ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        border: `1px solid var(--box-border-color)`,
        background: C.bg1,
        height: 44,
        flexShrink: 0,
        gap: 12,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="切换侧边栏"
          style={{
            background: 'none',
            border: '1px solid transparent',
            cursor: 'pointer',
            color: C.fg2,
            fontSize: '1em',
            padding: '0 6px',
            height: 28,
            lineHeight: 'normal',
            fontFamily: 'inherit',
            flexShrink: 0,
          }}
        >
          {sidebarOpen ? '▣' : '▢'}
        </button>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0, minWidth: 0 }}>
          <span style={{ color: C.green, fontWeight: 700, fontSize: '1em', whiteSpace: 'nowrap' }}>
            ~/wiki
          </span>
          <span className="logo-text" style={{ color: C.fg2, fontSize: '0.8em', whiteSpace: 'nowrap' }}>
            Leon 的个人知识库
          </span>
        </Link>

        <div style={{ flex: 1 }} />

        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', color: C.fg2,
            border: `1px solid ${C.bg3}`,
            padding: '0 10px',
            height: 28,
            cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '0.82em', whiteSpace: 'nowrap',
            lineHeight: 'normal',
          }}
        >
          <span>🔍</span>
          <span className="search-trigger-label" style={{ flex: 1, textAlign: 'left', color: C.fg2 }}>搜索…</span>
          <span style={{ color: C.fg2, fontSize: '0.85em', opacity: 0.7 }}>/</span>
        </button>

        <span className="article-count-badge" style={{ fontSize: '0.75em', color: C.fg2, flexShrink: 0, whiteSpace: 'nowrap' }}>
          [97]
        </span>
      </header>

      {/* body row — paddingTop (not marginTop!) so badge upper half stays inside overflow:hidden */}
      <div style={{ display: 'flex', gap: '1ch', paddingTop: 28, flex: 1, overflow: 'hidden', paddingBottom: 8 }}>
        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <nav ref={navRef} style={{
            width: 220,
            flexShrink: 0,
            padding: '8px 0 16px 8px',
            border: `1px solid var(--box-border-color)`,
            background: C.bg1,
            overflowY: 'auto',
            fontSize: '13px',
            lineHeight: '1.2',
          }}>
            <Link href="/" style={{
              display: 'block',
              padding: '4px 12px',
              textDecoration: 'none',
              color: pathname === '/' ? C.fg0 : C.fg1,
              background: pathname === '/' ? C.bg3 : 'transparent',
              fontWeight: pathname === '/' ? 700 : 400,
            }}>
              ~/wiki
            </Link>

            <div style={{ borderTop: `1px solid ${C.bg2}`, margin: '6px 0' }} />

            {NAV.map((group) => {
              const isCollapsed = collapsed[group.label] ?? false;
              return (
                <div key={group.label} style={{ marginBottom: 12 }}>
                  {/* Section header — clickable */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setCollapsed(c => ({ ...c, [group.label]: !isCollapsed }))}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setCollapsed(c => ({ ...c, [group.label]: !isCollapsed }))}
                    style={{
                      padding: '2px 12px',
                      fontWeight: 700,
                      color: C.fg0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 2,
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{
                      color: C.fg2,
                      fontSize: '0.85em',
                      display: 'inline-block',
                      transition: 'transform 0.15s',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'none',
                    }}>∨</span>
                    {group.label}
                  </div>

                  {/* Items — collapse/expand */}
                  {!isCollapsed && (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {group.items.map((item, idx, arr) => {
                        const active = isActive(item.slug);
                        const isLast = idx === arr.length - 1;
                        return (
                          <li key={item.slug} style={{ margin: 0, padding: 0 }}>
                            <Link
                              href={`/wiki/${encodeURIComponent(item.slug)}`}
                              data-active={active ? 'true' : undefined}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '3px 8px 3px 0',
                                lineHeight: '1.4',
                                textDecoration: 'none',
                                color: active ? C.fg0 : C.fg2,
                                background: active ? '#363a4f' : 'transparent',
                                fontWeight: active ? 700 : 400,
                              }}
                            >
                              <span style={{
                                flexShrink: 0,
                                width: 28,
                                textAlign: 'right',
                                paddingRight: 6,
                                color: active ? C.fg0 : C.bg3,
                                userSelect: 'none',
                              }}>
                                {isLast ? '└' : '├'}
                              </span>
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* ── Main ── */}
        <main style={{
          flex: 1, minWidth: 0,
          border: `1px solid var(--box-border-color)`,
          position: 'relative',
          background: C.bg1,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Title badge on the top border — with orange border */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 16,
            transform: 'translateY(-50%)',
            background: C.bg1,
          }}>
            <h1 style={{
              fontSize: '1.1em',
              fontWeight: 700,
              color: C.orange,
              border: `1px solid ${C.orange}`,
              padding: '2px 14px',
              margin: 0,
              lineHeight: 1.5,
              whiteSpace: 'nowrap',
            }}
              dangerouslySetInnerHTML={{ __html: '# ' + title }}
            />
          </div>
          {/* Scrollable article content — paddingTop must clear the badge height */}
          <div ref={contentRef} className="wiki-content-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '52px 56px 24px 40px' }}>
            {children}
          </div>
        </main>
      </div>

      {/* ── Statusbar footer ── */}
      <footer style={{
        border: `1px solid var(--box-border-color)`,
        borderBottom: 'none',
        padding: '4px 16px',
        background: C.bg1,
        fontSize: '0.75em',
        color: C.fg2,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        fontFamily: 'inherit',
        flexShrink: 0,
      }}>
        <span style={{ color: C.bg0, background: C.green, fontWeight: 700, padding: '0 6px' }}>NORMAL</span>
        <span style={{ color: C.fg2 }}>~/wiki</span>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: C.fg0 }}>
          {articleTitle || 'index'}
        </span>
        <span style={{ color: C.fg2 }}>▼ h j k l /</span>
      </footer>
    </div>
  );
}
