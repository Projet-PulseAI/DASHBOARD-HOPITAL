-- ==============================================================================
-- PULSEAI DASHBOARD REACT - SCHÉMA DE BASE DE DONNÉES
-- ==============================================================================
-- Version: 2.0
-- Description: Schéma complet pour le dashboard hospitalier PulseAI
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. NETTOYAGE COMPLET - SUPPRESSION DE TOUTES LES TABLES EXISTANTES
-- ==============================================================================
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.hospital_equipments CASCADE;
DROP TABLE IF EXISTS public.service_history CASCADE;
DROP TABLE IF EXISTS public.hospital_services CASCADE;
DROP TABLE IF EXISTS public.hospital_resources CASCADE;
DROP TABLE IF EXISTS public.hospitals CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.ratings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;

DROP TYPE IF EXISTS public.hospital_type CASCADE;
DROP TYPE IF EXISTS public.hospital_level CASCADE;
DROP TYPE IF EXISTS public.service_availability CASCADE;
DROP TYPE IF EXISTS public.hospital_status CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- ==============================================================================
-- 2. ACTIVATION DES EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 3. TYPES ÉNUMÉRÉS
-- ==============================================================================
CREATE TYPE public.hospital_type AS ENUM ('public', 'prive', 'mixte');
CREATE TYPE public.hospital_level AS ENUM ('primaire', 'secondaire', 'tertiaire');
CREATE TYPE public.service_availability AS ENUM ('available', 'busy', 'full', 'closed');

-- ==============================================================================
-- 4. TABLE HOSPITALS (Données statiques des hôpitaux)
-- ==============================================================================
CREATE TABLE public.hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations de base
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT NOT NULL,
    
    -- Géolocalisation
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Classification
    type hospital_type NOT NULL DEFAULT 'public',
    level hospital_level NOT NULL DEFAULT 'primaire',
    
    -- Services offerts (array de services)
    services_offered TEXT[] DEFAULT '{}',
    
    -- Contact et horaires
    contact TEXT,
    schedule JSONB DEFAULT '{}'::jsonb,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Index
    CONSTRAINT unique_owner UNIQUE(owner_id)
);

-- Index pour la recherche géographique
CREATE INDEX idx_hospitals_location ON public.hospitals(latitude, longitude);
CREATE INDEX idx_hospitals_type ON public.hospitals(type);
CREATE INDEX idx_hospitals_level ON public.hospitals(level);

-- ==============================================================================
-- 5. TABLE HOSPITAL_RESOURCES (Données dynamiques - ressources)
-- ==============================================================================
CREATE TABLE public.hospital_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    
    -- Ressources lits
    total_beds INTEGER NOT NULL DEFAULT 0,
    available_beds INTEGER NOT NULL DEFAULT 0,
    beds_by_service JSONB DEFAULT '{}'::jsonb,
    
    -- Ressources humaines
    total_doctors INTEGER NOT NULL DEFAULT 0,
    available_doctors INTEGER NOT NULL DEFAULT 0,
    doctors_by_service JSONB DEFAULT '{}'::jsonb,
    on_duty_staff INTEGER DEFAULT 0,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Index
    CHECK (available_beds >= 0),
    CHECK (available_beds <= total_beds),
    CHECK (available_doctors >= 0),
    CHECK (available_doctors <= total_doctors)
);

-- Index pour récupérer rapidement la dernière ressource
CREATE INDEX idx_resources_hospital_time ON public.hospital_resources(hospital_id, created_at DESC);

-- ==============================================================================
-- 6. TABLE HOSPITAL_SERVICES (Gestion des services)
-- ==============================================================================
CREATE TABLE public.hospital_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    
    -- Type de service
    service_type TEXT NOT NULL,
    
    -- Statut
    is_active BOOLEAN DEFAULT true,
    
    -- Capacité et file d'attente
    current_capacity INTEGER DEFAULT 0,
    queue_length INTEGER DEFAULT 0,
    
    -- Temps d'attente (en minutes)
    avg_wait_time INTEGER DEFAULT 0,
    max_wait_time INTEGER DEFAULT 0,
    
    -- Disponibilité
    availability_status service_availability DEFAULT 'available',
    
    -- Métadonnées
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contrainte d'unicité
    CONSTRAINT unique_hospital_service UNIQUE(hospital_id, service_type),
    
    -- Validations
    CHECK (queue_length >= 0),
    CHECK (avg_wait_time >= 0),
    CHECK (max_wait_time >= avg_wait_time)
);

-- Index
CREATE INDEX idx_services_hospital ON public.hospital_services(hospital_id);
CREATE INDEX idx_services_type ON public.hospital_services(service_type);
CREATE INDEX idx_services_availability ON public.hospital_services(availability_status);

-- ==============================================================================
-- 7. TABLE SERVICE_HISTORY (Historique temporel des services)
-- ==============================================================================
CREATE TABLE public.service_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    
    -- Données snapshot
    queue_length INTEGER NOT NULL,
    wait_time INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    availability_status service_availability NOT NULL,
    
    -- Timestamp
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Index pour séries temporelles
    CONSTRAINT valid_queue CHECK (queue_length >= 0),
    CONSTRAINT valid_wait CHECK (wait_time >= 0)
);

-- Index pour les requêtes temporelles
CREATE INDEX idx_history_hospital_service_time 
ON public.service_history(hospital_id, service_type, timestamp DESC);

-- ==============================================================================
-- 8. FONCTIONS DE TRIGGER POUR updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour hospitals
CREATE TRIGGER update_hospitals_updated_at
    BEFORE UPDATE ON public.hospitals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour hospital_services
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.hospital_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_history ENABLE ROW LEVEL SECURITY;

-- Policies pour HOSPITALS
CREATE POLICY "hospitals_select_own"
    ON public.hospitals FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "hospitals_insert_own"
    ON public.hospitals FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "hospitals_update_own"
    ON public.hospitals FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "hospitals_delete_own"
    ON public.hospitals FOR DELETE
    USING (auth.uid() = owner_id);

-- Policies pour HOSPITAL_RESOURCES
CREATE POLICY "resources_select_own"
    ON public.hospital_resources FOR SELECT
    USING (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

CREATE POLICY "resources_insert_own"
    ON public.hospital_resources FOR INSERT
    WITH CHECK (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

CREATE POLICY "resources_update_own"
    ON public.hospital_resources FOR UPDATE
    USING (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ))
    WITH CHECK (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

CREATE POLICY "resources_delete_own"
    ON public.hospital_resources FOR DELETE
    USING (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

-- Policies pour HOSPITAL_SERVICES
CREATE POLICY "services_select_own"
    ON public.hospital_services FOR SELECT
    USING (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

CREATE POLICY "services_insert_own"
    ON public.hospital_services FOR INSERT
    WITH CHECK (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

CREATE POLICY "services_update_own"
    ON public.hospital_services FOR UPDATE
    USING (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ))
    WITH CHECK (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

CREATE POLICY "services_delete_own"
    ON public.hospital_services FOR DELETE
    USING (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

-- Policies pour SERVICE_HISTORY
CREATE POLICY "history_select_own"
    ON public.service_history FOR SELECT
    USING (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

CREATE POLICY "history_insert_own"
    ON public.service_history FOR INSERT
    WITH CHECK (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

CREATE POLICY "history_update_own"
    ON public.service_history FOR UPDATE
    USING (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ))
    WITH CHECK (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

CREATE POLICY "history_delete_own"
    ON public.service_history FOR DELETE
    USING (hospital_id IN (
        SELECT id FROM public.hospitals WHERE owner_id = auth.uid()
    ));

-- ==============================================================================
-- 10. DONNÉES INITIALES (OPTIONNEL)
-- ==============================================================================

-- Vous pouvez ajouter des données de test ici si nécessaire

COMMIT;

-- ==============================================================================
-- FIN DU SCRIPT
-- ==============================================================================
