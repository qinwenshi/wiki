import type { Metadata } from 'next';
import './globals.css';

const BASE_URL = 'https://wiki.tokbook.cn';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Leon 的个人知识库',
    template: '%s · Leon 的个人知识库',
  },
  description: '思想、人物、公司、方法论——来自书与笔记的知识地图。涵盖商业、科技、历史、哲学等领域的个人知识整理。',
  keywords: ['知识库', '读书笔记', '商业', '科技', '历史', '哲学', '人物', '方法论'],
  authors: [{ name: 'Leon' }],
  creator: 'Leon',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: BASE_URL,
    siteName: 'Leon 的个人知识库',
    title: 'Leon 的个人知识库',
    description: '思想、人物、公司、方法论——来自书与笔记的知识地图',
  },
  twitter: {
    card: 'summary',
    title: 'Leon 的个人知识库',
    description: '思想、人物、公司、方法论——来自书与笔记的知识地图',
  },
  robots: {
    index: true,
    follow: true,
  },
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
