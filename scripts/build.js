import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build as esbuild } from 'esbuild';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const DIST_DIR = path.join(ROOT, 'dist');
const STYLES_FILE = path.join(ROOT, 'src/styles/main.css');
const TEMP_DIR = path.join(ROOT, '.temp');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// 清理并创建输出目录
function setupDirs() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }
  fs.mkdirSync(DIST_DIR);
  fs.mkdirSync(path.join(DIST_DIR, 'posts'));
  fs.mkdirSync(TEMP_DIR);
}

// 读取所有文章
function readPosts() {
  const posts = [];
  const dirs = fs.readdirSync(POSTS_DIR).filter(dir => {
    const stat = fs.statSync(path.join(POSTS_DIR, dir));
    return stat.isDirectory() && /^\d{8}/.test(dir);
  });

  for (const dir of dirs) {
    const mdFile = path.join(POSTS_DIR, dir, 'index.md');
    const htmlFile = path.join(POSTS_DIR, dir, 'index.html');
    const hasMd = fs.existsSync(mdFile);
    const hasHtml = fs.existsSync(htmlFile);

    if (hasMd && hasHtml) {
      console.warn(`⚠ ${dir} 同时存在 index.md 和 index.html，使用 index.md`);
    }

    if (hasMd) {
      const content = fs.readFileSync(mdFile, 'utf-8');
      const { data, content: mdContent } = matter(content);
      if (data.draft) continue;

      let htmlContent = md.render(mdContent);
      htmlContent = htmlContent.replace(/src="images\//g, `src="/posts/${dir}/images/`);

      const plainText = mdContent.replace(/[#*`\[\]()!]/g, '').replace(/\n/g, ' ').trim();
      const description = plainText.slice(0, 120) + (plainText.length > 120 ? '...' : '');

      posts.push({
        slug: dir,
        title: data.title || '无标题',
        date: formatDate(data.date),
        rawDate: data.date,
        isoDate: data.date ? new Date(data.date).toISOString() : '',
        content: htmlContent,
        description,
        dir,
        type: 'markdown',
        url: `/posts/${dir}.html`,
      });
    } else if (hasHtml) {
      const metaFile = path.join(POSTS_DIR, dir, 'meta.json');
      if (!fs.existsSync(metaFile)) {
        console.warn(`⚠ ${dir}/index.html 缺少 meta.json，跳过`);
        continue;
      }
      let meta;
      try {
        meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
      } catch (e) {
        console.warn(`⚠ ${dir}/meta.json 解析失败：${e.message}，跳过`);
        continue;
      }
      if (meta.draft) continue;

      posts.push({
        slug: dir,
        title: meta.title || '无标题',
        date: formatDate(meta.date),
        rawDate: meta.date,
        isoDate: meta.date ? new Date(meta.date).toISOString() : '',
        description: meta.description || '',
        dir,
        type: 'custom',
        url: `/posts/${dir}/`,
        noHeader: !!meta.noHeader,
      });
    }
  }

  posts.sort((a, b) => {
    const dateA = a.rawDate ? new Date(a.rawDate) : new Date(0);
    const dateB = b.rawDate ? new Date(b.rawDate) : new Date(0);
    return dateB - dateA;
  });

  return posts;
}

// 格式化日期
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 读取 CSS
function readCSS() {
  return fs.readFileSync(STYLES_FILE, 'utf-8');
}

// 复制图片资源（仅 markdown 文章）
function copyImages(posts) {
  for (const post of posts) {
    if (post.type !== 'markdown') continue;
    const imagesDir = path.join(POSTS_DIR, post.dir, 'images');
    if (fs.existsSync(imagesDir)) {
      const destDir = path.join(DIST_DIR, 'posts', post.slug, 'images');
      fs.mkdirSync(destDir, { recursive: true });
      const files = fs.readdirSync(imagesDir);
      for (const file of files) {
        fs.copyFileSync(path.join(imagesDir, file), path.join(destDir, file));
      }
      console.log(`✓ posts/${post.slug}/images/`);
    }
  }
}

function copyDirRecursive(src, dest, exclude = []) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 浮动返回按钮：右下角胶囊，毛玻璃质感，自动适配深色背景
const FLOATING_BACK_HTML = `
<style>
  #blog-back-fab {
    position: fixed;
    right: 18px;
    bottom: 18px;
    z-index: 2147483647;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px 8px 12px;
    font: 500 13px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
    color: #2b2b2b;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 999px;
    text-decoration: none;
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 6px 20px rgba(0, 0, 0, 0.08);
    transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
  }
  #blog-back-fab:hover {
    background: rgba(255, 255, 255, 0.92);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06), 0 10px 28px rgba(0, 0, 0, 0.12);
    text-decoration: none;
    color: #2b2b2b;
  }
  #blog-back-fab svg { display: block; opacity: .72; }
  @media (prefers-color-scheme: dark) {
    #blog-back-fab {
      color: #f2f2f2;
      background: rgba(28, 28, 30, 0.55);
      border-color: rgba(255, 255, 255, 0.10);
    }
    #blog-back-fab:hover {
      background: rgba(28, 28, 30, 0.85);
      color: #f2f2f2;
    }
  }
  @media (max-width: 480px) {
    #blog-back-fab { right: 12px; bottom: 12px; padding: 7px 12px 7px 10px; font-size: 12px; }
  }
</style>
<a id="blog-back-fab" href="/" aria-label="返回博客首页">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
  <span>王雨峰的博客</span>
</a>
`;

function injectFloatingBack(html) {
  if (html.includes('</body>')) {
    return html.replace('</body>', `${FLOATING_BACK_HTML}\n</body>`);
  }
  return html + FLOATING_BACK_HTML;
}

// 自定义 HTML 文章：整目录拷贝到 dist/posts/<slug>/，按需注入返回按钮
function buildCustomPosts(posts) {
  for (const post of posts) {
    if (post.type !== 'custom') continue;
    const srcDir = path.join(POSTS_DIR, post.dir);
    const destDir = path.join(DIST_DIR, 'posts', post.slug);
    copyDirRecursive(srcDir, destDir, ['meta.json']);

    const indexFile = path.join(destDir, 'index.html');
    let html = fs.readFileSync(indexFile, 'utf-8');
    if (!post.noHeader) {
      html = injectFloatingBack(html);
    }
    fs.writeFileSync(indexFile, html);
    console.log(`✓ posts/${post.slug}/`);
  }
}

// 使用 esbuild 编译 JSX 并渲染
async function buildPages(posts, css) {
  // 生成渲染脚本
  const renderScript = `
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HomePage } from '../src/components/HomePage.jsx';
import { PostPage } from '../src/components/PostPage.jsx';
import { htmlTemplate } from '../src/templates/html.js';

const posts = ${JSON.stringify(posts)};
const css = ${JSON.stringify(css)};

// 生成首页
const homeContent = renderToString(React.createElement(HomePage, { posts }));
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '王雨峰的博客',
  url: 'https://wangyufeng.org',
  author: {
    '@type': 'Person',
    name: '王雨峰',
    url: 'https://wangyufeng.org'
  }
};
const homeHtml = htmlTemplate({
  title: '王雨峰的博客',
  content: homeContent,
  css,
  url: '/',
  jsonLd: homeJsonLd
});
console.log('HOME:' + JSON.stringify(homeHtml));

// 生成文章页（仅 markdown 类型，自定义 HTML 由 buildCustomPosts 处理）
for (const post of posts) {
  if (post.type !== 'markdown') continue;
  const postContent = renderToString(
    React.createElement(PostPage, {
      title: post.title,
      date: post.date,
      content: post.content,
    })
  );
  const postJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.isoDate,
    author: {
      '@type': 'Person',
      name: '王雨峰',
      url: 'https://wangyufeng.org'
    },
    publisher: {
      '@type': 'Person',
      name: '王雨峰'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://wangyufeng.org' + post.url
    }
  };
  const postHtml = htmlTemplate({
    title: post.title + ' - 王雨峰的博客',
    content: postContent,
    css,
    description: post.description,
    url: post.url,
    date: post.isoDate,
    isArticle: true,
    jsonLd: postJsonLd
  });
  console.log('POST:' + post.slug + ':' + JSON.stringify(postHtml));
}
`;

  const renderScriptPath = path.join(TEMP_DIR, 'render.jsx');
  fs.writeFileSync(renderScriptPath, renderScript);

  // 用 esbuild 编译
  const outfile = path.join(TEMP_DIR, 'render.mjs');
  await esbuild({
    entryPoints: [renderScriptPath],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
    jsx: 'automatic',
    external: ['react', 'react-dom'],
  });

  // 执行渲染脚本
  const { execSync } = await import('child_process');
  const output = execSync(`node ${outfile}`, { encoding: 'utf-8' });

  // 解析输出并写入文件
  const lines = output.trim().split('\n');
  for (const line of lines) {
    if (line.startsWith('HOME:')) {
      const html = JSON.parse(line.slice(5));
      fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
      console.log('✓ index.html');
    } else if (line.startsWith('POST:')) {
      const rest = line.slice(5);
      const colonIdx = rest.indexOf(':');
      const slug = rest.slice(0, colonIdx);
      const html = JSON.parse(rest.slice(colonIdx + 1));
      fs.writeFileSync(path.join(DIST_DIR, 'posts', `${slug}.html`), html);
      console.log(`✓ posts/${slug}.html`);
    }
  }
}

// 清理临时文件
function cleanup() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }
}

// 复制 public 目录下的文件到 dist
function copyPublicFiles() {
  const publicDir = path.join(ROOT, 'public');
  if (!fs.existsSync(publicDir)) return;

  const files = fs.readdirSync(publicDir);
  for (const file of files) {
    const src = path.join(publicDir, file);
    const dest = path.join(DIST_DIR, file);
    const stat = fs.statSync(src);

    if (stat.isFile()) {
      fs.copyFileSync(src, dest);
      console.log(`✓ ${file}`);
    }
  }
}

// 生成 sitemap.xml
function generateSitemap(posts) {
  const siteUrl = 'https://wangyufeng.org';
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  for (const post of posts) {
    const lastmod = post.date || today;
    xml += `  <url>
    <loc>${siteUrl}${post.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml);
  console.log('✓ sitemap.xml');
}

// 生成 robots.txt
function generateRobots() {
  const content = `User-agent: *
Allow: /

Sitemap: https://wangyufeng.org/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), content);
  console.log('✓ robots.txt');
}

// 主函数
async function build() {
  console.log('\n🔨 Building blog...\n');

  setupDirs();
  const posts = readPosts();
  const css = readCSS();

  console.log(`Found ${posts.length} posts\n`);

  await buildPages(posts, css);
  copyImages(posts);
  buildCustomPosts(posts);
  copyPublicFiles();
  generateSitemap(posts);
  generateRobots();
  cleanup();

  console.log('\n✅ Build complete! Output: dist/\n');
}

build().catch(err => {
  console.error('Build failed:', err);
  cleanup();
  process.exit(1);
});
