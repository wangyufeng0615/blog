# 博客首页重构记录

> 目标：把首页从“文章列表型博客”升级为“工程师主页 + 作品索引 + AI 可读入口”，同时保持当前浅色、朴素、克制的视觉气质。

## 当前状态

- 首页实现：`src/components/HomePage.jsx`
- 主要样式：`src/styles/main.css`
- 文章数据来源：`posts/*/index.md` 与 `posts/*/index.html`
- 构建入口：`scripts/build.js`
- 已有基础：静态 HTML、canonical、Open Graph、JSON-LD、sitemap、robots.txt

## 设计原则

- 首页不是营销落地页，而是一个公开的工程师工作台。
- 信息密度要高，但保持可扫描：作品、工具、文章、AI 入口都应能快速定位。
- 延续现有配色：背景 `#faf9f7`，文字 `#3d3d3d`，accent `#5c7a6f`。
- 不走深色、强渐变、夸张插画、低质卡片墙路线。
- 优先使用语义化 HTML 与静态可读内容，避免把核心信息藏在复杂交互里。

## 首页信息架构草案

1. 顶部身份区
   - 姓名：王雨峰
   - 一句说明：写代码、做工具、做地图与 AI 相关的小实验
   - 快捷入口：GitHub、Email、RSS、AI agents

2. Featured Work
   - 展示最重要的作品，例如“和 AI 一起探索地球”
   - 采用更高权重的版式，但保持克制
   - 每个作品需要：名称、说明、类型、年份、访问链接

3. Tools / Experiments
   - 展示 aimeter、提前退休计算器、aitop、LOF 基金溢价计算器等
   - 更像工程索引，不做大卡片堆砌

4. Writing
   - 文章仍然保留，但作为主页的一部分
   - 默认展示近期文章，提供 All posts 入口

5. AI-readable
   - 在页面上提供可见入口
   - 在构建产物中补充 `/llms.txt`、`/posts.json`、`/projects.json`、可选 `/feed.xml`

## AI 可读增强清单

- [x] 生成 `/llms.txt`：站点简介、重要作品、文章索引、机器可读文件入口。
- [x] 生成 `/projects.json`：作品名称、描述、URL、类型、标签、年份。
- [x] 生成 `/posts.json`：文章标题、日期、URL、摘要、类型。
- [ ] 可选生成 `/feed.xml`：给 RSS/阅读器/搜索系统使用。
- [x] 强化首页 JSON-LD：`WebSite` + `Person` + `ItemList`。
- [ ] 文章页 JSON-LD 保持 `Article`，后续可补充 `dateModified`。
- [ ] robots.txt 精细化：区分搜索类 bot 与训练类 bot 的策略。
- [ ] sitemap 使用真实、可信的 `lastmod`。

## 首版实现计划

- [x] 建立重构记录文档。
- [x] 抽出首页作品数据，避免作品只存在于 Sidebar 内部。
- [x] 重写首页结构：身份区、精选作品、工具实验、近期文章、AI 入口。
- [x] 更新 CSS：扩大首页布局宽度，建立新的浅色工程主页样式。
- [x] 构建并本地预览。
- [x] 移动端宽度自检。
- [x] 更新本文档进度与后续 TODO。

## 决策记录

- 2026-05-07：首版先实现可预览的新首页，不先做完整 AI 文件生成；AI 可读层在首页设计稳定后补齐。
- 2026-05-07：首版保留当前色系与系统字体，不引入图片型 hero 或重视觉资产。
- 2026-05-07：实现过程中将基础 AI 文件一起补齐，避免首页出现空链接。
- 2026-05-07：本地预览地址为 `http://localhost:4173/`；使用 Playwright 截图检查桌面与 390px 移动端。
- 2026-05-08：首版反馈是信息密度不够、专业感不足、姓名过大、AI agents 模块过重。二版改为紧凑的工程索引页：小号身份区、作品表格化、AI 入口内联化。

## 二版调整计划

- [x] 移除大块 `For AI agents` 面板，改成顶部/页脚内联机器可读入口。
- [x] 降低姓名字号，提升正文、项目描述、文章标题等信息字号的可读性。
- [x] 把作品展示从大卡片改成更密集的项目索引表。
- [x] 增加紧凑的 profile / focus / stats 信息区，提高专业感。
- [x] 重新构建并检查桌面、移动端截图。

## 三版（2026-06-11）：推翻二版，回归单栏文档式

二版的问题：Profile / Index / Machine-readable 面板信息是凑出来的（Location、stats 数字没有真实价值），项目表格的 type/status 列是噪音，文章列表折叠掉了大半归档，整体堆砌感重。

三版方案：
- 单栏文档式布局，最大宽度 720px；移除三栏面板、统计数字、项目表格、文章折叠
- 头部：小头像 + 姓名 + 原有 bio + GitHub / Email
- 作品：每项一行（名称 — 描述），恢复站主原始描述文案（"我和好朋友玩的很开心""虽然能用，但效果不太好"），不用二版改写的版本
- 文章：全量展示不折叠，按年份分组，年份在左侧独立列（移动端年份独占一行），日期用等宽字体 MM-DD
- 机器可读入口收进页脚一行（llms.txt / posts.json / projects.json / sitemap.xml）
- 保留二版的构建层产物：llms.txt、posts.json、projects.json、JSON-LD `@graph`
- 删除不再使用的 Sidebar.jsx、PostList.jsx；项目数据统一在 `src/data/projects.js`（单一 `allProjects` 数组）

验证：
- `npm run build` 通过
- 桌面 1280px 与移动 390px 截图检查通过；puppeteer 实测 390px 下 `scrollWidth === clientWidth`，无横向滚动
- 文章页样式不受影响（main.css 重写只动了首页部分）

## 四版（2026-06-11）：推翻全部历史风格，按"文集/篝火"概念重做

站主要求完全忽略此前所有设计思路，由 Claude 读文章后按对站主的理解重新设计。

设计依据（来自文章）：
- 《最后一次博客的重构》：博客是打算超越生命长度维护的长期个人档案，"小小的赛博空间"
- 《AI时代的篝火》：定位是 AI 内容泛滥时代里被信任的人类信息源，服务少数忠实读者
- 《2025年度碎碎念》："哪怕让我多看一秒都算浪费生命"——零注意力浪费
- 文风偏文人（王小波、《我与地坛》），不是技术博客腔

四版方案（概念：一份跨越七年的个人文集）：
- 首页改宋体排版（Georgia + Source Han Serif / Songti SC），日期、联系方式、机器入口用等宽字体
- 全站配色换为暖纸色系：纸 `#f7f3ea`、墨 `#2d2a24`、余烬赭石 `#a4512c`（替换原墨绿 accent），CSS 变量管理
- 时间为唯一组织轴：63 篇全量展示，年份小节（年份 + 篇数 + 细线），节内双栏（移动端单栏）
- 头部只有姓名、一句话（用站主自己的"小小的赛博空间"措辞）、GitHub / Email；去掉头像
- 页脚以《AI时代的篝火》原句作题记收尾，机器可读入口等宽小字一行
- 注意：没有用"100% 由人类写作"做 tagline，因 20260425 研究报告是 AI 协作产物
- 文章页只跟随换色，仍是无衬线正文；如需统一为宋体是一行改动，待站主定

验证：
- `npm run build` 通过；puppeteer 实测 390px 无横向滚动；桌面 1440 / 移动 390 截图通过
- 整页高度约 2300px（1440 宽下），全部归档一页可达

## 后续待讨论

- 首页是否中英混排：建议中文为主，保留一行英文身份句。
- AI bot 策略：建议允许搜索/用户请求类 bot，训练类 bot 由站点主人单独决定。
- 是否生成 RSS/Atom feed。
- 是否继续调整首屏语气：更个人、更工程、更作品集，三者可以微调比例。

## 验证记录

- 2026-05-07：`npm run build` 通过，生成 62 篇文章、`llms.txt`、`posts.json`、`projects.json`、`sitemap.xml`、`robots.txt`。
- 2026-05-07：`curl http://localhost:4173/projects.json` 可解析，项目数为 5。
- 2026-05-07：`curl http://localhost:4173/posts.json` 可解析，文章数为 62。
- 2026-05-07：Playwright 桌面截图：`output/playwright/home-desktop.png`。
- 2026-05-07：Playwright 390px 移动端截图：`output/playwright/home-mobile.png`。
- 2026-05-07：390px 移动端 `documentElement.scrollWidth === clientWidth`，无横向滚动。
- 2026-05-07：Playwright console 检查无 error/warning。
- 2026-05-08：二版 `npm run build` 通过，机器可读文件继续生成。
- 2026-05-08：二版桌面截图：`output/playwright/home-v2-desktop.png`。
- 2026-05-08：二版 390px 移动端截图：`output/playwright/home-v2-mobile.png`。
- 2026-05-08：二版桌面与 390px 移动端 `documentElement.scrollWidth === clientWidth`，无横向滚动。
- 2026-05-08：二版 Playwright console 检查无 error/warning。
