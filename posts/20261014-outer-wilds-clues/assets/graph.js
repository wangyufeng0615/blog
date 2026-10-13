(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const LANG = /^en/i.test(document.documentElement.lang) ? 'en' : 'zh';
  const T = v => (v && typeof v === 'object' && !Array.isArray(v) ? v[LANG] : v);
  const FONT = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", sans-serif';
  const NODE_W = 200, INNER_W = NODE_W - 24, COL_GAP = 58, COL_W = NODE_W + COL_GAP, V_GAP = 14, PAD = 28, BAND_HEAD = 56, BAND_GAP = 60;
  const UI = {
    zh: { official: '官方另一解', luck: '运气 / 试错 / 硬闯', shared: '两条线共用', all: '需全部', any: '任选一', timing: '时间窗口', risk: '小心坠落',
      kinds: { goal: '终点', branchGoal: '支线终点', target: '必需品', gate: '要过的关', clue: '线索', alt: '其他走法', loc: '地点' },
      allLong: '左边的前置需全部满足', anyLong: '左边的前置满足一条即可', verify: '社区说法，未在游戏原文核实', src: '出处', pre: '前置', next: '通往',
      goHere: '怎么到这里', foundHere: '这里能找到', sep: '、', close: '关闭' },
    en: { official: 'other in-game clue', luck: 'luck / trial / brute force', shared: 'shared by two lines', all: 'needs all', any: 'any one', timing: 'timing', risk: 'mind the drop',
      kinds: { goal: 'Ending', branchGoal: 'Side goal', target: 'Must-have', gate: 'Gate', clue: 'Clue', alt: 'Another way', loc: 'Location' },
      allLong: 'needs every prerequisite on its left', anyLong: 'any one prerequisite on its left is enough', verify: 'community claim, not confirmed in the game text', src: 'Source', pre: 'Needs', next: 'Leads to',
      goHere: 'How to get here', foundHere: 'Clues found here', sep: ', ', close: 'Close' }
  }[LANG];

  const svg = document.getElementById('graph');
  const stage = document.getElementById('stage');
  const detail = document.getElementById('detail');
  const vp = el('g', {}, svg);
  const state = { sel: null, view: { k: 1, tx: 0, ty: 0 }, moved: false, gw: 1000, gh: 1000, pos: {}, size: {} };
  const BANDS = window.OWC.bands;
  const G = { nodes: {}, edges: [], band: {} };

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Wrap by measured width: words for English, characters for Chinese. Nothing runs past the card edge.
  const ctx = document.createElement('canvas').getContext('2d');
  function wrap(text, font, maxW) {
    ctx.font = font;
    const fits = s => ctx.measureText(s).width <= maxW;
    const tokens = LANG === 'en' ? text.split(/(\s+)/).filter(Boolean) : [...text];
    const out = []; let line = '';
    for (const tok of tokens) {
      if (fits(line + tok)) { line += tok; continue; }
      if (line.trim()) out.push(line.trim());
      line = tok.trim() ? tok : '';
      while (!fits(line) && line.length > 1) { // a single word wider than the card
        let i = line.length - 1;
        while (i > 1 && !fits(line.slice(0, i))) i--;
        out.push(line.slice(0, i)); line = line.slice(i);
      }
    }
    if (line.trim()) out.push(line.trim());
    return out;
  }

  BANDS.forEach(b => {
    const reg = n => { if (n.ref) return; G.nodes[n.id] = n; G.band[n.id] = b.key; (n.kids || []).forEach(reg); };
    b.roots.forEach(reg);
  });
  BANDS.forEach(b => {
    const link = n => { if (n.ref) return; (n.kids || []).forEach(k => { G.edges.push({ from: k.ref || k.id, to: n.id }); link(k); }); };
    b.roots.forEach(link);
  });
  const parentCount = {}, backlinks = {};
  G.edges.forEach(e => { parentCount[e.from] = (parentCount[e.from] || 0) + 1; });
  for (const id in G.nodes) { const at = G.nodes[id].at; if (at) (backlinks[at] = backlinks[at] || []).push(id); }

  const isBig = n => n.t === 'goal' || n.t === 'target' || n.t === 'loc';
  function nodeClass(n) {
    if (n.t === 'goal') return G.band[n.id] === 'main' ? 'goal' : 'branch';
    return n.t;
  }
  function metaText(n) {
    const m = [];
    if (n.t === 'alt') m.push(UI[n.alt]);
    if (n.tag) m.push(UI[n.tag]);
    if (parentCount[n.id] > 1) m.push(UI.shared);
    if (n.req && (n.kids || []).length > 1) m.push(UI[n.req]);
    return m.join(' · ');
  }
  function measure(n) {
    const big = isBig(n);
    const lblFont = `${big ? 700 : n.t === 'gate' ? 600 : 400} ${big ? 14 : 13}px ${FONT}`;
    const label = wrap(T(n.label), lblFont, INNER_W);
    const place = n.place ? wrap(T(n.place), `400 11px ${FONT}`, INNER_W).slice(0, 2) : [];
    const meta = metaText(n);
    const metaLines = meta ? wrap(meta, `400 11px ${FONT}`, INNER_W) : [];
    const h = 10 + metaLines.length * 15 + (metaLines.length ? 2 : 0) + label.length * 18 + place.length * 15 + 9;
    return { label, place, metaLines, h };
  }

  // Tidy tree, right-to-left: leaves stack top-down, a parent sits at the middle of its children,
  // and a subtree shifts down whenever it would overlap the card above it in the same column.
  function layoutBand(roots) {
    const pos = {}, placed = [], colBottom = {};
    let cursor = 0, maxDepth = 0;
    function place(n, d) {
      if (n.ref) return null;
      maxDepth = Math.max(maxDepth, d);
      const start = placed.length, h = state.size[n.id].h;
      const centers = [];
      (n.kids || []).forEach(k => { const c = place(k, d + 1); if (c !== null) centers.push(c); });
      let top;
      const minTop = colBottom[d] === undefined ? 0 : colBottom[d] + V_GAP;
      if (!centers.length) {
        top = Math.max(cursor, minTop);
      } else {
        top = (centers[0] + centers[centers.length - 1]) / 2 - h / 2;
        if (top < minTop) {
          const delta = minTop - top;
          for (let i = start; i < placed.length; i++) {
            const id = placed[i]; pos[id].y += delta;
            colBottom[pos[id].d] = Math.max(colBottom[pos[id].d], pos[id].y + state.size[id].h);
          }
          cursor += delta; top = minTop;
        }
      }
      pos[n.id] = { d, y: top };
      placed.push(n.id);
      colBottom[d] = Math.max(colBottom[d] === undefined ? -Infinity : colBottom[d], top + h);
      cursor = Math.max(cursor, top + h + V_GAP);
      return top + h / 2;
    }
    roots.forEach((r, i) => { if (i) cursor += V_GAP * 2; place(r, 0); });
    const height = Math.max(...Object.keys(pos).map(id => pos[id].y + state.size[id].h));
    return { pos, height, maxDepth };
  }

  function render() {
    for (const id in G.nodes) state.size[id] = measure(G.nodes[id]);
    vp.innerHTML = '';
    const defs = el('defs', {}, vp);
    [['ah', 'var(--edge)'], ['ah-alt', 'var(--alt)']].forEach(([id, col]) => {
      const m = el('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
      el('path', { d: 'M0,0 L10,5 L0,10 z', style: `fill:${col}` }, m);
    });
    const L = BANDS.map(b => layoutBand(b.roots));
    const maxDepth = Math.max(...L.map(l => l.maxDepth));
    const width = PAD * 2 + maxDepth * COL_W + NODE_W;
    const pos = {};
    const gBand = el('g', {}, vp), gE = el('g', {}, vp), gN = el('g', {}, vp);
    let top = PAD;
    BANDS.forEach((b, i) => {
      const l = L[i];
      if (i > 0) el('line', { class: 'band-line', x1: PAD, x2: width - PAD, y1: top - BAND_GAP / 2, y2: top - BAND_GAP / 2 }, gBand);
      const t1 = el('text', { class: 'band-label', x: PAD, y: top + 18 }, gBand); t1.textContent = T(b.title);
      const t2 = el('text', { class: 'band-sub', x: PAD, y: top + 38 }, gBand); t2.textContent = T(b.band);
      const y0 = top + BAND_HEAD;
      for (const id in l.pos) pos[id] = { x: PAD + (maxDepth - l.pos[id].d) * COL_W, y: y0 + l.pos[id].y };
      top = y0 + l.height + BAND_GAP;
    });
    state.gw = width; state.gh = top - BAND_GAP + PAD; state.pos = pos;

    G.edges.forEach(e => {
      const a = G.nodes[e.from], b = G.nodes[e.to];
      if (!pos[a.id] || !pos[b.id]) return;
      const pa = pos[a.id], pb = pos[b.id];
      const x1 = pa.x + NODE_W, y1 = pa.y + state.size[a.id].h / 2, x2 = pb.x - 2, y2 = pb.y + state.size[b.id].h / 2;
      const dx = Math.max(28, (x2 - x1) / 2);
      const alt = a.t === 'alt';
      const p = el('path', { d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`, class: 'edge' + (alt ? ' alt' : ''), 'marker-end': `url(#${alt ? 'ah-alt' : 'ah'})` }, gE);
      p.dataset.from = a.id; p.dataset.to = b.id;
    });

    for (const id in pos) {
      const n = G.nodes[id], p = pos[id], s = state.size[id];
      const gr = el('g', { class: 'node ' + nodeClass(n), transform: `translate(${p.x},${p.y})`, tabindex: 0, role: 'button', 'aria-label': T(n.label) + (n.place ? ' — ' + T(n.place) : '') }, gN);
      gr.dataset.id = id;
      el('rect', { class: 'box', width: NODE_W, height: s.h, rx: 6 }, gr);
      let y = 10;
      s.metaLines.forEach(line => { const t = el('text', { class: n.t === 'alt' ? 'meta alt' : n.tag === 'timing' ? 'meta timing' : 'meta', x: 12, y: y + 10 }, gr); t.textContent = line; y += 15; });
      if (s.metaLines.length) y += 2;
      s.label.forEach(line => { const t = el('text', { class: 'lbl', x: 12, y: y + 14 }, gr); t.textContent = line; y += 18; });
      s.place.forEach(line => { const t = el('text', { class: 'sub', x: 12, y: y + 11 }, gr); t.textContent = line; y += 15; });
      gr.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(id); } });
    }
    applyView();
  }

  /* ---------- pan & zoom ---------- */
  const clampK = k => Math.min(3, Math.max(0.12, k));
  function applyView() {
    const v = state.view;
    vp.setAttribute('transform', `translate(${v.tx},${v.ty}) scale(${v.k})`);
    document.getElementById('z-val').textContent = Math.round(v.k * 100) + '%';
  }
  function fitWidth() {
    const w = stage.clientWidth;
    const k = clampK((w - 8) / state.gw);
    state.view = { k, tx: (w - state.gw * k) / 2, ty: 0 };
    applyView();
  }
  function zoomAt(f, cx, cy) {
    const v = state.view, k = clampK(v.k * f);
    v.tx = cx - (cx - v.tx) * (k / v.k); v.ty = cy - (cy - v.ty) * (k / v.k); v.k = k;
    state.moved = true; applyView();
  }
  const center = () => [stage.clientWidth / 2, stage.clientHeight / 2];
  document.getElementById('z-in').onclick = () => zoomAt(1.25, ...center());
  document.getElementById('z-out').onclick = () => zoomAt(0.8, ...center());
  document.getElementById('z-fit').onclick = () => { state.moved = false; fitWidth(); };

  // Plain wheel pans the canvas; at its top or bottom edge the scroll goes back to the page.
  svg.addEventListener('wheel', ev => {
    const r = svg.getBoundingClientRect();
    const unit = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? r.height : 1;
    if (ev.ctrlKey || ev.metaKey) { ev.preventDefault(); zoomAt(Math.exp(-ev.deltaY * unit * 0.0025), ev.clientX - r.left, ev.clientY - r.top); return; }
    const v = state.view;
    const minTy = Math.min(0, r.height - state.gh * v.k - 24), maxTy = 24;
    const dy = ev.deltaY * unit, dx = ev.deltaX * unit;
    const atEdge = (dy > 0 && v.ty <= minTy + 0.5) || (dy < 0 && v.ty >= maxTy - 0.5);
    if (atEdge && Math.abs(dy) >= Math.abs(dx)) return;
    ev.preventDefault();
    v.ty = Math.min(maxTy, Math.max(minTy, v.ty - dy));
    v.tx -= dx; state.moved = true; applyView();
  }, { passive: false });

  const ptrs = new Map(); let drag = null;
  svg.addEventListener('pointerdown', ev => {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    ptrs.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (ptrs.size === 1) drag = { x: ev.clientX, y: ev.clientY, moved: false, node: ev.target.closest('.node') };
    else if (drag) drag.moved = true;
  });
  window.addEventListener('pointermove', ev => {
    if (!ptrs.has(ev.pointerId)) return;
    const prev = ptrs.get(ev.pointerId);
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      const d0 = Math.hypot(a.x - b.x, a.y - b.y);
      ptrs.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      const [c, d] = [...ptrs.values()];
      const r = svg.getBoundingClientRect();
      if (d0 > 0) zoomAt(Math.hypot(c.x - d.x, c.y - d.y) / d0, (c.x + d.x) / 2 - r.left, (c.y + d.y) / 2 - r.top);
      return;
    }
    ptrs.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (!drag) return;
    if (!drag.moved && Math.hypot(ev.clientX - drag.x, ev.clientY - drag.y) < 5) return;
    drag.moved = true; svg.classList.add('dragging');
    state.view.tx += ev.clientX - prev.x; state.view.ty += ev.clientY - prev.y; state.moved = true; applyView();
  });
  function endPtr(ev) {
    if (!ptrs.has(ev.pointerId)) return;
    ptrs.delete(ev.pointerId);
    if (ptrs.size === 0 && drag) {
      if (!drag.moved) { if (drag.node) select(drag.node.dataset.id); else clear(); }
      drag = null; svg.classList.remove('dragging');
    }
  }
  window.addEventListener('pointerup', endPtr);
  window.addEventListener('pointercancel', endPtr);
  window.addEventListener('resize', () => { if (!state.moved) fitWidth(); });

  function focusNode(id) {
    const p = state.pos[id]; if (!p) return;
    const v = state.view, h = state.size[id].h;
    const panelW = window.innerWidth > 760 ? detail.offsetWidth + 24 : 0;
    const target = { tx: (stage.clientWidth - panelW) / 2 - (p.x + NODE_W / 2) * v.k, ty: stage.clientHeight / 2 - (p.y + h / 2) * v.k };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.tx = target.tx; v.ty = target.ty; applyView(); return; }
    const s = { tx: v.tx, ty: v.ty }, t0 = performance.now();
    (function step(t) {
      const u = Math.min(1, (t - t0) / 320), e = 1 - Math.pow(1 - u, 3);
      v.tx = s.tx + (target.tx - s.tx) * e; v.ty = s.ty + (target.ty - s.ty) * e; applyView();
      if (u < 1) requestAnimationFrame(step);
    })(t0);
    state.moved = true;
  }

  /* ---------- selection ---------- */
  function related(id) {
    const up = new Set([id]), down = new Set([id]);
    let ch = true;
    while (ch) { ch = false; G.edges.forEach(e => { if (up.has(e.from) && !up.has(e.to)) { up.add(e.to); ch = true; } }); }
    ch = true;
    while (ch) { ch = false; G.edges.forEach(e => { if (down.has(e.to) && !down.has(e.from)) { down.add(e.from); ch = true; } }); }
    return { up, down };
  }
  function applyHighlight() {
    svg.classList.toggle('focus', !!state.sel);
    svg.querySelectorAll('.node').forEach(n => n.classList.remove('hl', 'sel'));
    svg.querySelectorAll('.edge').forEach(e => e.classList.remove('hl'));
    if (!state.sel) return;
    const { up, down } = related(state.sel);
    svg.querySelectorAll('.node').forEach(n => {
      const id = n.dataset.id;
      if (up.has(id) || down.has(id)) n.classList.add('hl');
      if (id === state.sel) n.classList.add('sel');
    });
    svg.querySelectorAll('.edge').forEach(e => {
      const f = e.dataset.from, t = e.dataset.to;
      if ((down.has(f) && down.has(t)) || (up.has(f) && up.has(t))) e.classList.add('hl');
    });
  }
  const goLink = id => `<a href="#" data-go="${id}">${esc(T(G.nodes[id].label))}</a>`;
  function renderDetail() {
    const n = state.sel && G.nodes[state.sel];
    if (!n) { detail.hidden = true; return; }
    detail.hidden = false;
    const parents = G.edges.filter(e => e.from === n.id).map(e => e.to);
    const kids = G.edges.filter(e => e.to === n.id).map(e => e.from);
    const kind = n.t === 'goal' && G.band[n.id] !== 'main' ? UI.kinds.branchGoal : UI.kinds[n.t];
    let h = `<button class="close" type="button" aria-label="${UI.close}">×</button><h2>${esc(T(n.label))}</h2>`;
    if (n.place) h += `<div class="place">${esc(T(n.place))}</div>`;
    h += `<div class="tags"><span class="tag">${kind}</span>`;
    if (n.t === 'alt') h += `<span class="tag alt">${UI[n.alt]}</span>`;
    if (n.tag) h += `<span class="tag ${n.tag}">${UI[n.tag]}</span>`;
    if (n.req && kids.length > 1) h += `<span class="tag">${n.req === 'all' ? UI.allLong : UI.anyLong}</span>`;
    if (parentCount[n.id] > 1) h += `<span class="tag">${UI.shared}</span>`;
    if (n.verify) h += `<span class="tag">${UI.verify}</span>`;
    h += `</div>`;
    if (n.at) h += `<p class="go-here">${UI.goHere}${LANG === 'en' ? ': ' : '：'}${goLink(n.at)} →</p>`;
    (n.info || []).forEach(t => { h += `<p>${esc(T(t))}</p>`; });
    (n.quote || []).forEach(q => { h += `<blockquote>${esc(q[LANG])}<cite>${esc(q.cite[LANG])}</cite></blockquote>`; });
    if (backlinks[n.id]) h += `<p class="meta">${UI.foundHere}${LANG === 'en' ? ': ' : '：'}${backlinks[n.id].map(goLink).join(UI.sep)}</p>`;
    if (n.src) h += `<p class="meta">${UI.src}${LANG === 'en' ? ': ' : '：'}${n.src.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${esc(T(s.label))}</a>`).join(UI.sep)}</p>`;
    if (kids.length) h += `<p class="meta">${UI.pre}${LANG === 'en' ? ': ' : '：'}${kids.map(goLink).join(UI.sep)}</p>`;
    if (parents.length) h += `<p class="meta">${UI.next}${LANG === 'en' ? ': ' : '：'}${parents.map(goLink).join(UI.sep)}</p>`;
    detail.innerHTML = h;
    detail.scrollTop = 0;
    detail.querySelector('.close').onclick = clear;
    detail.querySelectorAll('a[data-go]').forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); select(a.dataset.go, true); focusNode(a.dataset.go); }));
  }
  function select(id, force) {
    state.sel = (!force && state.sel === id) ? null : id;
    applyHighlight(); renderDetail();
  }
  function clear() { state.sel = null; applyHighlight(); renderDetail(); }
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && state.sel) clear(); });

  render();
  fitWidth();
})();
