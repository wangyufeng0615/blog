(()=>{
// Nomai people: a star chart for orientation, a dossier for reading. Facts and evidence come unchanged from #data.
const D=JSON.parse(document.getElementById('data').textContent);
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const NS='http://www.w3.org/2000/svg',svg=$('chart'),panel=$('panel');
if(window.self!==window.top)document.documentElement.classList.add('embedded');

// Thematic regions of the chart. Unnamed relatives sit with the person they belong to.
const GROUPS=[
 {id:'pod1',title:'1号舱 · 失散与思念',ids:['PLUME','KEEK','KOUSA','FOLI','THATCH']},
 {id:'pod3',title:'3号舱 · 最后求生',ids:['ESCALL','SECCA','DIN']},
 {id:'forge',title:'跃迁重建 · 黑洞熔炉',ids:['ANNONA','POKE','CLARY','MITIS','ROOT','YARROW']},
 {id:'lab',title:'高能实验室 · 太阳站',ids:['PYE','RAMIE','IDAEA','PRIVET','FILIX']},
 {id:'cannon',title:'轨道探测炮 · 记忆雕像',ids:['CASSAVA','DAZ','AVENS','MALLOW','PHLOX']},
 {id:'sky',title:'天文台 · 课堂 · 朝圣',ids:['CONOY','SPIRE','BELLS','SOLANUM','ILEX','LAMI','LAEVI','TAGET']},
 {id:'life',title:'量子研究 · 生态保护',ids:['MELORAE','COLEUS','CYCAD','OENO','BUR','RHUS']},
 {id:'modern',title:'其他家族 · 末日通信',ids:['CANNA','BROMI','CLEM','HYSSOP','NEEM']}
];
const ERA={'坠落初代':{key:'first',label:'坠落初代'},'工程时期':{key:'build',label:'工程时期'},'孩童与成年朝圣':{key:'young',label:'孩子们'},'后期孩子们':{key:'young',label:'孩子们'},'现代其他家族':{key:'modern',label:'其他家族'},'仅被提及':{key:'mention',label:'仅被提及'}};
const TYPE={kin:'亲情',teach:'师承',work:'往来',ref:'提及'};
const TYPE_LONG={kin:'亲属、伴侣与思念',teach:'师承与传授',work:'合作、讨论与通信',ref:'只被提及或转述'};
const typeOf=e=>e.layer==='reference'?'ref':['亲属','伴侣','牵挂'].includes(e.kind)?'kin':['师承','传授'].includes(e.kind)?'teach':'work';

const people=[...D.people.map(p=>({...p,named:true})),...D.unnamed_people.map(p=>({...p,named:false}))];
const P=Object.fromEntries(people.map(p=>[p.id,p])),J=Object.fromEntries(D.projects.map(p=>[p.id,p]));
const E=[...D.edges,...D.unnamed_relations].map(e=>({...e,type:typeOf(e)})),EM=Object.fromEntries(E.map(e=>[e.id,e]));
const groupOf={};for(const g of GROUPS)for(const id of g.ids)groupOf[id]=g.id;for(const p of D.unnamed_people)groupOf[p.id]=groupOf[p.relative];
const degree={};for(const e of E){degree[e.a]=(degree[e.a]||0)+1;degree[e.b]=(degree[e.b]||0)+1}
const linksOf=id=>E.filter(e=>e.a===id||e.b===id);

// ---------- layout: seeded force simulation with label-box collision ----------
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const short=p=>p.named?p.name:p.name.split('的').pop();
const N=people.map(p=>{const r=p.named?3.6+Math.sqrt(degree[p.id]||1)*1.35:3,w=Math.max(2*r,[...short(p)].length*(p.named?13:11.5)+6);return{id:p.id,p,r,w,h:r*2+19,x:0,y:0,vx:0,vy:0}}),NM=Object.fromEntries(N.map(n=>[n.id,n]));
(function simulate(){
 const rand=rng(20261020),centers={},ids=GROUPS.map(g=>g.id),cross={};
 for(const e of E){const a=groupOf[e.a],b=groupOf[e.b];if(a!==b){const k=[a,b].sort().join();cross[k]=(cross[k]||0)+(e.type==='work'?1:2)}}
 // Order regions around the ring so heavily linked regions sit next to each other.
 const w=(a,b)=>cross[[a,b].sort().join()]||0;let best=null,bestCost=Infinity;
 (function perm(order,rest){if(!rest.length){let c=0;for(let i=0;i<order.length;i++)for(let j=i+1;j<order.length;j++){const d=Math.min(j-i,order.length-(j-i));c+=w(order[i],order[j])*d*d}if(c<bestCost){bestCost=c;best=order}return}for(let i=0;i<rest.length;i++)perm([...order,rest[i]],rest.filter((_,j)=>j!==i))})([ids[0]],ids.slice(1));
 best.forEach((id,i)=>{const a=-Math.PI/2+i/best.length*Math.PI*2;centers[id]={x:Math.cos(a)*470,y:Math.sin(a)*330}});
 for(const n of N){const c=centers[groupOf[n.id]];n.x=c.x+(rand()-.5)*90;n.y=c.y+(rand()-.5)*90}
 for(const n of N)if(!n.p.named){const r=NM[n.p.relative];n.x=r.x+(rand()-.5)*30;n.y=r.y+30}
 const spring={kin:[52,.07],teach:[60,.06],work:[95,.025],ref:[130,.008]},T=650;
 for(let it=0;it<T;it++){
  const alpha=1-it/T;
  for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const a=N[i],b=N[j];let dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy||1;if(d2>90000)continue;const f=2600/d2*alpha,d=Math.sqrt(d2);dx/=d;dy/=d;a.vx-=dx*f;a.vy-=dy*f;b.vx+=dx*f;b.vy+=dy*f}
  for(const e of E){const a=NM[e.a],b=NM[e.b],inner=groupOf[e.a]===groupOf[e.b],[L,k]=inner?spring[e.type]:[220,.004];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;const f=(d-L)*k*alpha;dx/=d;dy/=d;a.vx+=dx*f;a.vy+=dy*f;b.vx-=dx*f;b.vy-=dy*f}
  for(const n of N){const c=centers[groupOf[n.id]];n.vx+=(c.x-n.x)*.03*alpha;n.vy+=(c.y-n.y)*.03*alpha;n.vx-=n.x*.0015;n.vy-=n.y*.0015;n.vx*=.62;n.vy*=.62;n.x+=n.vx;n.y+=n.vy}
  if(it>T*.25)for(let pass=0;pass<2;pass++)for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const a=N[i],b=N[j],ox=(a.w+b.w)/2+14-Math.abs(a.x-b.x),oy=(a.h+b.h)/2+10-Math.abs((a.y+a.h/2)-(b.y+b.h/2));if(ox>0&&oy>0){if(ox<oy*1.6){const s=a.x<b.x?-1:1;a.x+=s*ox/2;b.x-=s*ox/2}else{const s=a.y<b.y?-1:1;a.y+=s*oy/2;b.y-=s*oy/2}}}
 }
})();

// ---------- drawing ----------
const el=(tag,attrs={},parent)=>{const n=document.createElementNS(NS,tag);for(const k in attrs)n.setAttribute(k,attrs[k]);parent&&parent.appendChild(n);return n};
const gStars=el('g',{class:'stars'},svg),gRegions=el('g',{class:'regions'},svg),gEdges=el('g',{class:'edges'},svg),gLabels=el('g',{class:'edge-labels'},svg),gNodes=el('g',{class:'nodes'},svg);
let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;for(const n of N){minX=Math.min(minX,n.x-n.w/2);maxX=Math.max(maxX,n.x+n.w/2);minY=Math.min(minY,n.y-n.r);maxY=Math.max(maxY,n.y+n.h)}
const regionBox={};for(const g of GROUPS){const ns=N.filter(n=>groupOf[n.id]===g.id);regionBox[g.id]={x0:Math.min(...ns.map(n=>n.x-n.w/2)),x1:Math.max(...ns.map(n=>n.x+n.w/2)),y0:Math.min(...ns.map(n=>n.y-n.r)),y1:Math.max(...ns.map(n=>n.y+n.h))};minY=Math.min(minY,regionBox[g.id].y0-30)}
const WORLD={x:minX-20,y:minY-10,w:maxX-minX+40,h:maxY-minY+20};
{const rand=rng(7);for(let i=0;i<140;i++)el('circle',{cx:WORLD.x+rand()*WORLD.w,cy:WORLD.y+rand()*WORLD.h,r:rand()<.85?.6:1.1,opacity:(.15+rand()*.35).toFixed(2)},gStars)}
for(const g of GROUPS){const b=regionBox[g.id];const t=el('text',{x:(b.x0+b.x1)/2,y:b.y0-16,class:'region','data-group':g.id},gRegions);t.textContent=g.title}

const pairIndex={};
const edgeEls=E.map(e=>{
 const a=NM[e.a],b=NM[e.b],mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
 const key=[e.a,e.b].sort().join(),k=pairIndex[key]=(pairIndex[key]||0)+1,bend=(e.type==='work'||e.type==='ref'?.12:.07)*d*(k%2?1:-1)*Math.ceil(k/2);
 const cx=mx-dy/d*bend,cy=my+dx/d*bend,path=`M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
 const line=el('path',{d:path,class:'edge '+e.type,'data-edge':e.id},gEdges);
 const hit=el('path',{d:path,class:'edge-hit','data-edge':e.id},gEdges);
 const label=el('text',{class:'edge-label '+e.type},gLabels);label.textContent=e.label;el('title',{},hit).textContent=`${P[e.a].name} — ${P[e.b].name}：${e.label}`;
 return{e,line,hit,label,a,b,cx,cy,lw:[...e.label].length*10.5+6};
});
const nodeEls={};
for(const n of N){
 const p=n.p,era=p.named?ERA[p.era]?.key||'build':'unnamed',g=el('g',{class:'node '+era,transform:`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`,tabindex:'0',role:'button','data-id':n.id,'aria-label':`${p.name}${p.named?'，'+p.role:'（姓名未记载）'}`},gNodes);
 el('rect',{x:-n.w/2-2,y:-n.r-4,width:n.w+4,height:n.h+6,class:'hit'},g);el('circle',{r:n.r+9,class:'halo'},g);el('circle',{r:n.r,class:'dot'},g);
 const t=el('text',{y:n.r+14,class:'name'},g);t.textContent=short(p);
 nodeEls[n.id]=g;
}

// ---------- camera ----------
let view={...WORLD};
// Fit a world box into the part of the chart not covered by the toolbar and zoom buttons.
function fitView(box,pad=0){const r=svg.getBoundingClientRect(),bar=document.querySelector('.sky-bar').getBoundingClientRect(),zb=$('zoom-fit').parentNode.getBoundingClientRect(),top=Math.max(0,bar.bottom-r.top+6),bottom=Math.max(0,r.bottom-zb.top+6),aw=r.width,ah=Math.max(60,r.height-top-bottom),w=box.w+pad*2,h=box.h+pad*2,k=Math.min(aw/w,ah/h),vw=r.width/k,vh=r.height/k;return{x:box.x-pad-(aw/k-w)/2,y:box.y-pad-top/k-(ah/k-h)/2,w:vw,h:vh}}
let anim=0;
function tween(to){cancelAnimationFrame(anim);const from={...view},t0=performance.now(),dur=matchMedia('(prefers-reduced-motion: reduce)').matches?0:320;const step=t=>{const k=dur?Math.min(1,(t-t0)/dur):1,e=1-Math.pow(1-k,3);view={x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e,w:from.w+(to.w-from.w)*e,h:from.h+(to.h-from.h)*e};apply();if(k<1)anim=requestAnimationFrame(step)};anim=requestAnimationFrame(step)}
function fit(){cancelAnimationFrame(anim);view=fitView(WORLD);apply()}
function frame(ids){const ns=[...ids].map(id=>NM[id]);let box={x:Math.min(...ns.map(n=>n.x-n.w/2)),y:Math.min(...ns.map(n=>n.y-n.r)),x1:Math.max(...ns.map(n=>n.x+n.w/2)),y1:Math.max(...ns.map(n=>n.y+n.h+14))};box={x:box.x,y:box.y,w:box.x1-box.x,h:box.y1-box.y};const minW=WORLD.w/2.2;if(box.w<minW){box.x-=(minW-box.w)/2;box.w=minW}const minH=WORLD.h/2.2;if(box.h<minH){box.y-=(minH-box.h)/2;box.h=minH}tween(fitView(box,50))}
function apply(){svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`);const z=WORLD.w/view.w;svg.style.setProperty('--z',Math.max(.6,Math.min(z,3)));$('zoom-out').disabled=view.w>=WORLD.w*1.6;$('zoom-in').disabled=view.w<=WORLD.w/5}
function zoomAt(f,cx,cy){const r=svg.getBoundingClientRect(),px=view.x+(cx-r.left)/r.width*view.w,py=view.y+(cy-r.top)/r.height*view.h,nw=Math.min(WORLD.w*1.6,Math.max(WORLD.w/5,view.w*f)),s=nw/view.w;view={x:px-(px-view.x)*s,y:py-(py-view.y)*s,w:nw,h:view.h*s};apply()}
const pointers=new Map();let drag=null,moved=false;
svg.addEventListener('pointerdown',ev=>{pointers.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});moved=false;if(pointers.size===1)drag={x:ev.clientX,y:ev.clientY,v:{...view}};else if(pointers.size===2){const [a,b]=[...pointers.values()];drag={pinch:Math.hypot(a.x-b.x,a.y-b.y),v:{...view},cx:(a.x+b.x)/2,cy:(a.y+b.y)/2}}});
svg.addEventListener('pointermove',ev=>{if(!pointers.has(ev.pointerId)||!drag)return;pointers.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});const r=svg.getBoundingClientRect();if(pointers.size===2&&drag.pinch){const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);view={...drag.v};zoomAt(drag.pinch/d,drag.cx,drag.cy);moved=true;return}const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4){moved=true;svg.setPointerCapture(ev.pointerId);svg.classList.add('dragging')}if(moved){view={...view,x:drag.v.x-dx/r.width*view.w,y:drag.v.y-dy/r.height*view.h};apply()}});
const up=ev=>{pointers.delete(ev.pointerId);if(!pointers.size){drag=null;svg.classList.remove('dragging')}else if(pointers.size===1){const [p]=[...pointers.values()];drag={x:p.x,y:p.y,v:{...view}}}};
svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
svg.addEventListener('wheel',ev=>{if(!ev.ctrlKey&&!ev.metaKey)return;ev.preventDefault();zoomAt(Math.exp(ev.deltaY*.01),ev.clientX,ev.clientY)},{passive:false});
$('zoom-in').onclick=()=>{const r=svg.getBoundingClientRect();zoomAt(.75,r.left+r.width/2,r.top+r.height/2)};
$('zoom-out').onclick=()=>{const r=svg.getBoundingClientRect();zoomAt(1/.75,r.left+r.width/2,r.top+r.height/2)};
$('zoom-fit').onclick=()=>tween(fitView(WORLD));

// ---------- state ----------
const hidden=new Set();let selected=null,hover=null,project=null,query='';
function focusSet(){
 const id=hover||selected;if(id){const s=new Set([id]);for(const e of linksOf(id))if(!hidden.has(e.type)){s.add(e.a);s.add(e.b)}return{nodes:s,center:id}}
 if(project)return{nodes:new Set(J[project].members),center:null};
 if(query)return{nodes:new Set(people.filter(matches).map(p=>p.id)),center:null};
 return null;
}
function matches(p){const q=query.toLowerCase();return [p.name,p.en,p.role,p.summary,...(p.facts||[])].some(s=>String(s||'').toLowerCase().includes(q))}
function paint(){
 const f=focusSet(),center=f?.center;
 svg.classList.toggle('focused',!!f);
 for(const id in nodeEls){const g=nodeEls[id];g.classList.toggle('on',!!f&&f.nodes.has(id));g.classList.toggle('center',id===center);g.classList.toggle('selected',id===selected)}
 const want=[];
 for(const x of edgeEls){const off=hidden.has(x.e.type),ego=!!center&&(x.e.a===center||x.e.b===center),inSet=!!f&&!center&&f.nodes.has(x.e.a)&&f.nodes.has(x.e.b);x.line.classList.toggle('off',off);x.hit.classList.toggle('off',off);x.line.classList.toggle('on',!off&&(ego||inSet));x.label.classList.remove('on');if(!off&&ego&&P[x.e.a].named&&P[x.e.b].named)want.push(x)}
 placeLabels(want,f);
}
// Greedy placement along each curve; a label that cannot fit stays hidden (the dossier lists every link).
const RANK={kin:0,teach:1,work:2,ref:3};
function placeLabels(list,f){
 const boxes=[...(f?.nodes||[])].map(id=>{const n=NM[id];return[n.x-n.w/2,n.y-n.r-2,n.x+n.w/2,n.y+n.h-2]});
 const hit=b=>boxes.some(o=>b[0]<o[2]&&b[2]>o[0]&&b[1]<o[3]&&b[3]>o[1]);
 for(const x of list.sort((p,q)=>RANK[p.e.type]-RANK[q.e.type])){
  const dx=x.b.x-x.a.x,dy=x.b.y-x.a.y,d=Math.hypot(dx,dy)||1,offs=x.e.type==='kin'||x.e.type==='teach'?[0,14,-14,26,-26]:[0];
  const other=NM[x.e.a===f.center?x.e.b:x.e.a],spots=[];
  for(const o of offs)for(const t of [.5,.62,.38,.72,.28]){const u=1-t;spots.push([u*u*x.a.x+2*u*t*x.cx+t*t*x.b.x-dy/d*o,u*u*x.a.y+2*u*t*x.cy+t*t*x.b.y+dx/d*o])}
  if(offs.length>1)spots.push([other.x,other.y+other.h+9],[other.x,other.y-other.r-12],[other.x-other.w/2-x.lw/2-4,other.y+other.r+10],[other.x+other.w/2+x.lw/2+4,other.y+other.r+10]);
  for(const [px,py] of spots){const b=[px-x.lw/2,py-8,px+x.lw/2,py+7];if(!hit(b)){boxes.push(b);x.label.setAttribute('x',px.toFixed(1));x.label.setAttribute('y',(py+3.5).toFixed(1));x.label.classList.add('on');break}}
 }
}
function setHash(v){try{history.replaceState(null,'',v?'#'+v:location.pathname+location.search)}catch{}}
function select(id,{scroll=true}={}){selected=id;project=null;paint();renderPerson(id);setHash(id);if(scroll)panel.scrollTop=0;frame(focusSet().nodes);$('status').textContent='已选中 '+P[id].name}
function clear(){selected=null;project=null;paint();renderOverview();setHash('');panel.scrollTop=0;tween(fitView(WORLD))}
for(const id in nodeEls){const g=nodeEls[id];
 g.addEventListener('pointerenter',ev=>{if(ev.pointerType==='mouse'){hover=id;paint()}});
 g.addEventListener('pointerleave',()=>{if(hover===id){hover=null;paint()}});
 g.addEventListener('click',()=>{if(moved)return;hover=null;selected===id?clear():select(id)});
 g.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();select(id)}});
 g.addEventListener('focus',()=>{hover=id;paint()});g.addEventListener('blur',()=>{hover=null;paint()});
}
for(const x of edgeEls)x.hit.addEventListener('click',()=>{if(moved)return;const e=x.e;select(e.a);const row=panel.querySelector(`[data-rel="${e.id}"]`);if(row){row.open=true;row.scrollIntoView({block:'center'})}});
svg.addEventListener('click',ev=>{if(!moved&&!ev.target.closest('.node')&&!ev.target.closest('.edge-hit')&&(selected||project))clear()});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&(selected||project)){clear()}});

// ---------- dossier ----------
const ERA_ORDER=['first','build','young','modern','mention','unnamed'],ERA_NAME={first:'坠落初代',build:'工程时期',young:'孩子们',modern:'其他家族',mention:'仅被提及',unnamed:'未具名亲属'};
function quote(r){return `<div class="src"><span>${esc(r.asset)} · 块 ${r.blocks.join('、')}</span>${r.blocks.map(id=>{const b=D.evidence[r.asset]?.find(b=>b.id===id);return b?`<blockquote><p>${esc(b.zh.replace(/\\+(?=\n)/g,'')).replace(/\n+/g,'<br>')}</p><p lang="en">${esc(b.en.replace(/\\+(?=\n)/g,'')).replace(/\n+/g,'<br>')}</p></blockquote>`:''}).join('')}</div>`}
function context(assets){return `<details class="ctx"><summary>完整对话上下文</summary>${assets.map(a=>`<details><summary>${esc(a)}</summary>${quote({asset:a,blocks:(D.evidence[a]||[]).map(b=>b.id)})}</details>`).join('')}</details>`}
const who=id=>`<button class="who ${P[id].named?ERA[P[id].era]?.key:'unnamed'}" data-go="${id}">${esc(P[id].name)}</button>`;
function relRow(e,id){const other=e.a===id?e.b:e.a;return `<details class="rel" data-rel="${e.id}"><summary>${who(other)}<span class="rel-label">${esc(e.label)}</span><span class="cert">${esc(e.certainty)}</span></summary>${e.note?`<p>${esc(e.note)}</p>`:''}${(e.evidence_blocks||[]).map(quote).join('')}${e.contexts?context([...new Set(e.contexts.map(r=>r.asset))]):''}</details>`}
function renderPerson(id){
 const p=P[id],links=linksOf(id),era=p.named?ERA[p.era]?.key:'unnamed';
 const byType=Object.keys(TYPE).map(t=>[t,links.filter(e=>e.type===t)]).filter(([,l])=>l.length);
 const shared=D.shared_text_groups.filter(g=>g.members.includes(id));
 panel.innerHTML=`<div class="dossier">
 <button class="back" id="back">← 全部人物</button>
 <header class="person-head"><span class="era-mark ${era}"></span><div><h2>${esc(p.name)}<small lang="en">${p.named?esc(p.en):''}</small></h2><p class="role">${esc(p.named?ERA[p.era].label+' · '+p.role:'未具名亲属 · 不计入43位具名人物')}</p></div></header>
 <p class="summary">${esc(p.summary)}</p>
 ${p.caveat?`<p class="caveat"><b>辨认提醒</b>${esc(p.caveat)}</p>`:''}
 ${p.facts?.length?`<section><h3>事迹 <span>${p.facts.length}</span></h3><ol class="facts">${p.facts.map((f,i)=>`<li><p>${esc(f)}</p><details><summary>原文</summary>${(p.fact_refs[i]||[]).map(quote).join('')}${context([...new Set((p.fact_refs[i]||[]).map(r=>r.asset))])}</details></li>`).join('')}</ol></section>`:''}
 <section><h3>关系 <span>${links.length}</span></h3>${byType.map(([t,l])=>`<div class="rel-group"><h4><i class="swatch ${t}"></i>${TYPE_LONG[t]}</h4>${l.map(e=>relRow(e,id)).join('')}</div>`).join('')||'<p class="muted">没有文本可证的具名联系。</p>'}
 ${shared.length?`<details class="shared"><summary>另有 ${shared.length} 组共同文本，不推定两两关系</summary><p class="muted">这些名字在同一文字组中发言，可能隔着时间或经由他人接续。</p>${shared.map(g=>`<p><span class="asset">${esc(g.asset)}</span>${g.members.filter(m=>m!==id).map(who).join('')}</p>`).join('')}</details>`:''}</section>
 ${p.projects?.length?`<section><h3>参与的工程与记录</h3><div class="projects">${p.projects.map(j=>`<button class="project" data-project="${j}"><b>${esc(J[j].title)}</b><span>${esc(J[j].summary)}</span></button>`).join('')}</div></section>`:''}
 ${p.relative?`<section><h3>对应人物</h3><p>${who(p.relative)}</p></section>`:''}
 </div>`;
}
function renderProject(j){
 const pr=J[j];project=j;selected=null;paint();setHash('');
 panel.innerHTML=`<div class="dossier"><button class="back" id="back">← 全部人物</button><header class="person-head"><div><h2>${esc(pr.title)}</h2><p class="role">工程与记录 · ${pr.members.length} 人</p></div></header><p class="summary">${esc(pr.summary)}</p><p class="caveat"><b>边界</b>列出的是同一工程或记录中的不同角色，不自动产生两两合作关系。</p><section><h3>成员</h3><p class="who-list">${pr.members.map(who).join('')}</p></section><section><h3>原文</h3>${context(pr.refs)}</section></div>`;
  panel.scrollTop=0;frame(pr.members);
}
function renderOverview(){
 const counts={};for(const e of E)counts[e.type]=(counts[e.type]||0)+1;
 const featured=['SOLANUM','ESCALL','POKE','CLARY','CASSAVA','FILIX'];
 panel.innerHTML=`<div class="overview">
 <h2>${esc(D.title)}</h2>
 <p class="summary">43 位具名挪麦人，从坠落、定居到工程时期和他们的孩子。星图按工程和事件分成八片区域，点亮一个人会看到与其相连的人；完整事迹和中英原文都在这一栏里。</p>
 <section><h3>颜色是世代</h3><ul class="legend">${ERA_ORDER.map(k=>`<li><i class="era-mark ${k}"></i>${ERA_NAME[k]}<span>${k==='unnamed'?D.unnamed_people.length:D.people.filter(p=>ERA[p.era]?.key===k).length}</span></li>`).join('')}</ul></section>
 <section><h3>线条是关系，可开关</h3><div class="filters">${Object.keys(TYPE).map(t=>`<button class="filter" data-type="${t}" aria-pressed="${!hidden.has(t)}"><i class="swatch ${t}"></i><b>${TYPE[t]}</b><span>${TYPE_LONG[t]} · ${counts[t]||0}</span></button>`).join('')}</div></section>
 <section><h3>可以从这些人读起</h3><div class="featured">${featured.map(id=>`<button data-go="${id}"><b>${esc(P[id].name)}</b><span>${esc(P[id].summary)}</span></button>`).join('')}</div></section>
 <section><h3>全部人物 <span>${D.people.length}</span></h3>${GROUPS.map(g=>`<div class="index-group"><h4>${esc(g.title)}</h4><p class="who-list">${g.ids.map(who).join('')}</p></div>`).join('')}</section>
 <section><h3>工程与记录 <span>${D.projects.length}</span></h3><div class="projects">${D.projects.map(j=>`<button class="project" data-project="${j.id}"><b>${esc(j.title)}</b><span>${j.members.length} 人 · ${esc(j.summary)}</span></button>`).join('')}</div></section>
 <section><h3>口径</h3><p class="muted">${esc(D.scope)}</p><details class="shared"><summary>${D.relationship_exclusions.length} 组同处提及但不算直接关系</summary>${D.relationship_exclusions.map(r=>`<div class="excl"><p>${r.pair.map(who).join('<span class="muted">与</span>')}</p><p class="muted">${esc(r.reason)}</p></div>`).join('')}</details>
 <p class="links"><a href="evidence.html">完整人物档案</a><a href="verification.html">核验与边界</a><a href="graph.json">数据 JSON</a></p></section>
 </div>`;
}
panel.addEventListener('click',ev=>{
 const go=ev.target.closest('[data-go]');if(go){ev.preventDefault();select(go.dataset.go);return}
 const pj=ev.target.closest('[data-project]');if(pj){renderProject(pj.dataset.project);return}
 const f=ev.target.closest('[data-type]');if(f){const t=f.dataset.type;hidden.has(t)?hidden.delete(t):hidden.add(t);f.setAttribute('aria-pressed',!hidden.has(t));syncFilters();paint();return}
 if(ev.target.closest('#back'))clear();
});
function syncFilters(){document.querySelectorAll('[data-type]').forEach(b=>b.setAttribute('aria-pressed',!hidden.has(b.dataset.type)))}
document.querySelector('.chart-filters').addEventListener('click',ev=>{const f=ev.target.closest('[data-type]');if(!f)return;const t=f.dataset.type;hidden.has(t)?hidden.delete(t):hidden.add(t);syncFilters();paint()});

// ---------- search ----------
const search=$('search');
search.addEventListener('input',()=>{query=search.value.trim();if(query){selected=null;project=null}paint();const n=query?people.filter(matches).length:0;$('status').textContent=query?`找到 ${n} 人`:''});
search.addEventListener('keydown',ev=>{if(ev.key==='Enter'){const hit=people.filter(matches)[0];if(hit){query='';search.value='';select(hit.id)}}else if(ev.key==='Escape'){search.value='';query='';paint()}});

// ---------- start ----------
renderOverview();
const start=decodeURIComponent(location.hash.slice(1));
requestAnimationFrame(()=>{fit();if(P[start])select(start,{scroll:false})});
let lastW=0;new ResizeObserver(()=>{const w=svg.clientWidth;if(Math.abs(w-lastW)>2){lastW=w;(selected||project)?frame(focusSet().nodes):fit()}}).observe(svg);
window.__nomaiLayout=()=>({nodes:N.map(n=>({id:n.id,x:n.x,y:n.y,w:n.w,h:n.h})),world:WORLD});
})();
