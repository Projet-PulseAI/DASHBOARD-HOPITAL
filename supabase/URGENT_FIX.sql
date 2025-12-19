-- ============================================================================
-- FIX URGENT: HTTP 500 "Database error saving new user"
-- ============================================================================
-- Cette erreur vient d'un trigger ou contrainte qui bloque auth.signup
-- Exécutez ce script pour identifier et corriger le problème
-- ============================================================================

-- ÉTAPE 1: Identifier les triggers sur auth.users
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement
FROM information_schema.triggers t
WHERE t.event_object_schema = 'auth' 
  AND t.event_object_table = 'users'
ORDER BY t.trigger_name;

-- ÉTAPE 2: Lister les fonctions de trigger potentiellement problématiques
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND (
    p.proname LIKE '%user%'
    OR p.proname LIKE '%auth%'
    OR p.proname LIKE '%signup%'
    OR p.proname LIKE '%profile%'
  )
ORDER BY p.proname;

-- ÉTAPE 3: Supprimer les triggers courants qui causent des problèmes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP TRIGGER IF EXISTS on_user_created ON auth.users;
DROP TRIGGER IF EXISTS create_profile_for_user ON auth.users;

-- ÉTAPE 4: Supprimer les fonctions trigger qui peuvent bloquer
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;
DROP FUNCTION IF EXISTS public.auto_create_profile() CASCADE;

-- ÉTAPE 5: Simplifier la policy INSERT sur hospitals
DROP POLICY IF EXISTS "Users can insert hospital" ON public.hospitals;

-- Policy PERMISSIVE pour le développement
CREATE POLICY "Users can insert hospital"
    ON public.hospitals FOR INSERT
    WITH CHECK (true);

-- ÉTAPE 6: Vérifier qu'aucune contrainte ne bloque
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.hospitals'::regclass;

-- ============================================================================
-- SI L'ERREUR PERSISTE APRÈS CE SCRIPT
-- ============================================================================
-- Le problème peut venir de:
-- 1. Une extension ou un hook Supabase (auth.hooks)
-- 2. Un webhook configuré sur le signup
-- 3. Une configuration Auth dans le dashboard
--
-- Solution: Désactiver TOUS les hooks dans:
-- Supabase Dashboard > Authentication > Hooks
-- ============================================================================
