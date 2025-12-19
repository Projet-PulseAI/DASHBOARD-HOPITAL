-- ============================================================================
-- SCRIPT DE DIAGNOSTIC ET CORRECTION - Erreur Signup
-- ============================================================================
-- Erreur: "Database error saving new user" - HTTP 500
-- Cause possible: Trigger, Policy RLS, ou contrainte bloquante
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- ÉTAPE 1: DIAGNOSTIC - Vérifier les triggers sur auth.users
-- ----------------------------------------------------------------------------
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users' 
  AND event_object_schema = 'auth';

-- ----------------------------------------------------------------------------
-- ÉTAPE 2: DIAGNOSTIC - Vérifier les policies RLS sur hospitals
-- ----------------------------------------------------------------------------
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'hospitals';

-- ----------------------------------------------------------------------------
-- ÉTAPE 3: CORRECTION - Supprimer les triggers potentiellement bloquants
-- ----------------------------------------------------------------------------
-- Si vous avez des triggers qui bloquent la création d'utilisateurs,
-- décommentez et exécutez cette section:

/*
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_created ON auth.users;
DROP FUNCTION IF EXISTS auto_confirm_user() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
*/

-- ----------------------------------------------------------------------------
-- ÉTAPE 4: CORRECTION - Simplifier temporairement la policy INSERT
-- ----------------------------------------------------------------------------
-- Supprime l'ancienne policy restrictive
DROP POLICY IF EXISTS "Users can insert hospital" ON public.hospitals;

-- Crée une policy TEMPORAIRE permissive pour le développement
-- ⚠️ À utiliser UNIQUEMENT en développement/test
CREATE POLICY "Users can insert hospital"
    ON public.hospitals FOR INSERT
    WITH CHECK (true);

-- Note: Pour la production, utilisez:
-- WITH CHECK (auth.uid() = owner_id AND auth.role() = 'authenticated')

-- ----------------------------------------------------------------------------
-- ÉTAPE 5: VÉRIFICATION - Confirmer que RLS est bien configuré
-- ----------------------------------------------------------------------------
-- Vérifier que RLS est activé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('hospitals', 'hospital_resources', 'hospital_services', 'service_history')
  AND schemaname = 'public';

-- ----------------------------------------------------------------------------
-- ÉTAPE 6: CORRECTION - Désactiver la confirmation email (via SQL)
-- ----------------------------------------------------------------------------
-- Cette méthode alternative désactive la confirmation par SQL
-- (au lieu de le faire via le Dashboard)

-- Note: Cette table est protégée, vous devrez probablement
-- désactiver la confirmation via le Dashboard Supabase:
-- Authentication > Providers > Email > Décocher "Confirm email"

COMMIT;

-- ============================================================================
-- INSTRUCTIONS D'UTILISATION
-- ============================================================================
/*

1. Copiez TOUT ce script
2. Allez sur Supabase Dashboard > SQL Editor
3. Collez et exécutez le script
4. Vérifiez les résultats de diagnostic dans les outputs

5. SI le problème persiste:
   a) Allez dans Authentication > Providers > Email
   b) DÉCOCHEZ "Confirm email"
   c) Sauvegardez
   
6. Testez à nouveau l'inscription avec un NOUVEL email

*/

-- ============================================================================
-- ROLLBACK POUR LA PRODUCTION
-- ============================================================================
/*
-- Quand vous passez en production, exécutez ceci:

DROP POLICY IF EXISTS "Users can insert hospital" ON public.hospitals;

CREATE POLICY "Users can insert hospital"
    ON public.hospitals FOR INSERT
    WITH CHECK (auth.uid() = owner_id);
*/
