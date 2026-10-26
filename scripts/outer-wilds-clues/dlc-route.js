// Texture generation is shared with the base-game map. The graph itself is static, with no hidden card faces.
(()=>{
 if(window.self!==window.top)document.documentElement.classList.add('embedded');
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


 const cloth=clothTile().url,cotton=cottonTile();
 document.querySelectorAll('[data-texture="cloth"]').forEach(e=>e.setAttribute('href',cloth));
 document.querySelectorAll('[data-texture="cotton"]').forEach(e=>e.setAttribute('href',cotton));
 function reveal(){const id=decodeURIComponent(location.hash.slice(1)).replace(/^n-/,''),mobile=matchMedia('(max-width:1100px)').matches;const el=document.getElementById('n-'+id+(mobile?'-mobile':''))||document.getElementById(id+(mobile?'-mobile':''));if(el)el.scrollIntoView({block:'start'})}
 addEventListener('hashchange',reveal);if(location.hash)requestAnimationFrame(reveal);
 if(window.self!==window.top){let frame=0;const post=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>parent.postMessage({type:'ow-frame-height',height:Math.ceil(document.body.getBoundingClientRect().height)},'*'))};new ResizeObserver(post).observe(document.body);addEventListener('load',post);document.fonts?.ready.then(post)}
})();
