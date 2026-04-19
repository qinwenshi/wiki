import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leon 的个人知识库',
  description: 'Leon 的个人知识库',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
