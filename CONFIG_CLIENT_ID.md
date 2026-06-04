# 🔐 Configuration Google OAuth Client ID

## 🚨 PROBLÈME CRITIQUE

Votre bouton "Se connecter avec Google" ne fonctionne pas parce que le **Client ID n'est pas configuré correctement**.

Actuellement, le Client ID hardcodé dans `js/auth.js` est un exemple fictif qui ne correspond pas à votre Google Cloud Console.

---

## ✅ SOLUTION

### Étape 1 : Obtenir votre Client ID réel

1. Allez à https://console.cloud.google.com
2. Sélectionnez votre projet VidSpark AI
3. Allez à **APIs & Services** → **Credentials**
4. Trouvez votre **OAuth 2.0 Client ID** (type : Web application)
5. **Copiez-le** (format : `12345-abcde.apps.googleusercontent.com`)

### Étape 2 : Mettre à jour `js/auth.js`

**Fichier :** `js/auth.js` ligne 96

**AVANT :**
```javascript
const clientId = '665845815325-ish73oi6ltps2urr8idt356hhmk21g8j.apps.googleusercontent.com';
```

**APRÈS :** Remplacez par votre CLIENT ID :
```javascript
const clientId = 'VOTRE_CLIENT_ID.apps.googleusercontent.com';
```

**Exemple :**
```javascript
const clientId = '123456789-abc123def456.apps.googleusercontent.com';
```

### Étape 3 : Tester

1. Sauvegardez le fichier
2. Rechargez login.html dans le navigateur (Ctrl+Shift+R pour forcer le reload)
3. Cliquez sur "Se connecter avec Google"
4. Un popup Google doit s'ouvrir

---

## 🐛 Problèmes Résolus

| Problème | Statut |
|----------|--------|
| Références `submitButton` null | ✅ CORRIGÉ |
| Client ID hardcodé incorrect | ✅ À FAIRE (voir ci-dessus) |
| Erreur Error 400 Google | ✅ Sera résolu quand vous ajoutez votre Client ID |

---

## 📋 Checklist

- [ ] Allez à Google Cloud Console
- [ ] Trouvez votre OAuth 2.0 Client ID
- [ ] Mettez-le à jour dans `js/auth.js` ligne 96
- [ ] Rechargez login.html (Ctrl+Shift+R)
- [ ] Cliquez le bouton "Se connecter avec Google"
- [ ] Un popup Google doit s'ouvrir ✓

---

## 🆘 Si ça ne marche pas...

### Erreur : "Google Identity Services not loaded"
→ Attendez quelques secondes que Google se charge, puis réessayez

### Erreur : "Error 400: invalid_request"
→ Votre Client ID est incorrect ou les URLs ne sont pas enregistrées dans Google Cloud Console
→ Voir `GOOGLE_OAUTH_CONFIG.md` pour ajouter les URLs

### Popup Google ne s'affiche pas
1. Ouvrez la console (F12)
2. Cherchez les erreurs rouges
3. Vérifiez que le Client ID est correct
4. Vérifiez que le script Google charge

---

**Date :** 2 juin 2026  
**Problème identifié :** Google OAuth ne fonctionne pas  
**Action :** Mettez à jour le Client ID dans `js/auth.js`
