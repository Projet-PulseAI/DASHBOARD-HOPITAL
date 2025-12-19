import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase.config';

// Création du client Supabase
export const supabase = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// Types de services disponibles
export const SERVICE_TYPES = [
  { id: 'urgences', name: 'Urgences', icon: '🚑' },
  { id: 'maternite', name: 'Maternité', icon: '👶' },
  { id: 'chirurgie', name: 'Chirurgie', icon: '⚕️' },
  { id: 'consultation', name: 'Consultation Générale', icon: '🩺' },
  { id: 'pediatrie', name: 'Pédiatrie', icon: '🧸' },
  { id: 'cardiologie', name: 'Cardiologie', icon: '❤️' },
  { id: 'radiologie', name: 'Radiologie', icon: '📷' },
  { id: 'laboratoire', name: 'Laboratoire', icon: '🔬' }
];

// Types d'hôpitaux
export const HOSPITAL_TYPES = [
  { value: 'public', label: 'Public' },
  { value: 'prive', label: 'Privé' },
  { value: 'mixte', label: 'Mixte' }
];

// Niveaux d'hôpitaux
export const HOSPITAL_LEVELS = [
  { value: 'primaire', label: 'Primaire' },
  { value: 'secondaire', label: 'Secondaire' },
  { value: 'tertiaire', label: 'Tertiaire' }
];
