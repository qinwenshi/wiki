'use client';
import { useEffect } from 'react';

export default function MermaidRenderer() {
  useEffect(() => {
    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        themeVariables: {
          darkMode: true,
          background: '#282828',
          primaryColor: '#458588',
          primaryTextColor: '#ebdbb2',
          lineColor: '#a89984',
          edgeLabelBackground: '#3c3836',
        },
      });
      mermaid.default.run({
        querySelector: '.mermaid',
      });
    });
  }, []);

  return null;
}
