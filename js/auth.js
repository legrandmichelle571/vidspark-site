/**
 * VidSpark AI — Authentification Supabase
 * Version: 2.0 - Minimal implementation
 */

const GoogleAuth = {
  /**
   * Connexion Google
   */
  async login() {
    try {
      console.log('[GoogleAuth] Starting Google login...');

      // Créer client Supabase dynamiquement
      const client = window.supabase.createClient(
        'https://fnhyskbisfbtjgblbiap.supabase.co',
        'sb_publishable_Eq1H3ObUnaRnRt-rVUx2Ng_8iKndXKZ'
      );

      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard.html`
        }
      });

      if (error) throw error;
      console.log('[GoogleAuth] OAuth initiated');
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
  GoogleAuth.init();
});
