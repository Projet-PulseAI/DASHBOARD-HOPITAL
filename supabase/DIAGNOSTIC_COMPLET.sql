-- ============================================================================
-- DIAGNOSTIC COMPLET: Identifier la cause du HTTP 500
-- ============================================================================

-- 1. VÉRIFIER LES TRIGGERS SUR auth.users
SELECT 
    trigger_schema,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
  AND event_object_table = 'users'
ORDER BY trigger_name;

-- 2. VÉRIFIER LES FONCTIONS TRIGGER
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_code
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname IN ('public', 'auth')
  AND p.proname IN (
    'handle_new_user',
    'create_profile',
    'create_hospital',
    'on_auth_user_created',
    'auto_create_profile'
  )
ORDER BY n.nspname, p.proname;

-- 3. VÉRIFIER S'IL Y A DES POLICIES BLOQUANTES SUR auth.users
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
WHERE schemaname = 'auth'
  AND tablename = 'users';

-- 4. VÉRIFIER LES EXTENSIONS ACTIVES
SELECT 
    extname,
    extversion
FROM pg_extension
ORDER BY extname;

-- ============================================================================
-- SI VOUS TROUVEZ UN TRIGGER, SUPPRIMEZ-LE AINSI:
-- ============================================================================
/*
-- Exemple (adaptez selon ce que vous trouvez):
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
*/

-- ============================================================================
-- RÉSULTATS ATTENDUS:
-- ============================================================================
-- Si Query 1 retourne des lignes → Vous avez un TRIGGER bloquant
-- Si Query 2 retourne des lignes → Vous avez une FONCTION trigger
-- Si Query 3 retourne des lignes → Vous avez des POLICIES sur auth.users
-- Si tout est vide → Le problème vient des Auth Hooks dans le Dashboard
