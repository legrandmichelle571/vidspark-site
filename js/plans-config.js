/**
 * VidSpark AI — Plan Definitions (Frontend)
 * ════════════════════════════════════════════════════════════════
 * MIRROR of backend/src/config/plans.js
 * Used by pricing page, billing page, and API client
 *
 * ⚠️  IMPORTANT: Must match backend exactly
 */

const PLANS_CONFIG = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',

    // Pricing (monthly)
    price_monthly: 0,
    price_yearly: 0,

    // Feature limits
    limits: {
      monthly_analyses: 10,
      ai_generations_monthly: 0,
      monthly_reports: 0,
      monthly_titles: 0,
      max_channels: 1
    },

    // Display
    badge: '🆓 FREE',
    color: '#22c55e',
    recommended: false,

    // Features included
    features: [
      { name: 'Analyze videos', included: true },
      { name: 'SEO score', included: true },
      { name: 'AI reports', included: false },
      { name: 'AI titles', included: false },
      { name: 'PDF export', included: false },
      { name: 'Max 1 channel', included: true }
    ]
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For serious creators',

    // Pricing (monthly)
    price_monthly: 9.99,
    price_yearly: 107.89,

    // Feature limits
    limits: {
      monthly_analyses: 500,
      ai_generations_monthly: 500,
      monthly_reports: 100,
      monthly_titles: -1,  // unlimited
      max_channels: 10
    },

    // Display
    badge: '⭐ PRO',
    color: '#7c6dfa',
    recommended: true,  // Show "RECOMMENDED" badge

    // Features included
    features: [
      { name: 'Analyze videos', included: true },
      { name: 'SEO score', included: true },
      { name: 'AI reports (100/mo)', included: true },
      { name: 'AI titles (unlimited)', included: true },
      { name: 'PDF export', included: true },
      { name: 'Max 10 channels', included: true }
    ]
  },

  business: {
    id: 'business',
    name: 'Business',
    description: 'For teams and agencies',

    // Pricing (monthly)
    price_monthly: 29.99,
    price_yearly: 323.89,

    // Feature limits
    limits: {
      monthly_analyses: 10000,
      ai_generations_monthly: 10000,
      monthly_reports: 5000,
      monthly_titles: -1,  // unlimited
      max_channels: 5  // ⚠️ with same owner check
    },

    // Display
    badge: '🚀 BUSINESS',
    color: '#3b82f6',
    recommended: false,

    // Features included
    features: [
      { name: 'Analyze videos', included: true },
      { name: 'SEO score', included: true },
      { name: 'AI reports (5k/mo)', included: true },
      { name: 'AI titles (unlimited)', included: true },
      { name: 'PDF export', included: true },
      { name: 'Multi-channel (up to 5)', included: true },
      { name: 'API access', included: true },
      { name: 'Priority support', included: true }
    ]
  }
};

/**
 * Get plan by ID
 */
function getPlanConfig(planId) {
  if (!PLANS_CONFIG[planId]) {
    console.error(`Invalid plan_id: ${planId}`);
    return PLANS_CONFIG.free;
  }
  return PLANS_CONFIG[planId];
}

/**
 * Get plan price (monthly or yearly)
 */
function getPlanPrice(planId, interval = 'monthly') {
  const plan = getPlanConfig(planId);
  return interval === 'yearly' ? plan.price_yearly : plan.price_monthly;
}

/**
 * Get monthly limit
 */
function getMonthlyLimit(planId) {
  return getPlanConfig(planId).limits.monthly_analyses;
}

/**
 * Format price for display
 */
function formatPrice(planId, interval = 'monthly') {
  const price = getPlanPrice(planId, interval);
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

/**
 * Get billing interval label
 */
function getIntervalLabel(interval) {
  if (interval === 'yearly') return '/year';
  return '/month';
}

/**
 * Log all plans (for debugging)
 */
function logPlans() {
  console.log('\n[Plans Config] ═══════════════════════════════════════');
  Object.values(PLANS_CONFIG).forEach(plan => {
    console.log(`\n${plan.name} (${plan.id}):`);
    console.log(`  Price: ${formatPrice(plan.id)}`);
    console.log(`  Analyses: ${plan.limits.monthly_analyses}/month`);
    console.log(`  Max Channels: ${plan.limits.max_channels}`);
  });
  console.log('\n═══════════════════════════════════════════════════════\n');
}

// Auto-log on load in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Uncomment to debug:
  // logPlans();
}
