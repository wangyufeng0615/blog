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
    if (!fs.existsSync(mdFile)) continue;

    const content = fs.readFileSync(mdFile, 'utf-8');
    const { data, content: mdContent } = matter(content);

    if (data.draft) continue;

    // 渲染 markdown 并修复图片路径
    let htmlContent = md.render(mdContent);
    // 将相对图片路径 images/xxx 转换为 /posts/slug/images/xxx
    htmlContent = htmlContent.replace(/src="images\//g, `src="/posts/${dir}/images/`);

    posts.push({
      slug: dir,
      title: data.title || '无标题',
      date: formatDate(data.date),
      rawDate: data.date,
      content: htmlContent,
      dir,
    });
  }

  // 按日期降序排序
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

// 复制图片资源
function copyImages(posts) {
  for (const post of posts) {
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
const homeHtml = htmlTemplate({ title: '王雨峰的博客', content: homeContent, css });
console.log('HOME:' + JSON.stringify(homeHtml));

// 生成文章页
for (const post of posts) {
  const postContent = renderToString(
    React.createElement(PostPage, {
      title: post.title,
      date: post.date,
      content: post.content,
    })
  );
  const postHtml = htmlTemplate({
    title: post.title + ' - 王雨峰的博客',
    content: postContent,
    css,
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

// 主函数
async function build() {
  console.log('\n🔨 Building blog...\n');

  setupDirs();
  const posts = readPosts();
  const css = readCSS();

  console.log(`Found ${posts.length} posts\n`);

  await buildPages(posts, css);
  copyImages(posts);
  copyPublicFiles();
  cleanup();

  console.log('\n✅ Build complete! Output: dist/\n');
}

build().catch(err => {
  console.error('Build failed:', err);
  cleanup();
  process.exit(1);
});
