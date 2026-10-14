import { parse as parseYaml } from 'yaml';
import { parseFragment } from 'parse5';
import { execFileSync } from 'node:child_process';

export function frontmatter(source) {
  const match = source.match(/^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/);
  if (!match) return { data: {}, content: source };
  const data = parseYaml(match[1], { maxAliasCount: 100 }) ?? {};
  if (typeof data !== 'object' || Array.isArray(data)) throw new Error('Frontmatter must be a YAML mapping');
  return { data, content: source.slice(match[0].length) };
}

export function plainText(html) {
  const visit = node => {
    if (['script', 'style', 'template'].includes(node.tagName)) return '';
    if (node.nodeName === '#text') return node.value;
    return (node.childNodes || []).map(visit).join(' ');
  };
  return visit(parseFragment(html)).replace(/\s+/g, ' ').trim();
}

export function summarize(html, limit = 120) {
  const text = plainText(html);
  return text.length > limit ? text.slice(0, limit).trimEnd() + '…' : text;
}

const dates = new Map();
export function sourceModified(paths, fallback = '') {
  const key = paths.join('\0');
  if (!dates.has(key)) {
    let date = '';
    try {
      date = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], { encoding: 'utf8' }).trim();
    } catch { /* Source exports without Git use the authored date. */ }
    dates.set(key, date);
  }
  return dates.get(key) || fallback;
}
