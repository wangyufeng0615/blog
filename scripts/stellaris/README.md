# 群星文库发布快照

维护中的页面与原始导出保留于相邻项目 `../stellaris-text-export/web-library/`。
博客发布受控静态快照 `posts/20261023/`，固定入口 `/stellaris/`；不依赖本机服务，不使用 ChatGPT 托管。

更新页面后执行：

```sh
cd ../stellaris-text-export/web-library
python3 build_agent_exports.py
cd /Users/bytedance/personal/blog
node scripts/stellaris/sync.mjs --source /Users/bytedance/personal/stellaris-text-export/web-library/dist
npm test
npm run build
npm run check:output
```

`release.json` 记录快照内文件的 SHA-256；不代表已部署。GitHub Pages workflow 成功且线上检查后才算发布。
不要把原始提取日期（2026-10-12）改成页面发布日期，也不要把此版本描述为游戏最新版本。
`overview.md` 是机器读取概览，不能改为文章根目录 `index.md`，否则博客会优先将其当作 Markdown 文章而跳过交互页面。

## AI / Agent 读取

`llms.txt` → `catalog.json` → 235 个 namespace/source 分组（完整计数以目录为准），每个分组均有不依赖 JavaScript 的 JSON 与 Markdown。`lookup/<prefix>.json` 用 key 的前两位小写索引精确定位，再用 `namespace:key` 找条目，避免跨 namespace 同名覆盖。页面永久链接通过 `?entry=<namespace:key>&lang=zh|en` 还原单条文案。
其余命名、脚本候选、原始文件仍全部保留在 `manifest.json` 指向的 gzip JSON 分块与原始 ZIP 中；脚本候选不是自然语言文案计数。

资料依据：
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://schema.org/Dataset
- https://llmstxt.org/ （社区提案，不保证 AI 自动发现或收录）
