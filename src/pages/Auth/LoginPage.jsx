import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(formData.email, formData.password);
    
    if (signInError) {
      setError('Email ou mot de passe incorrect');
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: '450px' }}>
        <div className="auth-header">
          <h1>🏥 PulseAI Dashboard</h1>
          <h2>Connexion Hôpital</h2>
          <p>Accédez à votre tableau de bord de gestion</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contact@hopital.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '1rem' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="text-center mt-3">
            <p>
              Pas encore inscrit ?{' '}
              <a href="/signup" className="text-primary">Créer un compte</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
