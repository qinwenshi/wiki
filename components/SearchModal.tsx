'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data: SearchResult[] = await res.json();
      setResults(data);
      setSelectedIndex(0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => search(query), 200);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [query, search]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navigate = (slug: string) => {
    router.push(`/wiki/${encodeURIComponent(slug)}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) navigate(results[selectedIndex].slug);
      else if (query.trim()) navigate(query.trim());
    }
  };

  if (!open) return null;

  const C = {
    bg0: 'var(--background0)',
    bg1: 'var(--background1)',
    bg2: 'var(--background2)',
    fg0: 'var(--foreground0)',
    fg1: 'var(--foreground1)',
    fg2: 'var(--foreground2)',
    yellow: 'var(--gb-yellow)',
    blue: 'var(--gb-blue)',
    aqua: 'var(--gb-aqua)',
    green: 'var(--gb-green)',
    orange: 'var(--gb-orange)',
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh',
      }}
    >
      {/* Modal box */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: 520,
          background: C.bg1,
          border: `1px solid ${C.fg2}`,
          fontFamily: 'inherit',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: `1px solid ${C.bg2}`,
          background: C.bg2,
        }}>
          <span style={{ color: C.fg0, fontSize: '0.85em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: C.fg2 }}>🔍</span> Search
          </span>
          <button
            onClick={onClose}
            style={{
              background: C.bg1, border: `1px solid ${C.fg2}`,
              color: C.fg0, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.8em',
              padding: '1px 7px', lineHeight: 1.4,
            }}
          >
            x
          </button>
        </div>

        {/* Input */}
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.bg2}` }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Filter"
            style={{
              width: '100%', padding: '6px 10px',
              background: C.bg0, color: C.fg0,
              border: `1px solid ${C.fg2}`,
              fontFamily: 'inherit', fontSize: '0.9em',
              outline: 'none',
            }}
            autoComplete="off"
          />
        </div>

        {/* Results */}
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {loading && (
            <div style={{ padding: '10px 14px', color: C.fg2, fontSize: '0.85em' }}>searching…</div>
          )}
          {!loading && query && results.length === 0 && (
            <div style={{ padding: '10px 14px', color: C.fg2, fontSize: '0.85em' }}>no results for "{query}"</div>
          )}
          {results.map((r, i) => (
            <div
              key={r.slug}
              onClick={() => navigate(r.slug)}
              onMouseEnter={() => setSelectedIndex(i)}
              style={{
                padding: '7px 14px',
                background: i === selectedIndex ? C.bg2 : 'transparent',
                cursor: 'pointer',
                borderBottom: `1px solid ${C.bg2}`,
              }}
            >
              <div style={{ color: i === selectedIndex ? C.aqua : C.fg0, fontSize: '0.88em', fontWeight: 600 }}>
                {i === selectedIndex ? '❯ ' : '  '}{r.title}
              </div>
              {r.excerpt && (
                <div style={{ color: C.fg2, fontSize: '0.78em', marginTop: 2, paddingLeft: 12 }}>{r.excerpt}</div>
              )}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '5px 12px',
          borderTop: `1px solid ${C.bg2}`,
          background: C.bg2,
          display: 'flex', gap: 16,
          fontSize: '0.72em', color: C.fg2,
        }}>
          <span><span style={{ color: C.yellow }}>↑↓</span> 选择</span>
          <span><span style={{ color: C.yellow }}>↵</span> 跳转</span>
          <span><span style={{ color: C.yellow }}>Esc</span> 关闭</span>
          <span><span style={{ color: C.yellow }}>/</span> 搜索</span>
        </div>
      </div>
    </div>
  );
}
