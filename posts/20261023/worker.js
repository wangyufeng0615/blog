let manifest, boot;
const cache = {}, loading = {}, metaCache = {}, hayCache = {}, lookupCache = {}, sourceFileCache = {};
let latest = 0;

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw Error('数据请求失败');
  return r.json();
}

async function fetchGzJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw Error('数据请求失败');
  return JSON.parse(await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).text());
}

async function load(kind) {
  if (cache[kind]) return cache[kind];
  if (loading[kind]) return loading[kind];
  return (loading[kind] = (async () => {
    manifest ||= await fetchJson('manifest.json');
    const files = manifest[kind].files;
    const chunks = new Array(files.length);
    const concurrency = Math.min(12, files.length);
    let next = 0, done = 0, lastPost = 0;
    async function workerLoop() {
      while (next < files.length) {
        const idx = next++;
        chunks[idx] = await fetchGzJson(files[idx]);
        done++;
        const now = performance.now();
        if (done === files.length || now - lastPost > 80) {
          lastPost = now;
          postMessage({ type: 'progress', kind, value: done / files.length });
        }
      }
    }
    await Promise.all(Array.from({ length: concurrency }, workerLoop));
    let total = 0;
    for (let c = 0; c < chunks.length; c++) total += chunks[c].length;
    const rows = new Array(total);
    const hay = new Array(total);
    const cats = {};
    const sourcesAll = {};
    const sourcesByCat = {};
    let pos = 0;
    for (let c = 0; c < chunks.length; c++) {
      const ch = chunks[c];
      for (let j = 0; j < ch.length; j++) {
        const r = ch[j];
        rows[pos] = r;
        hay[pos] = `${r.key || ''}\0${r.zh || ''}\0${r.en || ''}\0${r.source || ''}`.toLowerCase();
        cats[r.category] = (cats[r.category] || 0) + 1;
        sourcesAll[r.source] = (sourcesAll[r.source] || 0) + 1;
        const sc = (sourcesByCat[r.category] ??= {});
        sc[r.source] = (sc[r.source] || 0) + 1;
        pos++;
      }
    }
    cache[kind] = rows;
    hayCache[kind] = hay;
    metaCache[kind] = { cats, sourcesAll, sourcesByCat };
    return rows;
  })());
}

async function fastEntry(entry) {
  const colon = entry.indexOf(':');
  if (colon < 0) return null;
  const key = entry.slice(colon + 1);
  const prefix = key.slice(0, 2).toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (!prefix) return null;
  lookupCache[prefix] ??= fetchJson(`lookup/${prefix}.json`).catch(() => null);
  const lk = await lookupCache[prefix];
  const target = lk?.[entry];
  if (!target?.json) return null;
  sourceFileCache[target.json] ??= fetchJson(target.json).catch(() => null);
  const data = await sourceFileCache[target.json];
  if (!data?.entries) return null;
  return data.entries.find((r) => `${r.namespace}:${r.key}` === entry) || null;
}

async function fastSource(source) {
  const files = boot?.sourceFiles?.[source];
  if (!files?.length) return null;
  const loaded = await Promise.all(files.map((f) => (sourceFileCache[f] ??= fetchJson(f))));
  const rows = [];
  for (const data of loaded) {
    if (data?.entries) for (const r of data.entries) rows.push(r);
  }
  return rows;
}

onmessage = async ({ data: s }) => {
  if (s.type === 'init') {
    manifest = s.manifest;
    boot = s.boot;
    return;
  }
  latest = s.seq;
  try {
    const q = (s.q || '').trim().toLowerCase();
    const bk = boot?.kinds?.[s.kind];

    // Fast path 1: default page 1 served directly from boot.json (0 shard downloads)
    if (!cache[s.kind] && bk?.items && !q && !s.category && !s.source && !s.entry && !s.onlyLong && !s.bookmarks && s.page === 1) {
      postMessage({
        type: 'results', seq: s.seq, total: bk.count, count: bk.count,
        cats: bk.cats, sources: bk.sources || {}, items: bk.items, page: 1,
      });
      return;
    }

    // Fast path 2: permalink lookup (?kind=texts&entry=namespace:key) via lookup/ + single texts/ file
    if (!cache.texts && s.kind === 'texts' && s.entry && bk) {
      const hit = await fastEntry(s.entry);
      if (s.seq !== latest) return;
      if (hit) {
        postMessage({
          type: 'results', seq: s.seq, total: 1, count: bk.count,
          cats: bk.cats, sources: bk.sources || {}, items: [hit], page: 1,
        });
        return;
      }
    }

    // Fast path 3: source filter (?kind=texts&source=X) via single texts/<slug>.json
    if (!cache.texts && s.kind === 'texts' && s.source && !s.entry && bk && boot?.sourceFiles?.[s.source]) {
      const rows = await fastSource(s.source);
      if (s.seq !== latest) return;
      if (rows) {
        const bmSet = s.bookmarks ? new Set(s.bookmarks) : null;
        const hits = [];
        for (let i = 0; i < rows.length; i++) {
          const r = rows[i];
          if (s.category && r.category !== s.category) continue;
          if (s.onlyLong && (r.zh || '').length < 80) continue;
          if (bmSet && !bmSet.has(r.id)) continue;
          if (q && !`${r.key || ''}\0${r.zh || ''}\0${r.en || ''}\0${r.source || ''}`.toLowerCase().includes(q)) continue;
          hits.push(r);
        }
        const start = (s.page - 1) * 40;
        const sources = s.category ? (bk.sourcesByCat?.[s.category] || {}) : (bk.sources || {});
        postMessage({
          type: 'results', seq: s.seq, total: hits.length, count: bk.count,
          cats: bk.cats, sources, items: hits.slice(start, start + 40), page: s.page,
        });
        return;
      }
    }

    // Full corpus path: 12-way concurrent loader + pre-lowercased haystack + cached counts
    const rows = await load(s.kind);
    if (s.seq !== latest) return;
    const hay = hayCache[s.kind];
    const meta = metaCache[s.kind];
    const bmSet = s.bookmarks ? new Set(s.bookmarks) : null;
    const needFilter = !!(s.entry || s.category || s.source || s.onlyLong || bmSet || q);
    if (!needFilter) {
      const start = (s.page - 1) * 40;
      const end = Math.min(rows.length, start + 40);
      const items = [];
      for (let i = start; i < end; i++) items.push({ ...rows[i], id: `${s.kind}:${i}` });
      postMessage({
        type: 'results', seq: s.seq, total: rows.length, count: rows.length,
        cats: meta.cats, sources: meta.sourcesAll, items, page: s.page,
      });
      return;
    }

    const hits = [];
    const kindPrefix = `${s.kind}:`;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (s.entry && `${r.namespace}:${r.key}` !== s.entry) continue;
      if (s.category && r.category !== s.category) continue;
      if (s.source && r.source !== s.source) continue;
      if (s.onlyLong && (r.zh || '').length < 80) continue;
      if (bmSet && !bmSet.has(kindPrefix + i)) continue;
      if (q && !hay[i].includes(q)) continue;
      hits.push(i);
    }
    const start = (s.page - 1) * 40;
    const sources = s.category ? (meta.sourcesByCat[s.category] || {}) : meta.sourcesAll;
    postMessage({
      type: 'results', seq: s.seq, total: hits.length, count: rows.length,
      cats: meta.cats, sources,
      items: hits.slice(start, start + 40).map((i) => ({ ...rows[i], id: kindPrefix + i })),
      page: s.page,
    });
  } catch (e) {
    postMessage({ type: 'error', seq: s.seq, message: e.message });
  }
};
