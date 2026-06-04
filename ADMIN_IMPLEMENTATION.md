# 🛠️ ADMIN IMPLEMENTATION — Plan Détaillé

**Status:** ✅ PHASE 1: Backend + Client JS complétés  
**Date:** 2026-06-01

---

## ✅ **PHASE 1 COMPLÉTÉE: Backend Admin API + Client JS**

### **Backend Endpoints** (18 endpoints)
```
✅ GET  /api/admin/stats
✅ GET  /api/admin/users
✅ GET  /api/admin/users/:id
✅ PUT  /api/admin/users/:id/plan
✅ PUT  /api/admin/users/:id/status
✅ DELETE /api/admin/users/:id
✅ GET  /api/admin/subscriptions
✅ POST /api/admin/subscriptions/:id/extend
✅ POST /api/admin/subscriptions/:id/cancel
✅ GET  /api/admin/channels
✅ GET  /api/admin/channels/:userId
✅ DELETE /api/admin/channels/:id
✅ GET  /api/admin/quotas
✅ POST /api/admin/quotas/:userId/reset
✅ GET  /api/admin/payments
✅ POST /api/admin/payments/:id/refund
✅ GET  /api/admin/plans
✅ POST /api/admin/plans (+ PUT, DELETE)
✅ GET  /api/admin/logs
✅ GET  /api/admin/revenue
```

### **Authentification Admin** ✅
- ✅ Middleware `requireAdmin` (super_admin + admin)
- ✅ Middleware `requireRole(...)` pour rôles spécifiques
- ✅ Vérification rôle sur tous endpoints
- ✅ Logging automatique des actions admin

### **Client Admin JavaScript** ✅
- ✅ `admin/api.js` — Client API (19 méthodes)
- ✅ `admin/admin.js` — Logique (navigation, helpers, actions)
- ✅ Navigation sidebar (9 pages)
- ✅ Helpers: format date, currency, percent, badges
- ✅ Actions: changePlan, setStatus, showChannels, refundPayment
- ✅ Pagination, debounce, loader

### **Test Script** ✅
- ✅ `backend/test-admin-api.js` — Tester endpoints
- Usage: `ADMIN_TOKEN="token" node test-admin-api.js`

---

## 📋 **PHASE 2: MODIFIER PAGES EXISTANTES**

### **Tâches à faire:**

#### **1. index.html — Dashboard** 
- [ ] Charger stats réelles via `AdminAPI.getStats()`
- [ ] Afficher utilisateurs par plan (FREE/PRO/BUSINESS)
- [ ] Afficher revenu MRR/ARR
- [ ] Afficher utilisateurs actifs (7j)
- [ ] Ajouter Chart.js avec 6 graphiques:
  - [ ] Utilisateurs totaux (ligne)
  - [ ] Distribution plans (pie)
  - [ ] Revenus mensuels (bar)
  - [ ] Revenus annuels (bar)
  - [ ] Utilisation IA (gauge)
  - [ ] Utilisateurs actifs (ligne)

#### **2. users.html — Gestion Utilisateurs**
- [ ] Charger utilisateurs via `AdminAPI.getUsers()`
- [ ] Ajouter colonne "Actions"
- [ ] Actions par user:
  - [ ] 👁️ Voir détails (modale ou page)
  - [ ] ⬆️ Upgrade plan (dropdown: free→pro→business)
  - [ ] ⬇️ Downgrade plan
  - [ ] 🚫 Suspendre (suspend)
  - [ ] ✓ Réactiver (active)
  - [ ] 🔗 Voir chaînes YouTube (modale)
  - [ ] 🗑️ Supprimer
- [ ] Afficher usage quota pour chaque user
- [ ] Filtres améliorés (search, plan, status, quota%)

#### **3. payments.html — Paiements**
- [ ] Charger paiements via `AdminAPI.getPayments()`
- [ ] Ajouter colonne "Actions"
- [ ] Actions par paiement:
  - [ ] 💰 Rembourser (refund avec raison)
  - [ ] 🔁 Réessayer (retry)
  - [ ] 📄 Voir détails
- [ ] Afficher total $ par période
- [ ] Filtres améliorés (status, provider, date)

#### **4. stats.html — Graphiques**
- [ ] Ajouter Chart.js
- [ ] Charger données via `AdminAPI.getStats()`
- [ ] 6 graphiques:
  - [ ] Users growth (7d, 30d, 90d)
  - [ ] Plan distribution (pie)
  - [ ] Revenue trend (line)
  - [ ] Usage distribution (bar)
  - [ ] Churn rate (gauge)
  - [ ] Daily active users (area)

#### **5. logs.html — Logs Admin**
- [ ] Charger logs via `AdminAPI.getLogs()`
- [ ] Afficher: admin email, action, target user, timestamp
- [ ] Filtres: action type, date range

---

## 🆕 **PHASE 3: CRÉER NOUVELLES PAGES** (5 pages)

### **subscriptions.html**
```
Table:
  - User
  - Plan
  - Start Date
  - Expiry Date
  - Status
  - Auto-renew
  - Actions (extend 30d, cancel)
```

### **channels.html**
```
Table:
  - User
  - Channel ID
  - Channel Name
  - Google Owner
  - Added Date
  - Status
  - Actions (remove)

Stats:
  - Total channels
  - Channels per user (avg)
  - Distribution by plan
```

### **quotas.html**
```
Table:
  - User
  - Plan
  - Monthly Usage
  - Limit
  - Usage %
  - Days Left
  - Actions (reset)

Stats:
  - Heavy users (90%+ usage)
  - Upcoming limit hits
  - Quota resets timeline
```

### **plans.html**
```
Cards pour chaque plan:
  - Plan name
  - Price (monthly/yearly)
  - Limits:
    - monthly_analyses
    - monthly_reports
    - monthly_titles
    - max_channels
  - Actions (edit, duplicate, delete)

Form pour créer/edit plan:
  - name
  - price_monthly
  - price_yearly
  - limits JSON
```

### **settings.html**
```
Sections:
  - Stripe (test/live keys)
  - Google OAuth (client ID)
  - Webhook settings (secret)
  - Email notifications
  - Maintenance mode
  - System settings
```

---

## 🎨 **CSS Updates Nécessaires**

Ajouter à `admin.css`:
```css
/* Badges */
.badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge-free { background: rgba(34,197,94,.1); color: #22c55e; }
.badge-pro { background: rgba(124,109,250,.1); color: #7c6dfa; }
.badge-business { background: rgba(34,197,94,.1); color: #22c55e; }
.badge-success { background: rgba(34,197,94,.1); color: #22c55e; }
.badge-danger { background: rgba(239,68,68,.1); color: #ef4444; }
.badge-warning { background: rgba(245,158,11,.1); color: #f59e0b; }

/* Action buttons */
.action-btn { padding: 6px 12px; font-size: 12px; margin: 0 2px; }
.action-btn-small { padding: 4px 8px; font-size: 11px; }

/* Tables avec actions */
table td:last-child { text-align: center; white-space: nowrap; }
```

---

## 📦 **Dépendances à Ajouter**

### **Chart.js**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

### **Moment.js** (optionnel, pour dates)
```html
<script src="https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js"></script>
```

---

## 🚀 **Étapes à Suivre (dans l'ordre)**

### **1. Vérifier Backend** (URGENT)
```bash
# Lancer backend
npm start

# Tester endpoints
ADMIN_TOKEN="votre-token" node backend/test-admin-api.js
```

### **2. Améliorer pages existantes** (3 pages)
- [ ] index.html + Chart.js
- [ ] users.html + actions
- [ ] payments.html + actions

### **3. Créer nouvelles pages** (5 pages)
- [ ] subscriptions.html
- [ ] channels.html
- [ ] quotas.html
- [ ] plans.html
- [ ] settings.html

### **4. Tests et debugging**
- [ ] Tester chaque action
- [ ] Tester authentification admin
- [ ] Tester erreurs (404, 403, etc)

### **5. Déploiement**
- [ ] Environnement test
- [ ] Environnement production

---

## 📊 **Métrique de Succès**

- ✅ Tous endpoints testés et opérationnels
- ✅ Toutes pages chargent vraies données
- ✅ Authentification admin en place
- ✅ Toutes actions CRUD fonctionnent
- ✅ Graphiques Chart.js affichés
- ✅ Logging des actions admin
- ✅ Interface responsive
- ✅ Gestion d'erreurs complète

---

## 📝 **Notes Importantes**

1. **Pas de données mockées** — Toutes les données viennent du backend API
2. **Authentification requise** — Bearer token pour chaque requête
3. **Logging automatique** — Chaque action admin loggée
4. **Rôles supportés** — super_admin, admin, support
5. **Tests réguliers** — Utiliser test-admin-api.js avant chaque déploiement

---

**Next Step:** Vérifier les endpoints backend et commencer Phase 2 (améliorer pages existantes)
