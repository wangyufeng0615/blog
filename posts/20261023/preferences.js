(() => {
 const system = matchMedia('(prefers-color-scheme: dark)');
 let preference = 'system';
 try { const stored=localStorage.getItem('stellar-theme'); if(['system','light','dark'].includes(stored))preference=stored; } catch {}
 function apply(){const dark=preference==='dark'||preference==='system'&&system.matches;document.documentElement.classList.toggle('light',!dark);document.documentElement.style.colorScheme=dark?'dark':'light';document.documentElement.dataset.theme=preference;}
 window.stellarTheme={get preference(){return preference},set(value){if(!['system','light','dark'].includes(value))return;preference=value;try{localStorage.setItem('stellar-theme',value)}catch{}apply()}};
 system.addEventListener('change',()=>{if(preference==='system')apply()});apply();
})();
