# 王雨峰的博客

一个由 Node.js 在构建期生成的纯静态个人网站。首页和 Markdown 文章使用
React SSR 模板预渲染；自定义 HTML 文章与独立前端项目按目录发布。生产站点：
<https://wangyufeng.org>。

## 内容类型

### Markdown 文章

目录：`posts/YYYYMMDD[-N]/index.md`。

```markdown
---
title: 文章标题
date: 2026-07-16
draft: false
---

正文
```

- 构建输出为 `dist/posts/<slug>.html`。
- `images/` 会复制到 `dist/posts/<slug>/images/`。
- 正文中的 `images/...` 路径会改写为站点绝对文章资源路径。
- `draft: true` 的文章不会进入输出、索引或 sitemap。

### 自定义 HTML 文章

目录：`posts/YYYYMMDD[-N]/index.html`，同目录必须有 `meta.json`：

```json
{
  "title": "页面标题",
  "date": "2026-07-16",
  "description": "列表和搜索摘要",
  "draft": false
}
```

整个目录会复制到 `dist/posts/<slug>/`，`meta.json` 不发布。构建器默认向
`index.html` 注入右下角返回博客按钮；只有明确需要全屏无入口页面时才设置
`"noHeader": true`。同一目录同时存在 `index.md` 和 `index.html` 时，Markdown
优先并打印警告。

### 静态项目与内置应用

- `public/` 在博客页面生成后递归复制到 `dist/`，适合已经验收的静态快照和
  公共资源。
- `apps/ball-moving/` 是独立 Vite 应用；根目录 `npm run build` 会先构建它，
  再复制到 `dist/ball-moving/`。
- `trade_game`（盘感挑战）原先由 Pages CI 拉取私有仓库构建到 `/trade/`。
  2026-10-08 因后端下线撤下，CI 不再构建；最后发布的游戏 commit 为
  `c2b334ad3296bd277100edc6092d3de3e0e07a62`。

不要在 `public/` 手工复制仍有独立源码仓库的应用，除非它明确是受控的发布
快照；源码、发布 artifact 和 commit marker 应保持可区分。

## 本地构建

```bash
npm ci
npm --prefix apps/ball-moving ci
npm run build
npm run preview
```

`npm run build` 会删除并重建 `dist/`，也会创建后清理 `.temp/`。不要在
`dist/` 保存手工文件；需要发布的静态内容应放在 `public/`、`posts/` 或明确的
内置应用源目录。

构建输出还包括：

- `index.html` 与 Markdown 文章页。
- 自定义 HTML 文章目录、图片和 `public/` 内容。
- `projects.json`、`posts.json`、`llms.txt`。
- `sitemap.xml` 与 `robots.txt`。

## 验证

本项目当前没有独立测试或 lint 脚本。文档/文章修改后至少：

1. 运行完整 `npm run build`，确认没有跳过文章、JSON 解析警告或缺失 app 构建。
2. 用 `npm run preview` 打开首页、修改过的文章和移动端视口。
3. 检查文章资源、返回按钮、`projects.json`、`posts.json`、`llms.txt` 与 sitemap。
4. 自定义 HTML 页面额外检查窄屏、44px 触控目标和横向溢出。
5. 仅当 Pages workflow 成功并复核线上 URL 后，才把本地构建描述为已发布。

## 发布流程

`.github/workflows/deploy.yml` 在 `main` push 或手动触发时：

1. 安装博客和 `ball-moving` 依赖。
2. 构建博客与内置应用。
3. 上传单一 GitHub Pages artifact 并部署。

工作流会产生外部发布；本地构建成功不等于 Pages 已更新。Deploy Key、API
Token、证书、私钥、环境文件和服务端配置不得进入文章、日志样例或 Git。

## 代码结构

```text
blog/
├── posts/                       # Markdown / custom HTML 文章源
├── public/                      # 原样复制的静态资源和已验收快照
├── apps/ball-moving/            # 博客内置 Vite 应用
├── src/components/              # 首页与 Markdown 文章 React 模板
├── src/data/                    # 项目和友情链接数据
├── src/styles/main.css          # 站点样式
├── src/templates/html.js        # HTML shell、SEO 与 JSON-LD
├── scripts/build.js             # 文章发现、SSR、复制、索引与 sitemap
├── scripts/copy-apps.js         # 内置应用产物复制
└── dist/                        # 生成输出，不是编辑源
```

## License

仓库中的站点代码、文章和第三方素材可能适用不同许可；复用前请分别核对来源
和文件声明。
