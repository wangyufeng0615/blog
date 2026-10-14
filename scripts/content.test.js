import assert from 'node:assert/strict';
import test from 'node:test';
import { parse } from 'parse5';
import { htmlTemplate } from '../src/templates/html.js';
import { frontmatter, summarize } from './lib/content.js';

test('titles, descriptions and JSON-LD cannot break out of their HTML contexts', () => {
  const value = '\"><script>alert(1)</script>&\u2028';
  const html = htmlTemplate({ title: value, description: value, css: '', content: '', jsonLd: { name: value } });
  const document = parse(html);
  const elements = [];
  const walk = node => { if (node.tagName) elements.push(node); (node.childNodes || []).forEach(walk); };
  walk(document);
  const scripts = elements.filter(node => node.tagName === 'script');
  assert.equal(scripts.length, 1);
  assert.equal(JSON.parse(scripts[0].childNodes[0].value).name, value);
  const meta = elements.find(node => node.tagName === 'meta' && node.attrs.some(attr => attr.name === 'name' && attr.value === 'description'));
  assert.equal(meta.attrs.find(attr => attr.name === 'content').value, value);
  assert.equal(meta.attrs.length, 2);
});

test('summaries decode entities and retain linked text without markup or scripts', () => {
  assert.equal(summarize('<h2>标题</h2><p><a href="https://example.com">链接</a>&nbsp;正文 &amp; 引用</p><script>bad()</script>'), '标题 链接 正文 & 引用');
});

test('YAML frontmatter preserves authored dates and supports CRLF', () => {
  const { data, content } = frontmatter('---\r\ntitle: "引号文章"\r\ndate: 2026-10-14\r\ndraft: false\r\n---\r\n正文');
  assert.deepEqual(data, { title: '引号文章', date: '2026-10-14', draft: false });
  assert.equal(content, '正文');
  assert.throws(() => frontmatter('---\n- invalid\n---\n正文'), /mapping/);
});
