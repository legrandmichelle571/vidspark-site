/**
 * VidSpark AI — Authentification via Supabase
 * ════════════════════════════════════════════════════════════════
 * Utilise Supabase Auth pour Google OAuth
 */

let supabase = null;

const Auth = {
  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser() {
    if (!supabase) return null;
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
    if (!supabase) return;
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
   * Initialiser Supabase
   */
  initSupabase() {
    if (supabase) return; // Déjà initialisé

    if (!window.supabase) {
      console.error('[GoogleAuth] Supabase not loaded');
      return;
    }

    supabase = window.supabase.createClient(
      'https://fnhyskbisfbtjgblbiap.supabase.co',
      'sb_publishable_Eq1H3ObUnaRnRt-rVUx2Ng_8iKndXKZ'
    );
    console.log('[GoogleAuth] Supabase initialized');
  },

  /**
   * Initialiser Auth
   */
  async init() {
    this.initSupabase();
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
    this.initSupabase();
    if (!supabase) {
      alert('Supabase non initialisé');
      return;
    }

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
 * Initialisation au chargement
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Auth] Page loaded, initializing...');
  GoogleAuth.init();
});
