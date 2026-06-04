# 🔐 Google OAuth - Configuration FINALE (3 min)

**Tu es presque au finish! Juste 3 étapes!**

---

## ✅ ÉTAPE 1: Ouvre Google Cloud Console

```
https://console.cloud.google.com/apis/credentials?project=vidspark-ai-v4
```

---

## ✅ ÉTAPE 2: Clique sur "VidSpark Web"

C'est le client OAuth avec:
- Type: Application Web
- Créé: 3 juin 2026

---

## ✅ ÉTAPE 3: Ajoute les 2 URIs Manquantes

### Dans "Authorized redirect URIs":

**Ajoute SEULEMENT ces 2:**
```
https://vidsparkpro.com
https://www.vidsparkpro.com
```

Les autres sont déjà là! ✅

### Comment:
1. Clique "+ Add URI"
2. Colle: `https://vidsparkpro.com`
3. Clique "+ Add URI"
4. Colle: `https://www.vidsparkpro.com`
5. Clique **SAVE** en bas

---

## ⏱️ ÉTAPE 4: ATTENDS 5 Minutes

Google applique les changements lentement!

---

## 🧪 ÉTAPE 5: Teste

```
https://vidsparkpro.com/google-oauth-test.html
```

Doit afficher: **✅ Google OAuth prêt!**

---

## 🎯 C'EST TOUT!

Une fois que tu as fait ça, dis-moi et je vais:
1. Déployer le backend sur Railway
2. Mettre à jour toutes les URLs
3. Tester que tout marche

---

**FAIS-LE MAINTENANT!** ⏱️

(Message-moi quand c'est fait!)
