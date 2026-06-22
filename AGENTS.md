# 项目：王雨峰的博客

## 新增文章：自动判断类型

- 用户说"新增文章 / 新增 markdown 文章 / 新增 md 文章" → 在 `posts/YYYYMMDD/` 下创建 `index.md`，frontmatter 写 `title` 和 `date`
- 用户说"新增 web 文章 / 新增前端页面 / 新增自定义页面" → 在 `posts/YYYYMMDD/` 下创建 `index.html` + `meta.json`，资源（CSS/JS/图片）放同一文件夹，用相对路径引用
- slug 默认今天日期 `YYYYMMDD`，重名加 `-2`、`-3`

## Web 文章默认风格

写自定义页面时，没有特殊要求就按以下默认值，不要发挥成 editorial / 深色风：

- **视觉与首页一致**：背景 `#faf9f7`（浅米色），文字 `#3d3d3d`，accent `#5c7a6f`（墨绿），系统字体（`-apple-system, BlinkMacSystemFont, ...`），克制的字号节奏
- **默认保留浮动返回按钮**：不要在 `meta.json` 里写 `"noHeader": true`，除非用户明确说"不要返回按钮"
- **全屏布局**：可以用 `100vw` / `100vh` 充分利用屏幕，不要把内容硬塞回首页那种 860px 容器
- **移动端友好**：必须带 viewport meta 标签；用 `clamp()` / 媒体查询做响应式字号和间距；触控目标至少 44px；横向不出现滚动条；在窄屏（≤480px）下自检一遍再交付

只有在用户明确说"做一个深色的 / 做一个有视觉冲击的 / 自由发挥"时，才偏离上面的默认。
