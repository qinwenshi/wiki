# 📖 Leon 的个人知识库

**思想、人物、公司、方法论——来自书与笔记的知识地图**

🌐 **线上访问：** https://wiki.tokbook.cn/

---

## 项目简介

这是一个以 Wikipedia 为设计原型的个人知识管理系统。不同于普通笔记工具，它将多本书籍的内容消化、提炼，生成相互链接的 wiki 词条，形成一张可浏览、可搜索的知识地图。

所有内容来源于真实书籍，由 AI Agent 辅助提炼整理，非机械摘抄，而是结构化的知识重建。

> **灵感来源：** 本项目受 [wiki-gen-skill](https://gist.github.com/farzaa/c35ac0cfbeb957788650e36aabea836d#file-wiki-gen-skill-md) 启发——一个将个人日记、笔记、消息等私人数据编译成个人知识 wiki 的 AI Skill。原 Skill 定义了"你是一位作家，而非档案员"的核心理念：读懂条目的含义，写出捕捉理解的文章，而不是机械归档。本项目在此基础上扩展，以书籍为数据源，搭建了完整的 Next.js 展示层。

---

## 内容来源

| 书目 | 类型 | 主要词条 |
|------|------|---------|
| 王兴饭否合集（2007–2020，88万字） | PDF | 王兴、创业与商业、三个历史阶段 |
| 张一鸣近10年微博 | PDF | 张一鸣、产品与算法思维、字节跳动 |
| 张小龙饭否电子书 | PDF | 张小龙、微信产品哲学 |
| 饭否小字报 2009–2018 | PDF | 饭否文化与社区 |
| 大道段永平投资问答录 | PDF | 段永平、段永平投资哲学、步步高、价值投资 |
| 格鲁夫给经理人的第一课 | EPUB | 安迪·格鲁夫、高产出管理、OKR |
| 维特根斯坦传 | EPUB | 维特根斯坦、维特根斯坦哲学 |
| 俞军产品方法论 | EPUB | 俞军、俞军产品方法论、用户价值模型 |
| 王慧文清华产品课 | PDF | 王慧文、王慧文产品课、供需关系与产品设计 |
| 金字塔原理2 | EPUB | 金字塔原理、写作结构技术、逻辑思维框架 |
| 推荐系统实践 | EPUB | 推荐系统概论、协同过滤算法、推荐系统工程实践 |

---

## 知识库结构

**44 篇文章，9 个目录：**

```
content/
├── people/        # 人物传记（8篇）
│   └── 王兴、张一鸣、张小龙、王慧文、俞军、段永平、安迪·格鲁夫、维特根斯坦
├── companies/     # 公司词条（3篇）
│   └── 美团、字节跳动、步步高
├── philosophies/  # 哲学与方法论（13篇）
│   └── 俞军产品方法论、王慧文产品课、微信产品哲学、段永平投资哲学、金字塔原理...
├── techniques/    # 技术框架（6篇）
│   └── 协同过滤算法、高产出管理、OKR、写作结构技术...
├── knowledge/     # 通用知识领域（7篇）
│   └── 推荐系统概论、饭否文化与社区、经济与投资...
├── eras/          # 历史阶段（3篇）
│   └── 2007-2010 早期探索、2011-2015 美团崛起、2016-2020 成熟期
├── life/          # 生活观察（2篇）
├── reading/       # 阅读书单（1篇）
└── _index.md      # 全局索引
```

---

## 技术架构

- **框架：** Next.js 16（App Router，Turbopack）
- **数据层：** 本地 Markdown 文件（`content/` 目录），无数据库
- **渲染：** `remark` + `remark-gfm` + `remark-html` 将 Markdown 转为 HTML
- **图表：** Mermaid.js 客户端渲染（`MermaidRenderer` 组件）
- **搜索：** 全文关键词搜索（`/api/search`）
- **反向链接：** 自动计算 `[[wikilink]]` 引用（`/api/backlinks`）
- **图片代理：** `/api/image-proxy` 转发 Wikimedia 图片，规避限速
- **部署：** Vercel（自动 CI/CD）

### 核心文件

| 文件 | 作用 |
|------|------|
| `lib/localwiki.ts` | 数据层：读取 Markdown、构建索引、搜索、反向链接 |
| `components/WikiLayout.tsx` | 全站布局：深色导航、侧边栏、搜索框 |
| `components/MermaidRenderer.tsx` | 客户端 Mermaid 图表渲染 |
| `app/wiki/[...slug]/page.tsx` | 文章页面 |
| `app/page.tsx` | 首页（分类卡片） |
| `Agents.md` | 开发经验总结（12个已知问题与解法） |

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:3000

# 构建生产版本
npm run build
```

### 新增文章

1. 在 `content/<目录>/` 下新建 `.md` 文件，添加 YAML frontmatter：

```markdown
---
title: 文章标题
type: person|philosophy|knowledge|technique|company
description: 一句话描述
tags: [tag1, tag2]
related: ["[[相关文章]]"]
---

# 标题

正文内容...使用 [[wikilinks]] 链接其他词条。
```

2. 在 `components/WikiLayout.tsx` 的 `NAV` 数组中手动添加导航链接。

3. 支持的 Mermaid 图类型：`flowchart`、`timeline`、`mindmap`（推荐，中文兼容好）。**避免使用 `quadrantChart`**（中文兼容性差）。

### 部署到 Vercel

```bash
vercel --prod
```

---

## 已知注意事项

详见 [`Agents.md`](./Agents.md)，核心要点：

- `**粗体**` 后紧跟中文字符需加空格：`**粗体** 后续文字`
- 不支持 `$$LaTeX$$` 公式，用代码块替代
- Mermaid 节点标签中不能有双引号 `"`
- 新增导航条目需手动更新 `WikiLayout.tsx`

---

## 目录语义规范

| 目录 | 存放内容 |
|------|---------|
| `people/` | 具名人物传记 |
| `companies/` | 具名公司词条 |
| `philosophies/` | 特定人物/流派的方法论与智识立场 |
| `techniques/` | 可操作的技术框架与系统方法 |
| `knowledge/` | 通用领域背景知识 |
| `eras/` | 重要历史阶段 |
| `patterns/` | 有规律可循的行为模式 |
| `life/` | 生活与个人观察 |
| `reading/` | 书单与阅读记录 |
