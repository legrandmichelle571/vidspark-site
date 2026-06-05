/**
 * VidSpark AI — Authentification via Supabase
 * ════════════════════════════════════════════════════════════════
 * Utilise Supabase Auth pour Google OAuth
 */

// ✅ Initialiser Supabase Client
const supabase = window.supabase.createClient(
  'https://fnhyskbisfbtjgblbiap.supabase.co',
  'sb_publishable_Eq1H3ObUnaRnRt-rVUx2Ng_8iKndXKZ'
);

const Auth = {
  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      console.error('[Auth] Error:', err);
      return null;
    }
  },

  /**
   * Vérifier si connecté
   */
  async isLoggedIn() {
    const user = await this.getCurrentUser();
    return !!user;
  },

  /**
   * Déconnecter
   */
  async logout() {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.href = '/login.html';
    } catch (err) {
      console.error('[Auth] Logout error:', err);
    }
  }
};

/**
 * GOOGLE OAUTH VIA SUPABASE
 */
const GoogleAuth = {
  /**
   * Initialiser
   */
  async init() {
    console.log('[GoogleAuth] Initializing Supabase Auth');
    const loggedIn = await Auth.isLoggedIn();
    if (loggedIn) {
      console.log('[GoogleAuth] User already logged in, redirecting...');
      window.location.href = '/dashboard.html';
    }
  },

  /**
   * Connexion Google via Supabase
   */
  async login() {
    try {
      console.log('[GoogleAuth] Starting Google OAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://vidsparkpro.com/dashboard.html'
        }
      });

      if (error) {
        throw error;
      }
      console.log('[GoogleAuth] OAuth redirect initiated');
    } catch (err) {
      console.error('[GoogleAuth] Error:', err);
      alert('Erreur: ' + (err.message || 'Connexion échouée'));
    }
  }
};

/**
 * Initialisation
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Auth] Page loaded');
  GoogleAuth.init();
});
