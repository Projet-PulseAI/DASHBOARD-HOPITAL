# ⚡ SOLUTION IMMÉDIATE - HTTP 500 Database Error

## 🎯 Le Problème

Supabase retourne **HTTP 500** lors de `auth.signUp()`, ce qui signifie qu'un **trigger, hook, ou contrainte** empêche la création de l'utilisateur au niveau de la base de données.

---

## 🚨 SOLUTION RAPIDE (5 minutes)

### Option 1: Désactiver les Auth Hooks (RECOMMANDÉ)

1. **Allez sur Supabase Dashboard**:
   ```
   https://supabase.com/dashboard/project/fedjjdspntrxaqfzflao
   ```

2. **Navigation**:
   ```
   Authentication → Hooks
   ```

3. **Vérifiez et désactivez TOUS les hooks**:
   - [ ] Custom Access Token Hook
   - [ ] Send SMS Hook  
   - [ ] Send Email Hook
   - [ ] MFA Verification Hook

4. **Sauvegardez** les changements

---

### Option 2: Exécuter le Script de Nettoyage

1. **Ouvrez**: `dashboard-react/supabase/URGENT_FIX.sql`

2. **Copiez TOUT** le contenu

3. **Supabase Dashboard** → **SQL Editor** → **New Query**

4. **Collez** et **Run** ▶️

5. **Vérifiez les résultats**:
   - Ligne 1-15: Liste des triggers trouvés
   - Ligne 17-30: Fonctions trouvées
   - Ligne 32-40: Suppressions effectuées

---

### Option 3: Vérifier la Configuration Email

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Email**

2. **Vérifiez**:
   - ✅ "Enable Email provider" = **COCHÉ**
   - ✅ "Confirm email" = **DÉCOCHÉ** (très important!)
   - ✅ "Secure email change" = **DÉCOCHÉ** (pour tests)

3. **Sauvegardez**

---

### Option 4: Vérifier les Email Templates

1. **Supabase Dashboard** → **Authentication** → **Email Templates**

2. **Vérifiez** que les templates sont **valides** et **ne contiennent pas d'erreurs**

3. Particulièrement le template **"Confirm signup"**

---

## 🔍 DIAGNOSTIC AVANCÉ

### Voir les Logs Détaillés

1. **Supabase Dashboard** → **Logs** → **Auth Logs**

2. **Filtrez par**:
   - Time: Dernières 15 minutes
   - Level: Error
   - Event: signup

3. **Cherchez** le message d'erreur exact qui cause le HTTP 500

---

## 🧪 TEST ALTERNATIF - Création Manuelle

### Tester si le problème vient de l'Auth ou de la DB:

1. **Supabase Dashboard** → **Authentication** → **Add user** (bouton en haut)

2. **Créez un utilisateur manuellement**:
   - Email: `test-manual@hospital.com`
   - Password: `Test1234!`
   - Auto Confirm User: **COCHÉ**

3. **Si la création réussit**:
   ✅ Le problème ne vient PAS de la DB
   ❌ Le problème vient du processus de signup programmatique

4. **Si la création échoue**:
   ❌ Le problème vient d'un trigger/contrainte sur `auth.users`

---

## 🛠️ SOLUTION DE CONTOURNEMENT

Si rien ne fonctionne, utilisez cette approche temporaire:

### 1. Créer les utilisateurs manuellement

Dans Supabase Dashboard → Authentication → Add user:
- Email: Celui que vous voulez
- Password: Celui que vous voulez
- ✅ Auto Confirm User

### 2. Modifier le code pour utiliser uniquement signIn

Commentez temporairement le signup dans votre app et utilisez uniquement le login avec les comptes créés manuellement.

### 3. Créer l'hôpital via le Dashboard

Dans Table Editor → hospitals → Insert row:
```json
{
  "owner_id": "UUID_FROM_AUTH_USERS",
  "name": "Nom Hôpital",
  "email": "email@hospital.com",
  "address": "Adresse complète",
  "latitude": 3.848,
  "longitude": 11.502,
  "type": "public",
  "level": "primaire",
  "services_offered": []
}
```

---

## 📋 CHECKLIST DE VÉRIFICATION

Avant de tester à nouveau:

- [ ] Auth Hooks désactivés (Authentication → Hooks)
- [ ] "Confirm email" DÉCOCHÉ (Authentication → Providers → Email)
- [ ] Script URGENT_FIX.sql exécuté avec succès
- [ ] Email Templates valides (Authentication → Email Templates)
- [ ] Aucun webhook externe configuré
- [ ] Logs Auth vérifiés pour voir l'erreur exacte
- [ ] Test de création manuelle réussi

---

## 🎯 PROCHAINES ÉTAPES

### Étape 1: Exécutez URGENT_FIX.sql
```bash
# Ouvrir le fichier
cat /home/light667/ai4y-delta-lom25/dashboard-react/supabase/URGENT_FIX.sql

# Copier tout → Supabase SQL Editor → Run
```

### Étape 2: Désactivez Confirm Email
```
Dashboard → Authentication → Providers → Email
→ DÉCOCHER "Confirm email"
→ Save
```

### Étape 3: Vérifiez les Hooks
```
Dashboard → Authentication → Hooks
→ Désactiver tous les hooks actifs
```

### Étape 4: Testez avec un nouvel email
```bash
cd /home/light667/ai4y-delta-lom25/dashboard-react
npm run dev

# Ouvrir http://localhost:5173/signup (ou votre IP:port)
# F12 pour voir les logs
# Utiliser un NOUVEL email jamais utilisé
```

---

## 💡 CAUSE PROBABLE

Les erreurs HTTP 500 sur `auth.signUp` sont généralement causées par:

1. ✅ **Auth Hook qui échoue** (80% des cas)
2. ✅ **Trigger PostgreSQL sur auth.users** (15% des cas)
3. ✅ **Email template invalide** (3% des cas)
4. ✅ **Contrainte DB non satisfaite** (2% des cas)

---

## 🆘 SI RIEN NE FONCTIONNE

Contactez-moi avec:
1. Screenshot de **Authentication → Hooks**
2. Screenshot de **Authentication → Providers → Email**
3. Copie des **Auth Logs** (dernière erreur)
4. Résultat de l'exécution de **URGENT_FIX.sql**

Je pourrai alors identifier le problème exact! 🔧
