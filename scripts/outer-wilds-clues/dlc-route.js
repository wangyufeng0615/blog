(()=>{
// Echoes of the Eye as a readable route: one column of steps, three lanes for the archives, branches tucked into the step they leave from.
const D=JSON.parse(document.getElementById('data').textContent),V=JSON.parse(document.getElementById('view-data').textContent);
const L=document.documentElement.lang.startsWith('zh')?'zh':'en',zh=L==='zh';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(window.self!==window.top)document.documentElement.classList.add('embedded');
const NODE={},PHASE={};for(const p of D.phases){PHASE[p.id]=p;for(const n of p.nodes)NODE[n.id]=n}
const SRC=Object.fromEntries(D.sources.map(s=>[s.id,s]));
const T=zh?{details:'详情与原文',hide:'收起',facts:'说明',quotes:'游戏原文',sources:'路线核对',evidence:'在原文档案中查看',any:'三条线任选顺序，每条都是：怎么进馆 → 馆里学到的机制 → 用它解开的封印',all:'三道封印全部熄灭后',branch:'另一条路',lanes:{woods:'覆盖林地',cove:'星光海湾',canyon:'无尽峡谷'},laneSub:{woods:'木筏与黑暗过渡',cove:'死亡与警铃',canyon:'投影范围与隐桥'},entry:'这三件事不分先后'}:{details:'Details & source text',hide:'Hide',facts:'Notes',quotes:'Game text',sources:'Route checks',evidence:'Open in the source archive',any:'Take the three lanes in any order. Each runs: reach the archive → learn its rule → break its seal',all:'Once all three seals are out',branch:'Another way',lanes:{woods:'Shrouded Woodlands',cove:'Starlit Cove',canyon:'Endless Canyon'},laneSub:{woods:'Raft and dark transitions',cove:'Death and alarm bells',canyon:'Projection range and hidden bridge'},entry:'These three can happen in any order'};
const stripNo=s=>s.replace(/^\d+\s*/,'');
// Display only: game line-break escapes and rich-text tags; the embedded records stay verbatim.
const gameText=s=>esc(String(s).replace(/\\{1,2}[nN]/g,'\n').replace(/<\/?(?:color|size|b|i)(?:=[^>]*)?>/g,'').replace(/\n{2,}/g,'\n').trim()).replace(/\n/g,'<br>');
const FLOW=[
 {phase:'arrival',rows:[['radio'],['alignment'],['stranger']]},
 {phase:'entry',rows:[['artifact','lab','fire-rooms'],['dream']],aside:T.entry},
 {phase:'trail',rows:[['lake'],['vault-vision'],['symbol-room'],['temple'],['burning-rooms']]},
 {phase:'archives',title:zh?'三座档案馆，三种机制，三道封印':'Three archives, three rules, three seals',summary:[PHASE.archives.summary[L],PHASE.seals.summary[L]].join(zh?'':' '),aside:T.any,lanes:[['woods',['woods','raft-rule','raft-seal']],['cove',['cove','death-rule','alarm-seal']],['canyon',['canyon','radius-rule','bridge-seal']]],merge:'open-vault'},
 {phase:'farewell',rows:[['meeting'],['farewell'],['eye-coda']]},
 {phase:'history',timeline:['home-moon','block-signal','build-dream','release-signal','heard-signal']},
 {phase:'limits',grid:['loop','flood','stranger-ending','dream-ending']}
];
// Alternatives and asides live inside the step they branch from.
const BRANCH={'raft-rule':['known-raft'],'death-rule':['known-death'],canyon:['lift-route'],'radius-rule':['known-radius'],'symbol-room':['control-room']};
const branchOf={};for(const k in BRANCH)for(const id of BRANCH[k])branchOf[id]=k;
const laneOf={};for(const s of FLOW)for(const [lane,ids] of s.lanes||[])for(const id of ids)laneOf[id]=lane;

function detail(id){const n=NODE[id],other=zh?'en':'zh';return `<div class="detail" hidden>
 <p class="place">${esc(n.place[L])}</p>
 <ul class="facts">${n.facts.map(f=>`<li>${esc(f[L])}</li>`).join('')}</ul>
 <h4>${T.quotes}</h4>${n.quotes.map(q=>`<blockquote><p>${gameText(q[L])}</p><p class="alt" lang="${other}">${gameText(q[other])}</p><a href="evidence.html#${q.anchor}" target="_top">${esc(q.cite)}</a></blockquote>`).join('')}
 ${n.sources.length?`<h4>${T.sources}</h4><ul class="sources">${n.sources.map(s=>SRC[s]).map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a><span>${esc(s.use)}</span></li>`).join('')}</ul>`:''}
</div>`}
function card(id){const v=V[id],lane=laneOf[id];return `<article class="step k-${v.kind}${lane?' lane-'+lane:''}" id="n-${id}" data-id="${id}">
 <h3>${esc(v.title[L])}</h3><p class="note">${esc(v.note[L])}</p>
 ${(BRANCH[id]||[]).map(b=>`<div class="branch k-${V[b].kind}" id="n-${b}" data-id="${b}"><span class="branch-tag">${V[b].kind==='aside'?(zh?'旁支':'Aside'):T.branch}</span><h3>${esc(V[b].title[L].replace(/^(另一走法|已知后|旁支|Alternative|Later|Aside)[:：]\s*/,'').replace(/^./,c=>c.toUpperCase()))}</h3><p class="note">${esc(V[b].note[L])}</p><button class="more" aria-expanded="false">${T.details}</button>${detail(b)}</div>`).join('')}
 <button class="more" aria-expanded="false">${T.details}</button>${detail(id)}
</article>`}
function section(s){
 const p=PHASE[s.phase],title=s.title||stripNo(p.title[L]),summary=s.summary||p.summary[L];
 let body='';
 if(s.rows)body=s.rows.map(r=>`<div class="row cols-${r.length}">${r.map(card).join('')}</div>`).join('');
 if(s.lanes)body=`<div class="lanes">${s.lanes.map(([lane,ids])=>`<div class="lane lane-${lane}"><div class="lane-head" id="h-${ids[0]}"><b>${esc(T.lanes[lane])}</b><span>${esc(T.laneSub[lane])}</span></div>${ids.map(card).join('')}</div>`).join('')}</div><div class="row cols-1 merge">${card(s.merge)}</div>`;
 if(s.timeline)body=`<div class="timeline">${s.timeline.map(card).join('')}</div>`;
 if(s.grid)body=`<div class="grid">${s.grid.map(card).join('')}</div>`;
 return `<section class="phase p-${s.phase}" id="${s.phase}"><header><h2>${esc(title)}</h2><p>${esc(summary)}</p>${s.aside?`<p class="aside-note">${esc(s.aside)}</p>`:''}</header><div class="body">${body}</div></section>`;
}
$('flow').insertAdjacentHTML('beforeend',FLOW.map(section).join(''));

// ---------- connectors ----------
const wires=$('wires'),flow=$('flow');
const GENERIC=new Set(['线索指向','leads to','历史：先后','历史：后续','history','跨时代的因果','across eras']);
const narrow=matchMedia('(max-width: 899px)');
function rect(id,asTarget){let el=$('n-'+id);if(asTarget&&$('h-'+id))el=$('h-'+id);const r=el.getBoundingClientRect(),o=flow.getBoundingClientRect();return{x:r.left-o.left,y:r.top-o.top,w:r.width,h:r.height,cx:r.left-o.left+r.width/2,sec:el.closest('.phase').id}}
function draw(){
 const o=flow.getBoundingClientRect();wires.setAttribute('width',o.width);wires.setAttribute('height',o.height);wires.setAttribute('viewBox',`0 0 ${o.width} ${o.height}`);
 const small=narrow.matches,out=[],labels=[],junction=new Set();
 for(const e of D.edges){
  if(branchOf[e.to]||branchOf[e.from])continue;
  const a=rect(e.from),b=rect(e.to,true),fan=Math.abs(a.cx-b.cx)>4;
  if(small&&(fan||a.sec!==b.sec))continue;
  let d;
  if(Math.abs((a.y+a.h/2)-(b.y+b.h/2))<a.h/2&&b.x>a.x){const y=Math.max(a.y,b.y)+Math.min(a.h,b.h)/2;d=`M${a.x+a.w} ${y}H${b.x-3}`}
  else if(b.y<a.y+a.h)continue;
  else{const y0=a.y+a.h,y1=b.y-3,mid=fan?y1-20:0;
   if(!fan)d=`M${a.cx} ${y0}V${y1}`;else{const r=Math.min(8,Math.abs(b.cx-a.cx)/2),s=b.cx>a.cx?1:-1;d=`M${a.cx} ${y0}V${mid-r}Q${a.cx} ${mid} ${a.cx+s*r} ${mid}H${b.cx-s*r}Q${b.cx} ${mid} ${b.cx} ${mid+r}V${y1}`}
   const label=e.label[L];
   if(e.to==='open-vault'){if(!junction.has(e.to)){junction.add(e.to);labels.push(`<text x="${b.cx+10}" y="${y1-3}" class="wl need">${esc(label)}</text>`)}}
   else if(!GENERIC.has(label)){const ly=fan?y0+(mid-y0)/2:y0+(y1-y0)/2;labels.push(`<text x="${a.cx+9}" y="${ly+4}" class="wl ${e.kind}">${esc(label)}</text>`)}}
  out.push(`<path d="${d}" class="w ${e.kind}" marker-end="url(#m-${e.kind})"/>`);
 }
 wires.querySelector('#paths').innerHTML=out.join('')+labels.join('');
}
narrow.addEventListener?.('change',()=>redraw());
let raf=0;const redraw=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)};
new ResizeObserver(redraw).observe(flow);addEventListener('load',redraw);document.fonts?.ready.then(redraw);

// ---------- details ----------
flow.addEventListener('click',ev=>{const b=ev.target.closest('.more');if(!b)return;const box=b.nextElementSibling,open=box.hidden;box.hidden=!open;b.setAttribute('aria-expanded',open);b.textContent=open?T.hide:T.details;b.closest('.step,.branch').classList.toggle('open',open)});
function reveal(){const id=decodeURIComponent(location.hash.slice(1)).replace(/^n-/,'');const el=$('n-'+id);if(!el)return;const b=el.querySelector(':scope>.more');if(b&&b.getAttribute('aria-expanded')==='false')b.click();el.scrollIntoView({block:'center'})}
addEventListener('hashchange',reveal);if(location.hash)setTimeout(reveal,50);

// ---------- embedded height ----------
if(document.documentElement.classList.contains('embedded')){const post=()=>parent.postMessage({type:'ow-frame-height',height:Math.ceil(document.documentElement.scrollHeight)},'*');new ResizeObserver(post).observe(document.body);addEventListener('load',post)}
})();
