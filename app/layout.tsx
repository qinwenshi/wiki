import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leon 的个人知识库',
  description: 'Leon 的个人知识库',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Wikipedia Vector 2022 skin CSS */}
        <link
          rel="stylesheet"
          href="https://en.wikipedia.org/w/load.php?lang=en&modules=skin.styles&only=styles&skin=vector-2022"
        />
        <link
          rel="stylesheet"
          href="https://en.wikipedia.org/w/load.php?lang=en&modules=site.styles&only=styles&skin=vector-2022"
        />
        <link
          rel="stylesheet"
          href="https://en.wikipedia.org/w/load.php?lang=en&modules=ext.cite.styles&only=styles&skin=vector-2022"
        />
      </head>
      <body className="skin-vector skin-vector-2022">
        {children}
      </body>
    </html>
  );
}
