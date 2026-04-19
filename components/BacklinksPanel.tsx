interface Props {
  backlinks: string[];
  slug: string;
}

export default function BacklinksPanel({ backlinks, slug: _slug }: Props) {
  if (!backlinks.length) return null;
  return (
    <div className="backlinks-panel">
      <h3>← 链接到此页 ({backlinks.length})</h3>
      <ul className="backlinks-list">
        {backlinks.map((link) => (
          <li key={link}>
            <a href={`/wiki/${encodeURIComponent(link)}`}>{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
