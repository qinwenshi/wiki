'use client';

import { useState, useRef, useEffect, useCallback, RefObject } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
}

interface SearchBarProps {
  large?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export default function SearchBar({ large = false, inputRef }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef ?? internalRef;
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

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 4 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            ref={activeInputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1); }}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="/ 搜索…"
            style={{
              width: '100%',
              padding: large ? '0 14px' : '0 10px',
              height: large ? 38 : 28,
              fontSize: large ? '1em' : '0.85em',
              fontFamily: 'inherit',
              background: 'var(--background0)',
              color: 'var(--foreground0)',
              border: '1px solid var(--background3)',
              outline: 'none',
            }}
            aria-label="搜索知识库"
            autoComplete="off"
          />
          {loading && (
            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '0.8em', color: 'var(--foreground2)' }}>
              ⟳
            </span>
          )}
        </div>
        <button
          type="submit"
          style={{
            padding: large ? '0 16px' : '0 10px',
            height: large ? 38 : 28,
            background: 'var(--background2)',
            color: 'var(--foreground0)',
            border: '1px solid var(--background3)',
            cursor: 'pointer',
            fontSize: large ? '0.9em' : '0.8em',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            lineHeight: 'normal',
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
              className={i === selectedIndex ? 'selected' : ''}
              onMouseEnter={() => setSelectedIndex(i)}
              onClick={() => setIsOpen(false)}
            >
              <div style={{ fontWeight: 'bold', fontSize: '0.88em', color: 'var(--gb-aqua)' }}>{result.title}</div>
              {result.excerpt && (
                <div style={{ fontSize: '0.8em', color: 'var(--foreground2)', marginTop: 2 }}>{result.excerpt}</div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
