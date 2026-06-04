/**
 * VidSpark Admin — API Client
 * Gère tous les appels à /api/admin/*
 */

const AdminAPI = {
  BACKEND_URL: VIDSPARK_CONFIG.BACKEND_URL || 'http://localhost:3001/api',

  /**
   * Effectuer une requête HTTP vers l'API admin
   */
  async request(method, path, body = null) {
    try {
      const url = `${this.BACKEND_URL}${path}`;
      const token = localStorage.getItem('VIDSPARK_ADMIN_TOKEN');

      if (!token) {
        throw new Error('No admin token found. Please login.');
      }

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error('[AdminAPI]', err);
      throw err;
    }
  },

  /* ────────────────────────────────────────
     STATS
     ──────────────────────────────────────── */
  getStats() {
    return this.request('GET', '/admin/stats');
  },

  /* ────────────────────────────────────────
     USERS
     ──────────────────────────────────────── */
  getUsers(page = 1, limit = 50, filters = {}) {
    const query = new URLSearchParams({ page, limit, ...filters });
    return this.request('GET', `/admin/users?${query}`);
  },

  getUserDetail(userId) {
    return this.request('GET', `/admin/users/${userId}`);
  },

  changePlan(userId, plan) {
    return this.request('PUT', `/admin/users/${userId}/plan`, { plan });
  },

  setUserStatus(userId, status) {
    return this.request('PUT', `/admin/users/${userId}/status`, { status });
  },

  deleteUser(userId) {
    return this.request('DELETE', `/admin/users/${userId}`);
  },

  /* ────────────────────────────────────────
     SUBSCRIPTIONS
     ──────────────────────────────────────── */
  getSubscriptions(page = 1, limit = 50, filters = {}) {
    const query = new URLSearchParams({ page, limit, ...filters });
    return this.request('GET', `/admin/subscriptions?${query}`);
  },

  extendSubscription(subscriptionId, days = 30) {
    return this.request('POST', `/admin/subscriptions/${subscriptionId}/extend`, { days });
  },

  cancelSubscription(subscriptionId) {
    return this.request('POST', `/admin/subscriptions/${subscriptionId}/cancel`);
  },

  /* ────────────────────────────────────────
     CHANNELS
     ──────────────────────────────────────── */
  getChannels(page = 1, limit = 50) {
    const query = new URLSearchParams({ page, limit });
    return this.request('GET', `/admin/channels?${query}`);
  },

  getUserChannels(userId) {
    return this.request('GET', `/admin/channels/${userId}`);
  },

  deleteChannel(channelId) {
    return this.request('DELETE', `/admin/channels/${channelId}`);
  },

  /* ────────────────────────────────────────
     QUOTAS
     ──────────────────────────────────────── */
  getQuotas(page = 1, limit = 50) {
    const query = new URLSearchParams({ page, limit });
    return this.request('GET', `/admin/quotas?${query}`);
  },

  resetQuota(userId) {
    return this.request('POST', `/admin/quotas/${userId}/reset`);
  },

  /* ────────────────────────────────────────
     PAYMENTS
     ──────────────────────────────────────── */
  getPayments(page = 1, limit = 50, filters = {}) {
    const query = new URLSearchParams({ page, limit, ...filters });
    return this.request('GET', `/admin/payments?${query}`);
  },

  refundPayment(paymentId, reason = '') {
    return this.request('POST', `/admin/payments/${paymentId}/refund`, { reason });
  },

  /* ────────────────────────────────────────
     PLANS
     ──────────────────────────────────────── */
  getPlans() {
    return this.request('GET', '/admin/plans');
  },

  createPlan(plan) {
    return this.request('POST', '/admin/plans', plan);
  },

  updatePlan(planId, updates) {
    return this.request('PUT', `/admin/plans/${planId}`, updates);
  },

  deletePlan(planId) {
    return this.request('DELETE', `/admin/plans/${planId}`);
  },

  /* ────────────────────────────────────────
     LOGS
     ──────────────────────────────────────── */
  getLogs(limit = 100) {
    const query = new URLSearchParams({ limit });
    return this.request('GET', `/admin/logs?${query}`);
  },

  /* ────────────────────────────────────────
     REVENUE
     ──────────────────────────────────────── */
  getRevenue() {
    return this.request('GET', '/admin/revenue');
  }
};
