/**
 * VidSpark AI — Admin Shared Module
 * Auth, navigation, utilitaires communs à toutes les pages admin
 */
'use strict';

/* ── Masquer le contenu jusqu'à vérification d'authentification ── */
document.body.classList.add('auth-hidden');

/* ── Client Supabase singleton ── */
let _sbClient = null;
function getClient() {
  if (!_sbClient) {
    const { createClient } = supabase;
    _sbClient = createClient(VIDSPARK_CONFIG.SUPABASE_URL, VIDSPARK_CONFIG.SUPABASE_ANON_KEY);
  }
  return _sbClient;
}

/* ── Session courante ── */
let _adminUser = null;
function getAdminUser() { return _adminUser; }

/* ══════════════════════════════════════════════════════════════
   INIT — vérifier session + rôle admin
   Retourne { client, user, session } ou null si non autorisé
══════════════════════════════════════════════════════════════ */
async function initAdmin() {
  const client = getClient();

  /* Vérifier session Supabase */
  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    showLoginOverlay();
    return null;
  }

  /* Vérifier rôle admin dans la table users */
  const { data: dbUser, error } = await client
    .from('users')
    .select('id, email, name, role, plan, status')
    .eq('auth_id', session.user.id)
    .single();

  if (error || !dbUser) {
    showLoginOverlay('Utilisateur introuvable en base.');
    await client.auth.signOut();
    return null;
  }

  if (dbUser.role !== 'admin') {
    document.getElementById('vs-login-overlay').innerHTML = `
      <div class="vs-login-box">
        <div style="font-size:36px;margin-bottom:16px">🚫</div>
        <h2 style="color:#ef4444;margin-bottom:12px">Accès refusé</h2>
        <p style="color:#8888a0;margin-bottom:24px">Ce compte n'a pas les droits administrateur.</p>
        <button class="vs-btn vs-btn-ghost" onclick="VS.logout()">Déconnexion</button>
      </div>`;
    document.getElementById('vs-login-overlay').style.display = 'flex';
    return null;
  }

  _adminUser = { ...dbUser, auth_id: session.user.id };
  hideLoginOverlay();

  /* Afficher le contenu admin (retirer la classe auth-hidden) */
  document.body.classList.remove('auth-hidden');

  /* Mettre à jour l'info utilisateur dans la sidebar */
  const nameEl = document.getElementById('sb-user-name');
  const roleEl = document.getElementById('sb-user-role');
  if (nameEl) nameEl.textContent = dbUser.name || dbUser.email;
  if (roleEl) roleEl.textContent = 'Administrateur';

  return { client, user: dbUser, session };
}

/* ── Overlay de connexion ── */
function showLoginOverlay(errMsg) {
  const ov = document.getElementById('vs-login-overlay');
  if (!ov) return;
  ov.innerHTML = `
    <div class="vs-login-box">
      <div class="vs-login-logo">⚡ <span>VidSpark AI</span></div>
      <h2>Admin</h2>
      <p style="color:#8888a0;margin-bottom:24px;font-size:14px">Connectez-vous avec votre compte administrateur</p>
      ${errMsg ? `<div class="vs-alert vs-alert-err">${errMsg}</div>` : ''}
      <div id="vs-login-err" class="vs-alert vs-alert-err" style="display:none"></div>
      <input type="email" id="vs-login-email" class="vs-input" placeholder="Email admin" autocomplete="email">
      <input type="password" id="vs-login-pwd" class="vs-input" placeholder="Mot de passe" autocomplete="current-password">
      <button class="vs-btn vs-btn-primary" id="vs-login-btn" style="width:100%" onclick="VS.login()">
        Se connecter
      </button>
    </div>`;
  ov.style.display = 'flex';
  document.getElementById('vs-login-email')?.focus();
  document.getElementById('vs-login-pwd')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') VS.login();
  });
}
function hideLoginOverlay() {
  const ov = document.getElementById('vs-login-overlay');
  if (ov) ov.style.display = 'none';
}

/* ── Login ── */
async function login() {
  const email = document.getElementById('vs-login-email')?.value?.trim();
  const pwd   = document.getElementById('vs-login-pwd')?.value;
  const errEl = document.getElementById('vs-login-err');
  const btn   = document.getElementById('vs-login-btn');
  if (!email || !pwd) {
    errEl.textContent = 'Email et mot de passe requis.';
    errEl.style.display = 'block';
    return;
  }
  btn.textContent = '⏳ Connexion…';
  btn.disabled = true;
  const client = getClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password: pwd });
  if (error) {
    errEl.textContent = error.message;
    errEl.style.display = 'block';
    btn.textContent = 'Se connecter';
    btn.disabled = false;
    return;
  }
  /* Vérifier rôle admin */
  const { data: dbUser } = await client
    .from('users')
    .select('role, name')
    .eq('auth_id', data.user.id)
    .single();
  if (!dbUser || dbUser.role !== 'admin') {
    await client.auth.signOut();
    errEl.textContent = 'Accès refusé — compte non administrateur.';
    errEl.style.display = 'block';
    btn.textContent = 'Se connecter';
    btn.disabled = false;
    return;
  }
  window.location.reload();
}

/* ── Logout ── */
async function logout() {
  await getClient().auth.signOut();
  window.location.reload();
}

/* ══════════════════════════════════════════════════════════════
   NAVIGATION — injecter la sidebar
══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard',     icon: '📊', href: 'index.html'    },
  { key: 'users',     label: 'Utilisateurs',  icon: '👥', href: 'users.html'    },
  { key: 'payments',  label: 'Paiements',     icon: '💳', href: 'payments.html' },
  { key: 'stats',     label: 'Statistiques',  icon: '📈', href: 'stats.html'    },
  { key: 'logs',      label: 'Logs admin',    icon: '📋', href: 'logs.html'     },
];

function renderNav(active) {
  const container = document.getElementById('vs-nav-items');
  if (!container) return;
  container.innerHTML = NAV_ITEMS.map(item => `
    <a href="${item.href}" class="sb-nav-item ${item.key === active ? 'active' : ''}">
      <span class="sb-nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>`).join('');

  /* Logout button */
  const logoutEl = document.getElementById('vs-logout-btn');
  if (logoutEl) logoutEl.addEventListener('click', logout);
}

/* ══════════════════════════════════════════════════════════════
   UTILITAIRES
══════════════════════════════════════════════════════════════ */
function toast(msg, type = 'ok') {
  let el = document.getElementById('vs-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'vs-toast';
    document.body.appendChild(el);
  }
  const icons = { ok: '✓', err: '✗', warn: '⚠' };
  el.textContent = (icons[type] || '') + ' ' + msg;
  el.className = 'vs-toast vs-toast-' + type + ' show';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'vs-toast'; }, 3500);
}

function loader(v) {
  const el = document.getElementById('vs-loader');
  if (el) el.style.display = v ? 'flex' : 'none';
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

function fmtDateShort(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: '2-digit'
  });
}

function fmtMoney(n) {
  if (!n && n !== 0) return '—';
  return parseFloat(n).toFixed(2) + ' €';
}

function fmt(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function planBadge(plan) {
  const cfg = {
    free:     { cls: 'plan-free',     icon: '🆓', label: 'Free'     },
    pro:      { cls: 'plan-pro',      icon: '⭐', label: 'Pro'      },
    business: { cls: 'plan-business', icon: '🏢', label: 'Business' }
  };
  const c = cfg[plan] || cfg.free;
  return `<span class="badge ${c.cls}">${c.icon} ${c.label}</span>`;
}

function statusBadge(s) {
  const cfg = {
    active:    { cls: 'status-active',    icon: '●', label: 'Actif'    },
    suspended: { cls: 'status-suspended', icon: '⚠', label: 'Suspendu' },
    cancelled: { cls: 'status-cancelled', icon: '✕', label: 'Annulé'   }
  };
  const c = cfg[s] || { cls: '', icon: '?', label: s || '—' };
  return `<span class="badge ${c.cls}">${c.icon} ${c.label}</span>`;
}

function providerBadge(p) {
  const cfg = {
    stripe: { cls: 'prov-stripe', label: '💳 Stripe'   },
    paypal: { cls: 'prov-paypal', label: '🅿 PayPal'   },
    manual: { cls: 'prov-manual', label: '✋ Manuel'   }
  };
  const c = cfg[p] || { cls: '', label: p || '—' };
  return `<span class="badge ${c.cls}">${c.label}</span>`;
}

function payStatusBadge(s) {
  const cfg = {
    succeeded: { cls: 'pay-ok',  label: '✓ Réussi'   },
    failed:    { cls: 'pay-err', label: '✗ Échoué'   },
    pending:   { cls: 'pay-pend',label: '⏳ En attente'},
    refunded:  { cls: 'pay-ref', label: '↩ Remboursé' }
  };
  const c = cfg[s] || { cls: '', label: s || '—' };
  return `<span class="badge ${c.cls}">${c.label}</span>`;
}

/* ── Appeler un endpoint backend sécurisé ── */
async function callAdminAPI(method, endpoint, body = null) {
  const client = getClient();
  const session = await client.auth.getSession();
  if (!session.data?.session?.access_token) {
    throw new Error('Session token missing');
  }

  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${session.data.session.access_token}`,
      'Content-Type': 'application/json'
    }
  };
  if (body) opts.body = JSON.stringify(body);

  const backendUrl = VIDSPARK_CONFIG.BACKEND_URL || 'http://localhost:3001';
  const res = await fetch(`${backendUrl}/api/admin${endpoint}`, opts);

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errData.error || `API error: ${res.status}`);
  }

  return await res.json();
}

/* ── Re-vérifier le rôle admin ── */
async function verifyAdminRole() {
  const client = getClient();
  const { data: { session } } = await client.auth.getSession();
  if (!session) return false;

  const { data: dbUser } = await client
    .from('users')
    .select('role')
    .eq('auth_id', session.user.id)
    .single();

  return dbUser?.role === 'admin';
}

/* ── Changer le plan d'un utilisateur ── */
async function changePlan(userId, newPlan, userEmail) {
  if (!confirm(`Passer ${userEmail} en plan ${newPlan.toUpperCase()} ?`)) return;

  /* Re-vérifier le rôle admin avant opération */
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    toast('Accès refusé : rôle admin requis', 'err');
    return false;
  }

  try {
    await callAdminAPI('PUT', `/users/${userId}/plan`, { plan: newPlan });
    toast(`Plan mis à jour → ${newPlan}`, 'ok');
    return true;
  } catch (err) {
    toast('Erreur : ' + err.message, 'err');
    return false;
  }
}

/* ── Changer le statut d'un utilisateur ── */
async function changeStatus(userId, newStatus, userEmail) {
  const labels = { suspended: 'suspendre', active: 'réactiver' };
  if (!confirm(`Voulez-vous ${labels[newStatus] || newStatus} ${userEmail} ?`)) return;

  /* Re-vérifier le rôle admin avant opération */
  const isAdmin = await verifyAdminRole();
  if (!isAdmin) {
    toast('Accès refusé : rôle admin requis', 'err');
    return false;
  }

  try {
    await callAdminAPI('PUT', `/users/${userId}/status`, { status: newStatus });
    toast(`Statut mis à jour → ${newStatus}`, 'ok');
    return true;
  } catch (err) {
    toast('Erreur : ' + err.message, 'err');
    return false;
  }
}

/* ── Pagination helper ── */
function renderPagination(container, page, total, perPage, onPage) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) { container.innerHTML = ''; return; }
  const start = Math.max(1, page - 2);
  const end   = Math.min(pages, page + 2);
  let html = '<div class="pagination">';
  if (page > 1) html += `<button class="page-btn" onclick="(${onPage})(${page-1})">‹</button>`;
  for (let i = start; i <= end; i++) {
    html += `<button class="page-btn${i===page?' active':''}" onclick="(${onPage})(${i})">${i}</button>`;
  }
  if (page < pages) html += `<button class="page-btn" onclick="(${onPage})(${page+1})">›</button>`;
  html += `<span class="page-info">${total} résultats</span></div>`;
  container.innerHTML = html;
}

/* ── Export global VS ── */
const VS = {
  getClient, getAdminUser, initAdmin,
  login, logout,
  renderNav,
  toast, loader, fmtDate, fmtDateShort, fmtMoney, fmt, esc,
  planBadge, statusBadge, providerBadge, payStatusBadge,
  changePlan, changeStatus,
  callAdminAPI, verifyAdminRole,
  renderPagination
};
