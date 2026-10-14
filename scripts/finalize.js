import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse, parseFragment, serialize } from 'parse5';
import { imageSize } from 'image-size';
import { sourceModified, summarize } from './lib/content.js';
import { escapeHtml, scriptJson } from '../src/templates/escape.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const origin = 'https://wangyufeng.org';
const posts = JSON.parse(fs.readFileSync(path.join(dist, 'posts.json'), 'utf8'));
const entries = new Map();
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const setAttr = (node, name, value) => {
  const old = node.attrs.find(item => item.name === name);
  if (old) old.value = value;
  else node.attrs.push({ name, value });
};
const find = (node, predicate) => {
  if (predicate(node)) return node;
  for (const child of node.childNodes || []) {
    const match = find(child, predicate);
    if (match) return match;
  }
};
function append(parent, html) {
  for (const node of parseFragment(html).childNodes) {
    node.parentNode = parent;
    parent.childNodes.push(node);
  }
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : file.endsWith('.html') ? [file] : [];
  });
}

function splitRadar(document, file) {
  const dataNode = find(document, node => attr(node, 'id') === 'dashboard-data');
  if (!dataNode) return;
  const data = JSON.parse(dataNode.childNodes[0].value);
  const runtime = find(document, node => node.tagName === 'script' && node.childNodes?.some(child => child.value?.includes("const DATA = JSON.parse(document.getElementById('dashboard-data').textContent)")));
  if (!runtime) throw new Error('Storage radar runtime not found');
  const directory = path.dirname(file);
  // Retain the complete snapshot for inspection; the UI never reads raw posts.
  fs.writeFileSync(path.join(directory, 'snapshot.json'), JSON.stringify(data));
  const runtimeKeys = ['accounts', 'coverage', 'daily_authors', 'generated_at', 'market', 'metrics', 'model', 'release', 'source_mode', 'watch_accounts', 'watch_daily_authors', 'window'];
  const displayData = Object.fromEntries(runtimeKeys.filter(key => key in data).map(key => [key, data[key]]));
  for (const account of [...(displayData.accounts || []), ...(displayData.watch_accounts || [])]) {
    const match = account.avatar_data_uri?.match(/^data:image\/(\w+);base64,(.*)$/s);
    if (!match) continue;
    const bytes = Buffer.from(match[2], 'base64');
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
    const extension = { jpeg: 'jpg', png: 'png', webp: 'webp', gif: 'gif' }[match[1]];
    if (!extension) continue;
    fs.mkdirSync(path.join(directory, 'avatars'), { recursive: true });
    const name = `${hash}.${extension}`;
    fs.writeFileSync(path.join(directory, 'avatars', name), bytes);
    account.avatar_data_uri = `./avatars/${name}`;
  }
  const json = JSON.stringify(displayData);
  const digest = createHash('sha256').update(json).digest('hex').slice(0, 12);
  const dataUrl = `./data.json?v=${digest}`;
  fs.writeFileSync(path.join(path.dirname(file), 'data.json'), json);
  const code = runtime.childNodes[0].value.replace(
    "const DATA = JSON.parse(document.getElementById('dashboard-data').textContent);",
    `const response = await fetch(${JSON.stringify(dataUrl)});\n    if (!response.ok) throw new Error('数据暂时不可用');\n    const DATA = await response.json();`);
  const wrapped = `(async () => {\ntry {\n${code}\n` +
    `if (document.body.dataset.renderError) throw new Error('图表暂时不可用');\n` +
    `document.documentElement.classList.add('js');\n` +
    `document.getElementById('radar-loading')?.remove();\n` +
    `} catch (error) {\n` +
    `document.documentElement.classList.remove('js');\n` +
    `const status = document.getElementById('radar-loading');\n` +
    `if (status) { status.textContent = '图表加载失败，可阅读下方文字摘要，或刷新页面重试。'; status.setAttribute('role', 'alert'); }\n` +
    `console.error('dashboard data load failed', error);\n}\n})();\n`;
  const jsDigest = createHash('sha256').update(wrapped).digest('hex').slice(0, 12);
  fs.writeFileSync(path.join(path.dirname(file), 'dashboard.js'), wrapped);
  runtime.attrs = [{ name: 'src', value: `./dashboard.js?v=${jsDigest}` }, { name: 'defer', value: '' }];
  runtime.childNodes = [];
  dataNode.parentNode.childNodes = dataNode.parentNode.childNodes.filter(node => node !== dataNode);
  // Keep the authored text summary available until interactive rendering succeeds.
  const earlyScript = find(document, node => node.tagName === 'script' && node.childNodes?.some(child => child.value?.trim() === "document.documentElement.classList.add('js')"));
  if (earlyScript) earlyScript.parentNode.childNodes = earlyScript.parentNode.childNodes.filter(node => node !== earlyScript);
  const summary = find(document, node => attr(node, 'id') === 'summary');
  if (summary) append(summary, '<p id="radar-loading" role="status">正在加载图表数据，文字摘要可直接阅读。</p>');
  const head = find(document, node => node.tagName === 'head');
  append(head, `<link rel="preload" as="fetch" href="${dataUrl}" crossorigin><link rel="alternate" type="application/json" href="./snapshot.json" title="存储情绪雷达完整数据">`);
}

function imageHints(document, pageUrl) {
  let index = 0;
  const visit = node => {
    if (node.tagName === 'img') {
      if (!attr(node, 'loading') && index++ > 0) setAttr(node, 'loading', 'lazy');
      if (!attr(node, 'decoding')) setAttr(node, 'decoding', 'async');
      try {
        const resource = new URL(attr(node, 'src'), origin + pageUrl);
        const local = path.resolve(dist, '.' + decodeURIComponent(resource.pathname));
        if (resource.origin === origin && local.startsWith(dist + path.sep) && fs.existsSync(local)) {
          const size = imageSize(fs.readFileSync(local));
          if (!attr(node, 'width') && !attr(node, 'height') && size.width && size.height) {
            setAttr(node, 'width', String(size.width));
            setAttr(node, 'height', String(size.height));
          }
        }
      } catch { /* External images and unsupported formats retain authored sizing. */ }
    }
    (node.childNodes || []).forEach(visit);
  };
  visit(document);
}

for (const file of walk(dist)) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === '404.html') continue;
  const url = '/' + relative.replace(/(^|\/)index\.html$/, '$1');
  const document = parse(fs.readFileSync(file, 'utf8'));
  const head = find(document, node => node.tagName === 'head');
  const body = find(document, node => node.tagName === 'body');
  const titleNode = find(head, node => node.tagName === 'title');
  const title = titleNode?.childNodes.map(node => node.value || '').join('') || '王雨峰的博客';
  const post = posts.find(item => url === item.url.replace(origin, '') || item.languages?.some(locale => url === locale.url.replace(origin, '')));
  const parentPost = post || posts.filter(item => item.type === 'custom' && url.startsWith(item.url.replace(origin, ''))).sort((a, b) => b.url.length - a.url.length)[0];
  const description = post?.description || summarize(serialize(body));
  let meta = find(head, node => node.tagName === 'meta' && attr(node, 'name') === 'description');
  if (!meta) append(head, `<meta name="description" content="${escapeHtml(description)}">`);
  const canonical = find(head, node => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
  if (!canonical) append(head, `<link rel="canonical" href="${origin}${escapeHtml(url)}">`);
  const source = parentPost ? `posts/${parentPost.slug}` : relative.startsWith('ball-moving/') ? 'apps/ball-moving' : `public/${relative.replace(/index\.html$/, '')}`;
  const modified = post?.modified || sourceModified([source], parentPost?.modified || '');
  if (!find(head, node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')) {
    const ld = {
      '@context': 'https://schema.org', '@type': post ? 'Article' : 'WebPage',
      '@id': origin + url, url: origin + url, name: title, headline: title, description,
      inLanguage: attr(find(document, node => node.tagName === 'html'), 'lang') || 'zh-CN',
      author: { '@type': 'Person', '@id': origin + '/#person', name: '王雨峰', url: origin + '/' },
      isPartOf: { '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/' },
      ...(post?.date ? { datePublished: post.date } : {}),
      ...(modified ? { dateModified: modified } : {}),
    };
    append(head, `<script type="application/ld+json">${scriptJson(ld)}</script>`);
  }
  for (const [property, value] of [['og:title', title], ['og:description', description], ['og:url', origin + url], ['og:type', post ? 'article' : 'website'], ['og:image', origin + '/avatar.jpg']]) {
    if (!find(head, node => node.tagName === 'meta' && attr(node, 'property') === property)) append(head, `<meta property="${property}" content="${escapeHtml(value)}">`);
  }
  // Explicit referrer policy also protects direct GitHub Pages visits.
  if (!find(head, node => node.tagName === 'meta' && attr(node, 'name') === 'referrer')) append(head, '<meta name="referrer" content="strict-origin-when-cross-origin">');
  if (relative === 'storage-radar/index.html') splitRadar(document, file);
  imageHints(document, url);
  fs.writeFileSync(file, serialize(document));
  entries.set(origin + url, modified);
}

// Preserve authored hreflang entries, deduplicate them, then cover nested pages.
const sitemapFile = path.join(dist, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
const seen = new Set();
sitemap = sitemap.replace(/\s*<url>[\s\S]*?<\/url>/g, block => {
  const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
  if (!loc || seen.has(loc)) return '';
  seen.add(loc);
  return block;
});
const extras = [...entries].filter(([url]) => !seen.has(url)).map(([url, date]) => `  <url><loc>${escapeHtml(url)}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`).join('\n');
sitemap = sitemap.replace('</urlset>', extras + '\n</urlset>');
fs.writeFileSync(sitemapFile, sitemap);
console.log(`✓ Finalized ${entries.size} HTML pages; radar data is independently cacheable`);
