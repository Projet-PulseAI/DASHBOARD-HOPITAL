import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResourcesManager from '../../components/ResourcesManager/ResourcesManager';
import ServicesManager from '../../components/ServicesManager/ServicesManager';
import Analytics from '../../components/Analytics/Analytics';
import HospitalInfo from '../../components/HospitalInfo/HospitalInfo';
import './Dashboard.css';

export default function DashboardPage() {
  const { user, hospital, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="dashboard-container">
        <div className="alert alert-error">
          Aucune donnée hôpital trouvée. Veuillez contacter le support.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🏥 {hospital.name}</h1>
            <p className="hospital-type">
              {hospital.type === 'public' ? 'Public' : hospital.type === 'prive' ? 'Privé' : 'Mixte'} • 
              {' '}{hospital.level === 'primaire' ? 'Primaire' : hospital.level === 'secondaire' ? 'Secondaire' : 'Tertiaire'}
            </p>
          </div>
          <div className="header-right">
            <span className="user-email">{user.email}</span>
            <button onClick={handleSignOut} className="btn btn-outline">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Vue d'ensemble
        </button>
        <button
          className={`nav-tab ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          🏥 Ressources
        </button>
        <button
          className={`nav-tab ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          ⚕️ Services
        </button>
        <button
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
        <button
          className={`nav-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          ℹ️ Informations
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <h2>Vue d'ensemble</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Gestion rapide</h3>
                <p>Accédez rapidement aux fonctionnalités principales du dashboard</p>
                <div className="quick-actions">
                  <button onClick={() => setActiveTab('resources')} className="btn btn-primary">
                    Mettre à jour les ressources
                  </button>
                  <button onClick={() => setActiveTab('services')} className="btn btn-secondary">
                    Gérer les services
                  </button>
                </div>
              </div>
              
              <div className="overview-card">
                <h3>À propos de PulseAI</h3>
                <p>
                  Ce dashboard vous permet de gérer les ressources et services de votre hôpital en temps réel.
                  Les données que vous saisissez alimentent le système de recommandation de l'application mobile PulseAI,
                  permettant ainsi aux patients de trouver l'hôpital le plus adapté à leurs besoins.
                </p>
              </div>

              <div className="overview-card">
                <h3>Informations hôpital</h3>
                <ul className="info-list">
                  <li><strong>Adresse:</strong> {hospital.address}</li>
                  <li><strong>Email:</strong> {hospital.email}</li>
                  <li><strong>Téléphone:</strong> {hospital.phone || 'Non renseigné'}</li>
                  <li><strong>Services:</strong> {hospital.services_offered?.length || 0} service(s)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && <ResourcesManager hospital={hospital} />}
        {activeTab === 'services' && <ServicesManager hospital={hospital} />}
        {activeTab === 'analytics' && <Analytics hospital={hospital} />}
        {activeTab === 'info' && <HospitalInfo hospital={hospital} />}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2025 PulseAI - Dashboard de gestion hospitalière</p>
      </footer>
    </div>
  );
}
