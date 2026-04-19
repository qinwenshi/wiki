'use client';
import { useEffect, useRef } from 'react';

interface VimKeyOptions {
  openSearch?: () => void;
}

export function useVimKeys({ openSearch }: VimKeyOptions = {}) {
  const lastKey = useRef<string>('');
  const lastKeyTime = useRef<number>(0);

  useEffect(() => {
    const SCROLL_LINE = 64;
    const SCROLL_HALF = () => window.innerHeight / 2;

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // '/' opens search modal
      if (e.key === '/' && !inInput) {
        e.preventDefault();
        openSearch?.();
        return;
      }

      // Escape: blur active element
      if (e.key === 'Escape') {
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      if (inInput) return;

      const now = Date.now();

      switch (e.key) {
        case 'j':
          window.scrollBy({ top: SCROLL_LINE, behavior: 'smooth' });
          break;
        case 'k':
          window.scrollBy({ top: -SCROLL_LINE, behavior: 'smooth' });
          break;
        case 'd':
          window.scrollBy({ top: SCROLL_HALF(), behavior: 'smooth' });
          break;
        case 'u':
          window.scrollBy({ top: -SCROLL_HALF(), behavior: 'smooth' });
          break;
        case 'G':
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          break;
        case 'g':
          if (lastKey.current === 'g' && now - lastKeyTime.current < 600) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }, [openSearch]);
}
