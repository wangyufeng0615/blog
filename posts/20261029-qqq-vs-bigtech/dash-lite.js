// A tiny stand-in for the dashboard runtime the page was first built on:
// static CSV sources, derived tables (calc) and named drawings that redraw on resize.
(() => {
  const SOURCES = {
    cohorts: 'data/cohorts.csv',
    edu_profiles: 'data/edu_profiles.csv',
    edu_years: 'data/edu_years.csv',
    elite: 'data/elite.csv',
    pay_paths: 'data/pay_paths.csv',
    qqq_monthly: 'data/qqq_monthly.csv',
    rd_hires: 'data/rd_hires.csv',
    lines: 'data/lines.csv',
  };
  // The page loads this file as dash-lite.js?v=…; the same tag busts cached CSVs when data changes.
  const VER = new URL(document.currentScript.src).searchParams.get('v') || '';
  const state = {};
  const calcs = [];
  const draws = new Map();
  const listeners = [];
  const loading = { status: 'loading', data: [] };

  // Plain numbers become numbers; dates like "2000-01", flags and blanks stay strings.
  const NUM = /^-?\d+(\.\d+)?(e[-+]?\d+)?$/i;
  const typed = (row) => {
    for (const k in row) if (NUM.test(row[k])) row[k] = +row[k];
    return row;
  };

  const runDraw = (name) => {
    const fn = draws.get(name);
    if (!fn) return;
    document.querySelectorAll(`[data-draw="${name}"]`).forEach((el) => {
      if (!el.clientWidth) return; // hidden or not laid out yet; the next resize redraws it
      try { fn(el); } catch (e) { console.error(name, e); }
    });
  };
  const runAll = () => { for (const name of draws.keys()) runDraw(name); };

  window.dash = {
    colors: ['#2f6db5', '#c45a22'],
    calc(name, spec) { calcs.push({ name, spec }); },
    draw(name, fn) {
      if (fn) draws.set(name, fn);
      if (document.readyState !== 'loading') runDraw(name);
    },
    data(name) { return state[name] || loading; },
    onData(cb) { listeners.push(cb); },
  };

  const load = async () => {
    const entries = await Promise.all(Object.entries(SOURCES).map(async ([id, url]) => {
      try {
        const res = await fetch(VER ? url + '?v=' + VER : url);
        if (!res.ok) throw new Error(res.status + ' ' + url);
        return [id, { status: 'ok', data: d3.csvParse(await res.text(), typed) }];
      } catch (e) {
        console.error(e);
        return [id, { status: 'error', data: [] }];
      }
    }));
    entries.forEach(([id, v]) => { state[id] = v; });
    // Derived tables, in dependency order.
    let left = calcs.slice();
    while (left.length) {
      const next = left.filter((c) => !c.spec.inputs.some((i) => left.some((o) => o.name === i)));
      if (!next.length) break;
      for (const { name, spec } of next) {
        const ins = spec.inputs.map((i) => state[i] || loading);
        if (ins.some((s) => s.status !== 'ok')) { state[name] = { status: 'error', data: [] }; continue; }
        try { state[name] = { status: 'ok', data: spec.fn(...ins.map((s) => s.data)) }; }
        catch (e) { console.error(name, e); state[name] = { status: 'error', data: [] }; }
      }
      left = left.filter((c) => !next.includes(c));
    }
    listeners.forEach((cb) => cb());
    runAll();
  };

  let lastW = 0, timer = 0;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(timer);
    timer = setTimeout(runAll, 150);
  });

  const start = () => { lastW = window.innerWidth; runAll(); load(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
