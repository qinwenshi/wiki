'use client';

import { useEffect, useState } from 'react';

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [entries, setEntries] = useState<TocEntry[]>([]);

  useEffect(() => {
    const headings = document.querySelectorAll('.mw-parser-output h2, .mw-parser-output h3');
    const toc: TocEntry[] = [];
    headings.forEach((h) => {
      const heading = h as HTMLElement;
      const id = heading.id || heading.querySelector('[id]')?.id || '';
      const text = heading.textContent?.replace(/\[edit\]/g, '').trim() || '';
      const level = parseInt(heading.tagName[1]);
      if (id && text) {
        toc.push({ id, text, level });
      }
    });
    setEntries(toc);
  }, []);

  if (entries.length < 3) return null;

  return (
    <div className="wiki-toc" id="toc">
      <div className="wiki-toc-title">Contents</div>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id} style={{ marginLeft: (entry.level - 2) * 16 }}>
            <a href={`#${entry.id}`}>{entry.text}</a>
          </li>
        ))}
      </ol>
    </div>
  );
}
