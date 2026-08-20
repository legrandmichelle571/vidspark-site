/**
 * VidSpark AI — Connexion automatique de l'extension (handshake sécurisé)
 * ════════════════════════════════════════════════════════════════
 * Remplace l'ancien flux "ID d'activation + Code secret" copié manuellement.
 *
 * 1. Le site demande à l'extension d'ouvrir un handshake (chrome.runtime.sendMessage,
 *    voir manifest.json → externally_connectable). L'extension génère un nonce
 *    gardé localement et ne renvoie que son empreinte SHA-256 ("challenge").
 * 2. Le site échange ce challenge contre un `state` à usage unique auprès du
 *    backend (POST /api/auth/extension/handshake/start, authentifié par la
 *    session Supabase de l'utilisateur).
 * 3. Le site relaie ce `state` à l'extension, qui complète le handshake
 *    DIRECTEMENT auprès du backend (le site n'est plus dans la boucle) et
 *    reçoit son credential de liaison.
 *
 * Si l'extension n'est pas détectée, ou si une étape échoue/expire, l'appelant
 * peut proposer le code de secours à un seul champ via generateManualCode().
 */
const VIDSPARK_EXTENSION_ID = 'ojahpkeponimlmfokadlijbajooeejbk';
const VSExtPairing = {
  _detectTimeoutMs: 4000,

  /** Détecte l'extension et exécute le handshake complet si possible.
   *  hooks: { onDetected, onConnected, onFallback } — tous optionnels. */
  async run(hooks = {}) {
    const { onDetected = () => {}, onConnected = () => {}, onFallback = () => {} } = hooks;

    if (!window.chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
      onFallback();
      return { detected: false };
    }

    const requestResp = await this._sendToExtension({ type: 'VIDSPARK_HANDSHAKE_REQUEST' });
    if (!requestResp || !requestResp.challenge) {
      onFallback();
      return { detected: false };
    }
    onDetected();

    let startData;
    try {
      startData = await API.post('/auth/extension/handshake/start', { challenge: requestResp.challenge });
    } catch (err) {
      onFallback();
      return { detected: true, error: err.message };
    }
    if (!startData?.state) {
      onFallback();
      return { detected: true, error: 'no_state' };
    }

    const completeResp = await this._sendToExtension({ type: 'VIDSPARK_HANDSHAKE_STATE', state: startData.state });
    if (!completeResp || !completeResp.success) {
      onFallback();
      return { detected: true, error: completeResp?.error || 'handshake_failed' };
    }

    onConnected(completeResp.user);
    return { detected: true, connected: true, user: completeResp.user };
  },

  /** Génère un code de secours à un seul champ (valable 10 minutes). */
  async generateManualCode() {
    return API.post('/auth/extension/pair/manual-code', {});
  },

  _sendToExtension(message) {
    return new Promise((resolve) => {
      let settled = false;
      const timer = setTimeout(() => { if (!settled) { settled = true; resolve(null); } }, this._detectTimeoutMs);
      try {
        chrome.runtime.sendMessage(VIDSPARK_EXTENSION_ID, message, (resp) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (chrome.runtime.lastError) { resolve(null); return; }
          resolve(resp);
        });
      } catch (e) {
        if (!settled) { settled = true; clearTimeout(timer); resolve(null); }
      }
    });
  }
};
