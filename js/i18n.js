/* ════════════ VidSpark — moteur i18n partagé (pages principales) ════════════
   14 langues comme l'extension. Sélecteur flottant injecté automatiquement.
   Partage le choix avec les pages /outils/ via localStorage['vs_site_lang']. */
(function(){
  const LANGS = [
    {c:'fr',n:'Français'},{c:'en',n:'English'},{c:'es',n:'Español'},{c:'ar',n:'العربية'},
    {c:'pt',n:'Português'},{c:'de',n:'Deutsch'},{c:'it',n:'Italiano'},{c:'ru',n:'Русский'},
    {c:'ja',n:'日本語'},{c:'ko',n:'한국어'},{c:'hi',n:'हिन्दी'},{c:'zh',n:'中文'},
    {c:'tr',n:'Türkçe'},{c:'nl',n:'Nederlands'}
  ];
  const RTL = new Set(['ar']);
  const I18N = {};

  window.registerI18n = function(dict){ for(const k in dict) I18N[k]=Object.assign(I18N[k]||{},dict[k]); };
  window.vsGetLang = function(){
    let l = localStorage.getItem('vs_site_lang');
    if(!l){ l=(navigator.language||'fr').slice(0,2); if(!LANGS.some(x=>x.c===l)) l='en'; }
    return l;
  };
  window.t = function(key){ const e=I18N[key]; if(!e) return key; const l=vsGetLang(); return e[l]||e.en||e.fr||key; };
  window.applyI18n = function(){
    document.querySelectorAll('[data-i18n]').forEach(el=>{ el.innerHTML = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ el.placeholder = t(el.getAttribute('data-i18n-ph')); });
  };
  const inIframe = (function(){ try { return window.self !== window.top; } catch(e){ return true; } })();

  window.vsSetLang = function(code, fromMsg){
    localStorage.setItem('vs_site_lang', code);
    document.documentElement.lang = code;
    document.documentElement.dir = RTL.has(code) ? 'rtl' : 'ltr';
    applyI18n();
    // Synchroniser les iframes enfants et la fenêtre parente (même origine)
    if(!fromMsg){
      try { document.querySelectorAll('iframe').forEach(f=>f.contentWindow && f.contentWindow.postMessage({vsLang:code},'*')); } catch(e){}
      try { if(inIframe && window.parent) window.parent.postMessage({vsLang:code},'*'); } catch(e){}
    }
  };
  window.addEventListener('message', e => {
    if(e.data && e.data.vsLang && e.data.vsLang !== vsGetLang()) vsSetLang(e.data.vsLang, true);
  });

  document.addEventListener('DOMContentLoaded', () => {
    const lang = vsGetLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.has(lang) ? 'rtl' : 'ltr';

    // Pas de sélecteur dans une iframe (la page parente en fournit un)
    if(inIframe){ applyI18n(); return; }

    // Sélecteur flottant (haut-droite) — ne touche pas le markup des pages
    if(!document.getElementById('vsLangFloat')){
      const wrap = document.createElement('div');
      wrap.id = 'vsLangFloat';
      wrap.style.cssText = 'position:fixed;top:10px;right:12px;z-index:9999;';
      wrap.innerHTML = `<select aria-label="Language" style="background:#141418;color:#e8e8f0;border:1px solid #2b3647;border-radius:8px;padding:6px 8px;font-size:13px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.3);">
        ${LANGS.map(l=>`<option value="${l.c}"${l.c===lang?' selected':''}>${l.n}</option>`).join('')}
      </select>`;
      document.body.appendChild(wrap);
      wrap.querySelector('select').addEventListener('change', e => vsSetLang(e.target.value));
    }
    applyI18n();
  });
})();
