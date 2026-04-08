'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
}

interface SearchBarProps {
  large?: boolean;
}

export default function SearchBar({ large = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data: SearchResult[] = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => search(query), 300);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [query, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      router.push(`/wiki/${encodeURIComponent(results[selectedIndex].slug)}`);
    } else if (query.trim()) {
      router.push(`/wiki/${encodeURIComponent(query.trim())}`);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const inputStyle: React.CSSProperties = large ? {
    width: '100%',
    padding: '10px 16px',
    fontSize: '1.1em',
    border: '1px solid #a2a9b1',
    borderRadius: 2,
    outline: 'none',
  } : {
    width: '100%',
    padding: '6px 12px',
    fontSize: '0.9em',
    border: '1px solid #a2a9b1',
    borderRadius: 2,
    outline: 'none',
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 4 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1); }}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="搜索知识库…"
            style={inputStyle}
            aria-label="搜索知识库"
            autoComplete="off"
          />
          {loading && (
            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '0.8em', color: '#54595d' }}>
              ⟳
            </span>
          )}
        </div>
        <button
          type="submit"
          style={{
            padding: large ? '10px 20px' : '6px 12px',
            background: '#3366cc',
            color: 'white',
            border: 'none',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: large ? '1em' : '0.85em',
            whiteSpace: 'nowrap',
          }}
        >
          搜索
        </button>
      </form>

      {isOpen && results.length > 0 && (
        <div className="wiki-clone-search-dropdown">
          {results.map((result, i) => (
            <a
              key={result.slug}
              href={`/wiki/${encodeURIComponent(result.slug)}`}
              style={{ background: i === selectedIndex ? '#eaf3fb' : undefined }}
              onMouseEnter={() => setSelectedIndex(i)}
              onClick={() => setIsOpen(false)}
            >
              <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{result.title}</div>
              {result.excerpt && (
                <div style={{ fontSize: '0.8em', color: '#54595d', marginTop: 2 }}>{result.excerpt}</div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
