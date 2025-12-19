import { supabase } from '../lib/supabase';

/**
 * Service d'authentification pour les hôpitaux
 */
export const authService = {
  /**
   * Inscription d'un nouvel hôpital
   */
  async signUp(email, password, hospitalData) {
    try {
      console.log('🚀 Début inscription:', { email, hospitalData });
      
      // 1. Créer l'utilisateur dans Supabase Auth
      console.log('📝 Étape 1: Création utilisateur...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      // Log détaillé de l'erreur
      if (authError) {
        console.error('❌ Erreur auth complète:', {
          message: authError.message,
          status: authError.status,
          name: authError.name,
          cause: authError.cause,
          stack: authError.stack
        });
        throw new Error(`Erreur authentification: ${authError.message}`);
      }

      if (!authData.user) {
        console.error('❌ Aucun utilisateur retourné');
        throw new Error('Aucun utilisateur créé - vérifiez la configuration Supabase');
      }

      console.log('✅ Utilisateur créé:', authData.user.id);

      // 2. Attendre que l'utilisateur soit bien enregistré
      console.log('⏳ Attente 2 secondes...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Créer l'hôpital dans la base de données
      console.log('🏥 Étape 2: Création hôpital...');
      const hospitalPayload = {
        owner_id: authData.user.id,
        name: hospitalData.name,
        email: email,
        phone: hospitalData.phone || null,
        address: hospitalData.address,
        type: hospitalData.type,
        level: hospitalData.level,
        latitude: parseFloat(hospitalData.latitude),
        longitude: parseFloat(hospitalData.longitude),
        services_offered: hospitalData.services || [],
        contact: hospitalData.contact || null,
        schedule: hospitalData.schedule || {}
      };

      console.log('📤 Payload hôpital:', hospitalPayload);

      const { data: hospital, error: hospitalError } = await supabase
        .from('hospitals')
        .insert([hospitalPayload])
        .select()
        .single();

      if (hospitalError) {
        console.error('❌ Erreur création hôpital:', {
          message: hospitalError.message,
          details: hospitalError.details,
          hint: hospitalError.hint,
          code: hospitalError.code
        });
        throw new Error(`Erreur création hôpital: ${hospitalError.message}`);
      }

      console.log('✅ Hôpital créé:', hospital.id);
      return { user: authData.user, hospital, error: null };
      
    } catch (error) {
      console.error('💥 Erreur inscription complète:', error);
      return { 
        user: null, 
        hospital: null, 
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  },

  /**
   * Connexion d'un hôpital
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('Erreur connexion:', error);
      return { user: null, session: null, error };
    }
  },

  /**
   * Déconnexion
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      return { error };
    }
  },

  /**
   * Récupérer l'utilisateur connecté
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  },

  /**
   * Récupérer la session actuelle
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  },

  /**
   * Écouter les changements d'état d'authentification
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
