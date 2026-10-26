// A compact explanatory DAG. Full source records are kept in graph.json, not repeated on the map.
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const DLC_GROUPS=[
 {id:'arrival',title:{zh:'找到外星站，带着文物进入梦境',en:'Find the Stranger and enter the dream'},ids:['radio','alignment','stranger','artifact','fire-rooms','lab','dream']},
 {id:'trail',title:{zh:'从打不开的门，追到被藏起的档案',en:'Follow the locked vault’s clues to the hidden archives'},ids:['lake','vault-vision','symbol-room','control-room','temple','burning-rooms']},
 {id:'archives',title:{zh:'三条路线，解开三道封印',en:'Three routes, three seals'},sub:{zh:'三馆可任选顺序。每条线都从“怎么进去”，连到“学会什么”，再到“如何解封”。',en:'Visit in any order. Each route connects the entrance, the discovery and the seal it unlocks.'},ids:['woods','raft-rule','raft-seal','known-raft','cove','death-rule','alarm-seal','known-death','canyon','lift-route','radius-rule','bridge-seal','known-radius','open-vault','meeting','farewell','eye-coda']},
 {id:'history',title:{zh:'你到来之前，那次信号发生了什么',en:'Before your arrival: what happened to the signal'},ids:['home-moon','block-signal','build-dream','release-signal','heard-signal']},
 {id:'limits',title:{zh:'洪水、循环，以及留下来的两种结局',en:'The flood, the loop and two ways to remain'},ids:['flood','loop','stranger-ending','dream-ending']}
];
const TYPE={location:'loc',target:'target',seal:'target',goal:'goal',alternative:'alt',optional:'alt',ending:'branch',history:'gate',timing:'gate',clue:'gate',aside:'gate'};
const labels={zh:{clue:'意识到',location:'探索到',target:'意识到',seal:'应用机制',goal:'三者缺一不可',ending:'相遇与告别',history:'',alternative:'另一走法',optional:'可选 · 本体终局',timing:'时间窗口'},en:{clue:'Realize',location:'Explore',target:'Realize',seal:'Apply the rule',goal:'All three required',ending:'Encounter & farewell',history:'',alternative:'Another way',optional:'Optional · base ending',timing:'Timing'}};
// Conservative text metrics for build-time SVG. No line is ellipsized or dropped.
function textWidth(text,size){return [...text].reduce((sum,c)=>sum+size*(/[\u2e80-\uffef]/.test(c)?1.02:/[MW@%]/.test(c)?.88:/[A-Z]/.test(c)?.68:/[il.,:;'!| ]/.test(c)?.32:.57),0)}
function wrap(text,size,width,lang){
 const tokens=lang==='en'?String(text).split(/(\s+)/).filter(Boolean):[...String(text)].reduce((a,c)=>{if(/[，。；：！？、）》】」』…,.!?;:)\]]/.test(c)&&a.length)a[a.length-1]+=c;else a.push(c);return a},[]),lines=[];let line='';
 for(const token of tokens){if(textWidth(line+token,size)<=width){line+=token;continue}if(line.trim())lines.push(line.trim());line=token.trimStart();if(textWidth(line,size)>width){let part='';for(const c of line){if(textWidth(part+c,size)>width&&part){lines.push(part);part=''}part+=c}line=part}}
 if(line.trim())lines.push(line.trim());return lines;
}
function measure(id,v,lang,width){
 const kind=v.kind,tag=id.startsWith('known-')?(lang==='zh'?'学会机制后回访':'Revisit after learning'):id==='control-room'?(lang==='zh'?'可选旁支':'Optional detour'):labels[lang][kind];
 const title=v.title[lang].replace(/^(已知后|少潜行|顺路|Revisit|Less stealth|Aside)[:：]\s*/,'');
 const titleLines=wrap(title,16,width-30,lang),noteLines=wrap(v.note[lang],14,width-30,lang),placeLines=v.place?.[lang]?wrap(v.place[lang],12.5,width-30,lang):[];
 const h=14+(tag?19:0)+titleLines.length*22+5+noteLines.length*19+(placeLines.length?6+placeLines.length*16:0)+14+(id==='flood'?66:0);
 return {id,w:width,h,kind,type:TYPE[kind]||'gate',tag,titleLines,noteLines,placeLines};
}
export function createDlcLayout(data,view,lang='zh',mobile=false){
 const width=mobile?390:1500,nodes={},bands=[],junctions=[],X=[54,342,630,918,1206];
 const add=(id,x,y,w=mobile?326:240)=>{const n=measure(id,view[id],lang,w);nodes[id]={...n,x,y};return nodes[id]};
 const bottom=n=>n.y+n.h,center=n=>n.y+n.h/2;
 let end=0;
 if(mobile){
  let y=64;
  for(const group of DLC_GROUPS){const band={...group,y};bands.push(band);const titleHeight=(wrap(group.title[lang],19,326,lang).length-1)*25;band.subY=y+titleHeight+27;y+=titleHeight+32;if(group.sub)y=band.subY+(wrap(group.sub[lang],13,326,lang).length-1)*18+25;
   for(const id of group.ids){if(id==='stranger-ending'){junctions.push({id:'core-off',x:32,y,w:326,h:58,text:lang==='zh'?'若先取出高级核心，关闭循环':'If you remove the advanced core and disable the loop'});y+=90}const n=add(id,32,y);y=bottom(n)+30}
   y+=50;
  }end=y-15;
 }else{
  const a={...DLC_GROUPS[0],y:54};bands.push(a);const y=112;
  for(const [id,i] of [['radio',0],['alignment',1],['stranger',2]])add(id,X[i],y);
  add('artifact',X[3],y);add('fire-rooms',X[3],bottom(nodes.artifact)+32);
  add('lab',X[2],bottom(nodes.stranger)+88);
  add('dream',X[4],nodes['fire-rooms'].y);end=Math.max(...Object.values(nodes).map(bottom))+78;
  const b={...DLC_GROUPS[1],y:end};bands.push(b);const by=end+62;
  ['lake','vault-vision','symbol-room','temple','burning-rooms'].forEach((id,i)=>add(id,X[i],by));
  add('control-room',X[2],bottom(nodes['symbol-room'])+34);end=Math.max(...Object.values(nodes).map(bottom))+84;
  const c={...DLC_GROUPS[2],y:end};bands.push(c);let row=end+96;
  for(const [location,rule,seal,extras] of [
   ['woods','raft-rule','raft-seal',[['known-raft',1]]],
   ['cove','death-rule','alarm-seal',[['known-death',1]]],
   ['canyon','radius-rule','bridge-seal',[['lift-route',0],['known-radius',1]]]
  ]){
   [location,rule,seal].forEach((id,i)=>add(id,X[i],row));
   const rowBottom=Math.max(...[location,rule,seal].map(id=>bottom(nodes[id])));
   for(const [id,i] of extras)add(id,X[i],rowBottom+32);
   row=Math.max(rowBottom,...extras.map(([id])=>bottom(nodes[id])))+62;
  }
  add('open-vault',X[3],nodes['alarm-seal'].y);
  add('meeting',X[4],Math.max(nodes['woods'].y, nodes['open-vault'].y-104));
  add('farewell',X[4],bottom(nodes.meeting)+38);add('eye-coda',X[4],bottom(nodes.farewell)+38);
  end=Math.max(row-62,bottom(nodes['eye-coda']))+96;
  const h={...DLC_GROUPS[3],y:end};bands.push(h);
  h.ids.forEach((id,i)=>add(id,X[i],end+64));end=Math.max(...h.ids.map(id=>bottom(nodes[id])))+90;
  const l={...DLC_GROUPS[4],y:end};bands.push(l);const ly=end+64;
  add('flood',X[0],ly,528);add('loop',X[2],ly);
  const j={id:'core-off',x:X[3],y:ly,w:528,h:50,text:lang==='zh'?'若先取出高级核心，关闭循环':'If you first remove the advanced core and disable the loop'};junctions.push(j);
  add('stranger-ending',X[3],ly+84);add('dream-ending',X[4],ly+84);
  end=Math.max(...l.ids.map(id=>bottom(nodes[id])))+56;
 }
 const edges=[];
 const point=(x,y)=>({x,y});
 function connect(from,to,kind='learn',custom){
  const a=nodes[from],b=nodes[to];let points;
  if(custom)points=custom(a,b);
  else if(mobile){
   const gapTop=bottom(a),gapBottom=b.y;
   const blocked=Object.values(nodes).some(n=>n.id!==from&&n.id!==to&&n.y<gapBottom&&bottom(n)>gapTop);
   const crossBand=DLC_GROUPS.find(g=>g.ids.includes(from))!==DLC_GROUPS.find(g=>g.ids.includes(to));
   if(b.y>=bottom(a)&&!blocked&&!crossBand)points=[point(a.x+a.w/2,bottom(a)),point(b.x+b.w/2,b.y-3)];
   else{const left=kind==='alternative',bus=left?10:380;points=left?[point(a.x,center(a)),point(bus,center(a)),point(bus,center(b)),point(b.x-3,center(b))]:[point(a.x+a.w,center(a)),point(bus,center(a)),point(bus,center(b)),point(b.x+b.w+3,center(b))]}
  }else if(b.x>a.x){const x1=a.x+a.w,x2=b.x-3,mid=(x1+x2)/2;points=[point(x1,center(a)),point(mid,center(a)),point(mid,center(b)),point(x2,center(b))]}
  else if(b.x===a.x&&b.y>bottom(a)){points=[point(a.x+a.w/2,bottom(a)),point(b.x+b.w/2,b.y-3)]}
  else throw Error('Unrouted edge '+from+' → '+to);
  edges.push({from,to,kind,points});
 }
 const phase=id=>bands.find(b=>b.id===id);
 for(const e of data.edges){
  if(mobile){
   if(e.from==='stranger'){connect(e.from,e.to,e.kind,(a,b)=>[point(a.x,center(a)),point(10,center(a)),point(10,center(b)),point(b.x-3,center(b))]);continue}
   if(e.to==='open-vault'){connect(e.from,e.to,e.kind,(a,b)=>[point(a.x+a.w,center(a)),point(370,center(a)),point(370,center(b)),point(b.x+b.w+3,center(b))]);continue}
   connect(e.from,e.to,e.kind);continue;
  }
  if(e.from==='dream'&&e.to==='lake'){connect(e.from,e.to,e.kind,(a,b)=>[point(a.x+a.w/2,bottom(a)),point(a.x+a.w/2,phase('trail').y-26),point(24,phase('trail').y-26),point(24,center(b)),point(b.x-3,center(b))]);continue}
  if(e.from==='burning-rooms'){connect(e.from,e.to,e.kind,(a,b)=>[point(a.x+a.w/2,bottom(a)),point(a.x+a.w/2,phase('archives').y-28),point(24,phase('archives').y-28),point(24,center(b)),point(b.x-3,center(b))]);continue}
  if(e.to==='open-vault'){connect(e.from,e.to,e.kind,(a,b)=>[point(a.x+a.w,center(a)),point(890,center(a)),point(890,center(b)),point(b.x-3,center(b))]);continue}
  if(e.from==='lab'&&e.to==='dream'){const under=Math.max(bottom(nodes.lab),bottom(nodes['fire-rooms']))+24;connect(e.from,e.to,e.kind,(a,b)=>[point(a.x+a.w,center(a)),point(894,center(a)),point(894,under),point(1182,under),point(1182,center(b)),point(b.x-3,center(b))]);continue}
  connect(e.from,e.to,e.kind);
 }
 connect('symbol-room','control-room','alternative');
 // The two alternative endings share a condition, not a sequence.
 for(const to of ['stranger-ending','dream-ending']){
  const a=junctions[0],b=nodes[to];let points;
  if(mobile){const x=a.x+a.w/2;points=to==='stranger-ending'?[point(x,a.y+a.h),point(x,b.y-3)]:[point(a.x+a.w,a.y+a.h/2),point(380,a.y+a.h/2),point(380,center(b)),point(b.x+b.w+3,center(b))]}
  else points=[point(a.x+a.w/2,a.y+a.h),point(a.x+a.w/2,b.y-18),point(b.x+b.w/2,b.y-18),point(b.x+b.w/2,b.y-3)];
  edges.push({from:'core-off',to,kind:'alternative',points});
 }
 return {width,height:end,nodes,edges,bands,junctions,mobile,lang};
}
function pathOf(points){
 let d=`M${points[0].x},${points[0].y}`;
 for(let i=1;i<points.length;i++){
  const p=points[i],prev=points[i-1],next=points[i+1];
  if(next){const dx=p.x-prev.x,dy=p.y-prev.y,nx=next.x-p.x,ny=next.y-p.y;
   if((dx===0)!==(nx===0)){const r=Math.min(8,Math.hypot(dx,dy)/2,Math.hypot(nx,ny)/2);const ax=p.x-Math.sign(dx)*r,ay=p.y-Math.sign(dy)*r,bx=p.x+Math.sign(nx)*r,by=p.y+Math.sign(ny)*r;d+=` L${ax},${ay} Q${p.x},${p.y} ${bx},${by}`;continue}
  }d+=` L${p.x},${p.y}`;
 }return d;
}
export function renderDlcCanvas(data,view,lang){return [false,true].map(mobile=>{
 const layout=createDlcLayout(data,view,lang,mobile),prefix=mobile?'narrow':'wide';
 function nodeSvg(n){
  let y=14,out='';
  if(n.tag){const act=n.kind==='location'?'explore':n.kind==='clue'||n.kind==='target'?'realize':'';
   if(act){const w=textWidth(n.tag,12.5)+12;out+=`<rect class="kw-mark-${act}" x="14" y="12" width="${w}" height="18" rx="1.5"/>`}
   out+=`<text class="meta${n.kind==='alternative'||n.kind==='optional'?' alt':''}${n.kind==='timing'?' timing':''}${act?' kw-'+act:''}" x="${act?19:15}" y="26">${esc(n.tag)}</text>`;y+=19;
  }
  for(const line of n.titleLines){out+=`<text class="lbl" x="15" y="${y+17}">${esc(line)}</text>`;y+=22}y+=5;
  for(const line of n.noteLines){out+=`<text class="note" x="15" y="${y+14}">${esc(line)}</text>`;y+=19}
  if(n.placeLines.length)y+=6;for(const line of n.placeLines){out+=`<text class="sub" x="15" y="${y+12}">${esc(line)}</text>`;y+=16}
  if(n.id==='flood'){
   const ty=n.h-49,labels=lang==='zh'?['入梦','≈13分钟','≈20:30']:['Enter dream','≈13 min','≈20:30'],notes=lang==='zh'?['身体留在绿火旁','洼地被淹','岛屿高塔倒塌']:['Body stays at fire','Lowlands flood','Tower falls'];
   const xs=[18,n.w/2,n.w-18];out+=`<path class="clock-line" d="M18 ${ty}H${n.w-18}"/>`;
   xs.forEach((x,i)=>{const anchor=i===0?'start':i===2?'end':'middle';out+=`<circle class="clock-dot" cx="${x}" cy="${ty}" r="3"/><text class="clock-time" x="${x}" y="${ty+20}" text-anchor="${anchor}">${labels[i]}</text><text class="clock-note" x="${x}" y="${ty+37}" text-anchor="${anchor}">${notes[i]}</text>`});
  }
  return `<g class="node ${n.type}" data-id="${n.id}" id="n-${n.id}${mobile?'-mobile':''}" transform="translate(${n.x},${n.y})" data-box="${n.x},${n.y},${n.w},${n.h}"><rect class="shade" x=".5" y="3" width="${n.w-1}" height="${n.h}" rx="5"/><rect class="box" width="${n.w}" height="${n.h}" rx="4"/>${n.type==='alt'?`<rect class="fabric" width="${n.w}" height="${n.h}" rx="4" fill="url(#${prefix}-gingham)"/>`:''}<rect class="fabric" width="${n.w}" height="${n.h}" rx="4" fill="url(#${prefix}-cotton)"/><rect class="stitch-shadow" x="5.5" y="6" width="${n.w-11}" height="${n.h-11}" rx="2.5"/><rect class="stitch" x="5.5" y="5.5" width="${n.w-11}" height="${n.h-11}" rx="2.5"/>${out}</g>`;
 }
 const defs=`<defs><pattern id="${prefix}-cloth" width="360" height="360" patternUnits="userSpaceOnUse"><rect width="360" height="360" fill="#e2d6c0"/><image data-texture="cloth" width="360" height="360"/></pattern><pattern id="${prefix}-cotton" width="96" height="96" patternUnits="userSpaceOnUse"><image data-texture="cotton" width="96" height="96"/></pattern><pattern id="${prefix}-gingham" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M3 0V12 M9 0V12 M0 3H12 M0 9H12" stroke="#c97639" stroke-opacity=".065" stroke-width="3"/></pattern>${[['learn','#7d6550'],['need','#1d756d'],['alternative','#b9531a'],['optional','#b9531a'],['history','#7d6550']].map(([kind,color])=>`<marker id="${prefix}-${kind}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1.5L9 5L1 8.5L3 5Z" fill="${color}"/></marker>`).join('')}</defs>`;
 const bands=layout.bands.map(b=>`<g class="map-band" id="${b.id}${mobile?'-mobile':''}"><text class="band-label" x="${mobile?32:54}" y="${b.y}">${wrap(b.title[lang],mobile?19:23,mobile?326:1392,lang).map((s,i)=>`<tspan x="${mobile?32:54}" dy="${i?25:0}">${esc(s)}</tspan>`).join('')}</text>${b.sub?`<text class="band-sub" x="${mobile?32:54}" y="${mobile?b.subY:b.y+29}">${wrap(b.sub[lang],13,mobile?326:1392,lang).map((s,i)=>`<tspan x="${mobile?32:54}" dy="${i?18:0}">${esc(s)}</tspan>`).join('')}</text>`:''}</g>`).join('');
 const paths=layout.edges.map(e=>`<path class="thread ${e.kind}" data-from="${e.from}" data-to="${e.to}" d="${pathOf(e.points)}" marker-end="url(#${prefix}-${e.kind})"/>`).join('');
 const junctions=layout.junctions.map(j=>`<g class="ending-switch" transform="translate(${j.x},${j.y})"><rect width="${j.w}" height="${j.h}" rx="22"/><text x="${j.w/2}" y="${j.h/2-8}" text-anchor="middle">${wrap(j.text,13,j.w-28,lang).map((line,i,all)=>`<tspan x="${j.w/2}" dy="${i?18:all.length===1?13:4}">${esc(line)}</tspan>`).join('')}</text></g>`).join('');
 return `<svg class="clue-sheet ${prefix}" id="map-${prefix}" viewBox="0 0 ${layout.width} ${layout.height}" role="group" aria-label="${lang==='zh'?'回声之眼线索图：入口、三馆解封、幽禁者、历史与循环。全部卡面直接可读。':'Echoes of the Eye clue map: entry, archives, seals, Prisoner, history and loop. All cards are directly readable.'}">${defs}<rect class="cloth-shadow" x="4" y="6" width="${layout.width-8}" height="${layout.height-8}" rx="10"/><rect class="sheet-cloth" x="6" y="2" width="${layout.width-12}" height="${layout.height-8}" rx="8" fill="url(#${prefix}-cloth)"/><rect class="hem-dark" x="16" y="12" width="${layout.width-32}" height="${layout.height-28}" rx="4"/><rect class="hem-light" x="18" y="14" width="${layout.width-36}" height="${layout.height-32}" rx="3"/>${bands}<g class="threads">${paths}</g><g class="cards">${Object.values(layout.nodes).map(nodeSvg).join('')}</g>${junctions}</svg>`;
}).join('');}
