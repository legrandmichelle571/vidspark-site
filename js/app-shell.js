/* ==========================================================================
   VidSpark AI — App Shell (shared responsive navigation)
   Provides:
   - VidSparkShell.initBehavior(): sidebar collapse/drawer, groups, notif &
     avatar popovers. Safe to call on any page — it only wires elements that
     actually exist in the DOM.
   - VidSparkShell.mount(opts): builds + injects the sidebar/topbar chrome
     for pages that don't already have it (account/billing/channels).
   - VidSparkShell.loadUserInfo(): populates the topbar user card (name,
     email, avatar, plan) from Supabase auth, for pages using mount().
   Breakpoint: <=1024px = off-canvas drawer (tablet + mobile), never a
   permanently visible sidebar. >1024px = desktop, collapsible sidebar.
   ========================================================================== */
(function(){
  var API_BASE = 'https://vidspark-ai-production-9ac7.up.railway.app';
  var MOBILE_MAX = 1024;

  /* Canonical shell translations — registered here so the shared nav never
     depends on each page's own (sometimes inconsistently-named) i18n block. */
  if(window.registerI18n){
    registerI18n({
      sb_home:{fr:'Tableau de bord',en:'Dashboard',ar:'لوحة التحكم'},
      sb_studio:{fr:'Studio',en:'Studio',ar:'الاستوديو'},
      sb_channels:{fr:'Mes chaînes',en:'My channels',ar:'قنواتي'},
      sb_sub:{fr:'Abonnement',en:'Subscription',ar:'الاشتراك'},
      sb_account:{fr:'Compte',en:'Account',ar:'الحساب'},
      sb_plans:{fr:'Forfaits',en:'Plans',ar:'الباقات'},
      sb_logout:{fr:'Déconnexion',en:'Log out',ar:'تسجيل الخروج'},
      db_aipowered:{fr:'Propulsé par IA',en:'AI Powered',ar:'مدعوم بالذكاء الاصطناعي'},
      db_settings:{fr:'Paramètres',en:'Settings',ar:'الإعدادات'},
      db_account:{fr:'Compte',en:'Account',ar:'الحساب'},
      db_billing:{fr:'Abonnement',en:'Subscription',ar:'الاشتراك'},
      db_logout:{fr:'Déconnexion',en:'Log out',ar:'تسجيل الخروج'},
      nt_title:{fr:'Notifications',en:'Notifications',ar:'الإشعارات'},
      nt_empty:{fr:'Aucune notification.',en:'No notifications.',ar:'لا إشعارات.'}
    });
  }

  function isMobileSide(){ return window.innerWidth <= MOBILE_MAX; }

  function toggleSidebar(){
    if(isMobileSide()){
      var s=document.getElementById('appSide'), o=document.getElementById('sideOverlay');
      if(!s) return;
      var open=s.classList.toggle('drawer-open'); if(o) o.classList.toggle('show', open);
    } else {
      document.body.classList.toggle('side-collapsed');
      try{ localStorage.setItem('vs_side_collapsed', document.body.classList.contains('side-collapsed')?'1':'0'); }catch(e){}
    }
  }
  function closeDrawer(){
    var s=document.getElementById('appSide'), o=document.getElementById('sideOverlay');
    if(s) s.classList.remove('drawer-open'); if(o) o.classList.remove('show');
  }
  function toggleGroup(h){
    var g=h.closest('.sb-group'); if(!g) return;
    g.classList.toggle('collapsed');
    try{ var s=JSON.parse(localStorage.getItem('vs_side_groups')||'{}'); s[g.getAttribute('data-g')]=g.classList.contains('collapsed'); localStorage.setItem('vs_side_groups',JSON.stringify(s)); }catch(e){}
  }
  function sideSearch(q){
    q=(q||'').trim().toLowerCase(); var any=q.length>0;
    document.querySelectorAll('.sb-group').forEach(function(g){
      var vis=0;
      g.querySelectorAll('a.sb-link').forEach(function(a){
        var n=((a.getAttribute('data-name')||'')+' '+(a.textContent||'')).toLowerCase();
        var show=!any || n.indexOf(q)>-1; a.style.display=show?'':'none'; if(show) vis++;
      });
      g.style.display=vis?'':'none';
      if(any) g.classList.remove('collapsed');
    });
  }
  function toggleNotif(e){
    if(e){ e.stopPropagation(); }
    var p=document.getElementById('shellNotifPop'); if(!p) return;
    p.classList.toggle('open');
  }
  function closeNotif(){ var p=document.getElementById('shellNotifPop'); if(p) p.classList.remove('open'); }
  function toggleUserMenu(e){
    if(e){ e.stopPropagation(); }
    var m=document.getElementById('shellUserMenu'); if(!m) return;
    m.classList.toggle('active');
  }
  function closeUserMenu(){ var m=document.getElementById('shellUserMenu'); if(m) m.classList.remove('active'); }

  function initBehavior(){
    // restore collapsed state (desktop only)
    try{ if(!isMobileSide() && localStorage.getItem('vs_side_collapsed')==='1') document.body.classList.add('side-collapsed'); }catch(e){}
    // restore collapsed groups
    try{
      var gs=JSON.parse(localStorage.getItem('vs_side_groups')||'{}');
      document.querySelectorAll('.sb-group').forEach(function(g){ if(gs[g.getAttribute('data-g')]) g.classList.add('collapsed'); });
    }catch(e){}

    window.addEventListener('resize', function(){
      if(isMobileSide()){ document.body.classList.remove('side-collapsed'); }
      else { closeDrawer(); try{ if(localStorage.getItem('vs_side_collapsed')==='1') document.body.classList.add('side-collapsed'); }catch(e){} }
    });

    // close the drawer automatically once a nav link is chosen (tablet + mobile)
    document.addEventListener('click', function(e){
      if(e.target.closest && e.target.closest('.sb-nav a.sb-link, .sb-nav a.sb-link *') && isMobileSide()) closeDrawer();
    });

    // close popovers on outside click / Escape
    document.addEventListener('click', function(e){
      if(!e.target.closest || !e.target.closest('#shellNotifPop, #notifBtn, #shellNotifBtn')) closeNotif();
      if(!e.target.closest || !e.target.closest('#shellUserMenu, #shellAvatarButton, #avatarButton')) closeUserMenu();
    });
    document.addEventListener('keydown', function(e){
      if(e.key==='Escape'){ closeDrawer(); closeNotif(); closeUserMenu(); }
    });

    document.querySelectorAll('.sb-toggle, [data-shell-toggle]').forEach(function(b){ b.addEventListener('click', toggleSidebar); });
    document.querySelectorAll('.side-overlay').forEach(function(o){ o.addEventListener('click', closeDrawer); });
    document.querySelectorAll('.sb-group-h').forEach(function(h){ h.addEventListener('click', function(){ toggleGroup(h); }); });
    var search=document.getElementById('sideSearchInput'); if(search) search.addEventListener('input', function(){ sideSearch(search.value); });
    document.querySelectorAll('#shellNotifBtn, #notifBtn').forEach(function(b){ b.addEventListener('click', toggleNotif); });
    document.querySelectorAll('#shellAvatarButton, #avatarButton').forEach(function(b){ b.addEventListener('click', toggleUserMenu); });
  }

  /* ── Simplified shell markup for account / billing / channels ── */
  function shellHTML(active){
    function link(id, href, icon, i18nKey, label){
      var isActive = id===active ? ' active' : '';
      return '<a class="sb-link'+isActive+'" href="'+href+'"><span class="ic">'+icon+'</span><span class="lbl" data-i18n="'+i18nKey+'">'+label+'</span></a>';
    }
    return ''
    + '<aside class="app-side" id="appSide">'
    +   '<div class="sb-head">'
    +     '<div class="sb-brand-row">'
    +       '<a class="sb-brand" href="dashboard.html" style="cursor:pointer;">'
    +         '<span class="lg">✦</span>'
    +         '<span class="bt"><span class="nm">VidSpark AI</span><span class="sub" data-i18n="db_aipowered">AI Powered</span></span>'
    +       '</a>'
    +       '<button class="sb-toggle" title="Réduire le menu" aria-label="Menu"><span class="chev">⟨</span></button>'
    +     '</div>'
    +   '</div>'
    +   '<nav class="sb-nav">'
    +     '<div class="sb-group" data-g="main">'
    +       '<div class="sb-group-items" style="max-height:none;">'
    +          link('dashboard','dashboard.html','🏠','sb_home','Tableau de bord')
    +          link('studio','diamant.html','✦','sb_studio','Studio')
    +          link('channels','channels.html','📺','sb_channels','Mes chaînes')
    +          link('billing','billing.html','💳','sb_sub','Abonnement')
    +          link('account','account.html','⚙️','sb_account','Compte')
    +       '</div>'
    +     '</div>'
    +   '</nav>'
    +   '<div class="sb-user">'
    +     '<div class="su-main">'
    +       '<div class="su-av" id="shellAvatar">🙂<span class="on"></span></div>'
    +       '<div class="su-info"><div class="su-name" id="shellUserName">—</div><div class="su-mail" id="shellUserEmail">—</div></div>'
    +     '</div>'
    +     '<div class="su-actions">'
    +       '<button onclick="window.location.href=\'account.html\'">⚙ <span data-i18n="db_settings">Paramètres</span></button>'
    +       '<button class="su-logout" onclick="if(window.Auth)Auth.logout();else location.href=\'login.html\';">🚪 <span data-i18n="db_logout">Déconnexion</span></button>'
    +     '</div>'
    +   '</div>'
    + '</aside>'
    + '<div class="side-overlay" id="sideOverlay"></div>';
  }

  function topbarHTML(title, subtitle){
    return ''
    + '<header class="app-topbar">'
    +   '<div class="tb-left">'
    +     '<button class="shell-icon-btn" data-shell-toggle title="Menu" aria-label="Menu">☰</button>'
    +     '<a class="tb-logo" href="dashboard.html"><span class="lg">✦</span> VidSpark AI</a>'
    +     '<div><div style="font-weight:800;font-size:15px;">'+title+'</div>'
    +     (subtitle ? '<div style="font-size:11.5px;color:var(--shell-muted);">'+subtitle+'</div>' : '')+'</div>'
    +   '</div>'
    +   '<div class="tb-right">'
    +     '<button class="shell-icon-btn" id="shellNotifBtn" title="Notifications" aria-label="Notifications">🔔</button>'
    +     '<button class="shell-icon-btn" title="Réglages" onclick="window.location.href=\'account.html\'" aria-label="Réglages">⚙️</button>'
    +     '<div class="shell-avatar-wrap">'
    +       '<button id="shellAvatarButton" class="shell-avatar" aria-label="Compte"><span id="shellAvatarContent">👤</span></button>'
    +       '<div id="shellUserMenu" class="shell-menu">'
    +         '<a href="account.html" class="shell-menu-item" data-i18n="db_account">Compte</a>'
    +         '<a href="billing.html" class="shell-menu-item" data-i18n="db_billing">Abonnement</a>'
    +         '<button class="shell-menu-item danger" onclick="if(window.Auth)Auth.logout();else location.href=\'login.html\';" data-i18n="db_logout">Déconnexion</button>'
    +       '</div>'
    +     '</div>'
    +   '</div>'
    + '</header>'
    + '<div class="shell-notif-pop" id="shellNotifPop">'
    +   '<div class="shell-notif-h"><span data-i18n="nt_title">Notifications</span></div>'
    +   '<div class="shell-notif-empty" data-i18n="nt_empty">Aucune notification.</div>'
    + '</div>';
  }

  function mount(opts){
    opts = opts || {};
    var wrap=document.createElement('div');
    wrap.innerHTML = shellHTML(opts.active||'');
    while(wrap.firstChild) document.body.insertBefore(wrap.firstChild, document.body.firstChild);

    var topWrap=document.createElement('div');
    topWrap.innerHTML = topbarHTML(opts.title||'VidSpark AI', opts.subtitle||'');
    var mainEl = document.querySelector(opts.mainSelector || '.app-main');
    if(mainEl){
      while(topWrap.firstChild) mainEl.parentNode.insertBefore(topWrap.firstChild, mainEl);
    } else {
      while(topWrap.firstChild) document.body.appendChild(topWrap.firstChild);
    }

    if(window.applyI18n) try{ window.applyI18n(); }catch(e){}
    initBehavior();
    loadUserInfo();
  }

  async function loadUserInfo(){
    try{
      if(!window.Auth) return;
      await Auth.requireLogin();
      var user = await Auth.getCurrentUser();
      if(!user) return;
      var name = user.user_metadata && user.user_metadata.full_name || user.email || 'Creator';
      var nameEl=document.getElementById('shellUserName'); if(nameEl) nameEl.textContent=name;
      var emailEl=document.getElementById('shellUserEmail'); if(emailEl) emailEl.textContent=user.email||'';
      var avatarUrl = user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture);
      if(avatarUrl){
        var av=document.getElementById('shellAvatar'); if(av) av.innerHTML='<img src="'+avatarUrl+'" alt="">'+'<span class="on"></span>';
        var ac=document.getElementById('shellAvatarContent'); if(ac) ac.innerHTML='<img src="'+avatarUrl+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:13px;">';
      } else {
        var initial=(name||'?').trim().charAt(0).toUpperCase();
        var ac2=document.getElementById('shellAvatarContent'); if(ac2) ac2.textContent=initial;
      }
    }catch(e){ /* not logged in yet / page will handle its own auth redirect */ }
  }

  window.VidSparkShell = {
    isMobileSide: isMobileSide,
    toggleSidebar: toggleSidebar,
    closeDrawer: closeDrawer,
    toggleGroup: toggleGroup,
    sideSearch: sideSearch,
    initBehavior: initBehavior,
    mount: mount,
    loadUserInfo: loadUserInfo
  };
})();
