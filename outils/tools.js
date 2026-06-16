/* Outils gratuits VidSpark — helpers partagés */
const API = 'https://vidspark-ai-production-9ac7.up.railway.app';

/* ════════════ i18n — 14 langues (comme l'extension) ════════════ */
const LANGS = [
  {c:'fr',n:'Français'},{c:'en',n:'English'},{c:'es',n:'Español'},{c:'ar',n:'العربية',rtl:1},
  {c:'pt',n:'Português'},{c:'de',n:'Deutsch'},{c:'it',n:'Italiano'},{c:'ru',n:'Русский'},
  {c:'ja',n:'日本語'},{c:'ko',n:'한국어'},{c:'hi',n:'हिन्दी'},{c:'zh',n:'中文'},
  {c:'tr',n:'Türkçe'},{c:'nl',n:'Nederlands'}
];
const RTL = new Set(['ar']);

/* Dictionnaire commun (nav, footer, boutons) — appliqué à TOUTES les pages */
const I18N = {
  nav_tools:{fr:'🛠️ Tous les outils',en:'🛠️ All tools',es:'🛠️ Todas las herramientas',ar:'🛠️ كل الأدوات',pt:'🛠️ Todas as ferramentas',de:'🛠️ Alle Tools',it:'🛠️ Tutti gli strumenti',ru:'🛠️ Все инструменты',ja:'🛠️ すべてのツール',ko:'🛠️ 모든 도구',hi:'🛠️ सभी टूल',zh:'🛠️ 所有工具',tr:'🛠️ Tüm araçlar',nl:'🛠️ Alle tools'},
  nav_pro:{fr:'⭐ Passer Pro',en:'⭐ Go Pro',es:'⭐ Hazte Pro',ar:'⭐ الترقية إلى Pro',pt:'⭐ Seja Pro',de:'⭐ Pro werden',it:'⭐ Passa a Pro',ru:'⭐ Перейти на Pro',ja:'⭐ Proにアップ',ko:'⭐ Pro 업그레이드',hi:'⭐ Pro लें',zh:'⭐ 升级 Pro',tr:'⭐ Pro\'ya geç',nl:'⭐ Word Pro'},
  f_home:{fr:'Accueil',en:'Home',es:'Inicio',ar:'الرئيسية',pt:'Início',de:'Startseite',it:'Home',ru:'Главная',ja:'ホーム',ko:'홈',hi:'होम',zh:'首页',tr:'Ana sayfa',nl:'Home'},
  f_tools:{fr:'Outils gratuits',en:'Free tools',es:'Herramientas gratis',ar:'أدوات مجانية',pt:'Ferramentas grátis',de:'Kostenlose Tools',it:'Strumenti gratis',ru:'Бесплатные инструменты',ja:'無料ツール',ko:'무료 도구',hi:'मुफ़्त टूल',zh:'免费工具',tr:'Ücretsiz araçlar',nl:'Gratis tools'},
  f_pricing:{fr:'Tarifs',en:'Pricing',es:'Precios',ar:'الأسعار',pt:'Preços',de:'Preise',it:'Prezzi',ru:'Цены',ja:'料金',ko:'요금',hi:'मूल्य',zh:'价格',tr:'Fiyatlar',nl:'Prijzen'},
  f_privacy:{fr:'Confidentialité',en:'Privacy',es:'Privacidad',ar:'الخصوصية',pt:'Privacidade',de:'Datenschutz',it:'Privacy',ru:'Конфиденциальность',ja:'プライバシー',ko:'개인정보',hi:'गोपनीयता',zh:'隐私',tr:'Gizlilik',nl:'Privacy'},
  wait:{fr:'Veuillez patienter…',en:'Please wait…',es:'Espera…',ar:'يرجى الانتظار…',pt:'Aguarde…',de:'Bitte warten…',it:'Attendi…',ru:'Подождите…',ja:'お待ちください…',ko:'잠시만요…',hi:'कृपया रुकें…',zh:'请稍候…',tr:'Lütfen bekleyin…',nl:'Even geduld…'},
  pro_badge:{fr:'⭐ RÉSERVÉ AUX ABONNÉS PRO & BUSINESS',en:'⭐ PRO & BUSINESS SUBSCRIBERS ONLY',es:'⭐ SOLO SUSCRIPTORES PRO Y BUSINESS',ar:'⭐ لمشتركي PRO و BUSINESS فقط',pt:'⭐ APENAS ASSINANTES PRO E BUSINESS',de:'⭐ NUR FÜR PRO- & BUSINESS-ABOS',it:'⭐ SOLO ABBONATI PRO E BUSINESS',ru:'⭐ ТОЛЬКО ДЛЯ PRO И BUSINESS',ja:'⭐ PRO・BUSINESS会員限定',ko:'⭐ PRO & BUSINESS 전용',hi:'⭐ केवल PRO और BUSINESS के लिए',zh:'⭐ 仅限 PRO 和 BUSINESS 会员',tr:'⭐ SADECE PRO VE BUSINESS ABONELERİ',nl:'⭐ ALLEEN PRO- EN BUSINESS-ABONNEES'},
  faq_title:{fr:'Questions fréquentes',en:'FAQ',es:'Preguntas frecuentes',ar:'أسئلة شائعة',pt:'Perguntas frequentes',de:'Häufige Fragen',it:'Domande frequenti',ru:'Частые вопросы',ja:'よくある質問',ko:'자주 묻는 질문',hi:'सामान्य प्रश्न',zh:'常见问题',tr:'Sıkça sorulan sorular',nl:'Veelgestelde vragen'},
  discover_btn:{fr:'Découvrir VidSpark AI — dès 9,99€/mois',en:'Discover VidSpark AI — from €9.99/mo',es:'Descubre VidSpark AI — desde 9,99€/mes',ar:'اكتشف VidSpark AI — من 9.99€ شهريًا',pt:'Descubra o VidSpark AI — a partir de 9,99€/mês',de:'VidSpark AI entdecken — ab 9,99€/Monat',it:'Scopri VidSpark AI — da 9,99€/mese',ru:'Откройте VidSpark AI — от 9,99€/мес',ja:'VidSpark AIを見る — 月9.99€〜',ko:'VidSpark AI 알아보기 — 월 9.99€부터',hi:'VidSpark AI जानें — €9.99/माह से',zh:'了解 VidSpark AI — 每月 €9.99 起',tr:'VidSpark AI’yi keşfet — 9,99€/ay’dan',nl:'Ontdek VidSpark AI — vanaf €9,99/mnd'}
};

/* Les pages ajoutent leurs propres clés via registerI18n({key:{fr,en,...}}) */
function registerI18n(dict){ for(const k in dict) I18N[k]=Object.assign(I18N[k]||{},dict[k]); }

function getLang(){
  let l = localStorage.getItem('vs_site_lang');
  if(!l){ l=(navigator.language||'fr').slice(0,2); if(!LANGS.some(x=>x.c===l)) l='en'; }
  return l;
}
/* Repli : langue choisie → anglais → français */
function t(key){ const e=I18N[key]; if(!e) return key; const l=getLang(); return e[l]||e.en||e.fr||key; }

function setLang(code){
  localStorage.setItem('vs_site_lang', code);
  document.documentElement.lang = code;
  document.documentElement.dir = RTL.has(code) ? 'rtl' : 'ltr';
  applyI18n();
}
/* Applique les traductions à tout élément [data-i18n] / [data-i18n-ph] (placeholder) */
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.innerHTML = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ el.placeholder = t(el.getAttribute('data-i18n-ph')); });
}

/* Nav + footer communs injectés sur chaque page outil */
document.addEventListener('DOMContentLoaded', () => {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.has(lang) ? 'rtl' : 'ltr';

  const nav = document.createElement('div');
  nav.className = 'nav';
  nav.innerHTML = `
    <a href="/index.html" class="logo"><span class="lb">✦</span> VidSpark AI</a>
    <div class="nav-right">
      <select id="vsLang" style="background:#1b2330;color:#e8e8f0;border:1px solid #2b3647;border-radius:8px;padding:6px 8px;font-size:13px;cursor:pointer;">
        ${LANGS.map(l=>`<option value="${l.c}"${l.c===lang?' selected':''}>${l.n}</option>`).join('')}
      </select>
      <a href="/outils.html" data-i18n="nav_tools"></a>
      <a href="/pricing.html" class="cta" data-i18n="nav_pro"></a>
    </div>`;
  document.body.prepend(nav);

  const foot = document.createElement('footer');
  foot.innerHTML = `© 2026 VidSpark AI ·
    <a href="/index.html" data-i18n="f_home"></a> ·
    <a href="/outils.html" data-i18n="f_tools"></a> ·
    <a href="/pricing.html" data-i18n="f_pricing"></a> ·
    <a href="/privacy.html" data-i18n="f_privacy"></a>`;
  document.body.appendChild(foot);

  document.getElementById('vsLang').addEventListener('change', e => setLang(e.target.value));
  applyI18n();
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

/* Lance une action async en désactivant le bouton + retour visuel "Veuillez patienter…" (anti double-clic) */
async function run(btn, fn){
  if(btn.dataset.busy) return;
  const orig = btn.innerHTML;
  btn.dataset.busy = '1';
  btn.disabled = true;
  btn.style.opacity = '.65';
  btn.style.cursor = 'wait';
  btn.innerHTML = '<span class="spin"></span> ' + (typeof t==='function' ? t('wait') : 'Veuillez patienter…');
  try { await fn(); }
  finally {
    btn.disabled = false;
    btn.style.opacity = '';
    btn.style.cursor = '';
    btn.innerHTML = orig;
    delete btn.dataset.busy;
  }
}

/* Outils IA : réservés aux abonnés Pro/Business connectés */
async function aiCall(path, body){
  let token = null;
  try { const s = await Auth.getSession(); token = s?.access_token || null; } catch(e) {}
  if (!token) throw new Error('LOGIN_REQUIRED');
  // Injecte la langue de l'interface par défaut → l'IA répond dans cette langue
  const payload = Object.assign({ language: getLang() }, body || {});
  const r = await fetch(API + path, {
    method: 'POST',
    headers: {'Content-Type':'application/json','Authorization':'Bearer '+token},
    body: JSON.stringify(payload)
  });
  const d = await r.json().catch(()=>({}));
  if (r.status === 401) throw new Error('LOGIN_REQUIRED');
  if (r.status === 403) throw new Error('UPGRADE_REQUIRED');
  if (!r.ok) throw new Error(d.error || 'Erreur serveur');
  return d;
}

/* Message verrouillé (non connecté / pas Pro) */
function lockedHTML(kind){
  if(kind==='LOGIN_REQUIRED') return `
    <div style="background:var(--s2);border:1px solid var(--purple);border-radius:12px;padding:18px;text-align:center;margin-top:14px;">
      <div style="font-size:15px;font-weight:700;margin-bottom:6px;">🔒 Connecte-toi pour utiliser cet outil IA</div>
      <div class="muted" style="margin-bottom:12px;">Les outils IA sont réservés aux abonnés Pro et Business.</div>
      <a href="/login.html" class="btn" style="display:inline-block;">Se connecter</a>
      <a href="/pricing.html" class="btn ghost" style="display:inline-block;margin-left:8px;">Voir les tarifs</a>
    </div>`;
  return `
    <div style="background:var(--s2);border:1px solid var(--amber);border-radius:12px;padding:18px;text-align:center;margin-top:14px;">
      <div style="font-size:15px;font-weight:700;margin-bottom:6px;">⭐ Outil réservé aux abonnés Pro & Business</div>
      <div class="muted" style="margin-bottom:12px;">Passe à Pro pour débloquer les générateurs IA + les 25 outils de l'extension.</div>
      <a href="/pricing.html" class="btn" style="display:inline-block;">Passer Pro — dès 9,99€/mois</a>
    </div>`;
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
