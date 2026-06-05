/**
 * VidSpark AI — Authentification via Supabase
 * ════════════════════════════════════════════════════════════════
 * Utilise Supabase Auth pour:
 * - Connexion Google OAuth (via Supabase)
 * - Gestion de session
 * - Récupération du profil utilisateur
 */

// ✅ Initialiser Supabase Client
const supabase = window.supabase.createClient(
  'https://fnhyskbisfbtjgblbiap.supabase.co',
  'sb_publishable_Eq1H3ObUnaRnRt-rVUx2Ng_8iKndXKZ'
);

const Auth = {
  /**
   * Récupérer l'utilisateur actuel depuis Supabase
   */
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      console.error('[Auth] Error getting current user:', err);
      return null;
    }
  },

  /**
   * Vérifier si utilisateur est connecté
   */
  async isLoggedIn() {
    const user = await this.getCurrentUser();
    return !!user;
  },

  /**
   * Déconnecter l'utilisateur
   */
  async logout() {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      console.log('[Auth] User logged out');
    } catch (err) {
      console.error('[Auth] Logout failed:', err);
    }
  },

  /**
   * Rediriger vers login si pas connecté
   */
  async requireLogin() {
    const loggedIn = await this.isLoggedIn();
    if (!loggedIn) {
      window.location.href = '/login.html';
    }
  },

  /**
   * Rediriger vers dashboard si déjà connecté
   */
  async redirectIfLoggedIn() {
    const loggedIn = await this.isLoggedIn();
    if (loggedIn) {
      window.location.href = '/dashboard.html';
    }
  }
};

/**
 * ════════════════════════════════════════════════════════════════
 * GOOGLE OAUTH VIA SUPABASE
 * ════════════════════════════════════════════════════════════════
 */
const GoogleAuth = {
  /**
   * Initialiser - Check si déjà connecté
   */
  async init() {
    console.log('[GoogleAuth] Initializing Supabase Auth');

    // Vérifier l'état de session au chargement
    const loggedIn = await Auth.isLoggedIn();
    if (loggedIn) {
      console.log('[GoogleAuth] ✅ User already logged in');
    } else {
      console.log('[GoogleAuth] No active session');
    }
      console.log('[GoogleAuth] Client ID source:', window.VIDSPARK_GOOGLE_CLIENT_ID ? 'window variable' : 'hardcoded fallback');
      console.log('[GoogleAuth] Client ID format valid:', clientId.endsWith('.apps.googleusercontent.com'));

      if (!clientId || clientId.includes('REPLACE') || clientId.length < 50) {
        console.error('[GoogleAuth] ❌ CLIENT_ID not configured properly. Update js/auth.js line 96');
        return;
      }
      console.log('[GoogleAuth] ✅ CLIENT_ID validation passed');

      // Supabase est déjà configuré, rien à faire ici
    };

    // On n'a pas besoin de charger Google Identity Services
    // Supabase gère tout ça!
  },

  /**
   * 🚀 Connexion Google SIMPLE via Supabase
   * Une seule ligne de code!
   */
  async login() {
    try {
      console.log('[GoogleAuth] Starting Google login via Supabase');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://vidsparkpro.com/dashboard.html'
        }
      });

      if (error) {
        console.error('[GoogleAuth] Login failed:', error);
        throw error;
      }

      console.log('[GoogleAuth] ✅ OAuth initiated, redirecting to Google...');
    } catch (err) {
      console.error('[GoogleAuth] Login error:', err);
      alert('Erreur de connexion: ' + err.message);
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
