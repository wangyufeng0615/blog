// 得到老师预测回测：图表与明细渲染。数据由 data/<slug>.json 提供，字段见 build 脚本
(function () {
  const GROUP = {
    '命中': 'ok', '基本命中': 'ok', '部分命中': 'part', '落空': 'bad', '被反证': 'bad',
    '未到期-趋势向好': 'open', '未到期-趋势不利': 'open', '未到期': 'open', '无法验证': 'na', '作者已修正': 'na',
  };
  const GLABEL = { ok: '说对', part: '部分对', bad: '说错', open: '未到期', na: '无法验证' };
  const GCOLOR = { ok: 'var(--ok)', part: 'var(--part)', bad: 'var(--bad)', open: 'var(--open)', na: 'var(--na)' };
  const ORDER = ['ok', 'part', 'bad', 'open', 'na'];
  const DUE = ['ok', 'part', 'bad'];
  const TIER_NAME = { T1: '高风险判断', T2: '有依据的判断', T3: '常识与转述' };

  const g = (it) => GROUP[it.s] || 'na';
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const count = (xs) => { const c = { ok: 0, part: 0, bad: 0, open: 0, na: 0 }; xs.forEach((x) => c[g(x)]++); return c; };
  const own = (items) => items.filter((x) => x.a === '本人');
  const due = (xs) => xs.filter((x) => DUE.includes(g(x)));

  function stats(items) {
    const o = own(items), d = due(o), c = count(d);
    const t1 = d.filter((x) => x.tier === 'T1'), c1 = count(t1);
    return { all: items.length, own: o.length, due: d.length, ok: c.ok, part: c.part, bad: c.bad, rate: pct(c.ok, d.length), badRate: pct(c.bad, d.length), t1: t1.length, t1ok: c1.ok, t1part: c1.part, t1bad: c1.bad };
  }

  // 悬停提示：鼠标与键盘焦点共用
  const tip = document.createElement('div');
  tip.className = 'tip';
  tip.setAttribute('role', 'tooltip');
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(tip));
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.classList.add('on');
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let left = x + 14, top = y + 14;
    if (left + w > innerWidth - 8) left = Math.max(8, x - w - 14);
    if (top + h > innerHeight - 8) top = Math.max(8, y - h - 14);
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }
  const hideTip = () => tip.classList.remove('on');
  function bindTip(el, html) {
    el.addEventListener('pointermove', (e) => showTip(html(), e.clientX, e.clientY));
    el.addEventListener('pointerleave', hideTip);
    el.addEventListener('focus', () => { const r = el.getBoundingClientRect(); showTip(html(), r.left + r.width / 2, r.bottom); });
    el.addEventListener('blur', hideTip);
  }
  const itemTip = (x) => `<b>${esc(x.dl || x.d)} · ${esc(x.c)}</b><br>${esc(x.p)}<br><span class="r">${GLABEL[g(x)]}（${esc(x.s)}）</span><br>${esc(x.e)}`;

  // 计分卡
  function tiles(el, items) {
    const s = stats(items);
    const others = items.length - s.own;
    el.innerHTML = `
      <div class="tile"><div class="label">提取的预测</div><div class="value">${s.all}<small>条</small></div><div class="note">本人判断 ${s.own} 条，转述等其他 ${others} 条</div></div>
      <div class="tile"><div class="label">今天能判对错的本人判断</div><div class="value">${s.due}<small>条</small></div><div class="note">其余未到期或无法验证</div></div>
      <div class="tile"><div class="label">说对的比例</div><div class="value">${s.rate}<small>%</small></div><div class="note">说错 ${s.badRate}%，其余部分对</div></div>
      <div class="tile key"><div class="label">高风险判断：对 vs 错</div><div class="value">${s.t1ok}<small> : </small>${s.t1bad}</div><div class="note">共 ${s.t1} 条，另有 ${s.t1part} 条部分对</div></div>`;
  }

  // 一条横向堆叠条，HTML 实现便于自适应
  function stackRow(c, keys, total, label) {
    return keys.filter((k) => c[k]).map((k) => {
      const w = (c[k] / total) * 100;
      const txt = w >= 9 ? `<span class="in">${pct(c[k], total)}%</span>` : '';
      return `<span class="seg-${k}" style="flex:${c[k]} 1 0;background:${GCOLOR[k]}" tabindex="0" data-k="${k}" data-n="${c[k]}" data-t="${total}" data-l="${esc(label)}">${txt}</span>`;
    }).join('');
  }
  function bindStack(root) {
    root.querySelectorAll('[data-k]').forEach((s) => bindTip(s, () => `<b>${s.dataset.l}</b><br>${GLABEL[s.dataset.k]}：${s.dataset.n} 条（${pct(+s.dataset.n, +s.dataset.t)}%）`));
  }
  const STACK_CSS = `
    .stack{display:flex;gap:2px;height:22px;border-radius:5px;overflow:hidden;background:var(--bg)}
    .stack>span{display:flex;align-items:center;justify-content:center;min-width:0;outline-offset:-2px}
    .stack .in{font-size:11.5px;font-weight:600;color:#fff;white-space:nowrap;font-variant-numeric:tabular-nums}
    .stack .seg-part .in{color:#4a3306}.stack .seg-open .in,.stack .seg-na .in{color:#3d3d3d}
    .srows{display:grid;grid-template-columns:minmax(96px,auto) 1fr 52px;gap:12px 14px;align-items:center}
    .srows .lab{font-size:14px;color:var(--ink-strong);line-height:1.3}.srows .lab small{display:block;font-size:12px;color:var(--muted)}
    .srows .val{font-size:14px;font-weight:600;color:var(--ink-strong);text-align:right;font-variant-numeric:tabular-nums}
    @media (max-width:520px){.srows{grid-template-columns:1fr 46px}.srows .lab{grid-column:1/-1;margin-bottom:-6px}}`;
  function injectCss() {
    if (document.getElementById('stack-css')) return;
    const st = document.createElement('style'); st.id = 'stack-css'; st.textContent = STACK_CSS; document.head.appendChild(st);
  }
  function legend(keys, c) {
    return `<div class="legend">${keys.map((k) => `<span><i style="background:${GCOLOR[k]}"></i>${GLABEL[k]}${c ? ` ${c[k]}` : ''}</span>`).join('')}</div>`;
  }

  // 全部本人判断的结果分布
  function outcome(el, items) {
    injectCss();
    const o = own(items), c = count(o);
    el.innerHTML = `<div class="stack" style="height:30px">${stackRow(c, ORDER, o.length, '本人判断')}</div>${legend(ORDER, c)}`;
    bindStack(el);
  }

  // 按含金量分档的对错，说明"命中率会骗人"
  function tiers(el, items) {
    injectCss();
    const d = due(own(items));
    el.innerHTML = `<div class="srows">${['T1', 'T2', 'T3'].map((t) => {
      const xs = d.filter((x) => x.tier === t); if (xs.length < 5) return '';
      const c = count(xs);
      return `<div class="lab">${TIER_NAME[t]}<small>${t} · ${xs.length} 条</small></div><div class="stack">${stackRow(c, DUE, xs.length, TIER_NAME[t])}</div><div class="val">${pct(c.ok, xs.length)}%</div>`;
    }).join('')}</div>${legend(DUE)}`;
    bindStack(el);
  }

  // 分领域命中率
  function domains(el, items, min = 6) {
    injectCss();
    const d = due(own(items)), by = {};
    d.forEach((x) => (by[x.top] ||= []).push(x));
    const rows = Object.entries(by).filter(([, xs]) => xs.length >= min)
      .map(([t, xs]) => ({ t, xs, c: count(xs) }))
      .sort((a, b) => b.c.ok / b.xs.length - a.c.ok / a.xs.length);
    el.innerHTML = `<div class="srows">${rows.map((r) => `<div class="lab">${esc(r.t)}<small>${r.xs.length} 条</small></div><div class="stack">${stackRow(r.c, DUE, r.xs.length, r.t)}</div><div class="val">${pct(r.c.ok, r.xs.length)}%</div>`).join('')}</div>${legend(DUE)}<p class="cap" style="margin:10px 0 0">仅列 ${min} 条以上的领域</p>`;
    bindStack(el);
  }

  // 高风险判断时间线：三条泳道，点按发布日期排列，重叠时上下错开
  function timeline(el, items) {
    const xs = due(own(items).filter((x) => x.tier === 'T1' && x.d)).sort((a, b) => a.d.localeCompare(b.d));
    if (!xs.length) { el.innerHTML = ''; return; }
    const draw = () => {
      const W = Math.max(300, el.clientWidth), padL = W < 520 ? 54 : 70, padR = 12, R = W < 520 ? 4.5 : 5.5, step = R * 2 + 2;
      const t = (d) => new Date(d.length === 7 ? d + '-15' : d).getTime();
      const y0 = new Date(xs[0].d.slice(0, 4) + '-01-01').getTime();
      const y1 = new Date((+xs[xs.length - 1].d.slice(0, 4) + 1) + '-01-01').getTime();
      const X = (d) => padL + ((t(d) - y0) / (y1 - y0)) * (W - padL - padR);
      const lanes = DUE.map((k) => {
        const pts = [], list = xs.filter((x) => g(x) === k);
        list.forEach((x) => {
          const cx = X(x.d);
          for (let i = 0; ; i++) {
            const off = (i % 2 ? -1 : 1) * Math.ceil(i / 2) * step;
            if (!pts.some((p) => Math.abs(p.cx - cx) < step && Math.abs(p.off - off) < step)) { pts.push({ x, cx, off }); break; }
          }
        });
        const span = pts.length ? Math.max(...pts.map((p) => Math.abs(p.off))) : 0;
        return { k, pts, half: span + R + 8 };
      });
      let y = 8; lanes.forEach((l) => { l.cy = y + l.half; y += l.half * 2 + 6; });
      const H = y + 26;
      const years = []; for (let yr = +xs[0].d.slice(0, 4); yr <= +xs[xs.length - 1].d.slice(0, 4) + 1; yr++) years.push(yr);
      let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="高风险判断时间线，共 ${xs.length} 条">`;
      svg += `<g class="grid">${years.map((yr) => `<line x1="${X(yr + '-01-01')}" x2="${X(yr + '-01-01')}" y1="4" y2="${H - 22}"/>`).join('')}</g>`;
      svg += `<g class="axis">${years.slice(0, -1).map((yr) => `<text class="tick" x="${(X(yr + '-01-01') + X((yr + 1) + '-01-01')) / 2}" y="${H - 6}" text-anchor="middle">${W < 520 ? String(yr).slice(2) : yr}</text>`).join('')}</g>`;
      lanes.forEach((l) => {
        svg += `<text x="0" y="${l.cy + 4}" font-size="13" font-weight="600">${GLABEL[l.k]}</text><text x="0" y="${l.cy + 20}" class="tick">${l.pts.length} 条</text>`;
        l.pts.forEach((p, i) => { svg += `<circle data-l="${l.k}" data-i="${i}" cx="${p.cx.toFixed(1)}" cy="${(l.cy + p.off).toFixed(1)}" r="${R}" fill="${GCOLOR[l.k]}" stroke="var(--panel)" stroke-width="2" tabindex="0"/>`; });
      });
      svg += '</svg>';
      el.innerHTML = svg;
      el.querySelectorAll('circle').forEach((c) => {
        const l = lanes.find((z) => z.k === c.dataset.l), p = l.pts[+c.dataset.i];
        c.style.cursor = 'pointer';
        bindTip(c, () => itemTip(p.x));
      });
    };
    draw();
    let w = el.clientWidth;
    new ResizeObserver(() => { if (Math.abs(el.clientWidth - w) > 4) { w = el.clientWidth; draw(); } }).observe(el);
  }

  // 明细：筛选 + 分页
  function list(el, items) {
    const topics = [...new Set(items.map((x) => x.top))].sort();
    const state = { tier: 'T1', res: '', top: '', q: '', n: 30 };
    el.innerHTML = `
      <div class="filters">
        <div class="seg" data-f="tier" role="group" aria-label="含金量">${[['', '全部'], ['T1', '高风险'], ['T2', '有依据'], ['T3', '常识与转述']].map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${v === state.tier}">${l}</button>`).join('')}</div>
        <div class="seg" data-f="res" role="group" aria-label="结果">${[['', '全部'], ['ok', '说对'], ['part', '部分对'], ['bad', '说错'], ['open', '未到期']].map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${v === state.res}">${l}</button>`).join('')}</div>
        <select aria-label="领域"><option value="">全部领域</option>${topics.map((t) => `<option>${esc(t)}</option>`).join('')}</select>
        <input type="search" placeholder="搜索预测内容、年份、关键词" aria-label="搜索">
        <span class="count"></span>
      </div>
      <div class="rows"></div><button type="button" class="more">再显示 30 条</button>`;
    const rowsEl = el.querySelector('.rows'), cnt = el.querySelector('.count'), more = el.querySelector('.more');
    const filtered = () => items.filter((x) => (!state.tier || x.tier === state.tier) && (!state.res || g(x) === state.res) && (!state.top || x.top === state.top)
      && (!state.q || (x.p + x.e + (x.dl || x.d) + x.c + x.t).toLowerCase().includes(state.q)))
      .sort((a, b) => (a.tier || 'T9').localeCompare(b.tier || 'T9') || (b.d || '').localeCompare(a.d || ''));
    const render = () => {
      const xs = filtered();
      cnt.textContent = `${xs.length} 条`;
      rowsEl.innerHTML = xs.slice(0, state.n).map((x) => `
        <div class="row">
          <div class="when">${esc(x.dl || x.d || '日期不详')}<span class="course">${esc(x.c)}</span></div>
          <div class="claim">${esc(x.p)}<div class="tags"><span class="tier ${esc(x.tier)}">${esc(x.tier)}</span><span class="tag">${esc(x.top)}</span>${x.a !== '本人' ? `<span class="tag">${esc(x.a)}</span>` : ''}${x.t ? `<span class="tag">指向 ${esc(x.t)}</span>` : ''}</div></div>
          <div class="res"><span class="badge b-${g(x)}">${esc(x.s)}</span><div>${esc(x.e)}</div>${x.u ? `<a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.u.replace(/^https?:\/\/(www\.)?/, '').slice(0, 48))}</a>` : ''}</div>
        </div>`).join('') || '<p class="count" style="padding:20px 0">没有符合条件的预测。</p>';
      more.hidden = xs.length <= state.n;
    };
    el.querySelectorAll('.seg').forEach((seg) => seg.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      state[seg.dataset.f] = b.dataset.v; state.n = 30;
      seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      render();
    }));
    el.querySelector('select').addEventListener('change', (e) => { state.top = e.target.value; state.n = 30; render(); });
    el.querySelector('input').addEventListener('input', (e) => { state.q = e.target.value.trim().toLowerCase(); state.n = 30; render(); });
    more.addEventListener('click', () => { state.n += 30; render(); });
    render();
  }

  // 专题首页：每位老师的计分小卡
  function teacherCard(el, data) {
    const s = stats(data.items), c = { ok: s.ok, part: s.part, bad: s.bad };
    el.querySelector('[data-v="due"]').textContent = s.due;
    el.querySelector('[data-v="rate"]').textContent = s.rate + '%';
    el.querySelector('[data-v="t1"]').textContent = `${s.t1ok}:${s.t1bad}`;
    el.querySelector('.minibar').innerHTML = DUE.map((k) => `<span style="flex:${c[k]} 1 0;background:${GCOLOR[k]}" title="${GLABEL[k]} ${c[k]}"></span>`).join('');
  }

  // 专题首页：三人"全部 vs 高风险"说对率哑铃图
  function dumbbell(el, all) {
    const rows = all.map((d) => {
      const dd = due(own(d.items)), rate = (xs) => (xs.length ? (count(xs).ok / xs.length) * 100 : null);
      return { name: d.teacher, allR: rate(dd), t1: rate(dd.filter((x) => x.tier === 'T1')), t3: rate(dd.filter((x) => x.tier === 'T3')), n1: dd.filter((x) => x.tier === 'T1').length, n3: dd.filter((x) => x.tier === 'T3').length, n: dd.length };
    });
    const draw = () => {
      const W = Math.max(300, el.clientWidth), padL = W < 520 ? 52 : 70, padR = 16, rowH = 54, H = rows.length * rowH + 34;
      const X = (v) => padL + (v / 100) * (W - padL - padR);
      let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="三位老师不同难度判断的说对比例">`;
      svg += `<g class="grid">${[0, 25, 50, 75, 100].map((v) => `<line x1="${X(v)}" x2="${X(v)}" y1="0" y2="${H - 26}"/>`).join('')}</g>`;
      svg += `<g class="axis">${[0, 25, 50, 75, 100].map((v) => `<text class="tick" x="${X(v)}" y="${H - 8}" text-anchor="middle">${v}%</text>`).join('')}</g>`;
      rows.forEach((r, i) => {
        const cy = i * rowH + rowH / 2;
        svg += `<text x="0" y="${cy + 5}" font-size="14" font-weight="600">${esc(r.name)}</text>`;
        const vals = [r.n1 >= 5 ? r.t1 : null, r.allR, r.n3 >= 5 ? r.t3 : null].filter((v) => v != null);
        svg += `<line x1="${X(Math.min(...vals))}" x2="${X(Math.max(...vals))}" y1="${cy}" y2="${cy}" stroke="var(--line-strong)" stroke-width="2"/>`;
        const dot = (v, fill, stroke, lab, n) => v == null || n < 5 ? '' : `<circle cx="${X(v)}" cy="${cy}" r="7" fill="${fill}" stroke="${stroke}" stroke-width="2" tabindex="0" data-tip="${esc(r.name)}｜${lab}：说对 ${Math.round(v)}%（${n} 条）"/>`;
        svg += dot(r.t3, 'var(--panel)', 'var(--faint)', '常识与转述', r.n3);
        svg += dot(r.allR, 'var(--accent)', 'var(--panel)', '全部本人判断', r.n);
        svg += dot(r.t1, 'var(--ink-strong)', 'var(--panel)', '高风险判断', r.n1);
        if (r.t1 != null && r.n1 >= 5) svg += `<text x="${X(r.t1)}" y="${cy - 13}" text-anchor="middle" font-size="12" font-weight="600">${Math.round(r.t1)}%</text>`;
        if (r.t3 != null && r.n3 >= 5) svg += `<text x="${X(r.t3)}" y="${cy - 13}" text-anchor="middle" font-size="12" fill="var(--muted)">${Math.round(r.t3)}%</text>`;
      });
      svg += '</svg>';
      el.innerHTML = svg + `<div class="legend"><span><i style="background:var(--ink-strong);border-radius:50%"></i>高风险判断（T1）</span><span><i style="background:var(--accent);border-radius:50%"></i>全部本人判断</span><span><i style="background:var(--panel);border:2px solid var(--faint);border-radius:50%"></i>常识与转述（T3）</span></div>`;
      el.querySelectorAll('circle').forEach((c) => bindTip(c, () => esc(c.dataset.tip)));
    };
    draw();
    let w = el.clientWidth;
    new ResizeObserver(() => { if (Math.abs(el.clientWidth - w) > 4) { w = el.clientWidth; draw(); } }).observe(el);
  }

  // 专题首页：三人高风险判断对错条
  function t1compare(el, all) {
    injectCss();
    el.innerHTML = `<div class="srows">${all.map((d) => {
      const xs = due(own(d.items)).filter((x) => x.tier === 'T1'), c = count(xs);
      return `<div class="lab">${esc(d.teacher)}<small>${xs.length} 条</small></div><div class="stack">${stackRow(c, DUE, xs.length, d.teacher + ' 高风险判断')}</div><div class="val">${pct(c.ok, xs.length)}%</div>`;
    }).join('')}</div>${legend(DUE)}`;
    bindStack(el);
  }

  async function load(url) { const r = await fetch(url); if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); }

  window.Forecast = {
    async teacher(slug) {
      const data = await load(`../data/${slug}.json`);
      const $ = (id) => document.getElementById(id);
      tiles($('tiles'), data.items);
      outcome($('outcome'), data.items);
      tiers($('tiers'), data.items);
      domains($('domains'), data.items, data.minDomain || 6);
      timeline($('timeline'), data.items);
      list($('list'), data.items);
    },
    async overview(slugs) {
      const all = await Promise.all(slugs.map((s) => load(`data/${s}.json`)));
      all.forEach((d, i) => teacherCard(document.querySelector(`[data-teacher="${slugs[i]}"]`), d));
      dumbbell(document.getElementById('dumbbell'), all);
      t1compare(document.getElementById('t1compare'), all);
    },
  };
})();
