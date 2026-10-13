(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const FONT = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", sans-serif';
  const NODE_W = 196, INNER_W = NODE_W - 24, COL_GAP = 60, COL_W = NODE_W + COL_GAP, V_GAP = 14, PAD = 28, BAND_HEAD = 54, BAND_GAP = 56;
  const ORDER = ['main', 'qm', 'comet'];
  const ALT_TAG = { official: '官方另一解', luck: '运气 / 硬闯', skip: '二周目直接跳', glitch: '速通 bug' };
  const KIND_NAME = { goal: '终点', target: '必需品', gate: '要过的关', clue: '线索', alt: '其他走法' };

  const svg = document.getElementById('graph');
  const stage = document.getElementById('stage');
  const detail = document.getElementById('detail');
  const vp = el('g', {}, svg);
  const state = { sel: null, view: { k: 1, tx: 0, ty: 0 }, moved: false, gw: 1000, gh: 1000, pos: {}, size: {} };
  const G = { nodes: {}, edges: [], tree: {} };

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Wrap by measured width so text never runs past the card edge.
  const ctx = document.createElement('canvas').getContext('2d');
  function wrap(text, font, maxW) {
    ctx.font = font;
    const out = []; let line = '';
    for (const ch of text) {
      if (line && ctx.measureText(line + ch).width > maxW) { out.push(line); line = ch.trim() ? ch : ''; }
      else line += ch;
    }
    if (line) out.push(line);
    return out;
  }

  ORDER.forEach(key => {
    (function reg(n) { if (n.ref) return; G.nodes[n.id] = n; G.tree[n.id] = key; (n.kids || []).forEach(reg); })(TREES[key].root);
  });
  ORDER.forEach(key => {
    (function link(n) {
      if (n.ref) return;
      (n.kids || []).forEach(k => { const c = k.ref ? G.nodes[k.ref] : k; G.edges.push({ from: c.id, to: n.id }); link(k); });
    })(TREES[key].root);
  });
  const parentCount = {};
  G.edges.forEach(e => { parentCount[e.from] = (parentCount[e.from] || 0) + 1; });

  function isBig(n) { return n.t === 'goal' || n.t === 'target'; }
  function nodeClass(n) {
    if (n.t === 'goal') return G.tree[n.id] === 'main' ? 'goal' : 'branch';
    return n.t;
  }
  function metaText(n) {
    const m = [];
    if (n.t === 'alt') m.push(ALT_TAG[n.alt]);
    if (parentCount[n.id] > 1) m.push('两条线共用');
    const kids = (n.kids || []).length;
    if (n.req && kids > 1) m.push(n.req === 'all' ? '需全部' : '任选一');
    return m.join(' · ');
  }
  // Card content box: top padding, optional meta row, label lines, place lines.
  function measure(n) {
    const lblFont = `${isBig(n) ? 700 : n.t === 'gate' ? 600 : 400} ${isBig(n) ? 14 : 13}px ${FONT}`;
    const label = wrap(n.label, lblFont, INNER_W);
    const place = n.place ? wrap(n.place, `400 11px ${FONT}`, INNER_W).slice(0, 2) : [];
    const meta = metaText(n);
    const h = 10 + (meta ? 16 : 0) + label.length * 18 + place.length * 15 + 9;
    return { label, place, meta, h };
  }

  // Tidy tree, right-to-left: leaves stack top-down; a parent sits at the middle of its children,
  // and a whole subtree shifts down when that would overlap the card above it in the same column.
  function layoutTree(root) {
    const pos = {}, placed = [], colBottom = {};
    let cursor = 0, maxDepth = 0;
    function place(n, d) {
      if (n.ref) return null;
      maxDepth = Math.max(maxDepth, d);
      const start = placed.length, h = state.size[n.id].h;
      const centers = [];
      (n.kids || []).forEach(k => { const c = place(k, d + 1); if (c !== null) centers.push(c); });
      let top;
      if (!centers.length) {
        top = Math.max(cursor, colBottom[d] === undefined ? 0 : colBottom[d] + V_GAP);
        cursor = top + h + V_GAP;
      } else {
        top = (centers[0] + centers[centers.length - 1]) / 2 - h / 2;
        const minTop = colBottom[d] === undefined ? 0 : colBottom[d] + V_GAP;
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
    place(root, 0);
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
    const L = ORDER.map(k => layoutTree(TREES[k].root));
    const maxDepth = Math.max(...L.map(l => l.maxDepth));
    const width = PAD * 2 + maxDepth * COL_W + NODE_W;
    const pos = {};
    const gBand = el('g', {}, vp), gE = el('g', {}, vp), gN = el('g', {}, vp);
    let top = PAD;
    ORDER.forEach((k, i) => {
      const T = TREES[k], l = L[i];
      if (i > 0) el('line', { class: 'band-line', x1: PAD, x2: width - PAD, y1: top - BAND_GAP / 2, y2: top - BAND_GAP / 2 }, gBand);
      const t1 = el('text', { class: 'band-label', x: PAD, y: top + 18 }, gBand); t1.textContent = T.title;
      const t2 = el('text', { class: 'band-sub', x: PAD, y: top + 38 }, gBand); t2.textContent = T.band;
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
      const gr = el('g', { class: 'node ' + nodeClass(n), transform: `translate(${p.x},${p.y})`, tabindex: 0, role: 'button', 'aria-label': n.label + (n.place ? '，' + n.place : '') }, gN);
      gr.dataset.id = id;
      el('rect', { class: 'box', width: NODE_W, height: s.h, rx: 6 }, gr);
      let y = 10;
      if (s.meta) { const t = el('text', { class: n.t === 'alt' ? 'meta alt' : 'meta', x: 12, y: y + 10 }, gr); t.textContent = s.meta; y += 16; }
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

  // Plain wheel pans the canvas; at the top or bottom edge it hands the scroll back to the page.
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
      const u = Math.min(1, (t - t0) / 280), e = 1 - Math.pow(1 - u, 3);
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
  function renderDetail() {
    const n = state.sel && G.nodes[state.sel];
    if (!n) { detail.hidden = true; return; }
    detail.hidden = false;
    const parents = G.edges.filter(e => e.from === n.id).map(e => G.nodes[e.to]);
    const kids = G.edges.filter(e => e.to === n.id).map(e => G.nodes[e.from]);
    const kind = n.t === 'goal' && G.tree[n.id] !== 'main' ? '支线终点' : KIND_NAME[n.t];
    let h = `<button class="close" type="button" aria-label="关闭">×</button><h2>${esc(n.label)}</h2>`;
    if (n.place) h += `<div class="place">${esc(n.place)}</div>`;
    h += `<div class="tags"><span class="tag">${kind}</span>`;
    if (n.t === 'alt') h += `<span class="tag alt">${ALT_TAG[n.alt]}</span>`;
    if (n.req && kids.length > 1) h += `<span class="tag">${n.req === 'all' ? '左边的前置需全部满足' : '左边的前置满足一条即可'}</span>`;
    if (parentCount[n.id] > 1) h += `<span class="tag">两条线共用</span>`;
    if (n.verify) h += `<span class="tag">社区说法，未在游戏原文核实</span>`;
    h += `</div>`;
    (n.info ? [].concat(n.info) : []).forEach(t => { h += `<p>${t}</p>`; });
    (n.quote || []).forEach(q => { h += `<blockquote>${esc(q[0])}<cite>${esc(q[1])}</cite></blockquote>`; });
    if (n.src) h += `<p class="meta">出处：${n.src.map(s => `<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join('、')}</p>`;
    if (kids.length) h += `<p class="meta">前置：${kids.map(k => `<a href="#" data-go="${k.id}">${esc(k.label)}</a>`).join('、')}</p>`;
    if (parents.length) h += `<p class="meta">通往：${parents.map(k => `<a href="#" data-go="${k.id}">${esc(k.label)}</a>`).join('、')}</p>`;
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
