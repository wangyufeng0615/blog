const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let saved;try{saved=JSON.parse(localStorage.getItem('stellar-saved')||'[]')}catch{saved=[]}
let state={kind:'texts',category:'',source:'',q:'',page:1,onlyLong:false,seq:0,entry:''},raw=false,onlySaved=false,result,meta,loadState={type:'searching'};
const kinds={texts:'kindTexts',names:'kindNames',scripts:'kindScripts',sources:'kindSources'};
const worker=new Worker('worker.js');
function update(){state.seq++;loadState={type:'searching'};renderStatus();worker.postMessage({...state,bookmarks:onlySaved?saved:null});let p=new URLSearchParams();for(let k of ['kind','category','source','q','page','entry'])if(state[k]&&!(k==='page'&&state[k]===1))p.set(k,state[k]);p.set('lang',uiLocale);history.replaceState(null,'','?'+p);}
function reset(){Object.assign(state,{category:'',source:'',q:'',page:1,onlyLong:false,entry:''});onlySaved=false;$('#search').value='';$('#long').checked=false;$('#bookmarks').classList.remove('active');update()}
function format(text){text=String(text??'');if(!raw&&state.kind==='texts')text=text.replace(/\\n/g,'\n').replace(/§[a-zA-Z!0-9]/g,'').replace(/£([^£]+)£/g,'〔$1〕');let h=esc(text);if(state.q){let q=esc(state.q).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');h=h.replace(new RegExp(q,'gi'),m=>'<mark>'+m+'</mark>')}return h}
function toast(key){$('#toast').textContent=t(key);$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',1800)}
function savedCount(){$('#savedCount').textContent=num(saved.length)}savedCount();
function renderStatus(){
 $('#title').textContent=(onlySaved?t('savedPrefix'):'')+(state.category?t(state.category):t('allKind',{kind:t(kinds[state.kind])}));
 if(loadState.type==='progress')$('#count').textContent=t('loading',{kind:t(kinds[state.kind]),percent:Math.round(loadState.value*100)});
 else if(loadState.type==='error')$('#count').textContent=t('loadFailed');
 else if(loadState.type==='ready'&&result)$('#count').textContent=t('resultCount',{total:num(result.total),count:num(result.count)});
 else $('#count').textContent=t('searching');
}
function renderMeta(){if(meta){$('#namesCount').textContent=num(meta.names.count);$('#scriptsCount').textContent=num(meta.scripts.count);$('#binaryNote').textContent=t('binaryNote',{count:num(meta.sources.count),binary:num(meta.binary.length)})}savedCount()}
function renderFilters(){if(!result)return;
 $('#categories').innerHTML=`<button data-cat="" class="${!state.category?'active':''}">${t('allTopics')} <small>${num(result.count)}</small></button>`+Object.entries(result.cats).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`<button data-cat="${esc(c)}" class="${state.category===c?'active':''}">${esc(t(c))} <small>${num(n)}</small></button>`).join('');
 let sources=Object.entries(result.sources).sort((a,b)=>a[0].localeCompare(b[0]));
 $('#source').innerHTML=`<option value="">${t('allSources')} (${num(sources.length)})</option>`+sources.map(([s,n])=>`<option value="${esc(s)}">${esc(s)} (${num(n)})</option>`).join('');$('#source').value=state.source;
 $('#mobileCategory').innerHTML=`<option value="">${t('allTopics')}</option>`+Object.entries(result.cats).map(([c,n])=>`<option value="${esc(c)}">${esc(t(c))} (${num(n)})</option>`).join('');$('#mobileCategory').value=state.category;
 $('#notice').innerHTML=state.entry?`<a href="?kind=texts&amp;lang=${uiLocale}">${t('clearEntry')}</a>`:state.kind==='texts'?'':state.kind==='sources'?t('sourceNotice',{count:num(result.count),binary:num(meta?.binary?.length||0)}):t('candidateNotice');
}
function render(){if(!result)return;
 $('#results').innerHTML=result.items.map(r=>{
  return `<article class="${state.kind==='sources'?'source-file':''}" data-id="${esc(r.id)}">
   <div class="entry-head"><span class="key">${esc(r.key||t('emptyKey'))}</span><div class="tools">${state.kind==='texts'?`<a class="permalink" href="?kind=texts&amp;entry=${encodeURIComponent(r.namespace+':'+r.key)}&amp;lang=${uiLocale}" aria-label="${t('permalink')}" title="${t('permalink')}">↗</a>`:''}<button data-save="${r.id}" class="${saved.includes(r.id)?'saved':''}" aria-label="${esc(t('saveEntry',{key:r.key}))}" aria-pressed="${saved.includes(r.id)}">${saved.includes(r.id)?'★':'☆'}</button><button data-copy="${r.id}">${t('copy')}</button></div></div>
   <div class="text-cols single"><div><div class="prose" ${state.kind==='texts'?`lang="${uiLocale==='zh'?'zh-CN':'en'}"`:''}>${state.kind!=='texts'?format(r.zh):r[uiLocale]===null||r[uiLocale]===undefined?t(uiLocale==='zh'?'missingZh':'missingEn'):r[uiLocale]===''?t('emptyString'):format(r[uiLocale])}</div></div></div>
   <div class="entry-foot"><span>${esc(t(r.category))}</span><button data-source="${esc(r.source)}" title="${t('readSource')}">↗ ${esc(r.source)}</button>${r.el||r.zl?`<span>${t('line',{line:(state.kind==='texts'&&uiLocale==='en'?r.el:r.zl)||r.el||r.zl})}</span>`:''}</div>
   <details><summary>${t('provenance')}</summary><p>${t('namespace')}：${esc(r.namespace||t('originalScript'))} · ${esc(t(r.status||'original'))}</p><p>${t(state.kind==='texts'?'zhSource':'sourceLabel')}：${esc(r.zs||r.source)} : ${r.zl||r.el||1}</p>${r.es?`<p>${t('enSource')}：${esc(r.es)} : ${r.el}</p>`:''}<pre>${esc(state.kind==='texts'?r[uiLocale]:r.zh)}</pre></details>
  </article>`;
 }).join('')||`<div class="empty">${t('emptyResults')}</div>`;
 $('#prev').disabled=state.page<=1;$('#next').disabled=state.page>=Math.ceil(result.total/40);$('#page').value=state.page;$('#pages').textContent=num(Math.max(1,Math.ceil(result.total/40)));$('#page').max=Math.max(1,Math.ceil(result.total/40));
}
function renderError(){$('#results').innerHTML=`<div class="empty">${t('loadFailed')}. ${t('retry')}</div>`}
document.addEventListener('uilanguagechange',()=>{let p=new URLSearchParams(location.search);p.set('lang',uiLocale);history.replaceState(null,'','?'+p);renderMeta();renderStatus();renderFilters();if(loadState.type==='error')renderError();else render()});
worker.onmessage=({data:r})=>{
 if(r.type==='progress'){if(r.kind===state.kind){loadState=r;renderStatus()}return}
 if(r.seq!==state.seq)return;
 if(r.type==='error'){loadState=r;renderStatus();renderError();return}
 result=r;loadState={type:'ready'};renderStatus();renderFilters();render();
};
$('#datasets').onclick=e=>{let b=e.target.closest('[data-kind]');if(!b)return;state.kind=b.dataset.kind;document.querySelectorAll('[data-kind]').forEach(el=>el.classList.toggle('active',el===b));$('#longLabel').style.display=state.kind==='texts'?'':'none';reset()};
$('#categories').onclick=e=>{let b=e.target.closest('[data-cat]');if(!b)return;state.entry='';state.category=b.dataset.cat;state.source='';state.page=1;update()};
let timer;$('#search').oninput=e=>{state.entry='';state.q=e.target.value;state.page=1;clearTimeout(timer);timer=setTimeout(update,220)};
$('#clear').onclick=()=>{clearTimeout(timer);state.q='';$('#search').value='';state.page=1;update()};$('#reset').onclick=reset;
$('#source').onchange=e=>{state.entry='';state.source=e.target.value;state.page=1;update()};$('#long').onchange=e=>{state.onlyLong=e.target.checked;state.page=1;update()};$('#raw').onchange=e=>{raw=e.target.checked;render()};
$('#results').onclick=async e=>{
 let b=e.target.closest('button');if(!b)return;
 if(b.dataset.source){state.entry='';state.q='';$('#search').value='';state.source=b.dataset.source;state.page=1;update();$('.workspace').scrollIntoView({behavior:'smooth'})}
 if(b.dataset.copy){let r=result.items.find(r=>r.id===b.dataset.copy);try{await navigator.clipboard.writeText([r.key,r.zh,r.en,r.source].filter(t=>t!==null&&t!==undefined).join('\n'));toast('copied')}catch{toast('copyBlocked')}}
 if(b.dataset.save){let id=b.dataset.save;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];try{localStorage.setItem('stellar-saved',JSON.stringify(saved))}catch{toast('saveTemporary')}savedCount();if(onlySaved)update();else render()}
};
$('#bookmarks').onclick=()=>{onlySaved=!onlySaved;$('#bookmarks').classList.toggle('active',onlySaved);state.page=1;update()};
function page(n){state.page=Math.min(Math.max(1,n),Math.max(1,Math.ceil((result?.total||0)/40)));update();$('.workspace').scrollIntoView({behavior:'smooth'})}
$('#prev').onclick=()=>page(state.page-1);$('#next').onclick=()=>page(state.page+1);$('#page').onchange=e=>page(parseInt(e.target.value)||1);
$('#theme').onchange=e=>window.stellarTheme.set(e.target.value);
$('#about').onclick=()=>$('#info').showModal();$('#closeInfo').onclick=()=>$('#info').close();document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();$('#search').focus()}});
$('#mobileCategory').onchange=e=>{state.category=e.target.value;state.source='';state.page=1;update()};
renderStatus();
(async()=>{try{
 meta=await fetch('manifest.json').then(r=>r.json());renderMeta();$('#report').textContent=await fetch('report.txt').then(r=>r.text());
 let downloads=await fetch('downloads.json').then(r=>r.json());$('#downloads').innerHTML=downloads.map(x=>`<a href="${encodeURI(x.url)}" download>${esc(x.name)}</a>`).join('');
 let p=new URLSearchParams(location.search);for(let k of ['kind','category','source','q','entry'])if(p.has(k))state[k]=p.get(k);if(!kinds[state.kind])state.kind='texts';if(state.entry){state.kind='texts';state.category='';state.source='';state.q=''}state.page=Math.max(1,parseInt(p.get('page'))||1);$('#search').value=state.q;$('#longLabel').style.display=state.kind==='texts'?'':'none';document.querySelectorAll('[data-kind]').forEach(b=>b.classList.toggle('active',b.dataset.kind===state.kind));update();
}catch(e){loadState={type:'error'};renderStatus();renderError()}})();
