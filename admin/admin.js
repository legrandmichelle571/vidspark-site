/**
 * VidSpark Admin — Core Logic
 * Navigation, helpers, utilitaires pour pages admin
 */

const VS = {
  /* ────────────────────────────────────────
     AUTH CHECK
     ──────────────────────────────────────── */
  checkAdminAuth() {
    const token = localStorage.getItem('VIDSPARK_ADMIN_TOKEN');
    if (!token) {
      // Rediriger vers la page de login
      window.location.href = '../login.html?admin=true&redirect=' + encodeURIComponent(window.location.href);
      return false;
    }
    return true;
  },

  /* ────────────────────────────────────────
     NAVIGATION SIDEBAR
     ──────────────────────────────────────── */
  initNavigation() {
    const navContainer = document.getElementById('vs-nav-items');
    if (!navContainer) return;

    const navItems = [
      { icon: '📊', label: 'Dashboard', href: 'index.html', page: 'index' },
      { icon: '👥', label: 'Utilisateurs', href: 'users.html', page: 'users' },
      { icon: '💳', label: 'Paiements', href: 'payments.html', page: 'payments' },
      { icon: '🔔', label: 'Abonnements', href: 'subscriptions.html', page: 'subscriptions' },
      { icon: '📺', label: 'Chaînes', href: 'channels.html', page: 'channels' },
      { icon: '📊', label: 'Quotas', href: 'quotas.html', page: 'quotas' },
      { icon: '💰', label: 'Plans', href: 'plans.html', page: 'plans' },
      { icon: '📈', label: 'Statistiques', href: 'stats.html', page: 'stats' },
      { icon: '📋', label: 'Logs', href: 'logs.html', page: 'logs' }
    ];

    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    navContainer.innerHTML = navItems.map(item => `
      <a href="${item.href}" class="sb-nav-item ${currentPage === item.page ? 'active' : ''}">
        <span class="sb-nav-icon">${item.icon}</span>
        <span class="sb-nav-label">${item.label}</span>
      </a>
    `).join('');
  },

  /* ────────────────────────────────────────
     LOGOUT
     ──────────────────────────────────────── */
  logout() {
    localStorage.removeItem('VIDSPARK_ADMIN_TOKEN');
    localStorage.removeItem('VIDSPARK_ADMIN_USER');
    window.location.href = 'index.html';
  },

  /* ────────────────────────────────────────
     HELPERS — Formatage
     ──────────────────────────────────────── */
  formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  },

  formatDateTime(dateStr) {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('fr-FR');
    } catch {
      return dateStr;
    }
  },

  formatCurrency(amount) {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  formatPercent(value) {
    if (value === null || value === undefined) return '—';
    return `${parseFloat(value).toFixed(1)}%`;
  },

  esc(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /* ────────────────────────────────────────
     HELPERS — Plan Badge
     ──────────────────────────────────────── */
  getPlanBadge(plan) {
    const badges = {
      'free': '<span class="badge badge-free">🆓 FREE</span>',
      'pro': '<span class="badge badge-pro">⭐ PRO</span>',
      'business': '<span class="badge badge-business">🏢 BUSINESS</span>'
    };
    return badges[plan] || `<span class="badge">${plan.toUpperCase()}</span>`;
  },

  /* ────────────────────────────────────────
     HELPERS — Status Badge
     ──────────────────────────────────────── */
  getStatusBadge(status) {
    const badges = {
      'active': '<span class="badge badge-success">✓ ACTIVE</span>',
      'suspended': '<span class="badge badge-danger">⊘ SUSPENDED</span>',
      'cancelled': '<span class="badge badge-warning">✕ CANCELLED</span>',
      'expired': '<span class="badge badge-warning">⏰ EXPIRED</span>',
      'succeeded': '<span class="badge badge-success">✓ SUCCEEDED</span>',
      'failed': '<span class="badge badge-danger">✕ FAILED</span>',
      'pending': '<span class="badge badge-warning">⏳ PENDING</span>',
      'refunded': '<span class="badge badge-warning">↩ REFUNDED</span>'
    };
    return badges[status] || `<span class="badge">${status.toUpperCase()}</span>`;
  },

  getProviderBadge(provider) {
    const badges = {
      'stripe': '<span class="badge" style="background:rgba(99,102,241,.12);color:#6366f1">🔘 Stripe</span>',
      'paypal': '<span class="badge" style="background:rgba(59,130,246,.12);color:#3b82f6">🔵 PayPal</span>',
      'manual': '<span class="badge" style="background:rgba(107,114,128,.12);color:#6b7280">✍ Manuel</span>'
    };
    return badges[provider] || `<span class="badge">${(provider || '—').toUpperCase()}</span>`;
  },

  /* ────────────────────────────────────────
     ACTIONS — Changer Plan
     ──────────────────────────────────────── */
  async changePlan(userId, newPlan) {
    try {
      const confirmed = confirm(`Changer le plan à ${newPlan.toUpperCase()}?`);
      if (!confirmed) return false;

      await AdminAPI.changePlan(userId, newPlan);
      alert(`✅ Plan changé à ${newPlan}`);
      location.reload();
      return true;
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
      return false;
    }
  },

  /* ────────────────────────────────────────
     ACTIONS — Suspendre/Réactiver
     ──────────────────────────────────────── */
  async setStatus(userId, newStatus) {
    try {
      const messages = {
        'active': 'Réactiver cet utilisateur?',
        'suspended': 'Suspendre cet utilisateur?',
        'cancelled': 'Annuler cet utilisateur?'
      };

      const confirmed = confirm(messages[newStatus] || `Changer statut à ${newStatus}?`);
      if (!confirmed) return false;

      await AdminAPI.setUserStatus(userId, newStatus);
      alert(`✅ Statut changé à ${newStatus}`);
      location.reload();
      return true;
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
      return false;
    }
  },

  /* ────────────────────────────────────────
     ACTIONS — Voir Détails
     ──────────────────────────────────────── */
  async showUserDetail(userId) {
    try {
      const detail = await AdminAPI.getUserDetail(userId);
      console.log('User detail:', detail);

      // Afficher modal ou rediriger
      window.location.href = `users.html?id=${userId}`;
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
    }
  },

  /* ────────────────────────────────────────
     ACTIONS — Voir Chaînes YouTube
     ──────────────────────────────────────── */
  async showChannels(userId) {
    try {
      const { channels } = await AdminAPI.getUserChannels(userId);
      console.log('User channels:', channels);

      if (channels.length === 0) {
        alert('Aucune chaîne YouTube liée');
        return;
      }

      const list = channels.map(c => `
        • ${c.channel_name || c.channel_id}
        Owner: ${c.google_account_owner}
        Added: ${this.formatDate(c.added_at)}
      `).join('\n\n');

      alert(`Chaînes YouTube:\n\n${list}`);
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
    }
  },

  /* ────────────────────────────────────────
     ACTIONS — Rembourser Paiement
     ──────────────────────────────────────── */
  async refundPayment(paymentId, amount) {
    try {
      const reason = prompt(`Rembourser $${amount}?\n\nRaison du remboursement:`);
      if (!reason) return false;

      await AdminAPI.refundPayment(paymentId, reason);
      alert('✅ Paiement remboursé');
      location.reload();
      return true;
    } catch (err) {
      alert(`❌ Erreur: ${err.message}`);
      return false;
    }
  },

  /* ────────────────────────────────────────
     HELPERS — Pagination
     ──────────────────────────────────────── */
  renderPagination(currentPage, totalPages, onPageChange) {
    const container = document.querySelector('[id$="-pag"]');
    if (!container) return;

    let html = '<div style="display:flex; gap:8px; justify-content:center; margin-top:24px; align-items:center">';

    if (currentPage > 1) {
      html += `<button class="vs-btn vs-btn-ghost vs-btn-sm" onclick="this.onclick_handler && this.onclick_handler(${currentPage - 1})">← Précédent</button>`;
    }

    html += `<span style="color:var(--muted); font-size:14px">Page ${currentPage} / ${totalPages}</span>`;

    if (currentPage < totalPages) {
      html += `<button class="vs-btn vs-btn-ghost vs-btn-sm" onclick="this.onclick_handler && this.onclick_handler(${currentPage + 1})">Suivant →</button>`;
    }

    html += '</div>';
    container.innerHTML = html;

    // Attacher handler (note: hack, il faudrait mieux)
    container.querySelectorAll('button').forEach(btn => {
      btn.onclick_handler = onPageChange;
    });
  },

  /* ────────────────────────────────────────
     HELPERS — Debounce
     ──────────────────────────────────────── */
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  /* ────────────────────────────────────────
     LOADER
     ──────────────────────────────────────── */
  showLoader() {
    const loader = document.getElementById('vs-loader');
    if (loader) loader.style.display = 'flex';
  },

  hideLoader() {
    const loader = document.getElementById('vs-loader');
    if (loader) loader.style.display = 'none';
  }
};

/* ════════════════════════════════════════════
   INIT on page load
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  VS.initNavigation();

  // Logout button
  const logoutBtn = document.getElementById('vs-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => VS.logout());
  }

  // Update last refresh time
  const lastRefreshEl = document.getElementById('last-refresh');
  if (lastRefreshEl) {
    const now = new Date().toLocaleTimeString('fr-FR');
    lastRefreshEl.textContent = `Actualisé: ${now}`;
  }

  // Update topbar date
  const topbarDateEl = document.getElementById('topbar-date');
  if (topbarDateEl) {
    const now = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    topbarDateEl.textContent = now;
  }

  VS.hideLoader();
});
