// Builds /outer-wilds-clues/ (zh) and /outer-wilds-clues/en/ from data.src.mjs:
//   assets/graph-data.js  canvas data (quotes resolved to official English + Simplified Chinese game text)
//   graph.json            machine-readable graph for agents
//   llms.txt              bilingual plain-text version
//   index.html, en/index.html  pages with static FAQ, <noscript> clue list, JSON-LD, hreflang
// Quotes are looked up in the extracted game text in the Obsidian vault (GAME_TEXT_DIR); rerun after editing data:
//   node scripts/outer-wilds-clues/gen.mjs
// og.html is the source of assets/og-outer-wilds-clues*.png (Chrome headless screenshot, 1200x630).
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BANDS, FAQ, TIMELINE, TRAVELERS, ENTRY_NODE, ACTION, ENDINGS, TOOLS, NOTE } from './data.src.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const POST = path.resolve(here, '../../posts/20261014-outer-wilds-clues');
const GAME_TEXT_DIR = process.env.OW_TEXT_DIR || path.join(process.env.HOME, 'Documents/Obsidian Vault/生活/游戏/Outer Wilds');
const SITE = 'https://wangyufeng.org';
const URLS = { zh: '/outer-wilds-clues/', en: '/outer-wilds-clues/en/' };
const PUBLISHED = '2026-10-14T21:00:00+08:00';
const MODIFIED = '2026-10-15T03:00:00+08:00';

/* ---------- game text lookup ---------- */
function pairs(file) {
  const t = fs.readFileSync(path.join(GAME_TEXT_DIR, file), 'utf8');
  const out = [];
  const re = /(?:### (\S+) · (shiplog_text|shiplog_name|ui)\n\n)?\*\*EN\*\*\n\n([\s\S]*?)\n\n\*\*中文\*\*\n\n([\s\S]*?)(?=\n\n(?:\*\*|#|位置与字体信息|选项条件|```)|\n*$)/g;
  let m;
  while ((m = re.exec(t))) {
    const en = m[3].split(/\n\n/).join(' ').replace(/\s+/g, ' ').trim();
    const zh = m[4].split(/\n\n/).join('').replace(/\n/g, '').trim();
    out.push({ id: m[1], kind: m[2], en: en.replace(/@@/g, ''), zh: zh.replace(/@@/g, '') });
  }
  return out;
}
const LOG = pairs('飞船日志中英对照.md');
const NOMAI = pairs('挪麦文字中英对照.md');
const DLG = pairs('对话与说明牌中英对照.md');
const UI_TEXT = Object.fromEntries(pairs('界面中英对照.md').filter(p => p.kind === 'ui').map(p => [p.id, p]));
const logText = Object.fromEntries(LOG.filter(p => p.kind === 'shiplog_text').map(p => [p.id, p]));
const logName = Object.fromEntries(LOG.filter(p => p.kind === 'shiplog_name').map(p => [p.id, p]));

function resolveQuote(key) {
  const [src, ...rest] = key.split(':');
  const arg = rest.join(':');
  if (src === 'UI') {
    const p = UI_TEXT[arg];
    if (!p) throw new Error(`UI text not found: ${arg}`);
    return { zh: p.zh, en: p.en, cite: { zh: '结局画面', en: 'Ending screen' } };
  }
  if (src === 'LOG') {
    const p = logText[arg];
    if (!p) throw new Error(`Ship log entry not found: ${arg}`);
    const name = logName[arg.replace(/_(X|R)\d+$/, '')];
    return { zh: p.zh, en: p.en, cite: { zh: `飞船日志 · ${name ? name.zh : arg}`, en: `Ship log · ${name ? name.en : arg}` } };
  }
  const pool = src === 'NOMAI' ? NOMAI : DLG;
  const hits = pool.filter(p => p.en.includes(arg));
  if (!hits.length) throw new Error(`Text not found (${src}): ${arg}`);
  const p = hits[0];
  return src === 'NOMAI'
    ? { zh: p.zh, en: p.en, cite: { zh: '挪麦文字', en: 'Nomai text' } }
    : { zh: p.zh, en: p.en, cite: { zh: '对话与说明牌', en: 'Dialogue and signs' } };
}

/* ---------- resolve data ---------- */
const ACT = {};
for (const [k, ids] of Object.entries(ACTION)) ids.forEach(id => { ACT[id] = k; });
const nodes = {};
function resolve(n) {
  if (n.ref) return { ref: n.ref };
  const out = { ...n };
  if (ACT[n.id]) out.act = ACT[n.id];
  if (NOTE[n.id]) out.note = NOTE[n.id];
  if (n.quote) out.quote = n.quote.map(x => resolveQuote(x.$q));
  if (n.kids) out.kids = n.kids.map(resolve);
  nodes[n.id] = out;
  return out;
}
const resolvedBands = BANDS.map(b => ({ ...b, roots: b.roots.map(resolve) }));

/* ---------- one read-only map: each location joins the clues that need it ----------
   The "getting there" band is folded into the others: a location subtree becomes a prerequisite of every clue
   whose `at` points to it. Shared nodes are drawn once, under the parent that puts them furthest from the goal
   (longest path), so every arrow points right; other parents get a {ref}. */
function mergeLocations(src) {
  const reach = src.find(b => b.key === 'reach');
  const keep = src.filter(b => b.key !== 'reach');
  const kidsOf = {}, bandOf2 = {};
  const walk = (n, band) => {
    if (n.ref) return;
    bandOf2[n.id] = band;
    const ks = (n.kids || []).map(k => k.ref || k.id);
    if (n.at) ks.push(n.at);
    kidsOf[n.id] = ks;
    (n.kids || []).forEach(k => walk(k, band));
  };
  keep.forEach(b => b.roots.forEach(r => walk(r, b.key)));
  reach.roots.forEach(r => walk(r, 'reach'));
  // locations take the band of the clue that needs them
  const used = new Set();
  const claim = (id, band) => { if (bandOf2[id] === 'reach') bandOf2[id] = band; if (used.has(id + band)) return; used.add(id + band); kidsOf[id].forEach(k => claim(k, band)); };
  keep.forEach(b => b.roots.forEach(r => claim(r.id, b.key)));
  for (const id in bandOf2) if (bandOf2[id] === 'reach') throw new Error(`Location never used by a clue: ${id}`);
  // longest distance from the band's root
  const depth = {};
  const visit = (id, d, stack) => {
    if (stack.has(id)) throw new Error(`Cycle at ${id}`);
    if (depth[id] !== undefined && depth[id] >= d) return;
    depth[id] = d; stack.add(id);
    kidsOf[id].forEach(k => visit(k, d + 1, stack));
    stack.delete(id);
  };
  keep.forEach(b => b.roots.forEach(r => visit(r.id, 0, new Set())));
  // tree parent = the parent sitting one column to the left of the child's deepest position
  const treeParent = {};
  for (const p in kidsOf) for (const k of kidsOf[p]) {
    if (depth[p] === undefined) continue;
    if (depth[p] + 1 === depth[k] && treeParent[k] === undefined) treeParent[k] = p;
  }
  const build = id => {
    const n = { ...nodes[id] };
    delete n.at;
    const ks = kidsOf[id];
    if (ks.length) n.kids = ks.map(k => (treeParent[k] === id ? build(k) : { ref: k }));
    else delete n.kids;
    return n;
  };
  return keep.map(b => ({ ...b, roots: b.roots.map(r => build(r.id)) }));
}
const bands = mergeLocations(resolvedBands);
for (const id in ACT) if (!nodes[id]) throw new Error(`ACTION lists unknown node: ${id}`);
for (const id in NOTE) if (!nodes[id]) throw new Error(`NOTE lists unknown node: ${id}`);
const edges = [];
(function link() {
  const walk = n => { if (n.ref) return; (n.kids || []).forEach(k => { edges.push({ from: k.ref || k.id, to: n.id }); walk(k); }); };
  bands.forEach(b => b.roots.forEach(walk));
})();
const bandOf = {};
bands.forEach(b => { const walk = n => { if (n.ref) return; bandOf[n.id] = b.key; (n.kids || []).forEach(walk); }; b.roots.forEach(walk); });

fs.writeFileSync(path.join(POST, 'assets/graph-data.js'),
  `// Generated by scripts/outer-wilds-clues/gen.mjs — edit data.src.mjs instead.\nwindow.OWC = ${JSON.stringify({ bands })};\n`);

/* ---------- who pointed you where (ship log rumors sourced from travelers) ---------- */
const RAW_DIR = path.join(GAME_TEXT_DIR, '原始资源');
const rumors = [];
for (const sub of fs.readdirSync(RAW_DIR)) {
  const dir = path.join(RAW_DIR, sub);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.xml'))) {
    const t = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of t.matchAll(/<RumorFact>([\s\S]*?)<\/RumorFact>/g)) {
      const id = (m[1].match(/<ID>(.*?)<\/ID>/) || [])[1], src = (m[1].match(/<SourceID>(.*?)<\/SourceID>/) || [])[1];
      if (id && src) rumors.push({ id, src });
    }
  }
}
const leads = TRAVELERS.map(tr => ({
  ...tr,
  items: rumors.filter(r => tr.src.includes(r.src)).sort((a, b) => a.id.localeCompare(b.id)).map(r => {
    const entry = r.id.replace(/_R\d+$/, '');
    const text = logText[r.id], name = logName[entry];
    if (!text || !name) throw new Error(`Rumor text missing: ${r.id}`);
    return { rumor: r.id, entry, to: { zh: name.zh, en: name.en }, said: { zh: text.zh, en: text.en }, node: ENTRY_NODE[entry] || null };
  }).reduce((acc, it) => { // two rumors about the same place become one item
    const prev = acc.find(x => x.entry === it.entry);
    if (prev) { prev.said = { zh: prev.said.zh + it.said.zh, en: prev.said.en + ' ' + it.said.en }; prev.rumor += ',' + it.rumor; } else acc.push(it);
    return acc;
  }, [])
}));

/* ---------- loop timeline (static SVG) ---------- */
// Rough rendered width at the 12.5px label size: CJK and full-width glyphs ≈ 1em, other characters ≈ 0.56em.
const textW = str => [...str].reduce((w, ch) => w + (/[\u2E80-\uFFEF]/.test(ch) ? 12.5 : 7), 0);
const fmtMin = t => `${Math.floor(t)}:${String(Math.round((t % 1) * 60)).padStart(2, '0')}`;
const escX = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function timelineSvg(lang) {
  const W = 1040, X0 = 150, X1 = 1010, ROW = 24, LANE_PAD = 14, TOP = 30;
  const x = t => X0 + (X1 - X0) * t / 22;
  let y = TOP, body = '';
  for (const lane of TIMELINE.lanes) {
    const rows = Math.max(...lane.items.map(i => i.row)) + 1;
    const h = rows * ROW + LANE_PAD;
    body += `<line class="tl-axis" x1="${X0}" x2="${X1}" y1="${y + h}" y2="${y + h}"/>`;
    body += `<text class="tl-lane" x="8" y="${y + 18}">${escX(lane.name[lang])}</text>`;
    for (const it of lane.items) {
      const cy = y + it.row * ROW + 14;
      const cls = lane.sun ? ' tl-sun' : '';
      const open = '<g>';
      if (it.from !== undefined) {
        const bw = x(it.to) - x(it.from), fits = textW(it.label[lang]) + 12 <= bw;
        body += `${open}<rect class="tl-range${cls}" x="${x(it.from)}" y="${cy - 8}" width="${bw}" height="16" rx="3"/>`;
        // a label that doesn't fit inside its bar sits right after it
        body += `<text class="tl-label" x="${fits ? x(it.from) + 6 : x(it.to) + 8}" y="${cy + 4}">${escX(it.label[lang])}</text></g>`;
      } else {
        const left = it.side === 'left';
        body += `${open}<circle class="tl-dot${it.goal ? ' goal' : cls}" cx="${x(it.t)}" cy="${cy}" r="5.5"/>`;
        body += `<text class="tl-label" x="${x(it.t) + (left ? -10 : 10)}" y="${cy + 4}" text-anchor="${left ? 'end' : 'start'}">${escX(it.label[lang])}</text></g>`;
      }
    }
    y += h + 6;
  }
  let grid = '';
  for (let m = 0; m <= 22; m += 2) {
    grid += `<line class="tl-grid" x1="${x(m)}" x2="${x(m)}" y1="${TOP - 6}" y2="${y - 6}"/><text class="tl-tick" x="${x(m)}" y="${TOP - 12}" text-anchor="middle">${m}:00</text>`;
  }
  const aria = lang === 'zh' ? '一个 22 分钟循环的时间轴' : 'Timeline of one 22-minute loop';
  return `<svg viewBox="0 0 ${W} ${y + 4}" role="img" aria-label="${aria}">${grid}${body}</svg>`;
}
function leadsHtml(lang) {
  return leads.map(tr => `    <article class="lead-card"><h3>${escX(tr.name[lang])} <small>${escX(tr.where[lang])}</small></h3><ul>${tr.items.map(it =>
    `<li><div class="to">→ ${escX(it.to[lang])}</div><p class="said">${escX(it.said[lang])}</p></li>`).join('')}</ul></article>`).join('\n');
}
const endings = ENDINGS.items.map(e => ({ ...e, quote: resolveQuote(e.quote) }));
const linkOr = (text, node, lang) => escX(text[lang]);
function endingsHtml(lang) {
  return endings.map(e => `    <article class="lead-card ending"><h3>${escX(e.name[lang])} <small>${escX(e.kind[lang])}</small></h3>
      <ol class="steps">${e.steps.map(([t, n]) => `<li>${linkOr(t, n, lang)}</li>`).join('')}</ol>
      <blockquote class="end-line">${escX(e.quote[lang])}</blockquote>${e.note ? `<p class="said">${escX(e.note[lang])}</p>` : ''}</article>`).join('\n');
}
function toolsHtml(lang) {
  return TOOLS.items.map(t => `    <article class="lead-card tool"><h3>${escX(t.name[lang])} <small>${escX(t.from[lang])}</small></h3>
      <ul class="uses">${t.uses.map(([u, n]) => `<li>${linkOr(u, n, lang)}</li>`).join('')}</ul></article>`).join('\n');
}
// A small Archimedean spiral, the way Nomai writing curls.
const SPIRAL = (() => { let d = ''; for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 5.2, r = 1 + i / 64 * 9.5; d += `${i ? 'L' : 'M'}${(11 + r * Math.cos(a)).toFixed(2)},${(11 + r * Math.sin(a)).toFixed(2)}`; } return `<svg viewBox="0 0 22 22" aria-hidden="true"><path class="spiral" d="${d}"/></svg>`; })();

/* ---------- graph.json for agents ---------- */
const TYPE_EN = { goal: 'goal', target: 'required_item', gate: 'gate', clue: 'clue', alt: 'alternative', loc: 'location' };
const graph = {
  name: 'Outer Wilds clue dependency map',
  name_zh: '星际拓荒通关线索图',
  description: 'Prerequisite graph of the Outer Wilds base game (no DLC): what you must learn or reach before each step, where each clue is, alternative ways through, and how to get to key locations. Contains full spoilers.',
  url: SITE + URLS.en,
  url_zh: SITE + URLS.zh,
  author: { name: '王雨峰 (Wang Yufeng)', url: SITE + '/' },
  datePublished: PUBLISHED.slice(0, 10),
  dateModified: MODIFIED.slice(0, 10),
  game: { name: 'Outer Wilds', name_zh: '星际拓荒', developer: 'Mobius Digital', publisher: 'Annapurna Interactive', year: 2019 },
  sources: 'Quotes: official English and Simplified Chinese game text (Steam build, October 2026). Alternatives: Outer Wilds Wiki and community guides, cited per node.',
  how_to_read: 'player_action: realize = figure something out, explore = get somewhere or through something. Each node lists prerequisites (node ids that point into it). requires=all means every prerequisite is needed; requires=any means one is enough. type=alternative nodes are non-intended ways through (alternative_kind: official = another in-game clue or mechanic, luck = trial and error or brute force). location_ref points to a location node describing how to get there.',
  bands: bands.map(b => ({ key: b.key, title: b.title, summary: b.band, roots: b.roots.map(r => r.id) })),
  nodes: Object.values(nodes).map(n => ({
    id: n.id, type: TYPE_EN[n.t], band: bandOf[n.id], label: n.label, place: n.place || null,
    player_action: n.act || null, requires: n.req || null, alternative_kind: n.alt || null, timing_sensitive: n.tag === 'timing' || undefined,
    unverified: n.verify || undefined, location_ref: n.at || null,
    prerequisites: edges.filter(e => e.to === n.id).map(e => e.from),
    unlocks: edges.filter(e => e.from === n.id).map(e => e.to),
    summary: n.note || null, notes: n.info || [], quotes: (n.quote || []).map(q => ({ en: q.en, zh: q.zh, source: q.cite.en })),
    references: (n.src || []).map(s => s.url)
  })),
  faq: FAQ.map(([qq, a]) => ({ question: qq, answer: a })),
  loop_timeline: { minutes: 22, lanes: TIMELINE.lanes.map(l => ({ name: l.name, events: l.items.map(i => ({ label: i.label, at_minute: i.t ?? null, from_minute: i.from ?? null, to_minute: i.to ?? null, node: i.node || null })) })) },
  endings: endings.map(e => ({ name: e.name, kind: e.kind, how: e.steps.map(([t, n]) => ({ step: t, node: n || null })), line: { en: e.quote.en, zh: e.quote.zh, source: e.quote.cite.en }, note: e.note || null })),
  tools: TOOLS.items.map(t => ({ name: t.name, from: t.from, uses: t.uses.map(([u, n]) => ({ use: u, node: n || null })) })),
  traveler_leads: leads.map(tr => ({ traveler: tr.name, where: tr.where, leads: tr.items.map(i => ({ to: i.to, said: i.said, node: i.node, ship_log_rumor: i.rumor })) }))
};
fs.writeFileSync(path.join(POST, 'graph.json'), JSON.stringify(graph, null, 1));

/* ---------- text outline (noscript + llms.txt) ---------- */
const ALT = { official: { zh: '官方另一解', en: 'other in-game clue' }, luck: { zh: '运气 / 试错 / 硬闯', en: 'luck / trial / brute force' } };
const REQ = { all: { zh: '以下全部需要', en: 'needs all of' }, any: { zh: '以下任选一', en: 'any one of' } };
const TIMING_TXT = { zh: '时间窗口', en: 'timing' };
const ACT_TXT = { realize: { zh: '意识到', en: 'Realize' }, explore: { zh: '探索到', en: 'Explore' } };
function line(n, lang) {
  if (n.ref) return { text: `${lang === 'zh' ? '（同上：' : '(see above: '}${nodes[n.ref].label[lang]}${lang === 'zh' ? '）' : ')'}`, kids: [] };
  const kids = n.kids || [];
  let text = n.t === 'alt' ? `[${ALT[n.alt][lang]}] ${n.label[lang]}` : (n.act ? `[${ACT_TXT[n.act][lang]}] ` : '') + n.label[lang];
  if (n.tag === 'timing') text += ` [${TIMING_TXT[lang]}]`;
  if (n.place) text += ` — ${n.place[lang]}`;
  if (n.req && kids.length > 1) text += ` (${REQ[n.req][lang]})`;
  return { text, kids };
}
function mdTree(n, lang, depth) {
  const l = line(n, lang);
  return [`${'  '.repeat(depth)}- ${l.text}`].concat(l.kids.map(k => mdTree(k, lang, depth + 1))).join('\n');
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function htmlTree(n, lang) {
  const l = line(n, lang);
  return `<li>${esc(l.text)}${l.kids.length ? `<ul>${l.kids.map(k => htmlTree(k, lang)).join('')}</ul>` : ''}</li>`;
}

const llms = `# Outer Wilds clue dependency map / 星际拓荒通关线索图

> A prerequisite graph for the Outer Wilds base game (Mobius Digital, 2019; no Echoes of the Eye DLC). To reach the ending you need three things: the Eye of the Universe's coordinates, the Nomai Vessel, and the advanced warp core. Each node lists what you must learn or reach first, where the clue is, other ways through, and how to get to key locations. Full spoilers.
> 《星际拓荒》本体线索依赖图：结局需要的三样东西、每一步的前置线索与地点、其他走法，以及关键地点怎么去。全剧透。

- English page: ${SITE}${URLS.en}
- 中文页面：${SITE}${URLS.zh}
- Machine-readable graph (nodes, prerequisites, quotes in English and Chinese): ${SITE}${URLS.zh}graph.json
- Author: 王雨峰 (Wang Yufeng), ${SITE}/ · Published ${PUBLISHED.slice(0, 10)}
- Sources: official game text (English + Simplified Chinese, Steam build Oct 2026); alternatives from the Outer Wilds Wiki and community guides. Please link the page when citing.

## FAQ (English)

${FAQ.map(([qq, a]) => `### ${qq.en}\n\n${a.en}`).join('\n\n')}

## One loop (English)

${TIMELINE.lanes.map(l => `- ${l.name.en}: ${l.items.map(i => (i.t !== undefined ? fmtMin(i.t) + ' ' : '') + i.label.en).join('; ')}`).join('\n')}

## Who points you where (English)

${leads.map(tr => `- ${tr.name.en} (${tr.where.en}): ${tr.items.map(i => `→ ${i.to.en}: "${i.said.en}"`).join(' ')}`).join('\n')}

## Tools and abilities (English)

${TOOLS.items.map(t => `- ${t.name.en} (${t.from.en}): ${t.uses.map(u => u[0].en).join('; ')}`).join('\n')}

## Endings (English)

${endings.map(e => `- ${e.name.en} (${e.kind.en}): ${e.steps.map(s => s[0].en).join(' → ')}. Line: "${e.quote.en}"`).join('\n')}

## Full map (English)

Indented items are prerequisites of the item above them.

${bands.map(b => `### ${b.title.en}${b.band.en ? ': ' + b.band.en : ''}\n\n${b.roots.map(r => mdTree(r, 'en', 0)).join('\n')}`).join('\n\n')}

## 常见问题（中文）

${FAQ.map(([qq, a]) => `### ${qq.zh}\n\n${a.zh}`).join('\n\n')}

## 一个循环（中文）

${TIMELINE.lanes.map(l => `- ${l.name.zh}：${l.items.map(i => i.label.zh).join('；')}`).join('\n')}

## 谁给你指的路（中文）

${leads.map(tr => `- ${tr.name.zh}（${tr.where.zh}）：${tr.items.map(i => `→ ${i.to.zh}：“${i.said.zh}”`).join(' ')}`).join('\n')}

## 工具与能力（中文）

${TOOLS.items.map(t => `- ${t.name.zh}（${t.from.zh}）：${t.uses.map(u => u[0].zh).join('；')}`).join('\n')}

## 结局图鉴（中文）

${endings.map(e => `- ${e.name.zh}（${e.kind.zh}）：${e.steps.map(s => s[0].zh).join(' → ')}。原文："${e.quote.zh}"`).join('\n')}

## 完整依赖（中文）

缩进项是上一项的前置。

${bands.map(b => `### ${b.title.zh}${b.band.zh ? '：' + b.band.zh : ''}\n\n${b.roots.map(r => mdTree(r, 'zh', 0)).join('\n')}`).join('\n\n')}
`;
fs.writeFileSync(path.join(POST, 'llms.txt'), llms);

/* ---------- pages ---------- */
const COPY = {
  zh: {
    htmlLang: 'zh-CN', ogLocale: 'zh_CN', ogAlt: 'en_US',
    title: '星际拓荒通关线索图｜Outer Wilds 线索依赖、地点入口与通关路线',
    description: '《星际拓荒》（Outer Wilds）本体的线索依赖图：打出结局要凑齐宇宙之眼坐标、挪麦飞船、高级跃迁核心三样东西；每一步要先知道什么、在哪颗星球学到、关键地点怎么进、什么时候去，以及能靠运气或另一条线索绕过去的步骤。',
    keywords: '星际拓荒, Outer Wilds, 星际拓荒攻略, 星际拓荒线索, 星际拓荒结局, 宇宙之眼坐标, 挪麦人, 灰烬双星计划, 背阴城怎么进, 高能实验室, 黑洞熔炉, 南部天文台, 量子卫星第六个位置, 黑棘星安康鱼, 深巨星核心',
    socialTitle: '星际拓荒通关线索图｜Outer Wilds',
    socialDesc: '打出《星际拓荒》结局要凑齐哪三样东西、每样要先知道什么、关键地点怎么进，一张图看全。',
    imageAlt: '星际拓荒通关线索依赖图', og: 'og-outer-wilds-clues.png',
    h1: '星际拓荒通关线索图',
    lgAct: '<span><b class="kw-realize">意识到</b>想明白一件事</span>\n    <span><b class="kw-explore">探索到</b>去到一个地方</span>',
    lg: ['青框：结局和三样必需品', '实线：设计好的路线', '橙色虚线：其他走法（运气、试错、硬闯或另一条线索）', '点卡片看游戏原文'],
    spoiler: '全是剧透，没通关慎看',
    basis: '本页内容基于游戏全部原始文本、官方 Wiki 和社区讨论，充分打磨',
    switchLabel: 'English', switchHref: 'en/', switchLang: 'en', switchHreflang: 'en',
    zoomOut: '缩小', zoomIn: '放大', fit: '全貌', hint: '', tip: '双指或 Ctrl/⌘ + 滚轮放大，拖动查看细节',
    aria: '星际拓荒线索依赖图：通关主线、地点入口、量子卫星支线、闯入者支线。文字版见本页 llms.txt。',
    noscript: '画布需要 JavaScript。下面是同一张图的文字版：缩进项是上一项的前置。',
    faqTitle: '常见问题', srcTitle: '资料来源',
    leadsTitle: '谁给你指的路',
    src: '实线和引文来自游戏原文：2026 年 10 月 Steam 版本的飞船日志、挪麦文字和对话，用官方简体中文译文，以及日志里自带的"这条传闻从哪里听来"的数据。其他走法和地点入口的细节来自 <a href="https://outerwilds.fandom.com/wiki/Outer_Wilds_Wiki" rel="noopener">Outer Wilds 官方 Wiki</a> 和玩家社区，每张卡片的详情里写了出处；标着"未在原文核实"的几条我没在游戏原文里找到依据。不含 DLC《回声之眼》。',
    agents: '给 AI 和程序读的版本：<a href="llms.txt">llms.txt</a>（全文）、<a href="graph.json">graph.json</a>（节点、前置关系和中英原文）。',
    byline: '王雨峰 · 2026 年 10 月 14 日', assets: 'assets/', root: './',
    breadcrumbHome: '王雨峰的博客'
  },
  en: {
    htmlLang: 'en', ogLocale: 'en_US', ogAlt: 'zh_CN',
    title: 'Outer Wilds Clue Map: Every Clue, Location and Route to the Ending',
    description: 'A dependency map of the Outer Wilds base game. To reach the ending you need the Eye of the Universe’s coordinates, the Nomai Vessel and the advanced warp core; see what you must learn first, where each clue is, how to get into key locations and when, and which steps you can get past another way.',
    keywords: 'Outer Wilds, Outer Wilds guide, Outer Wilds clues, Outer Wilds ending, Eye of the Universe coordinates, Nomai, Ash Twin Project, Sunless City, High Energy Lab, Black Hole Forge, Southern Observatory, Quantum Moon sixth location, Dark Bramble anglerfish, Giant’s Deep core',
    socialTitle: 'Outer Wilds Clue Map',
    socialDesc: 'What you need for the Outer Wilds ending, what to learn first, and how to get into every key location — on one zoomable map.',
    imageAlt: 'Outer Wilds clue dependency map', og: 'og-outer-wilds-clues-en.png',
    h1: 'Outer Wilds Clue Map',
    lgAct: '<span><b class="kw-realize">Realize</b>figure something out</span>\n    <span><b class="kw-explore">Explore</b>get somewhere</span>',
    lg: ['Teal: the ending and its must-haves', 'Solid: the intended route', 'Orange dashed: another way (luck, trial, brute force or another clue)', 'Click a card for the game text'],
    spoiler: 'Full spoilers — finish the game first',
    basis: 'Built from the game’s complete original text, the official wiki and community discussion, and carefully refined',
    switchLabel: '中文', switchHref: '../', switchLang: 'zh', switchHreflang: 'zh-CN',
    zoomOut: 'Zoom out', zoomIn: 'Zoom in', fit: 'Whole map', hint: '', tip: 'Pinch or Ctrl/⌘ + scroll to zoom in, drag to look around',
    aria: 'Outer Wilds clue dependency map: main path, getting there, Quantum Moon, the Interloper. A text version is in llms.txt.',
    noscript: 'The map needs JavaScript. Here is the same map as text; indented items are prerequisites of the item above.',
    faqTitle: 'FAQ', srcTitle: 'Sources',
    leadsTitle: 'Who points you where',
    src: 'Solid lines and quotes come from the game itself: ship log, Nomai text and dialogue from the October 2026 Steam build, in the official English text, plus the ship log’s own “where did you hear this” data. Alternatives and location details come from the <a href="https://outerwilds.fandom.com/wiki/Outer_Wilds_Wiki" rel="noopener">Outer Wilds Wiki</a> and the player community, cited on each card; a few marked “not confirmed in the game text” are community claims. Base game only, no Echoes of the Eye.',
    agents: 'For AI and programs: <a href="../llms.txt">llms.txt</a> (full text) and <a href="../graph.json">graph.json</a> (nodes, prerequisites, English and Chinese game text).',
    byline: 'Wang Yufeng · October 14, 2026', assets: '../assets/', root: '../',
    breadcrumbHome: 'Wang Yufeng’s blog'
  }
};

// Content hashes as ?v= so a deploy never pairs new HTML with cached old assets.
const ver = f => crypto.createHash('sha1').update(fs.readFileSync(path.join(POST, 'assets', f))).digest('hex').slice(0, 10);
const VER = { css: ver('graph.css'), data: ver('graph-data.js'), js: ver('graph.js') };
const tpl = fs.readFileSync(path.join(here, 'index.template.html'), 'utf8');
for (const lang of ['zh', 'en']) {
  const c = COPY[lang];
  const url = SITE + URLS[lang];
  const image = `${SITE}${URLS.zh}assets/${c.og}`;
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url + '#webpage', url, name: c.h1, description: c.description, inLanguage: c.htmlLang,
        isPartOf: { '@type': 'WebSite', name: lang === 'zh' ? '王雨峰的博客' : 'Wang Yufeng’s blog', url: SITE + '/' },
        breadcrumb: { '@id': url + '#breadcrumb' }, primaryImageOfPage: { '@id': url + '#image' } },
      { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
        { '@type': 'ListItem', position: 1, name: c.breadcrumbHome, item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: c.h1, item: url } ] },
      { '@type': 'Article', '@id': url + '#article', mainEntityOfPage: { '@id': url + '#webpage' }, headline: c.title, description: c.description,
        inLanguage: c.htmlLang, datePublished: PUBLISHED, dateModified: MODIFIED, image: { '@id': url + '#image' },
        author: { '@type': 'Person', name: '王雨峰', alternateName: 'Wang Yufeng', url: SITE + '/' },
        about: { '@type': 'VideoGame', name: 'Outer Wilds', alternateName: '星际拓荒', datePublished: '2019', genre: 'Adventure',
          author: { '@type': 'Organization', name: 'Mobius Digital' }, publisher: { '@type': 'Organization', name: 'Annapurna Interactive' } },
        keywords: c.keywords,
        workTranslation: lang === 'zh' ? { '@id': SITE + URLS.en + '#article' } : undefined,
        translationOfWork: lang === 'en' ? { '@id': SITE + URLS.zh + '#article' } : undefined,
        hasPart: { '@type': 'Dataset', name: 'Outer Wilds clue dependency graph', description: graph.description, url: SITE + URLS.zh + 'graph.json', encodingFormat: 'application/json', inLanguage: ['en', 'zh-CN'] } },
      { '@type': 'ImageObject', '@id': url + '#image', url: image, contentUrl: image, width: 1200, height: 630, caption: c.imageAlt },
      { '@type': 'FAQPage', '@id': url + '#faq', inLanguage: c.htmlLang,
        mainEntity: FAQ.map(([qq, a]) => ({ '@type': 'Question', name: qq[lang], acceptedAnswer: { '@type': 'Answer', text: a[lang] } })) }
    ]
  };
  const faqHtml = FAQ.map(([qq, a]) => `    <dt>${esc(qq[lang])}</dt>\n    <dd>${esc(a[lang])}</dd>`).join('\n');
  const noscript = bands.map(b => `<h3>${esc(b.title[lang])}${b.band[lang] ? ' · ' + esc(b.band[lang]) : ''}</h3><ul>${b.roots.map(r => htmlTree(r, lang)).join('')}</ul>`).join('\n');
  const vars = {
    ...c, url, image, vCss: VER.css, vData: VER.data, vJs: VER.js,
    spiral: SPIRAL, tlTitle: TIMELINE.title[lang], tlNote: TIMELINE.note[lang],
    timelineSvg: timelineSvg(lang), leads: leadsHtml(lang), endingsHtml: endingsHtml(lang), toolsHtml: toolsHtml(lang),
    endTitle: ENDINGS.title[lang], toolTitle: TOOLS.title[lang],
    belowLabel: lang === 'zh' ? '往下还有' : 'Further down', belowFaq: c.faqTitle, urlZh: SITE + URLS.zh, urlEn: SITE + URLS.en, pageLang: lang,
    otherPath: lang === 'zh' ? URLS.en : URLS.zh,
    jsonld: JSON.stringify(jsonld, null, 1).replace(/<\//g, '<\\/'),
    faq: faqHtml, noscriptList: noscript,
    legend: [c.lgAct].concat(c.lg.map((t, i) => `<span>${['<i class="lg-goal"></i>', '<i class="lg-main"></i>', '<i class="lg-alt"></i>', ''][i]}${esc(t)}</span>`)).join('\n    ')
  };
  const html = tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`Template var missing: ${k}`);
    return ['jsonld', 'faq', 'noscriptList', 'legend', 'src', 'agents', 'spiral', 'timelineSvg', 'leads', 'endingsHtml', 'toolsHtml'].includes(k) ? vars[k] : esc(vars[k]);
  });
  const out = lang === 'zh' ? path.join(POST, 'index.html') : path.join(POST, 'en/index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}
console.log('ok', Object.keys(nodes).length, 'nodes', edges.length, 'edges');
