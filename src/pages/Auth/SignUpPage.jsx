import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HOSPITAL_TYPES, HOSPITAL_LEVELS, SERVICE_TYPES } from '../../lib/supabase';
import './Auth.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    type: 'public',
    level: 'primaire',
    services: [],
    contact: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const serviceId = value;
      setFormData(prev => ({
        ...prev,
        services: checked
          ? [...prev.services, serviceId]
          : prev.services.filter(s => s !== serviceId)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    // Vérifier si on est en HTTPS ou localhost
    if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
      setError('La géolocalisation nécessite HTTPS. Veuillez entrer les coordonnées manuellement.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setLoading(false);
        setError('');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Impossible de récupérer votre position. Veuillez entrer les coordonnées manuellement.');
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError('Veuillez autoriser la géolocalisation ou entrer les coordonnées manuellement');
      setLoading(false);
      return;
    }

    if (formData.services.length === 0) {
      setError('Veuillez sélectionner au moins un service offert');
      setLoading(false);
      return;
    }

    const hospitalData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      type: formData.type,
      level: formData.level,
      services: formData.services,
      contact: formData.contact,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      schedule: {}
    };

    const { user, hospital, error: signUpError } = await signUp(formData.email, formData.password, hospitalData);
    
    if (signUpError) {
      let errorMessage = 'Erreur lors de l\'inscription';
      
      if (signUpError.message) {
        if (signUpError.message.includes('already registered')) {
          errorMessage = 'Cet email est déjà utilisé';
        } else if (signUpError.message.includes('unique_owner')) {
          errorMessage = 'Un hôpital existe déjà pour cet utilisateur';
        } else if (signUpError.message.includes('invalid email')) {
          errorMessage = 'Email invalide';
        } else {
          errorMessage = signUpError.message;
        }
      }
      
      setError(errorMessage);
      setLoading(false);
    } else if (user && hospital) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError('Erreur inconnue lors de l\'inscription');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🏥 PulseAI Dashboard</h1>
          <h2>Inscription Hôpital</h2>
          <p>Rejoignez le réseau PulseAI pour mieux servir vos patients</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            Inscription réussie ! Redirection vers le dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Informations de compte */}
          <div className="form-section">
            <h3>Informations de connexion</h3>
            
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="contact@hopital.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Informations hôpital */}
          <div className="form-section">
            <h3>Informations de l'hôpital</h3>
            
            <div className="form-group">
              <label className="form-label">Nom de l'hôpital *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Centre Hospitalier..."
              />
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  {HOSPITAL_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Niveau *</label>
                <select
                  name="level"
                  className="form-select"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  {HOSPITAL_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+237 6XX XX XX XX"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adresse complète *</label>
              <textarea
                name="address"
                className="form-textarea"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Rue, quartier, ville..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact (personne responsable)</label>
              <input
                type="text"
                name="contact"
                className="form-input"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Dr. Nom Prénom"
              />
            </div>
          </div>

          {/* Géolocalisation */}
          <div className="form-section">
            <h3>Localisation GPS</h3>
            
            <button
              type="button"
              onClick={getLocation}
              className="btn btn-secondary"
              disabled={loading}
            >
              📍 Détecter ma position automatiquement
            </button>

            <div className="grid grid-cols-2 mt-2">
              <div className="form-group">
                <label className="form-label">Latitude *</label>
                <input
                  type="number"
                  name="latitude"
                  className="form-input"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="0.000001"
                  required
                  placeholder="3.848"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude *</label>
                <input
                  type="number"
                  name="longitude"
                  className="form-input"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="0.000001"
                  required
                  placeholder="11.502"
                />
              </div>
            </div>
          </div>

          {/* Services offerts */}
          <div className="form-section">
            <h3>Services offerts *</h3>
            <p className="text-gray-600 mb-2">Sélectionnez tous les services disponibles dans votre établissement</p>
            
            <div className="services-grid">
              {SERVICE_TYPES.map(service => (
                <label key={service.id} className="service-checkbox">
                  <input
                    type="checkbox"
                    value={service.id}
                    checked={formData.services.includes(service.id)}
                    onChange={handleChange}
                  />
                  <span className="service-label">
                    <span className="service-icon">{service.icon}</span>
                    <span>{service.name}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '1rem' }}
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>

          <div className="text-center mt-3">
            <p>
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="text-primary">Se connecter</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
