'use client';
import { useEffect, useRef } from 'react';

interface VimKeyOptions {
  openSearch?: () => void;
  scrollTarget?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}

export function useVimKeys({ openSearch, scrollTarget }: VimKeyOptions = {}) {
  const lastKey = useRef<string>('');
  const lastKeyTime = useRef<number>(0);

  useEffect(() => {
    const SCROLL_LINE = 64;
    const SCROLL_HALF = () => (scrollTarget?.current?.clientHeight ?? window.innerHeight) / 2;
    const getEl = () => scrollTarget?.current ?? null;

    const scrollBy = (top: number) => {
      const el = getEl();
      if (el) el.scrollBy({ top, behavior: 'smooth' });
      else window.scrollBy({ top, behavior: 'smooth' });
    };
    const scrollTo = (top: number) => {
      const el = getEl();
      if (el) el.scrollTo({ top, behavior: 'smooth' });
      else window.scrollTo({ top, behavior: 'smooth' });
    };
    const scrollBottom = () => {
      const el = getEl();
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (e.key === '/' && !inInput) {
        e.preventDefault();
        openSearch?.();
        return;
      }

      if (e.key === 'Escape') {
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      if (inInput) return;

      const now = Date.now();

      switch (e.key) {
        case 'j': scrollBy(SCROLL_LINE); break;
        case 'k': scrollBy(-SCROLL_LINE); break;
        case 'd': scrollBy(SCROLL_HALF()); break;
        case 'u': scrollBy(-SCROLL_HALF()); break;
        case 'G': scrollBottom(); break;
        case 'g':
          if (lastKey.current === 'g' && now - lastKeyTime.current < 600) {
            scrollTo(0);
            lastKey.current = '';
          } else {
            lastKey.current = 'g';
            lastKeyTime.current = now;
          }
          return;
      }

      if (e.key !== 'g') lastKey.current = '';
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [openSearch, scrollTarget]);
}
