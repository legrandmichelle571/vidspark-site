# 📋 Checklist Credentials - À Remplir

## 🔐 SUPABASE

**URL du Dashboard:** https://supabase.com/dashboard/project/fnhyskbisfbtjgblbiap

### À Récupérer:

**SUPABASE_SERVICE_KEY:**
1. Va sur: Supabase Dashboard
2. Clique "Settings → API"
3. Cherche "service_role secret"
4. Copie la clé

```
SUPABASE_SERVICE_KEY = [COPIE LA CLÉ ICI]
```

---

## 💳 STRIPE

**URL du Dashboard:** https://dashboard.stripe.com/acct_1TdfmsDrjmVkL2UD/test/dashboard

### À Récupérer:

**STRIPE_SECRET_KEY:**
1. Va sur: Stripe → Developers → API Keys
2. Copie "Secret key"

```
STRIPE_SECRET_KEY = sk_test_[COPIE_ICI]
```

**STRIPE_PUBLIC_KEY:**
1. Même page, copie "Publishable key"

```
STRIPE_PUBLIC_KEY = pk_test_[COPIE_ICI]
```

**STRIPE_WEBHOOK_SECRET:**
1. Va sur: Stripe → Developers → Webhooks
2. Cherche le webhook `/api/webhooks/stripe`
3. Copie "Signing secret"

```
STRIPE_WEBHOOK_SECRET = whsec_test_[COPIE_ICI]
```

**STRIPE_PRICE_PRO & STRIPE_PRICE_BUSINESS:**
1. Va sur: Stripe → Products
2. Clique sur "VidSpark Pro"
3. Copie le "Price ID" (commence par `price_`)

```
STRIPE_PRICE_PRO = price_[COPIE_ICI]
STRIPE_PRICE_BUSINESS = price_[COPIE_ICI]
```

---

## 🔵 GOOGLE CLOUD

**URL du Dashboard:** https://console.cloud.google.com/apis/credentials?project=vidspark-ai-v4

### À Récupérer:

**GOOGLE_CLIENT_SECRET:**
1. Va sur: Google Cloud → Credentials
2. Clique sur le Client OAuth "VidSpark Web"
3. Copie "Client secret"

```
GOOGLE_CLIENT_SECRET = GOCSPX_[COPIE_ICI]
```

---

## 🤖 AI SERVICES

### OpenAI

**OPENAI_API_KEY:**
1. Va sur: https://platform.openai.com/api-keys
2. Crée une nouvelle clé (ou copie une existante)
3. Copie la clé

```
OPENAI_API_KEY = sk-proj-[COPIE_ICI]
```

### Claude (Anthropic)

**ANTHROPIC_API_KEY:**
1. Va sur: https://console.anthropic.com/account/keys
2. Crée une nouvelle clé
3. Copie la clé

```
ANTHROPIC_API_KEY = sk-ant-[COPIE_ICI]
```

### Gemini (Google)

**GEMINI_API_KEY:**
1. Va sur: https://makersuite.google.com/app/apikey
2. Crée une nouvelle clé
3. Copie la clé

```
GEMINI_API_KEY = [COPIE_ICI]
```

### DeepSeek

**DEEPSEEK_API_KEY:**
1. Va sur: https://platform.deepseek.com/api/keys
2. Crée une nouvelle clé
3. Copie la clé

```
DEEPSEEK_API_KEY = [COPIE_ICI]
```

---

## 📝 Formulaire à Remplir

Une fois que tu as toutes les clés, copie-colle ci-dessous:

```
SUPABASE_URL = https://fnhyskbisfbtjgblbiap.supabase.co
SUPABASE_ANON_KEY = sb_publishable_Eq1H3ObUnaRnRt-rVUx2Ng_8iKndXKZ
SUPABASE_SERVICE_KEY = [À REMPLIR]

GOOGLE_CLIENT_ID = 665845815325-kguko2tbkji3e9ru9fopmi97qcb9qcvl.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = [À REMPLIR]

STRIPE_PUBLIC_KEY = [À REMPLIR]
STRIPE_SECRET_KEY = [À REMPLIR]
STRIPE_WEBHOOK_SECRET = [À REMPLIR]
STRIPE_PRICE_PRO = [À REMPLIR]
STRIPE_PRICE_BUSINESS = [À REMPLIR]

OPENAI_API_KEY = [À REMPLIR]
ANTHROPIC_API_KEY = [À REMPLIR]
GEMINI_API_KEY = [À REMPLIR]
DEEPSEEK_API_KEY = [À REMPLIR]
```

---

## ✅ Checklist

- [ ] SUPABASE_SERVICE_KEY récupérée
- [ ] STRIPE_SECRET_KEY récupérée
- [ ] STRIPE_PUBLIC_KEY récupérée
- [ ] STRIPE_WEBHOOK_SECRET récupérée
- [ ] STRIPE_PRICE_PRO récupérée
- [ ] STRIPE_PRICE_BUSINESS récupérée
- [ ] GOOGLE_CLIENT_SECRET récupérée
- [ ] OPENAI_API_KEY récupérée
- [ ] ANTHROPIC_API_KEY récupérée
- [ ] GEMINI_API_KEY récupérée
- [ ] DEEPSEEK_API_KEY récupérée

---

**Une fois tout rempli, dis-moi et je vais configurer Railway!** 🚀
