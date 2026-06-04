# 🔐 Configuration Google OAuth pour VidSpark AI

**Status:** ❌ Erreur 401: invalid_client  
**Solution:** Configuration manquante dans Google Cloud Console

---

## 🎯 Ce Qu'Il Faut Faire

### **Étape 1: Aller à Google Cloud Console**

1. Ouvre: https://console.cloud.google.com/apis/credentials
2. Connecte-toi avec ton compte Google (legrandmichelle571@gmail.com)

---

### **Étape 2: Trouver le Client OAuth**

1. Dans le menu "Credentials" (à gauche)
2. Tu dois voir un client appelé "VidSpark AI" ou "665845815325-..."
3. **Clique dessus pour l'éditer**

---

### **Étape 3: Ajouter les Origins JavaScript**

Dans la section **"Authorized JavaScript origins"**:

**Supprime:**
- ❌ Tout ce qui dit `localhost`
- ❌ Tout ce qui est incorrect

**Ajoute SEULEMENT:**
```
https://vidsparkpro.com
https://www.vidsparkpro.com
```

Étapes:
1. Clique sur **"+ Add URI"**
2. Colle: `https://vidsparkpro.com`
3. Clique sur **"+ Add URI"** à nouveau
4. Colle: `https://www.vidsparkpro.com`
5. ✅ Laisse le reste vide
6. Clique **"SAVE"**

---

### **Étape 4: Ajouter les Redirect URIs**

Dans la section **"Authorized redirect URIs"**:

**Supprime:**
- ❌ Tout ce qui dit `localhost`
- ❌ Tout ce qui est incorrect

**Ajoute SEULEMENT:**
```
https://vidsparkpro.com/login.html
https://vidsparkpro.com
https://www.vidsparkpro.com/login.html
https://www.vidsparkpro.com
```

Étapes:
1. Clique sur **"+ Add URI"**
2. Colle: `https://vidsparkpro.com/login.html`
3. Clique sur **"+ Add URI"**
4. Colle: `https://vidsparkpro.com`
5. Clique sur **"+ Add URI"**
6. Colle: `https://www.vidsparkpro.com/login.html`
7. Clique sur **"+ Add URI"**
8. Colle: `https://www.vidsparkpro.com`
9. Clique **"SAVE"**

---

### **Étape 5: Vérifier le Client ID**

Dans la même page, tu dois voir ton **Client ID**:

```
665845815325-kguko2tbkji3e9ru9fopmi97qcb9qcvl.apps.googleusercontent.com
```

**Copie-le et conserve-le**, c'est important!

---

### **Étape 6: TRÈS IMPORTANT - Attendre**

⏱️ **ATTENDS 5-10 MINUTES**

Google prend du temps pour appliquer les changements!

---

### **Étape 7: Tester**

1. Ouvre: https://vidsparkpro.com/login
2. Clique sur **"Se connecter"**
3. Clique sur **"Se connecter avec Google"**
4. Ça devrait afficher un popup Google ✅

---

## ❓ Si Ça Ne Marche Pas

### **Erreur: "The OAuth client was not found"**

**Vérifier:**
1. ✅ Tu as bien cliqué sur **SAVE** après ajouter les URLs?
2. ✅ Tu as bien attendu 5-10 minutes?
3. ✅ Les URLs n'ont pas de typo? (https, pas http)
4. ✅ Tu utilises bien vidsparkpro.com?

### **Erreur: "Origin mismatch"**

**Vérifier:**
1. ✅ L'URL que tu utilises (vidsparkpro.com) est dans "Authorized JavaScript origins"?
2. ✅ Pas de typo dans l'URL?

### **Erreur: "Redirect URI mismatch"**

**Vérifier:**
1. ✅ `/login.html` est dans "Authorized redirect URIs"?
2. ✅ L'URL exacte que Google redirige est dans la liste?

---

## 🔧 Si Toujours Pas de Solution

**Contacter Google Cloud Support:**
1. Ouvre Google Cloud Console
2. Clique sur le "?" en bas à droite
3. Clique sur **"Create a Case"**
4. Explique l'erreur OAuth
5. Ils vont te dire exactement quoi corriger

---

## ✅ Checklist Finale

Avant de tester:
- [ ] J'ai accès à Google Cloud Console
- [ ] J'ai trouvé le client OAuth "VidSpark AI"
- [ ] J'ai ajouté `https://vidsparkpro.com` aux JavaScript origins
- [ ] J'ai ajouté `https://www.vidsparkpro.com` aux JavaScript origins
- [ ] J'ai ajouté `https://vidsparkpro.com/login.html` aux Redirect URIs
- [ ] J'ai ajouté `https://vidsparkpro.com` aux Redirect URIs
- [ ] J'ai ajouté `https://www.vidsparkpro.com/login.html` aux Redirect URIs
- [ ] J'ai ajouté `https://www.vidsparkpro.com` aux Redirect URIs
- [ ] J'ai cliqué sur **SAVE**
- [ ] J'ai attendu 5-10 minutes
- [ ] J'ai testé le login
- [ ] ✅ Ça marche!

---

## 📞 Besoin d'Aide?

Si tu as une erreur ou une question:
1. **Screenshot** la page d'erreur Google
2. **Screenshot** la page Google Cloud Console
3. Dis-moi exactement:
   - Quelle URL tu utilises (vidsparkpro.com?)
   - Quel message d'erreur tu reçois
   - Quel navigateur tu utilises

---

**Une fois que tu cliques sur "Save", c'est tout! ✅**

Vas-y! 🚀
