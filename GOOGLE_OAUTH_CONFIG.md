# 🔐 Guide Configuration Google OAuth - VidSpark AI

**Status :** ⚠️ À configurer  
**Error Current :** `400: invalid_request` Access Denied: Authorization error  
**Root Cause :** URLs manquantes dans Google Cloud Console

---

## 🚨 Problème Identifié

Quand l'utilisateur clique "Se connecter avec Google" sur **https://vidsparkpro.com**, Google retourne :
```
Error 400: invalid_request
Access Denied: Authorization error
```

**Cause :** Votre Client ID n'a pas les Origins et Redirect URIs correctement configurées dans Google Cloud Console.

---

## ✅ Solution : Configuration Complète

### ÉTAPE 1 : Accéder à Google Cloud Console

1. Allez à **https://console.cloud.google.com**
2. Sélectionnez votre projet VidSpark AI
3. Allez à **APIs & Services** → **Credentials**
4. Trouvez votre OAuth 2.0 Client ID (type : Web application)

---

### ÉTAPE 2 : Ajouter les URLs pour vidsparkpro.com

Cliquez sur votre Client ID pour l'éditer.

#### **Authorized JavaScript Origins**

Ajoutez EXACTEMENT ces deux URLs :
```
https://vidsparkpro.com
https://www.vidsparkpro.com
```

#### **Authorized Redirect URIs**

Ajoutez EXACTEMENT ces URLs (dans cet ordre) :
```
https://vidsparkpro.com/login.html
https://www.vidsparkpro.com/login.html
https://vidsparkpro.com/
https://www.vidsparkpro.com/
```

**Cliquez "Save"**

---

### ÉTAPE 3 : Ajouter les URLs pour Cloudflare Pages

En plus des URLs vidsparkpro.com, ajoutez aussi :

#### **Authorized JavaScript Origins** (ajouter à la liste existante)

```
https://vidspark.pages.dev
https://vidsparkpro.pages.dev
```

#### **Authorized Redirect URIs** (ajouter à la liste existante)

```
https://vidspark.pages.dev/login.html
https://vidsparkpro.pages.dev/login.html
https://vidspark.pages.dev/
https://vidsparkpro.pages.dev/
```

**Cliquez "Save"**

---

### ÉTAPE 4 : Vérifier le Client ID dans le code

Ouvrez **`js/auth.js`** et trouvez cette ligne :

```javascript
const GOOGLE_CLIENT_ID = 'VOTRE_CLIENT_ID.apps.googleusercontent.com';
```

Le `VOTRE_CLIENT_ID` doit correspondre exactement à l'ID dans Google Cloud Console.

**Exemple correct :**
```javascript
const GOOGLE_CLIENT_ID = '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';
```

Si vous ne trouvez pas le Client ID, retournez à Google Cloud Console → Credentials et copiez-le depuis votre OAuth 2.0 Web client.

---

### ÉTAPE 5 : Configuration OAuth Consent Screen

1. Dans Google Cloud Console, allez à **OAuth consent screen**
2. Complétez les informations :

| Champ | Valeur |
|-------|--------|
| Application name | `VidSpark AI` |
| User support email | `support@vidspark.ai` |
| Scopes | Sélectionnez : `openid`, `profile`, `email` |
| Authorized domains | `vidsparkpro.com` |
| Developer contact | `dev@vidspark.ai` |

3. **Cliquez "Save and Continue"**

---

### ÉTAPE 6 : Vérifier le Mode (Test vs Production)

**Option A : Mode Test** (pendant le développement)
- Cliquez "Add users" et entrez les emails des testeurs
- Les seuls utilisateurs acceptés seront ceux listés
- ✓ Rapide à tester

**Option B : Mode Production** (pour le lancement)
- Assurez-vous que votre app est vérifiée par Google (peut prendre 24-48h)
- Supprimez les restrictions de test users
- Tous les utilisateurs Gmail peuvent se connecter
- ✓ Prêt pour la production

**Recommandation :** Restez en Mode Test maintenant, passez à Production avant le lancement public.

---

## 🧪 Test : Vérifier que tout fonctionne

### Test 1 : Local (localhost:3000)
Si vous testez en local, assurez-vous que `http://localhost:3000` EST AJOUTÉ :

```
http://localhost:3000/login.html
http://localhost:3000/
```

(Note: utilisez `http://` pour localhost, pas `https://`)

### Test 2 : Live (vidsparkpro.com)
1. Allez à **https://vidsparkpro.com/login.html**
2. Cliquez "Se connecter avec Google"
3. Vous devriez voir le popup Google login
4. Après authentification, vous devriez être redirigé vers le dashboard

### Test 3 : Cloudflare Pages
1. Allez à **https://vidspark.pages.dev/login.html**
2. Même processus que ci-dessus
3. Devrait fonctionner identiquement

---

## ❌ Dépannage

### Erreur : "Redirect URI mismatch"
**Cause :** L'URL dans le code ne correspond pas à celle enregistrée dans Google Cloud.  
**Solution :** Vérifiez que votre `GOOGLE_CLIENT_ID` et les Redirect URIs correspondent exactement.

### Erreur : "Invalid client"
**Cause :** Le Client ID dans le code est incorrect ou n'existe pas.  
**Solution :** Copiez-collez directement depuis Google Cloud Console.

### Erreur : "Access Denied: Authorization error"
**Cause :** JavaScript Origins ou Redirect URIs manquantes.  
**Solution :** Refaites les étapes 2 et 3 ci-dessus, puis attendez 5-10 minutes que Google synchronise les changements.

### Popup Google ne s'affiche pas du tout
**Cause :** Possible problème de bloc popup ou script bloqué.  
**Solution :**
1. Ouvrez la console navigateur (F12)
2. Cherchez les erreurs rouges
3. Vérifiez que `js/auth.js` charge correctement
4. Vérifiez que le Client ID n'est pas vide

---

## 📋 Checklist Finale

- [ ] Allez à Google Cloud Console
- [ ] Trouvez votre OAuth 2.0 Client ID
- [ ] Ajoutez les Origins et Redirect URIs pour vidsparkpro.com
- [ ] Ajoutez les Origins et Redirect URIs pour *.pages.dev
- [ ] Vérifiez le Client ID dans `js/auth.js`
- [ ] Configurez OAuth Consent Screen
- [ ] Testez sur localhost (si en développement)
- [ ] Testez sur https://vidsparkpro.com/login.html
- [ ] Testez sur https://vidspark.pages.dev/login.html
- [ ] Tout fonctionne ? ✅

---

## 📧 Support

Si vous avez toujours des problèmes après avoir suivi ce guide :

1. **Vérifiez les logs** : Ouvrez la console navigateur (F12) et cherchez les erreurs
2. **Attendez 5-10 minutes** : Google met du temps à synchroniser les changements
3. **Videz le cache** : Faites un hard refresh (Ctrl+Shift+R)
4. **Créez un nouveau Client ID** : Parfois il faut recommencer de zéro

---

**Dernière mise à jour :** 2 juin 2026  
**Pour :** VidSpark AI SaaS
