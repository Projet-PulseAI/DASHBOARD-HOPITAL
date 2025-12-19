import { supabase } from '../lib/supabase';

/**
 * Service de gestion des données hospitalières
 */
export const hospitalService = {
  /**
   * Récupérer les informations de l'hôpital de l'utilisateur connecté
   */
  async getMyHospital(userId) {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('owner_id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération hôpital:', error);
      return { data: null, error };
    }
  },

  /**
   * Mettre à jour les informations de l'hôpital
   */
  async updateHospital(hospitalId, updates) {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .update(updates)
        .eq('id', hospitalId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur mise à jour hôpital:', error);
      return { data: null, error };
    }
  },

  /**
   * Récupérer les ressources actuelles
   */
  async getCurrentResources(hospitalId) {
    try {
      const { data, error } = await supabase
        .from('hospital_resources')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération ressources:', error);
      return { data: null, error };
    }
  },

  /**
   * Mettre à jour les ressources (lits, médecins)
   */
  async updateResources(hospitalId, resources) {
    try {
      const { data, error } = await supabase
        .from('hospital_resources')
        .insert([{
          hospital_id: hospitalId,
          total_beds: resources.total_beds,
          available_beds: resources.available_beds,
          beds_by_service: resources.beds_by_service || {},
          total_doctors: resources.total_doctors,
          available_doctors: resources.available_doctors,
          doctors_by_service: resources.doctors_by_service || {},
          on_duty_staff: resources.on_duty_staff || 0
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur mise à jour ressources:', error);
      return { data: null, error };
    }
  },

  /**
   * Récupérer l'historique des ressources
   */
  async getResourcesHistory(hospitalId, limit = 100) {
    try {
      const { data, error } = await supabase
        .from('hospital_resources')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return { data: null, error };
    }
  }
};
