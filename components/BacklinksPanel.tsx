interface Props {
  backlinks: string[];
  slug: string;
}

export default function BacklinksPanel({ backlinks, slug: _slug }: Props) {
  if (!backlinks.length) return null;
  return (
    <div style={{ marginTop: 32, borderTop: '1px solid #a2a9b1', paddingTop: 16 }}>
      <h3>← 链接到此页</h3>
      <ul>
        {backlinks.map((link) => (
          <li key={link}>
            <a href={`/wiki/${encodeURIComponent(link)}`} style={{ color: '#3366cc' }}>
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
