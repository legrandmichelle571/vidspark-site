/* ==========================================================================
   VidSpark AI — Tool Page Shell (mount helper)
   Pairs with css/tool-page.css. Generic, content-agnostic: it only builds
   the topbar + 2-column skeleton and renders sidebar cards from a plain
   config array. Pages keep full ownership of #tpMain — they render their
   own tabs/form/results into it exactly as before, no business logic here.

   Usage (see tiktok-seo.html for a full example):
     ToolPage.mount({
       icon: '🎵', title: 'SEO TikTok', subtitle: 'Suite complète…',
       meta: [ { icon:'🤖', text:'Propulsé par IA' }, { icon:'⚡', text:'5 outils' } ],
       sidebar: [
         { id:'tips', icon:'💡', title:'Conseils', html:'<p>…</p>' },
         { id:'preview', icon:'📄', title:'Dernier résultat', html:'<div class="tp-empty-hint">Rien pour l’instant.</div>' },
         { id:'shortcuts', icon:'🔗', title:'Raccourcis', html:'<ul><li><a href="/dashboard.html">Tableau de bord</a></li></ul>' }
       ]
     });
     // → returns { main: <#tpMain element>, updateCard(id, html) }

   The topbar's right side carries the `.tb-right` class — js/i18n.js (the
   shared 14-language switcher used across the site) auto-detects that
   class and inserts its selector there. Include <script src="/js/i18n.js">
   on any page using this shell to get the language button for free.
   ========================================================================== */
(function(){
  function cardHTML(c){
    return '<div class="tp-card" id="tpCard_'+c.id+'">'
      + '<div class="tp-card-h"><span class="ic">'+(c.icon||'✦')+'</span><span class="tt">'+(c.title||'')+'</span></div>'
      + '<div class="tp-card-b" id="tpCardBody_'+c.id+'">'+(c.html||'')+'</div>'
      + '</div>';
  }
  function metaHTML(items){
    if(!items || !items.length) return '';
    return '<div class="tp-meta">' + items.map(function(m){
      return '<span class="tp-meta-item">'+(m.icon?m.icon+' ':'')+(m.text||'')+'</span>';
    }).join('') + '</div>';
  }

  function mount(opts){
    opts = opts || {};
    var top = document.createElement('div');
    top.className = 'tp-topbar';
    top.innerHTML =
        '<a class="tp-brand" href="/index.html">'
      +   '<span class="lg">✦</span>'
      +   '<span class="tx"><span class="nm">VidSpark AI</span><span class="pg">'+(opts.title||'')+'</span></span>'
      + '</a>'
      + '<div class="tb-right">'
      +   '<a class="tp-back" href="/dashboard.html" aria-label="Tableau de bord">🏠 <span>Tableau de bord</span></a>'
      + '</div>';

    var page = document.createElement('div');
    page.className = 'tp-page';
    page.innerHTML =
        '<div class="tp-head">'
      +   '<h1>'+(opts.icon?opts.icon+' ':'')+(opts.title||'')+'</h1>'
      +   (opts.subtitle ? '<div class="sub">'+opts.subtitle+'</div>' : '')
      +   metaHTML(opts.meta)
      + '</div>'
      + '<div class="tp-grid">'
      +   '<div class="tp-main" id="tpMain"></div>'
      +   '<aside class="tp-side" id="tpSide">'+(opts.sidebar||[]).map(cardHTML).join('')+'</aside>'
      + '</div>';

    document.body.prepend(page);
    document.body.prepend(top);

    if(window.applyI18n) try{ window.applyI18n(); }catch(e){}

    return {
      main: document.getElementById('tpMain'),
      side: document.getElementById('tpSide'),
      updateCard: function(id, html){
        var el = document.getElementById('tpCardBody_'+id);
        if(el) el.innerHTML = html;
      }
    };
  }

  window.ToolPage = { mount: mount };
})();
