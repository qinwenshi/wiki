# Agents.md — Wiki Clone 项目已知问题与解法

本文件记录在构建和维护这个 Next.js wiki 项目过程中遇到的关键 bug，供未来 AI Agent 参考，避免重复踩坑。

---

## 1. Mermaid：节点标签中的双引号导致语法错误

**现象：** flowchart 渲染报 `Syntax error in text, mermaid version 11.x`

**原因：** Mermaid flowchart 中，节点标签用 `[]` 包裹时，内部不能出现双引号 `"`，否则解析器报错。

```markdown
❌ B --> E[聚焦执行\n王兴"避免过早优化"]
✅ B --> E[聚焦执行\n避免过早优化]
```

**解法：** 移除节点标签中的双引号，或改用单引号描述。

---

## 2. Mermaid：quadrantChart 中文标签兼容性差

**现象：** `quadrantChart` 类型图表在 Mermaid v11 下渲染报语法错误，尤其含中文。

**原因：**
- `x-axis` / `y-axis` 中文标签必须用英文双引号包裹
- `quadrant-N` 标签不能含中文冒号 `：`、全角括号 `（）` 等特殊字符
- 数据点名称含中文时有时也会触发解析器 bug

**解法：** 直接放弃 `quadrantChart`，改用 `flowchart TD/LR` 表达相同的矩阵/分类逻辑：

```markdown
❌ quadrantChart
    x-axis 低成熟度 --> 高成熟度
    quadrant-1 双向沟通：共同制定目标

✅ flowchart LR
    A[低成熟度] --> B[结构化指令]
    B --> C[中等成熟度] --> D[双向沟通]
    D --> E[高成熟度] --> F[授权自主]
```

---

## 3. Mermaid：`\n` 换行在 flowchart 节点中有效，但双引号破坏解析

**现象：** 有时 `\n` 换行正常，有时报错。

**原因：** `\n` 本身在 flowchart 节点标签中是合法的换行符。真正引起报错的是节点内的 `"` 字符，而非 `\n`。

**结论：** 节点标签中可以用 `\n`，但绝不能出现 `"`。

---

## 4. Markdown 粗体渲染：`**中文**` 紧跟中文字符不生效

**现象：** 页面直接显示 `**效用（用户获得的价值）**包括：` 而非加粗文本。

**原因：** remark（CommonMark 规范）要求粗体关闭标记 `**` 后，如果紧跟非空白字符（尤其是 CJK 字符），解析器可能无法识别为合法的强调结束标记。

**解法：**
```markdown
❌ **效用（用户获得的价值）**包括：
✅ **效用（用户获得的价值）** 包括：   ← 加一个空格
✅ #### 效用（用户获得的价值）包括：   ← 改用子标题更稳妥
```

批量修复脚本：
```python
import re, glob
pattern = re.compile(r'\*\*([^*]+)\*\*([^\s*\n])')
for f in glob.glob('content/**/*.md', recursive=True):
    with open(f) as fp: content = fp.read()
    new = pattern.sub(r'**\1** \2', content)
    if new != content:
        with open(f, 'w') as fp: fp.write(new)
```

⚠️ **注意：** 不要在开头 `**` 后加空格（`** text**`），这会让整个粗体失效。只在结尾 `**` 后加空格。

---

## 5. Markdown 粗体：脚本错误地在开头 `**` 后加空格

**现象：** 修复脚本运行后，粗体变成 `** text**` 形式，反而完全不渲染。

**原因：** 如果先手动 edit 了部分行（如 `**text** 包括：`），再运行上面的正则脚本，可能因为文件已改变导致匹配错位，产生 `** text**` 这种形式。

**解法：** 运行清理脚本修复开头多余空格：
```python
import re, glob
pattern = re.compile(r'\*\* ([^*\n]+)\*\*')
for f in glob.glob('content/**/*.md', recursive=True):
    with open(f) as fp: content = fp.read()
    new = pattern.sub(r'**\1**', content)
    if new != content:
        with open(f, 'w') as fp: fp.write(new)
```

---

## 6. LaTeX 公式 `$$...$$` 无法渲染

**现象：** 页面直接显示 `$$\text{用户价值} = \text{新体验} - ...$$` 原始字符串。

**原因：** 项目未集成 KaTeX 或 MathJax，remark 不处理 `$$` 语法，直接输出为纯文本。

**解法：** 将 `$$` 公式替换为代码块：
```markdown
❌ $$\text{用户价值} = \text{新体验} - \text{旧体验} - \text{替换成本}$$

✅ ```
用户价值 = 新体验 - 旧体验 - 替换成本
\```
```

**长期方案：** 如需支持公式渲染，可集成 `remark-math` + `rehype-katex`，并在 `next.config.ts` 中添加 KaTeX CSS。

---

## 7. Wikimedia 图片 404 / 429 问题

**现象：** 文章中的图片显示为破图（浏览器图标 + alt 文字）。

**原因：**
- **404**：Wikimedia 路径拼错，或文件已被删除/移动
- **429**：Wikimedia 限速，直接请求 thumbnail URL 被拦截

**解法：**
1. 已添加 `/api/image-proxy` 路由，所有外部图片通过代理转发（添加正确的 `User-Agent` 和 `Referer` header）
2. 无法确认存在的图片直接删除，不保留破图占位

**验证方法：** 新增图片前用 curl 确认：
```bash
curl -s -o /dev/null -w "%{http_code}" "https://upload.wikimedia.org/..."
# 200 = 可用，404 = 不存在，429 = 被限速（proxy 可解决）
```

---

## 8. 文章分类错误：knowledge/ 目录放了非通用知识

**现象：** 侧边栏"知识领域"下出现哲学类、技术类文章。

**原因：** 内容生成 Agent 未严格区分目录语义，将特定人物的方法论、技术框架都归入 `knowledge/`。

**正确的目录语义（参考 wiki skill）：**

| 目录 | 放什么 |
|------|--------|
| `knowledge/` | 通用领域知识（历史、科技、经济等背景知识） |
| `philosophies/` | 特定人物/流派的articulated智识立场与方法论 |
| `techniques/` | 可操作的技术框架与系统方法 |
| `companies/` | 具名公司条目 |
| `people/` | 具名人物传记 |
| `patterns/` | 有触发-机制-结果结构的行为模式 |

**已修正的移动：**
- `knowledge/产品与算法思维` → `philosophies/`
- `knowledge/高产出管理` → `techniques/`
- `knowledge/供需关系与产品设计` → `philosophies/`
- `knowledge/用户价值模型` → `philosophies/`
- `patterns/创业与商业` → `philosophies/`

---

## 9. 侧边栏导航硬编码：新增文章不自动出现

**现象：** 新生成的文章在知识库中存在，但侧边栏导航看不到。

**原因：** `components/WikiLayout.tsx` 中的 `NAV` 数组是硬编码的，不动态读取文件系统。

**解法：** 每次新增文章后，手动更新 `WikiLayout.tsx` 中对应分类的 `items` 数组：

```typescript
// components/WikiLayout.tsx
const NAV = [
  {
    label: '👤 人物',
    items: [
      { slug: '王兴', label: '王兴' },
      // 新增文章手动加在这里
    ],
  },
  ...
]
```

**长期方案：** 将 `getAllArticles()` 的结果在构建时传入 Layout，实现动态导航。

---

## 10. Next.js 16 async params

**现象：** 文章页面报 runtime error，`params.slug` 为 undefined。

**原因：** Next.js 15+ 中，页面组件的 `params` 是 Promise，必须 `await`。

```typescript
❌ export default function Page({ params }: { params: { slug: string[] } }) {
     const slug = params.slug;

✅ export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
     const { slug } = await params;
```

---

## 11. React 水合错误（Hydration Mismatch）

**现象：** 页面报 `Hydration failed because the initial UI does not match what was rendered on the server`。

**原因：** 修改了 `WikiLayout.tsx` 后，Next.js dev server 缓存了旧 HTML，而新 JS bundle 生成了不同的 DOM 结构。

**解法：**
```bash
# 1. 杀掉端口占用
lsof -ti:3000 | xargs kill
# 2. 清除 Next.js 构建缓存
rm -rf .next
# 3. 重启开发服务器
npm run dev
```

---

## 12. Mermaid 在 Next.js 中必须客户端渲染

**现象：** Mermaid 图表在服务端渲染时报错或不显示。

**原因：** Mermaid 依赖 DOM API（`document`、`window`），无法在 Node.js 服务端运行。

**解法：**
1. 在 `markdownToHtml()` 中，先将 ` ```mermaid ``` ` 块替换为 `MERMAID_PLACEHOLDER_N` 占位符
2. remark 处理完 Markdown 后，将占位符替换回 `<div class="mermaid">...</div>`
3. 创建 `'use client'` 的 `MermaidRenderer` 组件，在 `useEffect` 中调用 `mermaid.run()`

```typescript
// components/MermaidRenderer.tsx
'use client';
import { useEffect } from 'react';
export default function MermaidRenderer() {
  useEffect(() => {
    import('mermaid').then(m => {
      m.default.initialize({ startOnLoad: false, theme: 'default' });
      m.default.run({ querySelector: '.mermaid' });
    });
  }, []);
  return null;
}
```

---

## 13. 内容摄取：如何确保不丢失关键信息

**场景：** 从书籍（PDF/EPUB）中提取内容，写成 wiki 词条。

**错误模式：**
看了章节标题 + 每章前几百字，产生"认识感"就开始动笔写词条。这正是费曼本人批判的错误——**把"认识感"误判为"理解感"**。关键概念、原创案例、操作细节全部藏在后续正文里，被跳过了。

以《费曼学习法》为例，第一次写出的文章遗漏了：
- 费曼向普林斯顿教授发起挑战的核心案例
- 费曼父亲"鸟的名字"的故事（全书最深刻的结尾）
- 农民让孩子回家教自己的故事（以教代学的最佳案例）
- "盲维"概念（书中原创比喻）
- 绿灯思维 vs 红灯思维
- 三次复述的具体操作步骤（每次的不同机制）
- 第三次复述的最高目标是"预测问题"（不只是解释和解决）

**根本原因：** 250KB 的书，output 被截断了，只读了前 500 chars 的 preview 就误以为读完了。

**正确做法：**

1. **先统计总量**：`wc -c` 看文件大小，`python` 列出每章字数，知道规模再决定读法
2. **全文逐章读完**：用 `view` 工具分段阅读，每次 `view_range` 推进约400行，直到最后一行
3. **读完再动笔**：不要边读边写，等所有章节都读完、核心观点汇总后再写词条
4. **验证覆盖率**：写完后对照章节列表，确认每章的核心观点都有对应内容

**检查脚本（提取所有章节 + 字数）：**
```python
import json
with open('/tmp/book.json') as f:
    chapters = json.load(f)
for i, c in enumerate(chapters):
    print(f"{i:02d}. [{len(c['content']):5d}字] {c['name']}")
```

**分段读取模式：**
```
view /tmp/feynman_readable.txt [1, 400]
view /tmp/feynman_readable.txt [400, 800]
...直到最后一行
```

**判断"读完了"的标准：** 不是"我大概了解这本书在讲什么"，而是"我能列出每一章的核心观点，并且知道哪些是书中的原创案例、原话和比喻"。

## 14. Mermaid 代码围栏必须用 ` ```mermaid `，不能直接用图表类型名

**现象：** 图表显示为纯文本代码块，不渲染成图形。

**根本原因：** remark-mermaid 插件识别的围栏标识符是 `mermaid`，不是图表类型名（如 `flowchart`、`timeline`）。用 ` ```flowchart ` 开头会被当成普通代码块处理。

**错误写法：**
````
```flowchart LR
    A --> B
```
````

**正确写法：**
````
```mermaid
flowchart LR
    A --> B
```
````

**为什么会犯这个错：** SKILL.md 只列了支持的图表类型（`flowchart LR/TD` 等），没有写清楚代码块围栏本身必须是 `mermaid`。已同步修正 SKILL.md。
