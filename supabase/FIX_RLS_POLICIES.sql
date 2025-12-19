-- ============================================================================
-- FIX HTTP 406: Correction des RLS Policies
-- ============================================================================
-- Les erreurs HTTP 406 viennent de policies RLS trop restrictives ou en conflit
-- Ce script corrige toutes les policies pour permettre l'accès aux données
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. NETTOYER TOUTES LES POLICIES EXISTANTES
-- ----------------------------------------------------------------------------

-- Supprimer policies sur hospitals
DROP POLICY IF EXISTS "Hospitals can view own data" ON public.hospitals;
DROP POLICY IF EXISTS "Hospitals can update own data" ON public.hospitals;
DROP POLICY IF EXISTS "Users can insert hospital" ON public.hospitals;
DROP POLICY IF EXISTS "Public read access" ON public.hospitals;

-- Supprimer policies sur hospital_resources
DROP POLICY IF EXISTS "Hospitals can view own resources" ON public.hospital_resources;
DROP POLICY IF EXISTS "Hospitals can insert own resources" ON public.hospital_resources;
DROP POLICY IF EXISTS "Hospitals can update own resources" ON public.hospital_resources;
DROP POLICY IF EXISTS "Hospitals can delete own resources" ON public.hospital_resources;

-- Supprimer policies sur hospital_services
DROP POLICY IF EXISTS "Hospitals can view own services" ON public.hospital_services;
DROP POLICY IF EXISTS "Hospitals can manage own services" ON public.hospital_services;
DROP POLICY IF EXISTS "Public read services" ON public.hospital_services;

-- Supprimer policies sur service_history
DROP POLICY IF EXISTS "Hospitals can view own history" ON public.service_history;
DROP POLICY IF EXISTS "Hospitals can insert own history" ON public.service_history;

-- ----------------------------------------------------------------------------
-- 2. CRÉER LES NOUVELLES POLICIES CORRECTES
-- ----------------------------------------------------------------------------

-- ============ HOSPITALS ============

-- SELECT: L'hôpital peut voir ses propres données
CREATE POLICY "hospitals_select_own"
    ON public.hospitals FOR SELECT
    USING (auth.uid() = owner_id);

-- INSERT: Permettre l'insertion lors du signup
CREATE POLICY "hospitals_insert_own"
    ON public.hospitals FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- UPDATE: L'hôpital peut modifier ses propres données
CREATE POLICY "hospitals_update_own"
    ON public.hospitals FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- DELETE: L'hôpital peut supprimer ses propres données
CREATE POLICY "hospitals_delete_own"
    ON public.hospitals FOR DELETE
    USING (auth.uid() = owner_id);

-- ============ HOSPITAL_RESOURCES ============

-- SELECT: Voir ses propres ressources
CREATE POLICY "resources_select_own"
    ON public.hospital_resources FOR SELECT
    USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- INSERT: Créer des ressources pour son hôpital
CREATE POLICY "resources_insert_own"
    ON public.hospital_resources FOR INSERT
    WITH CHECK (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- UPDATE: Modifier ses ressources
CREATE POLICY "resources_update_own"
    ON public.hospital_resources FOR UPDATE
    USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    )
    WITH CHECK (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- DELETE: Supprimer ses ressources
CREATE POLICY "resources_delete_own"
    ON public.hospital_resources FOR DELETE
    USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- ============ HOSPITAL_SERVICES ============

-- SELECT: Voir ses propres services
CREATE POLICY "services_select_own"
    ON public.hospital_services FOR SELECT
    USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- INSERT: Créer des services
CREATE POLICY "services_insert_own"
    ON public.hospital_services FOR INSERT
    WITH CHECK (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- UPDATE: Modifier des services
CREATE POLICY "services_update_own"
    ON public.hospital_services FOR UPDATE
    USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    )
    WITH CHECK (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- DELETE: Supprimer des services
CREATE POLICY "services_delete_own"
    ON public.hospital_services FOR DELETE
    USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- ============ SERVICE_HISTORY ============

-- SELECT: Voir son historique
CREATE POLICY "history_select_own"
    ON public.service_history FOR SELECT
    USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- INSERT: Créer de l'historique
CREATE POLICY "history_insert_own"
    ON public.service_history FOR INSERT
    WITH CHECK (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- UPDATE: Modifier l'historique
CREATE POLICY "history_update_own"
    ON public.service_history FOR UPDATE
    USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    )
    WITH CHECK (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- DELETE: Supprimer de l'historique
CREATE POLICY "history_delete_own"
    ON public.service_history FOR DELETE
    USING (
        hospital_id IN (
            SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- 3. VÉRIFICATION
-- ----------------------------------------------------------------------------

-- Lister toutes les policies actives
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('hospitals', 'hospital_resources', 'hospital_services', 'service_history')
ORDER BY tablename, cmd, policyname;

COMMIT;

-- ============================================================================
-- RÉSULTAT ATTENDU:
-- ============================================================================
-- Vous devriez voir 4 policies par table (SELECT, INSERT, UPDATE, DELETE)
-- Total: 16 policies actives
-- ============================================================================
