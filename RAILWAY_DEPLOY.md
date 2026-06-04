# 🚀 Déployer VidSpark Backend sur Railway

## ÉTAPE 1: Aller sur Railway

1. Ouvre: https://railway.app
2. Connecte-toi avec ton compte
3. Clique "+ New Project"

---

## ÉTAPE 2: Connecter GitHub

1. Clique "Deploy from GitHub repo"
2. Sélectionne: `legrandmichelle571/vidspark-ai`
3. Railway va auto-détecter Node.js ✅

---

## ÉTAPE 3: Ajouter les Variables d'Environnement

Dans Railway, clique "Variables" et ajoute:

```
NODE_ENV=production
PORT=3001

SUPABASE_URL=https://fnhyskbisfbtjgblbiap.supabase.co
SUPABASE_ANON_KEY=sb_publishable_Eq1H3ObUnaRnRt-rVUx2Ng_8iKndXKZ
SUPABASE_SERVICE_KEY=[À RÉCUPÉRER DE SUPABASE]

JWT_SECRET=[GÉNÉRER: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
JWT_REFRESH_SECRET=[GÉNÉRER: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
JWT_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=604800

GOOGLE_CLIENT_ID=665845815325-kguko2tbkji3e9ru9fopmi97qcb9qcvl.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[À RÉCUPÉRER DE GOOGLE CLOUD]
GOOGLE_CALLBACK_URL=https://[RAILWAY_URL]/api/auth/google/callback

STRIPE_PUBLIC_KEY=pk_test_[TA_CLÉ]
STRIPE_SECRET_KEY=sk_test_[TA_CLÉ]
STRIPE_WEBHOOK_SECRET=whsec_test_[TA_CLÉ]
STRIPE_PRICE_PRO=price_[ID]
STRIPE_PRICE_BUSINESS=price_[ID]

OPENAI_API_KEY=sk-proj-[TA_CLÉ]
ANTHROPIC_API_KEY=sk-ant-[TA_CLÉ]
GEMINI_API_KEY=[TA_CLÉ]
DEEPSEEK_API_KEY=[TA_CLÉ]

FRONTEND_URL=https://vidsparkpro.com
```

---

## ÉTAPE 4: Déployer

1. Railway va auto-déployer
2. Attends que le déploiement soit "Success" ✅
3. Clique sur "Deployments"
4. Copie l'URL du projet (exemple: `https://vidspark-ai-...railway.app`)

---

## ÉTAPE 5: Mettre à Jour les URLs

Une fois que Railway te donne l'URL:

1. Va dans: `E:/extension pro/VidSpark-Site/admin/config.js`
2. Change `BACKEND_URL:` avec l'URL de Railway
3. Fais un commit et push

---

## ✅ Vérifier que Ça Marche

```
curl https://[RAILWAY_URL]/health
```

Doit retourner:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## ⚠️ Notes Importantes

- ⏱️ Le déploiement prend 5-10 minutes
- 🔄 Attends que Railway affiche "Success"
- 🌍 L'URL est automatique, pas besoin de configurer DNS
- 📝 Sauvegarde l'URL de Railway quelque part!

---

**Une fois l'URL reçue, dis-moi et je vais finaliser tout!** 🚀
