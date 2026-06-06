/**
 * VidSpark AI — Authentification Supabase
 * Version: 3.0 - Complete Auth module
 */

// Supabase client
const supabaseClient = window.supabase.createClient(
  'https://fnhyskbisfbtjgblbiap.supabase.co',
  'sb_publishable_Eq1H3ObUnaRnRt-rVUx2Ng_8iKndXKZ'
);

/**
 * Auth — Gestion complète de l'authentification
 */
const Auth = {
  /**
   * Obtenir la session actuelle
   */
  async getSession() {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (err) {
      console.error('[Auth] getSession error:', err);
      return null;
    }
  },

  /**
   * Obtenir l'utilisateur actuel
   */
  async getCurrentUser() {
    try {
      const session = await this.getSession();
      if (!session) return null;
      return session.user;
    } catch (err) {
      console.error('[Auth] getCurrentUser error:', err);
      return null;
    }
  },

  /**
   * Vérifier si connecté, sinon rediriger
   */
  async requireLogin() {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        console.warn('[Auth] Not logged in, redirecting to login...');
        window.location.href = '/login.html';
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Auth] requireLogin error:', err);
      window.location.href = '/login.html';
      return false;
    }
  },

  /**
   * Logout
   */
  async logout() {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      console.log('[Auth] Logged out successfully');
      window.location.href = '/login.html';
    } catch (err) {
      console.error('[Auth] Logout error:', err);
      alert('Erreur lors de la déconnexion: ' + err.message);
    }
  },

  /**
   * Initialiser (traiter le token depuis l'URL)
   */
  async init() {
    try {
      // Vérifier si on revient d'une redirection OAuth
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        console.log('[Auth] Processing OAuth redirect...');
        // Supabase traite automatiquement le token
        // Attendre que la session soit établie
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const session = await this.getSession();
      console.log('[Auth] Session loaded:', session ? 'logged in' : 'not logged in');
    } catch (err) {
      console.error('[Auth] Init error:', err);
    }
  }
};

/**
 * GoogleAuth — Connexion spécifique Google (pour login.html)
 */
const GoogleAuth = {
  /**
   * Connexion Google
   */
  async login() {
    try {
      console.log('[GoogleAuth] Starting Google login...');

      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard.html`,
          queryParams: {
            // Forcer le choix du compte Google à chaque fois
            // 'select_account' = affiche le choix même si déjà connecté
            prompt: 'select_account'
          }
        }
      });

      if (error) throw error;
      console.log('[GoogleAuth] OAuth initiated with account selection');
    } catch (err) {
      console.error('[GoogleAuth] Error:', err);
      alert('Connexion échouée: ' + err.message);
    }
  },

  /**
   * Initialiser
   */
  async init() {
    console.log('[GoogleAuth] Auth page loaded');
  }
};

// Au chargement
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
  GoogleAuth.init();
});
