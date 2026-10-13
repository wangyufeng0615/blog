// Regenerates posts/20261014-outer-wilds-clues/index.html and llms.txt from assets/graph-data.js:
// FAQ (HTML + FAQPage JSON-LD), Article JSON-LD; llms.txt carries the full clue list. Edit the data or the template, then run
//   node scripts/outer-wilds-clues/gen.mjs
// og.html is the source of assets/og-outer-wilds-clues.png (Chrome headless screenshot at 1200x630).
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const tpl = path.join(here, 'index.template.html');
const postDir = path.resolve(here, '../../posts/20261014-outer-wilds-clues');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(postDir, 'assets/graph-data.js'), 'utf8') + '\nthis.TREES = TREES;', ctx);
const TREES = ctx.TREES;
const URL = 'https://wangyufeng.org/outer-wilds-clues/';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const strip = s => String(s).replace(/<[^>]+>/g, '');

const FAQ = [
  ['《星际拓荒》要打出结局，需要凑齐哪几样东西？',
   '三样：宇宙之眼的坐标（在深巨星核心的探测器跟踪模块里）、挪麦人的飞船（困在黑棘星深处）、高级跃迁核心（在灰烬双星计划的中央舱室里）。把核心装进飞船，在舰桥输入坐标，就能跃迁到宇宙之眼。取出核心会让时间循环停止，所以这一步要放在最后一轮。'],
  ['宇宙之眼的坐标每个玩家都一样吗？',
   '一样。坐标对所有玩家、所有存档固定不变，飞船也不检查你这一局有没有亲眼看过跟踪模块。记住坐标的二周目玩家可以完全不去深巨星。'],
  ['能在一个循环里通关吗？',
   '能，对应成就"新手的运气"。知道全部答案时，必做的只剩：拿发射密码，触发天文台雕像（跳过它沙子不会落、太阳也不会爆），跃迁进灰烬双星计划取核心，穿过安康鱼巢到飞船，装核心、输坐标。'],
  ['黑棘星的安康鱼怎么躲？',
   '安康鱼是瞎的，靠声音找猎物，关掉引擎靠惯性滑过去就不会被发现。线索在余烬双星背阴城附近的安康鱼化石：挪麦小孩玩"安康鱼和小鱼"时扮安康鱼的要戴眼罩。另外，从种子出来时速度方向固定，什么都不按直接漂也很稳；转动机身不会惊动它们。'],
  ['怎么潜到深巨星的水流下面、穿过核心外的电场？',
   '设计好的办法是坐逆时针旋转的气旋下去，线索在碎空星南部天文台的龙卷风模型。也可以高速直冲、停在被抛起的岛下面等它砸下来，或者碰巧被卷下去（费尔德斯巴就是无意中发现的）。核心外的电场只能钻进水母穿过，线索是黑棘星里费尔德斯巴吃水母的笔记：外皮像橡胶，能绝缘。'],
  ['灰烬双星计划怎么进去？',
   '保护外壳没有任何物理入口，只能跃迁进去。白洞站教你跃迁平台的用法（站上去，等对应天体经过头顶）；黑洞熔炉说明沙漏双星共用两星之间的对准点，高能实验室的高塔设计图对应每座塔的去向，合起来能推出计划塔的接收点就在灰烬双星表面。接收点一开始埋在沙下，大约第 7 分 50 秒露出来就能用，营火边打盹可以快进。'],
  ['量子卫星的第六个位置怎么去？',
   '要用齐三条量子法则：成像法则（深巨星量子试验之塔），纠缠法则（余烬双星湖床洞穴），第六位置法则（碎空星量子知识之塔：祭坛必须在卫星北极）。在祭坛里关门关灯就会随它移动，让祭坛出现在北极后再用一次，就能见到所莱内姆。这条线不影响通关，但结局营火边会多一个人。'],
  ['挪麦人是怎么灭绝的？',
   '太阳站没能引爆太阳之后，挪麦人去调查刚到的彗星"闯入者"。彗星核心里是高压的幽灵物质，外壳破裂后几乎一瞬间覆盖了整个星系。线索是余烬双星重力炮召回的冰封航天飞机，以及闯入者核心旁的记录；幽灵物质肉眼看不见，用相机能看到。']
];

const ALT_TAG = { official: '官方另一解', luck: '运气 / 硬闯', skip: '二周目直接跳', glitch: '速通 bug' };
const nodes = {};
for (const k in TREES) (function reg(n) { if (n.ref) return; nodes[n.id] = n; (n.kids || []).forEach(reg); })(TREES[k].root);

const faqHtml = FAQ.map(([q, a]) => `    <dt>${esc(q)}</dt>\n    <dd>${esc(a)}</dd>`).join('\n');
const jsonld = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': URL + '#webpage', url: URL, name: '星际拓荒通关线索图', inLanguage: 'zh-CN',
      isPartOf: { '@type': 'WebSite', name: '王雨峰的博客', url: 'https://wangyufeng.org/' },
      primaryImageOfPage: { '@type': 'ImageObject', url: URL + 'assets/og-outer-wilds-clues.png', width: 1200, height: 630 } },
    { '@type': 'Article', '@id': URL + '#article', mainEntityOfPage: { '@id': URL + '#webpage' },
      headline: '星际拓荒通关线索图：Outer Wilds 线索依赖与跳关路线全图',
      description: '《星际拓荒》本体的线索依赖图：结局需要的三样东西、每一步的前置线索与所在星球，以及可以靠运气、二周目或 bug 绕过的步骤。',
      inLanguage: 'zh-CN', datePublished: '2026-10-14T21:00:00+08:00', dateModified: '2026-10-14T21:00:00+08:00',
      author: { '@type': 'Person', name: '王雨峰', url: 'https://wangyufeng.org/' },
      image: URL + 'assets/og-outer-wilds-clues.png',
      about: { '@type': 'VideoGame', name: 'Outer Wilds', alternateName: '星际拓荒', datePublished: '2019',
        author: { '@type': 'Organization', name: 'Mobius Digital' }, publisher: { '@type': 'Organization', name: 'Annapurna Interactive' } },
      keywords: '星际拓荒, Outer Wilds, 宇宙之眼, 挪麦人, 灰烬双星计划, 量子卫星, 线索依赖图' },
    { '@type': 'FAQPage', '@id': URL + '#faq', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  ]
};

let html = fs.readFileSync(tpl, 'utf8');
html = html.replace('/*JSONLD*/', JSON.stringify(jsonld, null, 1).replace(/<\//g, '<\\/'));
html = html.replace('/*FAQ*/', faqHtml);
fs.writeFileSync(path.join(postDir, 'index.html'), html);
function md(n, depth) {
  if (n.ref) return `${'  '.repeat(depth)}- （同上：${nodes[n.ref].label}）`;
  const kids = n.kids || [];
  const req = n.req && kids.length > 1 ? (n.req === 'all' ? '（以下全部需要）' : '（以下任选一）') : '';
  const head = n.t === 'alt' ? `其他走法·${ALT_TAG[n.alt]}：${n.label}` : `${n.label}${req}`;
  return [`${'  '.repeat(depth)}- ${head}${n.place ? ` — ${n.place}` : ''}`].concat(kids.map(k => md(k, depth + 1))).join('\n');
}
const llms = `# 星际拓荒通关线索图（Outer Wilds clue dependency map）

> 《星际拓荒》（Outer Wilds，Mobius Digital，2019）本体的线索依赖图。结局需要凑齐三样东西：宇宙之眼坐标、挪麦飞船、高级跃迁核心。图中每个节点列出它的前置知识、所在星球，以及可以靠运气、硬闯、二周目或速通 bug 绕过的其他走法。不含 DLC《回声之眼》。全文含剧透。

- 页面：${URL}
- 作者：王雨峰（https://wangyufeng.org/）
- 发布：2026-10-14
- 依据：游戏原文（2026 年 10 月 Steam 版，官方简体中文译文的飞船日志、挪麦文字、对话）+ 官方 Wiki、speedrun.com 指南、速通社区 bug 清单。引用时请链接页面。

## 常见问题

${FAQ.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n')}

## 完整依赖清单

缩进项是上一项的前置。"以下任选一"表示满足其中一条即可，"以下全部需要"表示都要满足。

${['main', 'qm', 'comet'].map(k => `### ${TREES[k].title}：${TREES[k].band}\n\n${md(TREES[k].root, 0)}`).join('\n\n')}
`;
fs.writeFileSync(path.join(postDir, 'llms.txt'), llms);
console.log('ok', html.length);
