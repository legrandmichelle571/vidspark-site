/* ==========================================================================
   VidSpark AI — Dashboard quick-return link
   Injects a floating "Tableau de bord" button on public/marketing pages,
   shown ONLY when the visitor has an active session — a fast way back to
   the app without hunting for it in the page's own navigation (several
   public pages don't have one). Safe no-op if Auth isn't loaded or the
   visitor isn't logged in.
   ========================================================================== */
(function(){
  if(window.registerI18n){
    registerI18n({
      vs_back_dashboard:{fr:'📊 Tableau de bord',en:'📊 Dashboard',es:'📊 Panel',ar:'📊 لوحة التحكم',pt:'📊 Painel',de:'📊 Dashboard',it:'📊 Dashboard',ru:'📊 Панель',ja:'📊 ダッシュボード',ko:'📊 대시보드',hi:'📊 डैशबोर्ड',zh:'📊 仪表盘',tr:'📊 Panel',nl:'📊 Dashboard'}
    });
  }

  function inject(){
    if(document.getElementById('vsDashLink')) return;
    var label = (window.t ? t('vs_back_dashboard') : '📊 Tableau de bord');
    var a = document.createElement('a');
    a.id = 'vsDashLink';
    a.href = '/dashboard.html';
    a.textContent = label;
    a.setAttribute('data-i18n', 'vs_back_dashboard');
    a.style.cssText = [
      'position:fixed', 'bottom:20px', 'right:20px', 'z-index:9999',
      'display:inline-flex', 'align-items:center', 'gap:6px',
      'background:linear-gradient(135deg,#F2900F,#E8830A)', 'color:#2b1500',
      'font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'font-weight:700', 'font-size:13px', 'padding:10px 16px', 'border-radius:12px',
      'text-decoration:none', 'box-shadow:0 8px 22px -8px rgba(255,157,31,.45)',
      'transition:transform .2s ease, box-shadow .2s ease'
    ].join(';');
    a.addEventListener('mouseenter', function(){ a.style.transform='translateY(-1px)'; a.style.boxShadow='0 12px 28px -8px rgba(255,157,31,.5)'; });
    a.addEventListener('mouseleave', function(){ a.style.transform='none'; a.style.boxShadow='0 8px 22px -8px rgba(255,157,31,.45)'; });
    document.body.appendChild(a);
  }

  function check(){
    if(!window.Auth || !window.Auth.waitForSession) return;
    // waitForSession (pas getSession) : laisse à Supabase le temps de relire
    // une session déjà persistée avant de conclure "non connecté" — sans ça,
    // ce bouton pouvait rester invisible pour un utilisateur pourtant connecté.
    Auth.waitForSession().then(function(session){
      if(session) inject();
    }).catch(function(){});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', check);
  else check();
})();
