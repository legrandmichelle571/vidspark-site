/**
 * VidSpark AI — API Client
 * ════════════════════════════════════════════════════════════════
 * Client HTTP pour communiquer avec le backend
 * Gère les tokens, refresh automatique, et gestion d'erreurs
 */

const API = {
  // Configuration
  baseURL: localStorage.getItem('VIDSPARK_API_URL') || 'https://vidspark-ai-production-9ac7.up.railway.app/api',

  // 🔍 DEBUG: Log the API URL being used
  init() {
    const storedUrl = localStorage.getItem('VIDSPARK_API_URL');
    console.log('[API] BACKEND_URL USED:', this.baseURL);
    console.log('[API] URL source:', storedUrl ? 'localStorage' : 'hardcoded fallback');
    if (!storedUrl) {
      console.warn('[API] ⚠️ No localStorage VIDSPARK_API_URL set. Using localhost fallback.');
    }
  },

  /**
   * Effectuer une requête HTTP
   * Ajoute automatiquement le token d'authentification
   * Rafraîchit le token si expiré
   */
  async request(method, endpoint, body = null) {
    const token = localStorage.getItem('VIDSPARK_ACCESS_TOKEN');
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const data = await response.json();

      // Si token expiré, tenter refresh
      if (response.status === 401 && endpoint !== '/auth/refresh') {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Recommencer la requête avec le nouveau token
          return this.request(method, endpoint, body);
        } else {
          // Refresh a échoué, rediriger login
          this.logout();
          throw new Error('Session expired');
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`[API] ${method} ${endpoint}:`, err);
      throw err;
    }
  },

  /**
   * GET
   */
  get(endpoint) {
    return this.request('GET', endpoint);
  },

  /**
   * POST
   */
  post(endpoint, body) {
    return this.request('POST', endpoint, body);
  },

  /**
   * PUT
   */
  put(endpoint, body) {
    return this.request('PUT', endpoint, body);
  },

  /**
   * DELETE
   */
  delete(endpoint) {
    return this.request('DELETE', endpoint);
  },

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('VIDSPARK_REFRESH_TOKEN');
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn('[API] Token refresh failed');
        return false;
      }

      // Sauvegarder les nouveaux tokens
      localStorage.setItem('VIDSPARK_ACCESS_TOKEN', data.access_token);
      localStorage.setItem('VIDSPARK_REFRESH_TOKEN', data.refresh_token);
      localStorage.setItem('VIDSPARK_TOKEN_EXPIRES_AT', Date.now() + data.expires_in * 1000);

      console.log('[API] Token refreshed');
      return true;
    } catch (err) {
      console.error('[API] Refresh token error:', err);
      return false;
    }
  },

  /**
   * Déconnecter
   */
  logout() {
    localStorage.removeItem('VIDSPARK_ACCESS_TOKEN');
    localStorage.removeItem('VIDSPARK_REFRESH_TOKEN');
    localStorage.removeItem('VIDSPARK_TOKEN_EXPIRES_AT');
    localStorage.removeItem('VIDSPARK_USER');
    window.location.href = '/login.html';
  },

  /**
   * Vérifier si token est expiré
   */
  isTokenExpired() {
    const expiresAt = localStorage.getItem('VIDSPARK_TOKEN_EXPIRES_AT');
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt);
  }
};

/**
 * ════════════════════════════════════════════════════════════════
 * ENDPOINTS AUTHENTIFICATION
 * ════════════════════════════════════════════════════════════════
 */
const AuthAPI = {
  /**
   * POST /api/auth/google
   * Créer les codes d'activation avec access_token Supabase
   */
  async googleLogin(accessToken) {
    const data = await API.post('/auth/google', { access_token: accessToken });

    // Sauvegarder les codes d'activation
    localStorage.setItem('VIDSPARK_ACTIVATION_ID', data.activation_id);
    localStorage.setItem('VIDSPARK_ACTIVATION_SECRET', data.activation_secret);
    localStorage.setItem('VIDSPARK_SUBSCRIPTION_EXPIRY', data.subscription_expiry);
    localStorage.setItem('VIDSPARK_USER', JSON.stringify(data.user));

    console.log('[AuthAPI] ✅ Activation codes received:', {
      activation_id: data.activation_id,
      subscription_expiry: data.subscription_expiry
    });

    return data;
  },

  /**
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.warn('[AuthAPI] Logout failed:', err);
    }
    API.logout();
  },

  /**
   * GET /api/auth/me
   * Récupérer le profil utilisateur actuel
   */
  async getProfile() {
    return API.get('/auth/me');
  }
};

/**
 * ════════════════════════════════════════════════════════════════
 * ENDPOINTS UTILISATEUR
 * ════════════════════════════════════════════════════════════════
 */
const UserAPI = {
  /**
   * GET /api/user/profile
   */
  async getProfile() {
    return API.get('/user/profile');
  },

  /**
   * PUT /api/user/profile
   */
  async updateProfile(data) {
    return API.put('/user/profile', data);
  },

  /**
   * GET /api/user/plan
   */
  async getPlan() {
    return API.get('/user/plan');
  },

  /**
   * GET /api/user/usage
   */
  async getUsage() {
    return API.get('/user/usage');
  }
};

/**
 * ════════════════════════════════════════════════════════════════
 * ENDPOINTS CHAÎNES YOUTUBE
 * ════════════════════════════════════════════════════════════════
 */
const ChannelsAPI = {
  /**
   * GET /api/channels/list
   */
  async list() {
    return API.get('/channels/list');
  },

  /**
   * POST /api/channels/add
   */
  async add(channelId) {
    return API.post('/channels/add', { channel_id: channelId });
  },

  /**
   * POST /api/channels/remove
   */
  async remove(channelId) {
    return API.post('/channels/remove', { channel_id: channelId });
  },

  /**
   * POST /api/channels/set-primary
   */
  async setPrimary(channelId) {
    return API.post('/channels/set-primary', { channel_id: channelId });
  }
};

/**
 * ════════════════════════════════════════════════════════════════
 * ENDPOINTS FACTURATION (Stripe)
 * ════════════════════════════════════════════════════════════════
 */
const BillingAPI = {
  /**
   * POST /api/subscription/checkout/stripe
   * Créer une session Stripe Checkout
   * @param {string} planId - 'pro', 'business' or 'diamant'
   * @param {string} interval - 'month' or 'year'
   */
  async checkout(planId, interval = 'month') {
    // Valider les paramètres
    if (!['pro', 'business', 'diamant'].includes(planId)) {
      throw new Error('Invalid plan ID: ' + planId);
    }
    if (!['month', 'year'].includes(interval)) {
      throw new Error('Invalid interval: ' + interval);
    }

    const data = await API.post('/subscription/checkout/stripe', {
      plan: planId,
      interval: interval
    });

    // Rediriger vers le checkout Stripe
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    }
    return data;
  },

  /**
   * POST /api/billing/upgrade
   * Changer le plan existant
   */
  async upgrade(newPlanId) {
    return API.post('/billing/upgrade', { new_plan_id: newPlanId });
  },

  /**
   * POST /api/billing/cancel
   * Annuler la subscription
   */
  async cancel() {
    return API.post('/billing/cancel', {});
  },

  /**
   * GET /api/billing/subscription
   * Récupérer les infos subscription
   */
  async getSubscription() {
    return API.get('/billing/subscription');
  }
};
