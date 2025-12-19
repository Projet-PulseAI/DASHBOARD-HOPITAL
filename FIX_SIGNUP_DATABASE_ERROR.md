# 🔧 Fix: "Database error saving new user"

## 🎯 Problème Identifié

L'erreur **"Database error saving new user"** est causée par les **Row Level Security (RLS) policies** de Supabase qui empêchent l'insertion d'un hôpital lors de l'inscription.

### Cause Racine
- Lors de l'inscription, Supabase crée un utilisateur mais **requiert une confirmation d'email**
- Pendant la confirmation, `auth.uid()` n'est pas encore disponible dans le contexte authentifié
- La policy RLS `WITH CHECK (auth.uid() = owner_id)` échoue car l'utilisateur n'est pas encore complètement authentifié

---

## ✅ Solution 1: Désactiver la Confirmation d'Email (RECOMMANDÉ pour le développement)

### Étapes dans Supabase Dashboard:

1. **Allez sur**: https://supabase.com/dashboard/project/fedjjdspntrxaqfzflao

2. **Navigation**: `Authentication` → `Providers` → `Email`

3. **Désactivez**: "Confirm email"
   - Trouvez la section **"Confirm email"**
   - **Décochez** la case
   - Cliquez sur **"Save"**

4. **Alternative - Settings**:
   - Allez dans `Settings` → `Authentication`
   - Trouvez **"Enable email confirmations"**
   - **Désactivez** cette option
   - Sauvegardez

### Résultat:
✅ Les nouveaux utilisateurs seront **immédiatement actifs** sans confirmation d'email
✅ Le dashboard fonctionnera instantanément après l'inscription

---

## ✅ Solution 2: Mettre à Jour la Policy RLS (Si vous voulez garder la confirmation email)

### Option A: Policy Permissive (Temporaire - Développement uniquement)

```sql
-- Supprimez l'ancienne policy
DROP POLICY IF EXISTS "Users can insert hospital" ON public.hospitals;

-- Créez une nouvelle policy permissive
CREATE POLICY "Users can insert hospital"
    ON public.hospitals FOR INSERT
    WITH CHECK (true);  -- Permet toutes les insertions
```

⚠️ **ATTENTION**: Cette policy permet à n'importe qui d'insérer un hôpital. **À utiliser uniquement en développement**.

### Option B: Policy avec Service Role (Production)

Modifiez `auth.service.js` pour utiliser une **Cloud Function** ou un **Edge Function** qui utilise le **service role key** pour créer l'hôpital.

Cette solution est plus complexe et nécessite:
1. Créer une Edge Function Supabase
2. Utiliser le `service_role_key` côté serveur
3. Appeler la fonction depuis le frontend

---

## ✅ Solution 3: Auto-confirm via Trigger (Intermédiaire)

Créez un trigger PostgreSQL qui confirme automatiquement les utilisateurs:

```sql
-- Créez une fonction pour auto-confirmer
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créez le trigger
CREATE TRIGGER on_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();
```

---

## 🚀 Étapes Recommandées (Pour Commencer Rapidement)

### 1️⃣ Désactiver Email Confirmation (2 minutes)
```
1. Ouvrir Supabase Dashboard
2. Authentication → Providers → Email
3. Décocher "Confirm email"
4. Save
```

### 2️⃣ Tester l'Inscription
```
1. Ouvrir http://localhost:5173/signup
2. Remplir le formulaire avec un NOUVEL email
3. Cliquer "S'inscrire"
4. ✅ Devrait fonctionner sans erreur
```

### 3️⃣ Vérifier dans Supabase
```
1. Supabase Dashboard → Table Editor → hospitals
2. Vérifier qu'un nouvel hôpital a été créé
3. Authentication → Users
4. Vérifier que l'utilisateur existe et est confirmé
```

---

## 🔍 Debugging Supplémentaire

### Si l'erreur persiste:

#### 1. Vérifiez les RLS Policies
```sql
-- Dans Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'hospitals';
```

#### 2. Vérifiez que RLS est activé
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'hospitals';
```

#### 3. Testez l'insertion manuelle
```sql
-- Créez un utilisateur test dans Authentication
-- Puis essayez:
INSERT INTO public.hospitals (
  owner_id, name, email, address, latitude, longitude, type, level
) VALUES (
  'USER_ID_FROM_AUTH',  -- Remplacez par un vrai UUID
  'Test Hospital',
  'test@hospital.com',
  '123 Test Street',
  3.848,
  11.502,
  'public',
  'primaire'
);
```

---

## 📝 Pour la Production

Quand vous déployez en production, **réactivez** la confirmation d'email et utilisez:

1. **Edge Function** avec service role pour créer l'hôpital
2. **Email templates** personnalisés pour la confirmation
3. **RLS policies** strictes avec `auth.uid() = owner_id`

---

## 🆘 Support

Si le problème persiste après avoir désactivé la confirmation email:

1. Vérifiez la **console du navigateur** pour les erreurs exactes
2. Vérifiez les **logs Supabase** dans Dashboard → Logs
3. Testez avec un **email complètement nouveau** (pas déjà enregistré)

