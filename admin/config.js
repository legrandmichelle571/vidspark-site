/**
 * VidSpark AI — Admin Config
 * ─────────────────────────────────────────────────────────────
 * Remplir avant déploiement :
 *   SUPABASE_URL      → Settings > API > Project URL
 *   SUPABASE_ANON_KEY → Settings > API > anon public
 * ─────────────────────────────────────────────────────────────
 */
const VIDSPARK_CONFIG = {
  SUPABASE_URL:      'https://fnhyskbisfbtjgblbiap.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_Eq1H3ObUnaRnRt-rVUx2Ng_8iKndXKZ',
  BACKEND_URL:       'https://vidspark-ai-production-9ac7.up.railway.app'  /* Railway URL - Déployé! */
};

/* Limites MENSUELLES par plan (depuis v5.0) — cohérentes avec backend/src/routes/subscription.js */
const PLAN_LIMITS = {
  free:     {
    monthly_analyses:  10,
    monthly_reports:   0,
    monthly_titles:    0,
    max_channels:      1,
    monthly_limit:     10
  },
  pro:      {
    monthly_analyses:  500,
    monthly_reports:   100,
    monthly_titles:    -1,  // illimité
    max_channels:      10,
    monthly_limit:     500
  },
  business: {
    monthly_analyses:  10000,
    monthly_reports:   5000,
    monthly_titles:    -1,  // illimité
    max_channels:      5,
    monthly_limit:     10000
  }
};

/* Anciens aliases (pour compatibilité) */
PLAN_LIMITS.free.daily_analyses = 10;
PLAN_LIMITS.pro.daily_analyses = 500;
PLAN_LIMITS.business.daily_analyses = 10000;

if (VIDSPARK_CONFIG.SUPABASE_URL.includes('VOTRE_PROJECT_ID')) {
  console.error('[VidSpark Admin] ⚠️  Configurer SUPABASE_URL dans admin/config.js');
}
