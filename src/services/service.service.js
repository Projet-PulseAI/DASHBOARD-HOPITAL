import { supabase } from '../lib/supabase';

/**
 * Service de gestion des services hospitaliers
 */
export const serviceService = {
  /**
   * Récupérer tous les services d'un hôpital
   */
  async getHospitalServices(hospitalId) {
    try {
      const { data, error } = await supabase
        .from('hospital_services')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('service_type');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération services:', error);
      return { data: null, error };
    }
  },

  /**
   * Créer ou mettre à jour un service
   */
  async upsertService(hospitalId, serviceData) {
    try {
      const { data, error } = await supabase
        .from('hospital_services')
        .upsert({
          hospital_id: hospitalId,
          service_type: serviceData.service_type,
          is_active: serviceData.is_active,
          current_capacity: serviceData.current_capacity || 0,
          queue_length: serviceData.queue_length || 0,
          avg_wait_time: serviceData.avg_wait_time || 0,
          max_wait_time: serviceData.max_wait_time || 0,
          availability_status: serviceData.availability_status || 'available'
        }, {
          onConflict: 'hospital_id,service_type'
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur upsert service:', error);
      return { data: null, error };
    }
  },

  /**
   * Mettre à jour le statut d'un service
   */
  async updateServiceStatus(hospitalId, serviceType, updates) {
    try {
      const { data, error } = await supabase
        .from('hospital_services')
        .update(updates)
        .eq('hospital_id', hospitalId)
        .eq('service_type', serviceType)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur mise à jour statut service:', error);
      return { data: null, error };
    }
  },

  /**
   * Récupérer l'historique d'un service
   */
  async getServiceHistory(hospitalId, serviceType, limit = 100) {
    try {
      const { data, error } = await supabase
        .from('service_history')
        .select('*')
        .eq('hospital_id', hospitalId)
        .eq('service_type', serviceType)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération historique service:', error);
      return { data: null, error };
    }
  },

  /**
   * Enregistrer un snapshot de service dans l'historique
   */
  async recordServiceSnapshot(hospitalId, serviceType, data) {
    try {
      const { data: snapshot, error } = await supabase
        .from('service_history')
        .insert([{
          hospital_id: hospitalId,
          service_type: serviceType,
          queue_length: data.queue_length,
          wait_time: data.wait_time,
          capacity: data.capacity,
          availability_status: data.availability_status
        }])
        .select()
        .single();

      if (error) throw error;
      return { data: snapshot, error: null };
    } catch (error) {
      console.error('Erreur enregistrement snapshot:', error);
      return { data: null, error };
    }
  }
};
