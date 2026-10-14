import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parse } from 'parse5';

const dist = path.resolve('dist');
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : file.endsWith('.html') ? [file] : [];
});
let pages = 0;
for (const file of walk(dist)) {
  if (path.basename(file) === '404.html') continue;
  const elements = [];
  const visit = node => { if (node.tagName) elements.push(node); (node.childNodes || []).forEach(visit); };
  visit(parse(fs.readFileSync(file, 'utf8')));
  const canonicals = elements.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
  assert.equal(canonicals.length, 1, `Canonical count: ${file}`);
  assert.equal(new URL(attr(canonicals[0], 'href')).origin, 'https://wangyufeng.org', file);
  const meta = elements.find(node => node.tagName === 'meta' && attr(node, 'name') === 'description');
  assert.ok(attr(meta, 'content')?.length, `Missing description: ${file}`);
  assert.deepEqual(meta.attrs.map(item => item.name).sort(), ['content', 'name'], `Malformed description: ${file}`);
  const ld = elements.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json');
  assert.ok(ld.length, `Missing JSON-LD: ${file}`);
  for (const node of ld) JSON.parse(node.childNodes.map(child => child.value || '').join(''));
  for (const node of elements.filter(node => node.tagName === 'script' && attr(node, 'src'))) {
    const url = new URL(attr(node, 'src'), 'https://wangyufeng.org/' + path.relative(dist, file));
    if (url.origin === 'https://wangyufeng.org') assert.ok(fs.existsSync(path.join(dist, decodeURIComponent(url.pathname))), `Missing script ${url.pathname} in ${file}`);
  }
  pages++;
}
const locations = [...fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(locations.length, new Set(locations).size, 'Duplicate sitemap URLs');
for (const { file, sha256 } of JSON.parse(fs.readFileSync('public/vendor/manifest.json', 'utf8')).files) {
  assert.equal(createHash('sha256').update(fs.readFileSync(path.join('public', file))).digest('hex'), sha256, `Vendor checksum: ${file}`);
}
const originalRadar = fs.readFileSync('public/storage-radar/index.html', 'utf8');
const originalData = JSON.parse(originalRadar.match(/<script id="dashboard-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const fullData = JSON.parse(fs.readFileSync(path.join(dist, 'storage-radar/snapshot.json'), 'utf8'));
assert.deepEqual(fullData, originalData, 'Full radar snapshot must remain lossless');
const displayData = JSON.parse(fs.readFileSync(path.join(dist, 'storage-radar/data.json'), 'utf8'));
for (const key of ['daily_authors', 'watch_daily_authors', 'metrics', 'coverage', 'market']) assert.deepEqual(displayData[key], originalData[key], `Radar data changed: ${key}`);
assert.ok(fs.statSync(path.join(dist, 'storage-radar/index.html')).size < 100_000, 'Radar HTML grew unexpectedly');
console.log(`Verified ${pages} HTML pages, ${locations.length} sitemap URLs, vendor checksums and lossless radar data.`);
