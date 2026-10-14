(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const LANG = /^en/i.test(document.documentElement.lang) ? 'en' : 'zh';
  const T = v => (v && typeof v === 'object' && !Array.isArray(v) ? v[LANG] : v);
  const FONT = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", sans-serif';
  const NODE_W = 214, TX = 15, INNER_W = NODE_W - TX * 2, COL_GAP = 52, COL_W = NODE_W + COL_GAP, V_GAP = 14, PAD = 48, BAND_HEAD = 56, BAND_GAP = 60;
  const UI = {
    zh: { realize: '意识到', explore: '探索到', official: '官方另一解', luck: '运气 / 试错 / 硬闯', timing: '时间窗口', risk: '小心坠落', verify: '社区说法', or: '或', go: '怎么去' },
    en: { realize: 'Realize', explore: 'Explore', official: 'other in-game clue', luck: 'luck / trial / brute force', timing: 'timing', risk: 'mind the drop', verify: 'community claim', or: 'or', go: 'how to get there' }
  }[LANG];

  const svg = document.getElementById('graph');
  const vp = el('g', {}, svg);
  const state = { view: { k: 1, tx: 0, ty: 0 }, moved: false, gw: 1000, gh: 1000, pos: {}, size: {} };
  const stage = document.getElementById('stage');
  const BANDS = window.OWC.bands;
  const G = { nodes: {}, edges: [], band: {} };

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

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

  const isBig = n => n.t === 'goal' || n.t === 'target' || n.t === 'loc';
  function nodeClass(n) {
    if (n.t === 'goal') return G.band[n.id] === 'main' ? 'goal' : 'branch';
    return n.t;
  }
  function metaText(n) {
    const m = [];
    if (n.act) m.push(UI[n.act]);
    if (n.t === 'alt') m.push(UI[n.alt]);
    if (n.tag) m.push(UI[n.tag]);
    if (n.verify) m.push(UI.verify);
    return m.join(' · ');
  }
  // Font size and line height per text row; graph.css uses the same sizes.
  const F = { meta: [12.5, 17], lbl: [15, 20], big: [16, 21], note: [13.5, 18], sub: [12.5, 17] };
  function measure(n) {
    const big = isBig(n);
    const lbl = big ? F.big : F.lbl;
    const label = wrap(T(n.label), `${big ? 700 : n.t === 'gate' ? 600 : 400} ${lbl[0]}px ${FONT}`, INNER_W);
    const place = n.place ? wrap(T(n.place), `400 ${F.sub[0]}px ${FONT}`, INNER_W).slice(0, 3) : [];
    const note = n.note ? wrap(T(n.note), `400 ${F.note[0]}px ${FONT}`, INNER_W).slice(0, 3) : [];
    const meta = metaText(n);
    const metaLines = meta ? wrap(meta, `700 ${F.meta[0]}px ${FONT}`, INNER_W - 14) : [];
    const h = 14 + metaLines.length * F.meta[1] + (metaLines.length ? 2 : 0) + label.length * lbl[1] + note.length * F.note[1] + (note.length ? 2 : 0) + place.length * F.sub[1] + 12;
    return { label, note, place, metaLines, h };
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
        top = minTop;
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

  // One tile of plain-weave canvas: 4 px threads going over and under, each thread a little lighter
  // or darker than its neighbours, with fine grain. It repeats seamlessly and scales with the map.
  function clothTile() {
    const S = 360, TW = 4, n = S / TW;
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const warp = Array.from({ length: n }, () => rnd() - 0.5), weft = Array.from({ length: n }, () => (rnd() - 0.5) * (rnd() < 0.05 ? 1.6 : 1));
    const c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d'), img = g.createImageData(S, S), d = img.data;
    const base = [226, 214, 192];
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const i = Math.floor(x / TW), j = Math.floor(y / TW), warpUp = (i + j) % 2 === 0;
      const across = warpUp ? (x % TW) / (TW - 1) : (y % TW) / (TW - 1); // 0..1 across the thread on top
      const round = 1 - Math.pow(across * 2 - 1, 2); // thread centre catches the light
      let l = 0.96 + 0.045 * round + 0.025 * (warpUp ? warp[i] : weft[j]) + (rnd() - 0.5) * 0.03;
      if (!warpUp) l *= 0.985;
      const k = (y * S + x) * 4;
      d[k] = Math.min(255, base[0] * l); d[k + 1] = Math.min(255, base[1] * l); d[k + 2] = Math.min(255, base[2] * l); d[k + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return { url: c.toDataURL('image/png'), size: S };
  }

  // Fine cotton for the cards, drawn at twice the map's resolution so it stays crisp when zoomed in.
  // It is only light and shade (transparent elsewhere), laid over each card's own colour.
  function cottonTile() {
    const S = 192, TW = 4, n = S / TW;
    let seed = 11;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const warp = Array.from({ length: n }, () => rnd() - 0.5), weft = Array.from({ length: n }, () => rnd() - 0.5);
    const c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d'), img = g.createImageData(S, S), d = img.data;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const i = Math.floor(x / TW), j = Math.floor(y / TW), warpUp = (i + j) % 2 === 0;
      const across = warpUp ? (x % TW) / (TW - 1) : (y % TW) / (TW - 1);
      const v = (0.5 - Math.pow(across * 2 - 1, 2)) * 0.6 + 0.35 * (warpUp ? warp[i] : weft[j]) + (rnd() - 0.5) * 0.25;
      const k = (y * S + x) * 4;
      if (v > 0) { d[k] = d[k + 1] = 255; d[k + 2] = 250; d[k + 3] = Math.min(70, v * 120); }
      else { d[k] = 95; d[k + 1] = 65; d[k + 2] = 35; d[k + 3] = Math.min(34, -v * 60); }
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  }

  // Nomai-style curl next to each band title.
  function spiralPath(cx, cy, R) {
    let d = '';
    for (let i = 0; i <= 56; i++) { const a = i / 56 * Math.PI * 5, r = 0.8 + i / 56 * R; d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }
    return d;
  }

  function render() {
    for (const id in G.nodes) state.size[id] = measure(G.nodes[id]);
    vp.innerHTML = '';
    const defs = el('defs', {}, vp);
    const tile = clothTile();
    const pat = el('pattern', { id: 'cloth', patternUnits: 'userSpaceOnUse', width: tile.size, height: tile.size }, defs);
    el('image', { href: tile.url, width: tile.size, height: tile.size }, pat);
    const cotton = el('pattern', { id: 'cotton', patternUnits: 'userSpaceOnUse', width: 96, height: 96 }, defs);
    el('image', { href: cottonTile(), width: 96, height: 96 }, cotton);
    const ging = el('pattern', { id: 'gingham', patternUnits: 'userSpaceOnUse', width: 14, height: 14 }, defs);
    el('rect', { width: 14, height: 7, fill: 'rgba(214,112,46,.085)' }, ging);
    el('rect', { width: 7, height: 14, fill: 'rgba(214,112,46,.085)' }, ging);
    [['ah', '#7d6550'], ['ah-alt', '#c4581a']].forEach(([id, col]) => {
      const m = el('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
      el('path', { d: 'M0,0 L10,5 L0,10 z', style: `fill:${col}` }, m);
    });
    const L = BANDS.map(b => layoutBand(b.roots));
    const maxDepth = Math.max(...L.map(l => l.maxDepth));
    const width = PAD * 2 + maxDepth * COL_W + NODE_W;
    const pos = {};
    const gCloth = el('g', {}, vp), gBand = el('g', {}, vp), gES = el('g', { class: 'edge-shadows' }, vp), gE = el('g', {}, vp), gN = el('g', {}, vp);
    let top = PAD;
    BANDS.forEach((b, i) => {
      const l = L[i];
      if (i > 0) el('line', { class: 'band-line', x1: PAD, x2: width - PAD, y1: top - BAND_GAP / 2, y2: top - BAND_GAP / 2 }, gBand);
      // band titles sit at the right, next to the goals, where the frame opens
      ctx.font = `700 17px ${FONT}`;
      const tw = ctx.measureText(T(b.title)).width;
      el('path', { class: 'spiral', d: spiralPath(width - PAD - tw - 17, top + 12, 8.5) }, gBand);
      const t1 = el('text', { class: 'band-label', x: width - PAD, y: top + 18, 'text-anchor': 'end' }, gBand); t1.textContent = T(b.title);
      const t2 = el('text', { class: 'band-sub', x: width - PAD, y: top + 38, 'text-anchor': 'end' }, gBand); t2.textContent = T(b.band);
      const y0 = top + BAND_HEAD;
      for (const id in l.pos) pos[id] = { x: PAD + (maxDepth - l.pos[id].d) * COL_W, y: y0 + l.pos[id].y };
      top = y0 + l.height + BAND_GAP;
    });
    state.gw = width; state.gh = top - BAND_GAP + PAD; state.pos = pos;
    // the cloth itself: a soft shadow under it, the woven surface, and a folded hem near the edge
    const cw = state.gw, ch = state.gh;
    el('rect', { class: 'cloth-shadow', x: -6, y: 10, width: cw + 12, height: ch + 6, rx: 14 }, gCloth);
    el('rect', { class: 'cloth-shadow', x: -2, y: 4, width: cw + 4, height: ch + 2, rx: 10 }, gCloth);
    el('rect', { class: 'cloth', width: cw, height: ch, rx: 8 }, gCloth);
    el('rect', { class: 'hem-dark', x: 10, y: 10, width: cw - 20, height: ch - 20, rx: 4 }, gCloth);
    el('rect', { class: 'hem-light', x: 12, y: 12, width: cw - 24, height: ch - 24, rx: 3 }, gCloth);

    // Where any one prerequisite is enough, the arrows merge into an "or" dot before the card;
    // arrows that reach the card directly are all required.
    const incoming = {};
    G.edges.forEach(e => { if (pos[e.from] && pos[e.to]) incoming[e.to] = (incoming[e.to] || 0) + 1; });
    const isOr = id => G.nodes[id].req === 'any' && incoming[id] > 1;
    const R = 9;
    G.edges.forEach(e => {
      const a = G.nodes[e.from], b = G.nodes[e.to];
      if (!pos[a.id] || !pos[b.id]) return;
      const pa = pos[a.id], pb = pos[b.id];
      const x1 = pa.x + NODE_W, y1 = pa.y + state.size[a.id].h / 2, y2 = pb.y + state.size[b.id].h / 2;
      const or = isOr(b.id);
      const x2 = or ? pb.x - 26 - R : pb.x - 2;
      const dx = Math.max(18, (x2 - x1) / 2);
      const alt = a.t === 'alt';
      const attrs = { d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`, class: 'edge' + (alt ? ' alt' : '') };
      if (!or) attrs['marker-end'] = `url(#${alt ? 'ah-alt' : 'ah'})`;
      el('path', { d: attrs.d, class: 'edge-shadow' }, gES);
      const p = el('path', attrs, gE);
      p.dataset.from = a.id; p.dataset.to = b.id;
    });
    for (const id in pos) {
      if (!isOr(id)) continue;
      const pb = pos[id], y = pb.y + state.size[id].h / 2, cx = pb.x - 26;
      el('path', { d: `M${cx + R},${y} L${pb.x - 2},${y}`, class: 'edge-shadow' }, gES);
      const c = el('path', { d: `M${cx + R},${y} L${pb.x - 2},${y}`, class: 'edge join', 'marker-end': 'url(#ah)' }, gE);
      c.dataset.join = id;
      const g = el('g', { class: 'or' }, gE); g.dataset.join = id;
      el('circle', { cx, cy: y, r: R }, g);
      el('circle', { class: 'rim', cx, cy: y, r: R - 2.4 }, g);
      const t = el('text', { x: cx, y: y + 4, 'text-anchor': 'middle' }, g); t.textContent = UI.or;
    }

    for (const id in pos) {
      const n = G.nodes[id], p = pos[id], s = state.size[id];
      const gr = el('g', { class: 'node ' + nodeClass(n), transform: `translate(${p.x},${p.y})` }, gN);
      gr.dataset.id = id;
      // A fabric swatch: soft shadow, the cloth, its weave (gingham for other ways through),
      // then a hand-sewn running stitch whose thread colour carries the meaning.
      el('rect', { class: 'shade', x: 0.5, y: 3, width: NODE_W - 1, height: s.h, rx: 5 }, gr);
      el('rect', { class: 'box', width: NODE_W, height: s.h, rx: 4 }, gr);
      if (n.t === 'alt') el('rect', { class: 'fabric', width: NODE_W, height: s.h, rx: 4, fill: 'url(#gingham)' }, gr);
      el('rect', { class: 'fabric', width: NODE_W, height: s.h, rx: 4, fill: 'url(#cotton)' }, gr);
      el('rect', { class: 'stitch-shadow', x: 5.5, y: 6, width: NODE_W - 11, height: s.h - 11, rx: 2.5 }, gr);
      el('rect', { class: 'stitch', x: 5.5, y: 5.5, width: NODE_W - 11, height: s.h - 11, rx: 2.5 }, gr);
      let y = 14;
      s.metaLines.forEach((line, i) => {
        const kw = n.act && i === 0 ? UI[n.act] : '';
        const t = el('text', { class: n.t === 'alt' ? 'meta alt' : n.tag === 'timing' ? 'meta timing' : 'meta', x: kw ? TX + 5 : TX, y: y + 12 }, gr);
        if (kw && line.startsWith(kw)) { // realize / explore sit on a small woven label
          ctx.font = `700 ${F.meta[0]}px ${FONT}`;
          const w = ctx.measureText(kw).width, lx = TX - 1, lw = w + 12;
          gr.insertBefore(el('rect', { class: 'kw-mark-' + n.act, x: lx, y: y - 1, width: lw, height: F.meta[1] + 1, rx: 1.5 }), t);
          const a = el('tspan', { class: 'kw-' + n.act }, t); a.textContent = kw;
          const b = el('tspan', { dx: 9 }, t); b.textContent = line.slice(kw.length).replace(/^ · /, '· ');
        } else t.textContent = line;
        y += F.meta[1];
      });
      if (s.metaLines.length) y += 2;
      const lbl = isBig(n) ? F.big : F.lbl;
      s.label.forEach(line => { const t = el('text', { class: 'lbl', x: TX, y: y + lbl[0] + 1 }, gr); t.textContent = line; y += lbl[1]; });
      if (s.note.length) y += 2;
      s.note.forEach(line => { const t = el('text', { class: 'note', x: TX, y: y + F.note[0] }, gr); t.textContent = line; y += F.note[1]; });
      s.place.forEach(line => { const t = el('text', { class: 'sub', x: TX, y: y + F.sub[0] }, gr); t.textContent = line; y += F.sub[1]; });
    }
  }

  /* ---------- view: opens on the whole map; zoom in to read ---------- */
  const tip = document.getElementById('zoom-tip');
  const clampK = k => Math.min(2.5, Math.max(0.05, k));
  function applyView() {
    const v = state.view;
    vp.setAttribute('transform', `translate(${v.tx},${v.ty}) scale(${v.k})`);
    document.getElementById('z-val').textContent = Math.round(v.k * 100) + '%';
  }
  function fitAll() {
    const w = stage.clientWidth, h = stage.clientHeight;
    const k = clampK(Math.min((w - 24) / state.gw, (h - 24) / state.gh));
    state.view = { k, tx: (w - state.gw * k) / 2, ty: (h - state.gh * k) / 2 };
    applyView();
  }
  function zoomAt(f, cx, cy) {
    const v = state.view, k = clampK(v.k * f);
    v.tx = cx - (cx - v.tx) * (k / v.k); v.ty = cy - (cy - v.ty) * (k / v.k); v.k = k;
    state.moved = true; applyView();
    if (tip) tip.hidden = true;
  }
  const center = () => [stage.clientWidth / 2, stage.clientHeight / 2];
  document.getElementById('z-in').onclick = () => zoomAt(1.5, ...center());
  document.getElementById('z-out').onclick = () => zoomAt(1 / 1.5, ...center());
  document.getElementById('z-fit').onclick = () => { state.moved = false; fitAll(); };

  // Ctrl/⌘ + wheel or a trackpad pinch zooms. A plain wheel moves a zoomed-in map and hands the scroll
  // back to the page at its top or bottom edge (or right away when the whole map already fits).
  svg.addEventListener('wheel', ev => {
    const r = svg.getBoundingClientRect();
    const unit = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? r.height : 1;
    if (ev.ctrlKey || ev.metaKey) { ev.preventDefault(); zoomAt(Math.exp(-ev.deltaY * unit * 0.0025), ev.clientX - r.left, ev.clientY - r.top); return; }
    const v = state.view;
    const minTy = Math.min(12, r.height - state.gh * v.k - 12), maxTy = Math.max(12, r.height - state.gh * v.k - 12);
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
    if (ptrs.size === 1) drag = { x: ev.clientX, y: ev.clientY, moved: false };
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
    if (!drag.moved && Math.hypot(ev.clientX - drag.x, ev.clientY - drag.y) < 4) return;
    drag.moved = true; svg.classList.add('dragging');
    state.view.tx += ev.clientX - prev.x; state.view.ty += ev.clientY - prev.y; state.moved = true; applyView();
  });
  function endPtr(ev) {
    if (!ptrs.has(ev.pointerId)) return;
    ptrs.delete(ev.pointerId);
    if (ptrs.size === 0) { drag = null; svg.classList.remove('dragging'); }
  }
  window.addEventListener('pointerup', endPtr);
  window.addEventListener('pointercancel', endPtr);
  window.addEventListener('resize', () => { if (!state.moved) fitAll(); });

  render();
  fitAll();
})();
