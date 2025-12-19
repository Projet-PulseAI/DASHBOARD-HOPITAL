import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { hospitalService } from '../services/hospital.service';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session au chargement
    checkSession();

    // Écouter les changements d'authentification
    const { data: authListener } = authService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadHospitalData(session.user.id);
      } else {
        setUser(null);
        setHospital(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    const { session } = await authService.getSession();
    if (session?.user) {
      setUser(session.user);
      await loadHospitalData(session.user.id);
    }
    setLoading(false);
  };

  const loadHospitalData = async (userId) => {
    const { data } = await hospitalService.getMyHospital(userId);
    setHospital(data);
  };

  const signUp = async (email, password, hospitalData) => {
    const { user, hospital, error } = await authService.signUp(email, password, hospitalData);
    if (!error) {
      setUser(user);
      setHospital(hospital);
    }
    return { user, hospital, error };
  };

  const signIn = async (email, password) => {
    const { user, error } = await authService.signIn(email, password);
    if (!error && user) {
      setUser(user);
      await loadHospitalData(user.id);
    }
    return { user, error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (!error) {
      setUser(null);
      setHospital(null);
    }
    return { error };
  };

  const refreshHospitalData = async () => {
    if (user) {
      await loadHospitalData(user.id);
    }
  };

  const value = {
    user,
    hospital,
    loading,
    signUp,
    signIn,
    signOut,
    refreshHospitalData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
