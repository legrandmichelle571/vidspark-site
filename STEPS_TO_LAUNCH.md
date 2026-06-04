# 🚀 ÉTAPES POUR LANCER VIDSPARK - ORDRE EXACT

**Suis ces étapes dans cet ordre EXACT!**

---

## 🟢 ÉTAPE 1: Google OAuth (3 min)

**Fichier:** `GOOGLE_OAUTH_FINAL.md`

1. Ouvre Google Cloud Console
2. Ajoute 2 URIs manquantes
3. Clique SAVE
4. ATTENDS 5 minutes
5. Teste sur `google-oauth-test.html`

**STATUS:** ⏳ À faire

---

## 🟡 ÉTAPE 2: Récupérer les Credentials (10 min)

**Fichier:** `CREDENTIALS_CHECKLIST.md`

1. Va sur Supabase → Récupère `SUPABASE_SERVICE_KEY`
2. Va sur Stripe → Récupère `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`
3. Va sur Stripe → Récupère `STRIPE_PRICE_PRO`, `STRIPE_PRICE_BUSINESS`
4. Va sur Google Cloud → Récupère `GOOGLE_CLIENT_SECRET`
5. Va sur OpenAI/Claude/Gemini/DeepSeek → Récupère les clés API

**Remplis le formulaire dans le fichier**

**STATUS:** ⏳ À faire

---

## 🔴 ÉTAPE 3: Déployer sur Railway (5 min)

**Fichier:** `RAILWAY_DEPLOY.md`

1. Va sur https://railway.app
2. Clique "+ New Project"
3. Connecte GitHub repo: `legrandmichelle571/vidspark-ai`
4. Ajoute TOUTES les variables d'environnement (utilise les credentials de l'étape 2)
5. Attends que le déploiement soit "Success" ✅
6. **Copie l'URL de Railway** (exemple: `https://vidspark-ai-...railway.app`)

**STATUS:** ⏳ À faire

---

## 🟠 ÉTAPE 4: Mettre à Jour les URLs du Site (2 min)

Une fois que Railway te donne l'URL:

1. Ouvre: `E:/extension pro/VidSpark-Site/admin/config.js`
2. Change: `BACKEND_URL: 'https://vidspark-ai-...railway.app'`
3. Mets l'URL de Railway à la place
4. Enregistre et commit

**STATUS:** ⏳ À faire

---

## 🟣 ÉTAPE 5: Tester Tout (5 min)

1. Teste l'API:
   ```
   curl https://[RAILWAY_URL]/health
   ```

2. Teste le login:
   - Va sur `https://vidsparkpro.com/login`
   - Clique "Se connecter avec Google"
   - Ça doit marcher! ✅

3. Teste l'extension:
   - Ouvre ton extension VidSpark
   - Connecte-toi
   - Ça doit fonctionner! ✅

**STATUS:** ⏳ À faire

---

## 📊 RÉSUMÉ

| Étape | Durée | Status |
|-------|-------|--------|
| 1. Google OAuth | 3 min | ⏳ À faire |
| 2. Credentials | 10 min | ⏳ À faire |
| 3. Railway Deploy | 5 min | ⏳ À faire |
| 4. URLs du Site | 2 min | ⏳ À faire |
| 5. Test Final | 5 min | ⏳ À faire |
| **TOTAL** | **25 min** | ⏳ À faire |

---

## 🎯 ENSUITE

Une fois que tout est fait:
- ✅ Site marche
- ✅ Extension marche
- ✅ Backend marche
- ✅ Google OAuth marche
- ✅ Utilisateurs peuvent se connecter
- ✅ Utilisateurs peuvent analyser les vidéos

**C'est LANCÉ!** 🚀

---

## 💬 Questions?

Si tu bloques quelque part, dis-moi:
1. Sur quelle étape tu es
2. Quel message d'erreur tu vois
3. Je vais corriger! ⚡

---

**COMMENÇONS!** 🔥

Va faire l'étape 1 maintenant! (Lire `GOOGLE_OAUTH_FINAL.md`)
