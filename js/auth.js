/**
 * VidSpark AI — Authentification Supabase
 * Version: 3.0 - Complete Auth module
 */

// Supabase client
// ⚙️ Config explicite : on FORCE le flux "implicit" (#access_token dans le hash)
// pour rester cohérent quelle que soit la version du CDN @supabase/supabase-js@2.
// detectSessionInUrl: true → Supabase traite automatiquement le retour OAuth.
const supabaseClient = window.supabase.createClient(
  'https://fnhyskbisfbtjgblbiap.supabase.co',
  'sb_publishable_Eq1H3ObUnaRnRt-rVUx2Ng_8iKndXKZ',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit'
    }
  }
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
   * Attendre que la session soit prête.
   * Au retour d'une connexion Google, Supabase met un court instant à
   * traiter le token présent dans l'URL. On attend cet événement au lieu
   * de vérifier trop tôt (cause du bug "il faut s'y reprendre à 2 fois").
   */
  async waitForSession(timeoutMs = 5000) {
    // 1) Session déjà présente ? on répond tout de suite.
    let session = await this.getSession();
    if (session) return session;

    // 2) Est-ce qu'on revient d'une redirection OAuth ?
    const url = window.location.href;
    const returningFromOAuth =
      window.location.hash.includes('access_token') ||
      url.includes('code=') ||
      window.location.hash.includes('error');

    if (!returningFromOAuth) return null; // simple visite sans token → pas connecté

    // 3) On attend l'événement SIGNED_IN + un sondage de secours.
    return new Promise((resolve) => {
      let done = false;
      const finish = (s) => {
        if (done) return;
        done = true;
        try { sub?.subscription?.unsubscribe(); } catch (e) {}
        clearInterval(poll);
        resolve(s);
      };

      const { data: sub } = supabaseClient.auth.onAuthStateChange((event, s) => {
        if (s) finish(s);
      });

      const start = Date.now();
      const poll = setInterval(async () => {
        const s = await this.getSession();
        if (s) return finish(s);
        if (Date.now() - start > timeoutMs) return finish(null);
      }, 300);
    });
  },

  /**
   * Vérifier si connecté, sinon rediriger
   */
  async requireLogin() {
    try {
      const session = await this.waitForSession();
      if (!session) {
        console.warn('[Auth] Not logged in, redirecting to login...');
        window.location.href = '/login.html';
        return false;
      }
      // Nettoie le token de l'URL pour éviter qu'il traîne dans la barre d'adresse
      if (window.location.hash.includes('access_token') && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
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
          // Connexion = email + profil uniquement (accès NON sensibles).
          // Pas de scope YouTube : les données YouTube passent par la clé
          // API serveur, jamais par le compte du client → évite l'écran
          // d'avertissement "Google n'a pas validé cette application".
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

// Exposer globalement (les pages utilisent window.Auth dans leurs onclick)
window.Auth = Auth;
window.GoogleAuth = GoogleAuth;

// Au chargement
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
  GoogleAuth.init();
});
