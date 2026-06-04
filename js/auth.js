/**
 * VidSpark AI — Authentification
 * ════════════════════════════════════════════════════════════════
 * Gère:
 * - Connexion Google OAuth
 * - Session utilisateur
 * - Vérification de l'utilisateur connecté
 * - Redirection login/dashboard
 */

const Auth = {
  /**
   * Récupérer l'utilisateur actuel stocké localement
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('VIDSPARK_USER');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Récupérer le token d'accès
   */
  getAccessToken() {
    return localStorage.getItem('VIDSPARK_ACCESS_TOKEN');
  },

  /**
   * Vérifier si utilisateur est connecté
   */
  isLoggedIn() {
    const token = this.getAccessToken();
    return token && !API.isTokenExpired();
  },

  /**
   * Récupérer le profil utilisateur depuis l'API
   */
  async getProfile() {
    try {
      const response = await AuthAPI.getProfile();
      return response.user;
    } catch (err) {
      console.error('[Auth] Get profile failed:', err);
      return null;
    }
  },

  /**
   * Déconnecter l'utilisateur
   */
  async logout() {
    await AuthAPI.logout();
  },

  /**
   * Rediriger vers login si pas connecté
   */
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login.html';
    }
  },

  /**
   * Rediriger vers dashboard si déjà connecté
   */
  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = '/dashboard.html';
    }
  }
};

/**
 * ════════════════════════════════════════════════════════════════
 * GOOGLE OAUTH VIA GOOGLE IDENTITY SERVICES
 * ════════════════════════════════════════════════════════════════
 * Utilise: https://developers.google.com/identity/gsi
 */
const GoogleAuth = {
  /**
   * Initialiser Google Sign-In
   * À appeler au chargement de la page
   */
  init() {
    // Charger la library Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('[GoogleAuth] Google Identity Services loaded');

      // Google OAuth Client ID for VidSpark AI
      const clientId = window.VIDSPARK_GOOGLE_CLIENT_ID || '665845815325-kguko2tbkji3e9ru9fopmi97qcb9qcvl.apps.googleusercontent.com';

      // 🔍 DEBUG: Log the Client ID being used
      console.log('[GoogleAuth] CLIENT_ID USED:', clientId);
      console.log('[GoogleAuth] Client ID length:', clientId.length);
      console.log('[GoogleAuth] Client ID source:', window.VIDSPARK_GOOGLE_CLIENT_ID ? 'window variable' : 'hardcoded fallback');
      console.log('[GoogleAuth] Client ID format valid:', clientId.endsWith('.apps.googleusercontent.com'));

      if (!clientId || clientId.includes('REPLACE') || clientId.length < 50) {
        console.error('[GoogleAuth] ❌ CLIENT_ID not configured properly. Update js/auth.js line 96');
        return;
      }
      console.log('[GoogleAuth] ✅ CLIENT_ID validation passed');

      // Initialiser Google
      google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleCredentialResponse.bind(this)
      });

      // Rendre le bouton Google (optionnel, on a notre bouton custom)
      // google.accounts.id.renderButton(document.getElementById('googleButton'), {
      //   theme: 'dark',
      //   size: 'large',
      //   width: '100%'
      // });
    };

    document.head.appendChild(script);
  },

  /**
   * Gérer la réponse Google
   */
  async handleCredentialResponse(response) {
    console.log('[GoogleAuth] Credential response received');

    if (!response.credential) {
      throw new Error('No credential received from Google');
    }

    try {
      // Envoyer le token Google au backend
      const data = await AuthAPI.googleLogin(response.credential);

      console.log('[GoogleAuth] Login successful:', {
        userId: data.user.id,
        plan: data.user.plan,
        isNewUser: data.is_new_user
      });

      // ═══════════════════════════════════════════════════════════════
      // IMPORTANT: Sauvegarder dans localStorage AVANT redirection
      // Cela permet au website-bridge.js dans l'extension de détecter
      // la connexion et de sauvegarder le token localement
      // ═══════════════════════════════════════════════════════════════
      localStorage.setItem('VIDSPARK_IS_NEW_USER', data.is_new_user ? 'true' : 'false');

      // Rediriger selon si c'est un nouvel utilisateur
      if (data.is_new_user) {
        // Nouvel utilisateur: afficher onboarding (sélection chaîne YouTube)
        window.location.href = '/onboarding.html';
      } else {
        // Utilisateur existant: aller au dashboard
        window.location.href = '/dashboard.html';
      }
    } catch (err) {
      console.error('[GoogleAuth] Login failed:', err);
      throw err;
    }
  },

  /**
   * Lancer la connexion Google (appelé par le bouton)
   */
  async login() {
    try {
      console.log('[GoogleAuth] Starting login flow');

      // Attendre que Google soit chargé
      if (typeof google === 'undefined') {
        throw new Error('Google Identity Services not loaded');
      }

      // Afficher le sélecteur de compte Google
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Si le prompt n'a pas pu s'afficher, utiliser le bouton custom
          this.requestCredential();
        }
      });
    } catch (err) {
      console.error('[GoogleAuth] Login error:', err);
      throw err;
    }
  },

  /**
   * Demander les credentials Google via popup
   */
  async requestCredential() {
    try {
      if (typeof google === 'undefined') {
        throw new Error('Google Identity Services not loaded');
      }

      google.accounts.id.renderButton(
        document.getElementById('googleButton'),
        {
          theme: 'dark',
          size: 'large',
          width: '100%',
          text: 'signin'
        }
      );
    } catch (err) {
      console.error('[GoogleAuth] Request credential error:', err);
      throw err;
    }
  }
};

/**
 * ════════════════════════════════════════════════════════════════
 * Initialisation au chargement
 * ════════════════════════════════════════════════════════════════
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Auth] Initializing...');
  GoogleAuth.init();
});
