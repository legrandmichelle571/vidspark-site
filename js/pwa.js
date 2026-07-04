/* VidSpark AI — PWA bootstrap: registers the service worker and exposes a
   deferred install prompt so any page can offer an "Installer l'app" button. */
(function () {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }

  window.vidsparkDeferredInstallPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    window.vidsparkDeferredInstallPrompt = e;
    document.dispatchEvent(new CustomEvent("vidspark:install-available"));
  });

  window.vidsparkInstallApp = function () {
    var promptEvent = window.vidsparkDeferredInstallPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    promptEvent.userChoice.finally(function () {
      window.vidsparkDeferredInstallPrompt = null;
    });
  };

  window.addEventListener("appinstalled", function () {
    window.vidsparkDeferredInstallPrompt = null;
  });
})();
