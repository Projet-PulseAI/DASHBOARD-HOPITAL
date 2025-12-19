-- ============================================================================
-- SOLUTION FINALE: Nettoyer les utilisateurs orphelins
-- ============================================================================
-- Le problème: Des utilisateurs existent dans auth.users mais n'ont pas
-- d'hôpital correspondant dans public.hospitals
-- ============================================================================

-- ÉTAPE 1: Identifier les utilisateurs orphelins (sans hôpital)
SELECT 
    u.id,
    u.email,
    u.created_at,
    u.email_confirmed_at,
    CASE 
        WHEN h.id IS NULL THEN '❌ ORPHELIN'
        ELSE '✅ A un hôpital'
    END as status
FROM auth.users u
LEFT JOIN public.hospitals h ON u.id = h.owner_id
ORDER BY u.created_at DESC;

-- ÉTAPE 2: Compter les orphelins
SELECT 
    COUNT(*) as total_users,
    COUNT(h.id) as users_with_hospital,
    COUNT(*) - COUNT(h.id) as orphan_users
FROM auth.users u
LEFT JOIN public.hospitals h ON u.id = h.owner_id;

-- ÉTAPE 3: SUPPRIMER les utilisateurs orphelins
-- ⚠️ Attention: Ceci va supprimer définitivement ces comptes
DELETE FROM auth.users
WHERE id NOT IN (
    SELECT owner_id 
    FROM public.hospitals 
    WHERE owner_id IS NOT NULL
);

-- ÉTAPE 4: Vérifier qu'il ne reste plus d'orphelins
SELECT 
    COUNT(*) as remaining_orphans
FROM auth.users u
LEFT JOIN public.hospitals h ON u.id = h.owner_id
WHERE h.id IS NULL;

-- Si le résultat est 0 ✅ Parfait!

-- ============================================================================
-- APRÈS CE NETTOYAGE, TESTEZ L'INSCRIPTION AVEC UN NOUVEL EMAIL
-- ============================================================================
