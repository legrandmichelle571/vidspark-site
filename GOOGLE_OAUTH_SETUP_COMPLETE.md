# 🔐 VIDSPARK AI - Configuration Google OAuth - Guide Complet

**Date:** 3 Juin 2026  
**Client ID:** `665845815325-kguko2tbkji3e9ru9fopmi97qcb9qcvl.apps.googleusercontent.com`

---

## ⚠️ SITUATION CRITIQUE

**Erreur actuelle:** "Error 401: The OAuth client was not found"

**Cause:** Authorized Origins et Redirect URIs ne sont PAS configurés dans Google Cloud Console

**Solution:** Suivez ce guide EXACTEMENT

---

## 📍 ACCÉDER À GOOGLE CLOUD CONSOLE

1. Aller à: https://console.cloud.google.com
2. En haut à gauche, voir liste des projets
3. Sélectionner le projet **"VidSpark AI"** (ou créer s'il n'existe pas)

---

## 🔍 ÉTAPE 1: Vérifier le Client ID Existe

1. Menu gauche → **APIs & Services** → **Credentials**
2. Sous "OAuth 2.0 Client IDs", vous devriez voir:
   - **Type:** Web application
   - **Client ID:** `665845815325-kguko2tbkji3e9ru9fopmi97qcb9qcvl.apps.googleusercontent.com`

**Si ne vois pas ce Client ID:**
- Cliquer "+ CREATE CREDENTIALS" → "OAuth client ID"
- Application type: "Web application"
- Name: "VidSpark Web"
- Cliquer "Create"
- Copier le Client ID généré (format: `XXXXX-YYYY...apps.googleusercontent.com`)

---

## 🎯 ÉTAPE 2: AJOUTER Authorized JavaScript Origins

1. Toujours dans **Credentials**, cliquer sur votre Client ID (Web application)
2. Section "Authorized JavaScript origins" (URIs pour d'où vos JS peut faire appels)
3. Cliquer **"+ ADD URI"**

Ajouter **EXACTEMENT CES 3 URLs** (une par une):

```
https://vidsparkpro.com
https://www.vidsparkpro.com
https://vidsparkai-au2.pages.dev
```

**À FAIRE:**
- [ ] `https://vidsparkpro.com` - Ajouter
- [ ] `https://www.vidsparkpro.com` - Ajouter
- [ ] `https://vidsparkai-au2.pages.dev` - Ajouter

**Vérification:** Après ajout, vous devriez voir 3 URLs listées.

---

## 🎯 ÉTAPE 3: AJOUTER Authorized Redirect URIs

1. Même page, section "Authorized redirect URIs" (URLs où user est redirigé après login Google)
2. Cliquer **"+ ADD URI"**

Ajouter **EXACTEMENT CES 6 URLs** (une par une):

```
https://vidsparkpro.com/login.html
https://www.vidsparkpro.com/login.html
https://vidsparkai-au2.pages.dev/login.html
https://vidsparkpro.com/
https://www.vidsparkpro.com/
https://vidsparkai-au2.pages.dev/
```

**À FAIRE:**
- [ ] `https://vidsparkpro.com/login.html` - Ajouter
- [ ] `https://www.vidsparkpro.com/login.html` - Ajouter
- [ ] `https://vidsparkai-au2.pages.dev/login.html` - Ajouter
- [ ] `https://vidsparkpro.com/` - Ajouter
- [ ] `https://www.vidsparkpro.com/` - Ajouter
- [ ] `https://vidsparkai-au2.pages.dev/` - Ajouter

**Vérification:** Après ajout, vous devriez voir 6 URLs listées.

---

## 💾 ÉTAPE 4: SAUVEGARDER

1. En bas de la page, cliquer **"SAVE"**
2. Vous verrez confirmation "Changes saved"

---

## ⏳ ÉTAPE 5: ATTENDRE Google Sync

**IMPORTANT:** Google prend 5-10 MINUTES pour synchroniser les changements

- Pendant ce temps, OAuth retournera toujours "The OAuth client was not found"
- C'est NORMAL - attendez simplement

**Chrono:** 
- 0-5 min: Configuration en cours
- 5-10 min: Changements synced
- 10+ min: Vous pouvez tester

---

## 🧪 ÉTAPE 6: TESTER LA CONFIGURATION

**Après 10 minutes d'attente:**

1. Aller à: https://vidsparkpro.com/login.html
2. Ouvrir Console (F12 → Console)
3. Voir logs:
   ```
   [GoogleAuth] CLIENT_ID USED: 665845815325-kguko2tbkji3e9ru9fopmi97qcb9qcvl...
   [GoogleAuth] ✅ CLIENT_ID validation passed
   ```
4. Cliquer le bouton **"Sign in with Google"**
5. **Devrait voir:** Popup Google officiel (pas erreur)
6. Se connecter avec votre compte Google
7. **Devrait rediriger vers:** Dashboard

**Si ça marche ✅:**
- Popup Google s'ouvre
- Vous pouvez vous connecter
- Pas "Error 401" ou "The OAuth client was not found"

**Si ça ne marche toujours pas ❌:**
- Attendre plus (peut prendre jusqu'à 15 min)
- Rafraîchir page (Ctrl+Shift+R hard refresh)
- Vider cache navigateur
- Vérifier URLs exactes (pas de typo)
- Vérifier Client ID correct dans js/auth.js

---

## 📋 CHECKLIST CONFIGURATION GOOGLE

**Vérification avant test:**

- [ ] Projet "VidSpark AI" sélectionné dans Google Cloud
- [ ] APIs & Services → Credentials accessible
- [ ] Client ID existe: `665845815325-kguko2tbkji3e9ru9fopmi97qcb9qcvl...`
- [ ] Type: "Web application"
- [ ] Authorized JavaScript Origins:
  - [ ] `https://vidsparkpro.com`
  - [ ] `https://www.vidsparkpro.com`
  - [ ] `https://vidsparkai-au2.pages.dev`
- [ ] Authorized Redirect URIs (6 URLs):
  - [ ] `https://vidsparkpro.com/login.html`
  - [ ] `https://www.vidsparkpro.com/login.html`
  - [ ] `https://vidsparkai-au2.pages.dev/login.html`
  - [ ] `https://vidsparkpro.com/`
  - [ ] `https://www.vidsparkpro.com/`
  - [ ] `https://vidsparkai-au2.pages.dev/`
- [ ] Changements SAVED dans Google Cloud
- [ ] Attendu 5-10 minutes
- [ ] Testé: Popup Google s'ouvre
- [ ] Testé: Login fonctionne (pas Error 401)

---

## 🔧 CONFIGURATION SUPPLÉMENTAIRE (OPTIONNEL)

### OAuth Consent Screen

Si vous voyez "This app isn't verified by Google", c'est normal pour développement.

Pour passer en production (optionnel):

1. Google Cloud Console → OAuth consent screen
2. User type: "External" (car app n'est pas officiel Google)
3. Remplir: App name, User support email, Developer contact
4. Scopes: Ajouter `openid`, `profile`, `email`
5. Test users: Ajouter votre email Google

---

## 🆘 PROBLÈMES COMMUNS

### Erreur: "Redirect URI mismatch"
**Cause:** URL ne correspond pas exactement  
**Solution:** Vérifier typo, protocole https:// (pas http://), pas de slash à la fin si pas présent

### Erreur: "The OAuth client was not found"
**Cause:** Authorized Origins pas configuré  
**Solution:** Ajouter les 3 JavaScript Origins (https://vidsparkpro.com, etc.)

### Erreur: "CORS error" en console
**Cause:** Frontend utilise localhost au lieu de vidsparkpro.com  
**Solution:** Vérifier js/auth.js a bon Client ID, vérifier site chargé depuis vidsparkpro.com

### Popup Google ne s'ouvre pas
**Cause:** Client ID incorrect ou Google Identity Services pas chargé  
**Solution:** Vérifier logs console, vérifier Client ID dans js/auth.js

### "This app isn't verified" warning
**Normal pour dev** - Cliquer "Continue" pour tester  
**Pour production:** Faire la vérification Google (voir section optionnelle)

---

## 📝 NOTES IMPORTANTES

1. **URLs doivent être en HTTPS** - `http://` ne fonctionne pas
2. **Client ID est public** - C'est OK de le mettre dans le code
3. **Changements prennent 5-10 min** - Pas instantané
4. **Cache peut être problématique** - Faire Ctrl+Shift+R (hard refresh)
5. **Chaque domaine a besoin d'une entry** - `vidsparkpro.com` ≠ `www.vidsparkpro.com`

---

## 📞 CONTACT GOOGLE SUPPORT

Si vous avez d'autres problèmes:

- Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
- Google Identity Services: https://developers.google.com/identity/gsi
- Google Cloud Support: https://cloud.google.com/support

---

## ✅ PROCHAINES ÉTAPES

Après configuration Google réussie:

1. Backend doit être déployé sur Railway (voir RAILWAY_DEPLOYMENT_SETUP.md)
2. Frontend URL mise à jour (admin/config.js)
3. Test end-to-end login + dashboard

---

**Guide créé:** 3 Juin 2026  
**Client ID:** `665845815325-kguko2tbkji3e9ru9fopmi97qcb9qcvl.apps.googleusercontent.com`  
**Temps estimé:** 15-20 minutes (incluant attente Google sync)
