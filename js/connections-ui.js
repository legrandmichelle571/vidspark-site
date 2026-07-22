/**
 * VidSpark AI — UI Connexions multi-plateformes (TikTok, Phase 5)
 * ════════════════════════════════════════════════════════════════
 * Carte autonome sur le dashboard : Connecter/Déconnecter TikTok.
 * N'importe rien d'autre que ConnectionsAPI (js/api.js) — aucune dépendance
 * sur le reste de la logique du dashboard (KPIs, coach, graphiques).
 *
 * États affichés : 'idle' (chargement), 'disconnected', 'connecting',
 * 'connected', 'error'. Piloté uniquement par GET /api/connections
 * (ConnectionsAPI.list()) + les paramètres de retour du callback OAuth
 * (?connections=success|error&platform=...&code=...).
 */
(function () {
  const PLATFORM = 'tiktok';
  const PLATFORM_LABEL = 'TikTok';

  let card = null;

  function render(state, data) {
    if (!card) return;

    const body = {
      idle: () => `<div class="conn-row"><span class="conn-spin">⏳</span><span>Vérification…</span></div>`,

      disconnected: () => `
        <div class="conn-row">
          <span class="conn-icon">🎵</span>
          <div class="conn-text">
            <div class="conn-title">${PLATFORM_LABEL}</div>
            <div class="conn-sub">Non connecté</div>
          </div>
          <button class="btn btn-primary btn-sm" id="connBtnConnect">Connecter TikTok</button>
        </div>`,

      connecting: () => `
        <div class="conn-row">
          <span class="conn-spin">⏳</span>
          <div class="conn-text">
            <div class="conn-title">${PLATFORM_LABEL}</div>
            <div class="conn-sub">Connexion en cours…</div>
          </div>
        </div>`,

      connected: () => `
        <div class="conn-row">
          ${data && data.avatarUrl ? `<img class="conn-avatar" src="${data.avatarUrl}" alt="">` : `<span class="conn-icon">🎵</span>`}
          <div class="conn-text">
            <div class="conn-title">${PLATFORM_LABEL} — ${data && data.externalName ? data.externalName : 'Connecté'}</div>
            <div class="conn-sub conn-ok">✅ Connecté</div>
          </div>
          <button class="btn btn-ghost btn-sm" id="connBtnDisconnect">Déconnecter</button>
        </div>`,

      error: () => `
        <div class="conn-row">
          <span class="conn-icon">⚠️</span>
          <div class="conn-text">
            <div class="conn-title">${PLATFORM_LABEL}</div>
            <div class="conn-sub conn-err">Erreur${data && data.code ? ` (${data.code})` : ''} — connexion impossible</div>
          </div>
          <button class="btn btn-primary btn-sm" id="connBtnConnect">Réessayer</button>
        </div>`
    };

    card.innerHTML = (body[state] || body.disconnected)();
    wireButtons();
  }

  function wireButtons() {
    const connectBtn = document.getElementById('connBtnConnect');
    if (connectBtn) connectBtn.addEventListener('click', handleConnect);

    const disconnectBtn = document.getElementById('connBtnDisconnect');
    if (disconnectBtn) disconnectBtn.addEventListener('click', handleDisconnect);
  }

  async function handleConnect() {
    render('connecting');
    try {
      const { authorizationUrl } = await ConnectionsAPI.connect(PLATFORM);
      window.location.href = authorizationUrl;
    } catch (err) {
      console.error('[ConnectionsUI] connect a échoué:', err);
      render('error', { code: err.code });
    }
  }

  async function handleDisconnect() {
    if (!window.confirm('Déconnecter votre compte TikTok de VidSpark ?')) return;
    render('connecting');
    try {
      await ConnectionsAPI.disconnect(PLATFORM);
      await refreshState();
    } catch (err) {
      console.error('[ConnectionsUI] disconnect a échoué:', err);
      render('error', { code: err.code });
    }
  }

  /**
   * Lit ?connections=success|error&platform=...&code=... laissé par le callback
   * OAuth, puis nettoie l'URL (history.replaceState) pour éviter un retraitement
   * si l'utilisateur recharge la page.
   * @returns {{status:string, platform:string, code:string}|null}
   */
  function consumeRedirectParams() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('connections');
    if (!status) return null;

    const platform = params.get('platform');
    const code = params.get('code');

    params.delete('connections');
    params.delete('platform');
    params.delete('code');
    const cleanQuery = params.toString();
    const cleanUrl = window.location.pathname + (cleanQuery ? `?${cleanQuery}` : '') + window.location.hash;
    window.history.replaceState({}, '', cleanUrl);

    return { status, platform, code };
  }

  async function refreshState() {
    render('idle');
    try {
      const connections = await ConnectionsAPI.list();
      const tiktok = connections.find((c) => c.platform === PLATFORM);
      render(tiktok ? 'connected' : 'disconnected', tiktok);
    } catch (err) {
      // Le module peut être désactivé (404) — état neutre, pas une erreur alarmante
      // pour l'utilisateur : voir index.js#CONNECTIONS_MODULE_ENABLED.
      console.warn('[ConnectionsUI] liste des connexions indisponible:', err.message);
      render('disconnected');
    }
  }

  async function init() {
    card = document.getElementById('tiktokConnectionCard');
    if (!card) return; // page sans cette carte — rien à faire

    const redirect = consumeRedirectParams();

    if (redirect && redirect.platform === PLATFORM) {
      if (redirect.status === 'error') {
        render('error', { code: redirect.code });
        return;
      }
      // 'success' : on retombe sur GET /connections pour l'état réel plutôt que
      // de faire confiance au seul paramètre d'URL (source de vérité unique).
    }

    await refreshState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
