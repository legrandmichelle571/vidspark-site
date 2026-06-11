/* Outils gratuits VidSpark — helpers partagés */
const API = 'https://vidspark-ai-production-9ac7.up.railway.app';

/* Nav + footer communs injectés sur chaque page outil */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.createElement('div');
  nav.className = 'nav';
  nav.innerHTML = `
    <a href="/index.html" class="logo"><span class="lb">✦</span> VidSpark AI</a>
    <div class="nav-right">
      <a href="/outils.html">🛠️ Tous les outils</a>
      <a href="/pricing.html" class="cta">⭐ Passer Pro</a>
    </div>`;
  document.body.prepend(nav);

  const foot = document.createElement('footer');
  foot.innerHTML = `© 2026 VidSpark AI ·
    <a href="/index.html">Accueil</a> ·
    <a href="/outils.html">Outils gratuits</a> ·
    <a href="/pricing.html">Tarifs</a> ·
    <a href="/privacy.html">Confidentialité</a>`;
  document.body.appendChild(foot);
});

function vidId(u){
  const m = (u||'').match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test((u||'').trim())) return u.trim();
  return null;
}
function esc(s){const d=document.createElement('div');d.textContent=s==null?'':s;return d.innerHTML;}
function spinner(msg){return `<div class="muted"><span class="spin"></span>${msg||'Génération en cours…'}</div>`;}
function copyTxt(txt,btn){navigator.clipboard.writeText(txt);const o=btn.textContent;btn.textContent='✅';setTimeout(()=>btn.textContent=o,1400);}

async function aiCall(path, body){
  const r = await fetch(API + path, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  const d = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(d.error || 'Erreur serveur');
  return d;
}

/* Score CTR local (analyseur de titre) */
function titleScore(t){
  const lower=t.toLowerCase(), len=t.length, words=t.split(/\s+/).filter(Boolean).length;
  const power=['incroyable','secret','gratuit','meilleur','facile','rapide','jamais','choquant','astuce','best','free','easy','amazing','top','viral','سر','مجان','أفضل'];
  const okLen=len>=40&&len<=70, okNum=/\d/.test(t), okEmo=power.some(w=>lower.includes(w));
  const okHook=/^(comment|pourquoi|how|why|top|كيف|لماذا)/i.test(t)||/\d/.test(t.slice(0,4))||/[?؟]/.test(t);
  const okPunct=/[?!؟]/.test(t);
  const cLen=okLen?25:(len>=25&&len<=85?16:8), cWords=words>=4?12:6;
  const score=Math.min(100,cLen+cWords+8+(okNum?15:0)+(okEmo?15:0)+(okHook?15:0)+(okPunct?10:0));
  return {score, okLen, okNum, okEmo, okHook, okPunct, len};
}
