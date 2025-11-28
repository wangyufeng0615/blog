# 王雨峰的博客

一个简约的静态博客，使用 React 预渲染生成纯静态 HTML。

## 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                        构建时 (Node.js)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   posts/*.md  ──→  gray-matter  ──→  markdown-it  ──→      │
│   (Markdown)      (解析frontmatter)   (转HTML)              │
│                                                             │
│                           ↓                                 │
│                                                             │
│               React 组件 + renderToString                   │
│                           ↓                                 │
│                                                             │
│                    静态 HTML 文件                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 核心组件

| 组件 | 职责 | 技术选择 |
|------|------|----------|
| Markdown 解析器 | 解析 frontmatter + 转 HTML | gray-matter + markdown-it |
| React 组件 | 页面模板 (列表页、详情页) | React 18 |
| 预渲染引擎 | React → 静态 HTML | react-dom/server |
| 构建脚本 | 编排整个构建流程 | Node.js |
| 样式 | 简约科幻风格 | 原生 CSS |

## 目录结构

```
blog/
├── posts/                    # 文章源文件
│   ├── 20190101/
│   │   ├── index.md
│   │   └── images/
│   └── ...
├── src/
│   ├── components/           # React 组件
│   │   ├── Layout.jsx
│   │   ├── PostList.jsx
│   │   └── PostDetail.jsx
│   ├── styles/
│   │   └── main.css
│   └── templates/
│       └── html.js
├── scripts/
│   └── build.js              # 构建脚本
├── dist/                     # 输出目录
├── package.json
└── README.md
```

## 使用方法

```bash
# 安装依赖
npm install

# 构建静态文件
npm run build

# 本地预览
npm run preview
```

## 依赖

- react / react-dom - 组件渲染
- markdown-it - Markdown 转 HTML
- gray-matter - 解析 frontmatter
