# 🔥 SOLUTION URGENTE: Erreur HTTP 500 "Database error saving new user"

## ❌ Erreur Actuelle
```
XHRPOST https://fedjjdspntrxaqfzflao.supabase.co/auth/v1/signup
[HTTP/3 500  474ms]
Auth error: AuthApiError: Database error saving new user
```

## 🎯 Cause Probable

L'erreur **HTTP 500** lors du signup signifie que Supabase **refuse de créer l'utilisateur** au niveau de la base de données, AVANT même que notre code ne tente de créer l'hôpital.

**Causes possibles:**
1. ✅ **Trigger bloquant** sur `auth.users`
2. ✅ **Email déjà utilisé** (ancien compte non supprimé)
3. ✅ **Confirmation email activée** avec policy RLS restrictive
4. ✅ **Contrainte de base de données** non satisfaite

---

## 🚀 SOLUTION EN 3 ÉTAPES

### ✅ ÉTAPE 1: Exécuter le Script de Diagnostic et Correction

1. **Ouvrez** le fichier: `/home/light667/ai4y-delta-lom25/dashboard-react/supabase/fix_signup_issue.sql`

2. **Copiez TOUT** le contenu du fichier

3. **Allez sur Supabase Dashboard**:
   - https://supabase.com/dashboard/project/fedjjdspntrxaqfzflao
   - Cliquez sur **"SQL Editor"** (icône </>)
   - Cliquez sur **"New query"**

4. **Collez** le script et cliquez sur **"Run"** (▶️)

5. **Vérifiez les résultats**:
   - Si vous voyez des triggers sur `auth.users` → Problème identifié!
   - Si la policy INSERT est restrictive → Problème identifié!

---

### ✅ ÉTAPE 2: Désactiver la Confirmation Email

1. **Dans Supabase Dashboard**, allez sur:
   ```
   Authentication → Providers → Email
   ```

2. **Trouvez** la section **"Confirm email"**

3. **DÉCOCHEZ** la case "Confirm email"

4. **Cliquez** sur **"Save"**

5. **Vérifiez** que le message confirme: "Email provider updated"

---

### ✅ ÉTAPE 3: Supprimer les Anciens Utilisateurs (Important!)

Si vous avez déjà essayé de vous inscrire avec cet email:

1. **Dans Supabase Dashboard**, allez sur:
   ```
   Authentication → Users
   ```

2. **Cherchez** l'email que vous voulez utiliser

3. **Cliquez** sur les **3 points** (⋮) à droite

4. **Sélectionnez** "Delete user"

5. **Confirmez** la suppression

6. **Vérifiez aussi** dans:
   ```
   Table Editor → hospitals
   ```
   Et supprimez tout hôpital orphelin associé à cet email

---

## 🧪 TEST APRÈS CORRECTION

### 1. Rechargez l'application
```bash
# Dans le terminal
cd /home/light667/ai4y-delta-lom25/dashboard-react
npm run dev
```

### 2. Ouvrez la console du navigateur
- Appuyez sur **F12**
- Allez sur l'onglet **"Console"**

### 3. Testez l'inscription
- Allez sur **http://localhost:5173/signup**
- Utilisez un **NOUVEL EMAIL** (jamais utilisé avant)
- Remplissez le formulaire:
  - **Email**: `test123@hospital.com` (exemple)
  - **Mot de passe**: `Test1234!`
  - **Nom**: `Test Hospital`
  - **Adresse**: `123 Test Street, Yaoundé`
  - **Latitude**: `3.848`
  - **Longitude**: `11.502`
  - **Type**: Public
  - **Niveau**: Primaire
  - **Services**: Cochez au moins 1 service

### 4. Observez la console
Vous devriez voir:
```
🚀 Début inscription: {...}
📝 Étape 1: Création utilisateur...
✅ Utilisateur créé: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
⏳ Attente 2 secondes...
🏥 Étape 2: Création hôpital...
📤 Payload hôpital: {...}
✅ Hôpital créé: yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
```

### 5. Vérifiez dans Supabase
- **Authentication → Users**: Votre nouvel utilisateur doit apparaître
- **Table Editor → hospitals**: Votre hôpital doit être créé

---

## ❓ SI LE PROBLÈME PERSISTE

### Option A: Vérifier les Logs Supabase
1. **Dashboard Supabase** → **Logs**
2. **Sélectionnez**: "Auth Logs"
3. **Regardez** les erreurs détaillées
4. **Cherchez**: "Database error" ou "constraint violation"

### Option B: Tester l'Insertion Manuelle
```sql
-- Dans Supabase SQL Editor

-- 1. Créer un utilisateur de test via le Dashboard (Authentication > Add User)
-- Email: manual@test.com
-- Password: Test1234!

-- 2. Récupérer l'ID de l'utilisateur
SELECT id, email FROM auth.users WHERE email = 'manual@test.com';

-- 3. Essayer d'insérer un hôpital manuellement
INSERT INTO public.hospitals (
    owner_id,
    name,
    email,
    address,
    latitude,
    longitude,
    type,
    level
) VALUES (
    'REMPLACER_PAR_USER_ID',  -- UUID de l'utilisateur
    'Test Manual Hospital',
    'manual@test.com',
    '123 Test St',
    3.848,
    11.502,
    'public',
    'primaire'
);

-- Si cette insertion fonctionne: Le problème vient de l'auth signup
-- Si cette insertion échoue: Le problème vient de la policy RLS ou contrainte
```

### Option C: Désactiver Temporairement RLS (DEV UNIQUEMENT!)
```sql
-- ⚠️ UNIQUEMENT POUR TESTER - NE PAS UTILISER EN PRODUCTION

ALTER TABLE public.hospitals DISABLE ROW LEVEL SECURITY;

-- Testez le signup

-- Puis réactivez:
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
```

---

## 📊 Checklist de Vérification

Avant de tester à nouveau:

- [ ] Script SQL `fix_signup_issue.sql` exécuté avec succès
- [ ] "Confirm email" DÉCOCHÉ dans Authentication > Providers
- [ ] Anciens utilisateurs avec cet email SUPPRIMÉS
- [ ] Policy INSERT sur `hospitals` est permissive (WITH CHECK true)
- [ ] Aucun trigger bloquant sur `auth.users`
- [ ] Utilisation d'un NOUVEL EMAIL jamais utilisé
- [ ] Console navigateur ouverte pour voir les logs détaillés

---

## 🆘 Support d'Urgence

Si rien ne fonctionne après ces étapes:

**Partagez avec moi:**
1. Les logs de la console du navigateur (F12)
2. Les résultats du script SQL de diagnostic
3. Le contenu de "Auth Logs" dans Supabase Dashboard
4. Une capture d'écran de la configuration Email Provider

Je pourrai alors diagnostiquer le problème exact!

---

## 📝 Note pour Plus Tard

Une fois que tout fonctionne, pour sécuriser en production:

1. **Réactivez** la confirmation email
2. **Changez** la policy INSERT:
   ```sql
   DROP POLICY IF EXISTS "Users can insert hospital" ON public.hospitals;
   CREATE POLICY "Users can insert hospital"
       ON public.hospitals FOR INSERT
       WITH CHECK (auth.uid() = owner_id);
   ```
3. Utilisez une **Edge Function** pour gérer le signup complexe
