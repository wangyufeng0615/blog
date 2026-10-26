import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {DLC_VIEW} from './dlc-view.mjs';
import {DLC_GROUPS,createDlcLayout} from './dlc-layout.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),post=path.resolve(here,'../../posts/20261014-outer-wilds-clues');
const text=process.env.OW_TEXT_DIR||path.join(process.env.HOME,'Documents/Obsidian Vault/生活/游戏/Outer Wilds');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const dlc=read(path.join(post,'dlc/graph.json')),corpus=read(path.join(text,'中英对照与结构.json'));
test('concise canvas labels cover every audited clue without replacing its complete facts',()=>{
 const nodes=dlc.phases.flatMap(p=>p.nodes);
 assert.deepEqual(new Set(Object.keys(DLC_VIEW)),new Set(nodes.map(n=>n.id)));
 for(const n of nodes)for(const lang of ['zh','en']){
  assert.ok(DLC_VIEW[n.id].title[lang].trim(),n.id+' title '+lang);
  assert.ok(DLC_VIEW[n.id].note[lang].trim(),n.id+' note '+lang);
 }
 for(const file of ['dlc/index.html','dlc/en/index.html']){
  const html=fs.readFileSync(path.join(post,file),'utf8');
  const embedded=JSON.parse(html.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(embedded,dlc,file+' retains complete notes and resolved source records');
 }
});
test('all Stranger log records and conditional variants remain verbatim',()=>{
 const original=corpus.text_records.filter(r=>r.asset==='InvisiblePlanet'&&r.kind==='shiplog_text');
 const exported=dlc.source_records.filter(r=>r.asset==='InvisiblePlanet'&&r.kind==='shiplog_text');
 assert.equal(original.length,98);assert.deepEqual(new Set(exported.map(r=>r.id)),new Set(original.map(r=>r.id)));
 for(const r of dlc.source_records){const raw=corpus.text_records.find(x=>x.id===r.id);assert.ok(raw,r.id);assert.equal(r.en,raw.english);assert.equal(r.zh,raw.chinese);assert.deepEqual(r.context,raw.context)}
});
test('all cited bilingual quotes resolve to the exact extracted source record',()=>{
 const byId=new Map(dlc.source_records.map(r=>[r.id,r]));
 for(const phase of dlc.phases)for(const node of phase.nodes){assert.ok(node.quotes.length,node.id);assert.equal(node.facts.length,2,node.id);for(const q of node.quotes){assert.deepEqual(q,byId.get(q.id),node.id+' '+q.id)}}
});
test('copied original XML files match their retained SHA256 hashes',()=>{
 for(const f of dlc.source_manifest){const bytes=fs.readFileSync(path.join(post,'dlc',f.path));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.sha256,f.name)}
});
test('discovery routes stay distinct from mandatory mechanics and have no circular first-visit requirements',()=>{
 const ids=new Set(dlc.phases.flatMap(p=>p.nodes.map(n=>n.id))),seen=new Set(),stack=new Set();
 assert.equal(ids.size,39);assert.equal(dlc.edges.length,36);
 for(const e of dlc.edges){assert.ok(ids.has(e.from));assert.ok(ids.has(e.to));assert.ok(['learn','need','optional','history','alternative'].includes(e.kind))}
 const visit=id=>{assert.ok(!stack.has(id),'cycle at '+id);if(seen.has(id))return;stack.add(id);for(const e of dlc.edges.filter(e=>e.from===id))visit(e.to);stack.delete(id);seen.add(id)};for(const id of ids)visit(id);
 const prerequisites=dlc.edges.filter(e=>e.to==='open-vault'&&e.kind==='need').map(e=>e.from);
 assert.deepEqual(new Set(prerequisites),new Set(['raft-seal','alarm-seal','bridge-seal']));
 assert.equal(dlc.edges.find(e=>e.from==='lab'&&e.to==='dream').kind,'learn');
 assert.equal(dlc.edges.find(e=>e.from==='cove'&&e.to==='death-rule').kind,'learn');
 assert.ok(!dlc.edges.some(e=>e.from==='death-rule'&&e.to==='cove'));
});
test('the integrated Nomai dataset is identical to the audited Vault dataset',()=>{
 const current=read(path.join(text,'挪麦人物关系图谱数据.json')),integrated=read(path.join(post,'nomai/graph.json'));
 assert.deepEqual(integrated,current);assert.equal(integrated.people.length,43);assert.equal(integrated.people.reduce((n,p)=>n+p.facts.length,0),137);assert.equal(integrated.edges.length+integrated.unnamed_relations.length,131);
 const html=fs.readFileSync(path.join(post,'nomai/index.html'),'utf8'),embedded=JSON.parse(html.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/)[1]);assert.deepEqual(embedded,current);
});
test('both topic languages embed the two new sections and retain the base map',()=>{
 for(const name of ['index.html','en/index.html']){const html=fs.readFileSync(path.join(post,name),'utf8');for(const id of ['base-map','nomai','dlc','nomai-frame','dlc-frame'])assert.ok(html.includes('id="'+id+'"'),name+' '+id);assert.ok(!html.includes('{{'));const ld=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);assert.equal(ld['@graph'].find(x=>x['@type']==='Article').hasPart.length,3)}
 const graph=read(path.join(post,'graph.json'));assert.equal(graph.topic_sections.length,3);assert.equal(graph.nodes.length,145);assert.equal(graph.nodes.reduce((n,x)=>n+x.prerequisites.length,0),148);
});
test('route and star-chart layouts place every audited DLC clue and Nomai person exactly once',()=>{
 const ids=dlc.phases.flatMap(p=>p.nodes.map(n=>n.id));
 const placed=DLC_GROUPS.flatMap(s=>s.ids);
 assert.deepEqual([...placed].sort(),[...ids].sort(),'every clue appears once');
 const chart=fs.readFileSync(path.join(here,'nomai-view.js'),'utf8'),groups=chart.slice(chart.indexOf('const GROUPS='),chart.indexOf('const ERA='));
 const nomai=read(path.join(post,'nomai/graph.json')),members=[...groups.matchAll(/'([A-Z_]+)'/g)].map(m=>m[1]);
 assert.deepEqual([...members].sort(),nomai.people.map(p=>p.id).sort());
});

test('DLC map uses short, directly visible cards, with full sources preserved separately',()=>{
 const ids=dlc.phases.flatMap(p=>p.nodes.map(n=>n.id));
 for(const file of ['dlc/index.html','dlc/en/index.html']){
  const html=fs.readFileSync(path.join(post,file),'utf8');
  const body=html.slice(html.indexOf('<main id="flow">'),html.indexOf('<footer class="foot">'));
  assert.doesNotMatch(body,/<(?:button|details|summary|blockquote)\b|aria-expanded=|class="(?:evidence|facts)"/);
  for(const mode of ['wide','narrow']){
   const svg=body.match(new RegExp('<svg class="clue-sheet '+mode+'"[\\s\\S]*?<\\/svg>'))?.[0];
   assert.ok(svg,mode);
   const rendered=[...svg.matchAll(/data-id="([a-z-]+)"/g)].map(m=>m[1]);
   assert.deepEqual(rendered.sort(),[...ids].sort());
  }
 }
 // A card carries one actionable idea; the source paragraphs must not leak back onto its face.
 for(const [id,v] of Object.entries(DLC_VIEW)){
  assert.ok(v.title.zh.length<=25,id+' Chinese title');
  assert.ok(v.note.zh.length<=48,id+' Chinese note');
  assert.ok(v.note.en.length<=160,id+' English note');
 }
});

test('both responsive DLC layouts keep nodes separate and route edges outside other cards',()=>{
 for(const lang of ['zh','en'])for(const mobile of [false,true]){
  const layout=createDlcLayout(dlc,DLC_VIEW,lang,mobile),nodes=Object.values(layout.nodes);
  assert.equal(nodes.length,39);
  for(const n of nodes){assert.ok(n.x>=0&&n.y>=0&&n.x+n.w<=layout.width&&n.y+n.h<=layout.height,n.id+' stays inside the cloth')}
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
   const a=nodes[i],b=nodes[j];
   assert.ok(!(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y),`${lang} ${mobile}: ${a.id} overlaps ${b.id}`);
  }
  for(const edge of layout.edges)for(let i=1;i<edge.points.length;i++){
   const a=edge.points[i-1],b=edge.points[i];
   assert.ok(a.x===b.x||a.y===b.y,'orthogonal route segment');
   for(const n of nodes){
    if(n.id===edge.from||n.id===edge.to)continue;
    const hit=a.x===b.x?a.x>n.x&&a.x<n.x+n.w&&Math.max(a.y,b.y)>n.y&&Math.min(a.y,b.y)<n.y+n.h:a.y>n.y&&a.y<n.y+n.h&&Math.max(a.x,b.x)>n.x&&Math.min(a.x,b.x)<n.x+n.w;
    assert.ok(!hit,`${lang} ${mobile}: ${edge.from} → ${edge.to} crosses ${n.id}`);
   }
  }
  for(const edge of dlc.edges)assert.ok(layout.edges.some(e=>e.from===edge.from&&e.to===edge.to&&e.kind===edge.kind),'keep audited edge semantics');
 }
});
