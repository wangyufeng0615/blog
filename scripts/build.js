import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { build as esbuild } from 'esbuild';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { allProjects } from '../src/data/projects.js';

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

const SITE_URL = 'https://wangyufeng.org';

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

/**
 * Discover publishable Markdown and custom-HTML posts.
 *
 * Markdown wins when both entry formats exist. Custom HTML is listed only when
 * meta.json parses successfully; draft entries never reach indexes or output.
 */
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

      const permalink = normalizeCustomPermalink(meta.permalink, dir);
      const locales = normalizeCustomLocales(meta.locales, permalink, dir);

      posts.push({
        slug: dir,
        title: meta.title || '无标题',
        date: formatDate(meta.date),
        rawDate: meta.date,
        isoDate: meta.date ? new Date(meta.date).toISOString() : '',
        modifiedDate: formatDate(meta.modified || meta.date),
        description: meta.description || '',
        dir,
        type: 'custom',
        url: permalink,
        noHeader: !!meta.noHeader,
        locales,
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

function normalizeCustomLocales(locales, permalink, dir) {
  if (locales == null) return null;
  if (typeof locales !== 'object' || Array.isArray(locales)) {
    throw new Error(`Invalid locales for ${dir}: expected an object`);
  }

  const required = ['zh-CN', 'en'];
  const normalized = {};
  for (const language of required) {
    const locale = locales[language];
    if (!locale || typeof locale !== 'object' || Array.isArray(locale)) {
      throw new Error(`Invalid locales for ${dir}: missing ${language}`);
    }
    for (const field of ['url', 'title', 'description', 'socialTitle', 'socialDescription', 'ogLocale', 'imageAlt']) {
      if (typeof locale[field] !== 'string' || !locale[field].trim()) {
        throw new Error(`Invalid locales for ${dir}: ${language}.${field} is required`);
      }
    }
    normalized[language] = {
      ...locale,
      url: normalizeCustomPermalink(locale.url, dir),
    };
  }

  if (normalized['zh-CN'].url !== permalink) {
    throw new Error(`Invalid locales for ${dir}: zh-CN.url must match permalink`);
  }
  if (!normalized.en.url.startsWith(permalink)) {
    throw new Error(`Invalid locales for ${dir}: en.url must be nested below permalink`);
  }
  return normalized;
}

function normalizeCustomPermalink(value, dir) {
  const fallback = `/posts/${dir}/`;
  if (value == null || value === '') return fallback;
  if (
    typeof value !== 'string' ||
    !/^\/[a-z0-9][a-z0-9/_-]*\/$/.test(value) ||
    value.includes('//') ||
    value.includes('..')
  ) {
    throw new Error(`Invalid permalink for ${dir}: expected an absolute lowercase path ending in /`);
  }
  return value;
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
function floatingBackHtml(language = 'zh-CN') {
  const english = language === 'en';
  const label = english ? 'Back to Wang Yufeng’s blog' : '返回王雨峰的博客首页';
  const text = english ? 'Wang Yufeng’s Blog' : '王雨峰的博客';
  return `
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
<a id="blog-back-fab" href="/" aria-label="${label}">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
  <span>${text}</span>
</a>
`;
}

function injectFloatingBack(html, language) {
  const control = floatingBackHtml(language);
  if (html.includes('</body>')) {
    return html.replace('</body>', `${control}\n</body>`);
  }
  return html + control;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractEnglishCopy(appFile) {
  const source = fs.readFileSync(appFile, 'utf-8');
  const startMarker = 'const COPY = ';
  const endMarker = '// The Chinese copy is authored directly in the HTML';
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Unable to extract COPY from ${appFile}`);
  }

  const expression = source.slice(start + startMarker.length, end).trim().replace(/;$/, '');
  const sandbox = Object.create(null);
  vm.runInNewContext(`copy = (${expression})`, sandbox, { timeout: 1000 });
  if (!sandbox.copy?.en || typeof sandbox.copy.en !== 'object') {
    throw new Error(`COPY.en is missing from ${appFile}`);
  }
  return sandbox.copy.en;
}

function translateStaticCopy(html, copy, sourceName) {
  const expectedKeys = [...html.matchAll(/\bdata-i18n="([^"]+)"/g)].map((match) => match[1]);
  let translated = 0;
  html = html.replace(
    /(<([a-z][\w:-]*)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/gi,
    (match, open, tag, key, body, close) => {
      if (/<[a-z][^>]*>/i.test(body)) {
        throw new Error(`Nested markup is not supported for data-i18n="${key}" in ${sourceName}`);
      }
      if (!(key in copy)) {
        throw new Error(`Missing English copy for data-i18n="${key}" in ${sourceName}`);
      }
      translated += 1;
      return `${open}${escapeHtml(copy[key])}${close}`;
    }
  );
  if (translated !== expectedKeys.length) {
    throw new Error(`Translated ${translated}/${expectedKeys.length} data-i18n nodes in ${sourceName}`);
  }

  const altKeys = [...html.matchAll(/\bdata-i18n-alt="([^"]+)"/g)].map((match) => match[1]);
  let translatedAlts = 0;
  html = html.replace(/<[^>]*\bdata-i18n-alt="([^"]+)"[^>]*>/gi, (element, key) => {
    if (!(key in copy)) {
      throw new Error(`Missing English copy for data-i18n-alt="${key}" in ${sourceName}`);
    }
    if (!/\balt="[^"]*"/i.test(element)) {
      throw new Error(`Missing alt attribute for data-i18n-alt="${key}" in ${sourceName}`);
    }
    translatedAlts += 1;
    return element.replace(/\balt="[^"]*"/i, `alt="${escapeHtml(copy[key])}"`);
  });
  if (translatedAlts !== altKeys.length) {
    throw new Error(`Translated ${translatedAlts}/${altKeys.length} alt attributes in ${sourceName}`);
  }
  return html;
}

function replaceMetaContent(html, selector, value, content) {
  const tagPattern = new RegExp(`<meta\\s+[^>]*${escapeRegExp(selector)}="${escapeRegExp(value)}"[^>]*>`, 'i');
  if (!tagPattern.test(html)) {
    throw new Error(`Missing meta[${selector}="${value}"]`);
  }
  return html.replace(tagPattern, (tag) => {
    if (!/\bcontent="[^"]*"/i.test(tag)) {
      throw new Error(`Missing content on meta[${selector}="${value}"]`);
    }
    return tag.replace(/\bcontent="[^"]*"/i, `content="${escapeHtml(content)}"`);
  });
}

function buildStructuredData(post, language, locale) {
  const url = `${SITE_URL}${locale.url}`;
  const image = `${SITE_URL}${post.url}assets/og-land-below-wind.png`;
  const published = formatDate(post.rawDate);
  const websiteName = language === 'en' ? 'Wang Yufeng’s Blog' : '王雨峰的博客';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: locale.title,
        description: locale.description,
        inLanguage: language,
        datePublished: published,
        dateModified: post.modifiedDate,
        isPartOf: {
          '@type': 'WebSite',
          name: websiteName,
          url: `${SITE_URL}/`,
        },
        primaryImageOfPage: { '@id': `${url}#primaryimage` },
      },
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        headline: locale.socialTitle,
        description: locale.description,
        inLanguage: language,
        datePublished: published,
        dateModified: post.modifiedDate,
        author: {
          '@type': 'Person',
          name: '王雨峰',
          url: `${SITE_URL}/`,
        },
        image: { '@id': `${url}#primaryimage` },
        about: [
          {
            '@type': 'Book',
            name: 'Land Below the Wind',
            alternateName: '风下之乡',
            author: { '@type': 'Person', name: 'Agnes Newton Keith' },
          },
          { '@type': 'Place', name: 'Sabah, Malaysia' },
          { '@type': 'Thing', name: 'British North Borneo history' },
        ],
      },
      {
        '@type': 'ImageObject',
        '@id': `${url}#primaryimage`,
        url: image,
        contentUrl: image,
        width: 1200,
        height: 630,
        caption: locale.imageAlt,
      },
    ],
  };
}

function localizeCustomHtml(sourceHtml, post, language, locale, englishCopy) {
  const isEnglish = language === 'en';
  let html = sourceHtml;
  if (isEnglish) {
    html = translateStaticCopy(html, englishCopy, `${post.dir}/index.html`);
    html = html.replace(/\b(href|src)="\.\//g, '$1="../');
  }

  html = html.replace(/<html\s+lang="[^"]+">/i, `<html lang="${language}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(locale.title)}</title>`);
  html = replaceMetaContent(html, 'name', 'description', locale.description);
  html = replaceMetaContent(html, 'name', 'keywords', locale.keywords || 'Land Below the Wind, Agnes Newton Keith, Sabah, North Borneo, literary map');
  html = replaceMetaContent(html, 'property', 'og:title', locale.socialTitle);
  html = replaceMetaContent(html, 'property', 'og:description', locale.socialDescription);
  html = replaceMetaContent(html, 'property', 'og:site_name', isEnglish ? 'Wang Yufeng’s Blog' : '王雨峰的博客');
  html = replaceMetaContent(html, 'property', 'og:url', `${SITE_URL}${locale.url}`);
  html = replaceMetaContent(html, 'property', 'og:image:alt', locale.imageAlt);
  html = replaceMetaContent(html, 'property', 'og:locale', locale.ogLocale);
  html = replaceMetaContent(html, 'property', 'og:locale:alternate', isEnglish ? 'zh_CN' : 'en_US');
  html = replaceMetaContent(html, 'name', 'twitter:title', locale.socialTitle);
  html = replaceMetaContent(html, 'name', 'twitter:description', locale.socialDescription);
  html = replaceMetaContent(html, 'name', 'twitter:image:alt', locale.imageAlt);

  html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]+"\s*\/>/gi, '');
  const canonical = `<link rel="canonical" href="${SITE_URL}${locale.url}" />`;
  const alternates = Object.entries(post.locales)
    .map(([code, item]) => `    <link rel="alternate" hreflang="${code}" href="${SITE_URL}${item.url}" />`)
    .concat(`    <link rel="alternate" hreflang="x-default" href="${SITE_URL}${post.locales['zh-CN'].url}" />`)
    .join('\n');
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]+"\s*\/>/i, `${canonical}\n${alternates}`);

  const jsonLd = JSON.stringify(buildStructuredData(post, language, locale), null, 2);
  html = html.replace(
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">\n${jsonLd}\n    </script>`
  );
  html = html.replace(/\bdata-lang="zh"\s+aria-current="[^"]+"/g, `data-lang="zh" aria-current="${isEnglish ? 'false' : 'page'}"`);
  html = html.replace(/\bdata-lang="en"\s+aria-current="[^"]+"/g, `data-lang="en" aria-current="${isEnglish ? 'page' : 'false'}"`);

  if (!post.noHeader) html = injectFloatingBack(html, language);
  return html;
}

/**
 * Copy custom HTML posts and inject the shared return control unless noHeader
 * explicitly opts out. meta.json is build metadata and is never published.
 */
function buildCustomPosts(posts) {
  for (const post of posts) {
    if (post.type !== 'custom') continue;
    const srcDir = path.join(POSTS_DIR, post.dir);
    const outputPath = post.url.replace(/^\/+|\/+$/g, '');
    const destDir = path.join(DIST_DIR, outputPath);
    if (!destDir.startsWith(`${DIST_DIR}${path.sep}`)) {
      throw new Error(`Custom page output escaped dist: ${post.url}`);
    }
    copyDirRecursive(srcDir, destDir, ['meta.json']);

    const sourceHtml = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf-8');
    if (!post.locales) {
      const indexFile = path.join(destDir, 'index.html');
      const html = post.noHeader ? sourceHtml : injectFloatingBack(sourceHtml, 'zh-CN');
      fs.writeFileSync(indexFile, html);
      console.log(`✓ ${outputPath}/`);
      continue;
    }

    const englishCopy = extractEnglishCopy(path.join(srcDir, 'app.js'));
    for (const [language, locale] of Object.entries(post.locales)) {
      const relativeLocalePath = locale.url.slice(post.url.length).replace(/^\/+|\/+$/g, '');
      const localeDest = relativeLocalePath ? path.join(destDir, relativeLocalePath) : destDir;
      fs.mkdirSync(localeDest, { recursive: true });
      const html = localizeCustomHtml(sourceHtml, post, language, locale, englishCopy);
      fs.writeFileSync(path.join(localeDest, 'index.html'), html);
      console.log(`✓ ${locale.url.replace(/^\/+/, '')}`);
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
const projects = ${JSON.stringify(allProjects)};
const css = ${JSON.stringify(css)};

// 生成首页
const homeContent = renderToString(React.createElement(HomePage, { posts }));
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://wangyufeng.org/#website',
      name: '王雨峰的博客',
      url: 'https://wangyufeng.org',
      author: { '@id': 'https://wangyufeng.org/#person' },
      inLanguage: ['zh-CN', 'en']
    },
    {
      '@type': 'Person',
      '@id': 'https://wangyufeng.org/#person',
      name: '王雨峰',
      url: 'https://wangyufeng.org',
      email: 'mailto:alanwang424@gmail.com',
      sameAs: ['https://github.com/wangyufeng0615'],
      knowsAbout: ['AI tools', 'map games', 'software engineering', 'personal software']
    },
    {
      '@type': 'ItemList',
      '@id': 'https://wangyufeng.org/#projects',
      name: 'Projects by 王雨峰',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: project.name,
          description: project.description,
          url: project.url,
          applicationCategory: project.type,
          author: { '@id': 'https://wangyufeng.org/#person' }
        }
      }))
    }
  ]
};
const homeHtml = htmlTemplate({
  title: '王雨峰的博客',
  content: homeContent,
  css,
  description: '王雨峰的工程师主页，收集 AI 工具、地图游戏、个人软件和文章。',
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
  const output = execSync(`node ${outfile}`, {
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024,
  });

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

// public/ is copied late and can overwrite an earlier generated path. Keep it
// for intentional static artifacts, not duplicate sources of generated pages.
function copyPublicFiles() {
  const publicDir = path.join(ROOT, 'public');
  if (!fs.existsSync(publicDir)) return;

  function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      for (const file of fs.readdirSync(src)) {
        copyRecursive(path.join(src, file), path.join(dest, file));
      }
    } else {
      fs.copyFileSync(src, dest);
      const rel = path.relative(DIST_DIR, dest);
      if (rel) console.log(`✓ ${rel}`);
    }
  }

  for (const file of fs.readdirSync(publicDir)) {
    copyRecursive(path.join(publicDir, file), path.join(DIST_DIR, file));
  }
}

// 生成 sitemap.xml
function generateSitemap(posts) {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  for (const post of posts) {
    const lastmod = post.modifiedDate || post.date || today;
    const variants = post.locales ? Object.values(post.locales) : [{ url: post.url }];
    for (const variant of variants) {
      const alternates = post.locales
        ? Object.entries(post.locales)
            .map(([language, locale]) => `    <xhtml:link rel="alternate" hreflang="${language}" href="${SITE_URL}${locale.url}" />`)
            .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${post.locales['zh-CN'].url}" />`)
            .join('\n') + '\n'
        : '';
      xml += `  <url>
    <loc>${SITE_URL}${variant.url}</loc>
${alternates}    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  }

  for (const project of allProjects) {
    if (!project.url.startsWith(`${SITE_URL}/`)) continue;
    xml += `  <url>
    <loc>${project.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml);
  console.log('✓ sitemap.xml');
}

function generateAiReadableFiles(posts) {
  const projectIndex = allProjects.map((project) => ({
    name: project.name,
    description: project.description,
    url: project.url,
    type: project.type,
    year: project.year,
    tags: project.tags,
    status: project.status,
  }));

  const postIndex = posts.map((post) => {
    const entry = {
      title: post.title,
      date: post.date,
      modified: post.modifiedDate || post.date,
      url: `${SITE_URL}${post.url}`,
      description: post.description,
      type: post.type,
      slug: post.slug,
    };
    if (post.locales) {
      entry.languages = Object.entries(post.locales).map(([language, locale]) => ({
        language,
        title: locale.title,
        url: `${SITE_URL}${locale.url}`,
        description: locale.description,
      }));
    }
    return entry;
  });

  const writingEntries = posts.flatMap((post) => {
    if (!post.locales) {
      return [{ title: post.title, url: `${SITE_URL}${post.url}`, description: post.description }];
    }
    return Object.entries(post.locales).map(([language, locale]) => ({
      title: `${locale.title} [${language}]`,
      url: `${SITE_URL}${locale.url}`,
      description: locale.description,
    }));
  });

  const llms = `# 王雨峰的博客

> 王雨峰的个人网站，收集 AI 工具、地图游戏、个人软件、投资/技术/生活文章。站点是静态 HTML，适合人类阅读，也提供机器可读索引供 AI agents 使用。

The homepage is the best human-readable overview. For automated reading, prefer the JSON indexes below and use article URLs as canonical sources.

## Site

- [Homepage](${SITE_URL}/): Engineer homepage, featured work, tools, writing archive, and AI-readable entry points.
- [Sitemap](${SITE_URL}/sitemap.xml): Canonical URLs for crawl discovery.
- [Robots](${SITE_URL}/robots.txt): Crawler policy.

## Machine-readable indexes

- [Projects JSON](${SITE_URL}/projects.json): Structured project list with names, descriptions, URLs, types, tags, years, and status.
- [Posts JSON](${SITE_URL}/posts.json): Structured post list with titles, dates, URLs, descriptions, types, and slugs.

## Featured work

${projectIndex.map((project) => `- [${project.name}](${project.url}): ${project.description}`).join('\n')}

## Writing and pages

${writingEntries.slice(0, 30).map((post) => `- [${post.title}](${post.url}): ${post.description}`).join('\n')}

## Optional

- [All posts JSON](${SITE_URL}/posts.json): Use this when a complete article index is needed.
`;

  fs.writeFileSync(path.join(DIST_DIR, 'projects.json'), JSON.stringify(projectIndex, null, 2));
  fs.writeFileSync(path.join(DIST_DIR, 'posts.json'), JSON.stringify(postIndex, null, 2));
  fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llms);
  console.log('✓ projects.json');
  console.log('✓ posts.json');
  console.log('✓ llms.txt');
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
  generateAiReadableFiles(posts);
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
