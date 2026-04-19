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
          background: '#1e1e2e',
          primaryColor: '#89b4fa',
          primaryTextColor: '#cdd6f4',
          primaryBorderColor: '#313244',
          lineColor: '#6c7086',
          secondaryColor: '#313244',
          tertiaryColor: '#45475a',
          edgeLabelBackground: '#1e1e2e',
          clusterBkg: '#1e1e2e',
          titleColor: '#cba6f7',
          nodeTextColor: '#cdd6f4',
        },
      });
      mermaid.default.run({
        querySelector: '.mermaid',
      });
    });
  }, []);

  return null;
}
