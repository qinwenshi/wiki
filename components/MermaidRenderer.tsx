'use client';
import { useEffect } from 'react';

export default function MermaidRenderer() {
  useEffect(() => {
    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      });
      mermaid.default.run({
        querySelector: '.mermaid',
      });
    });
  }, []);

  return null;
}
