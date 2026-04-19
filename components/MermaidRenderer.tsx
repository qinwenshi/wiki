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
          primaryColor: '#1e3a5f',
          primaryTextColor: '#cdd6f4',
          primaryBorderColor: '#45475a',
          lineColor: '#6c7086',
          secondaryColor: '#313244',
          tertiaryColor: '#45475a',
          edgeLabelBackground: '#1e1e2e',
          clusterBkg: '#1e1e2e',
          titleColor: '#cba6f7',
          nodeTextColor: '#cdd6f4',
          // Timeline / mindmap section palette (Catppuccin-tinted dark surfaces)
          cScale0:  '#1e3a5f',   // blue tint
          cScale1:  '#3d2b5e',   // mauve tint
          cScale2:  '#1e3a28',   // green tint
          cScale3:  '#4a2e1e',   // peach tint
          cScale4:  '#4a1e2a',   // red tint
          cScale5:  '#4a3e1a',   // yellow tint
          cScale6:  '#1e3a38',   // teal tint
          cScale7:  '#1e3542',   // sky tint
          cScale8:  '#2b2f5e',   // lavender tint
          cScale9:  '#4a1e40',   // pink tint
          cScale10: '#4a2e2e',   // flamingo tint
          cScale11: '#313244',   // neutral surface
          // Timeline-specific text
          cScaleLabel0:  '#cdd6f4',
          cScaleLabel1:  '#cdd6f4',
          cScaleLabel2:  '#cdd6f4',
          cScaleLabel3:  '#cdd6f4',
          cScaleLabel4:  '#cdd6f4',
          cScaleLabel5:  '#cdd6f4',
          cScaleLabel6:  '#cdd6f4',
          cScaleLabel7:  '#cdd6f4',
          cScaleLabel8:  '#cdd6f4',
          cScaleLabel9:  '#cdd6f4',
          cScaleLabel10: '#cdd6f4',
          cScaleLabel11: '#cdd6f4',
        },
      });
      mermaid.default.run({
        querySelector: '.mermaid',
      });
    });
  }, []);

  return null;
}
