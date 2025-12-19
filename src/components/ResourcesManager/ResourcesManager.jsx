import React, { useState, useEffect } from 'react';
import { hospitalService } from '../../services/hospital.service';
import './ResourcesManager.css';

export default function ResourcesManager({ hospital }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentResources, setCurrentResources] = useState(null);

  const [formData, setFormData] = useState({
    total_beds: 0,
    available_beds: 0,
    total_doctors: 0,
    available_doctors: 0,
    on_duty_staff: 0,
    beds_by_service: {},
    doctors_by_service: {}
  });

  useEffect(() => {
    loadCurrentResources();
  }, [hospital.id]);

  const loadCurrentResources = async () => {
    const { data } = await hospitalService.getCurrentResources(hospital.id);
    if (data) {
      setCurrentResources(data);
      setFormData({
        total_beds: data.total_beds || 0,
        available_beds: data.available_beds || 0,
        total_doctors: data.total_doctors || 0,
        available_doctors: data.available_doctors || 0,
        on_duty_staff: data.on_duty_staff || 0,
        beds_by_service: data.beds_by_service || {},
        doctors_by_service: data.doctors_by_service || {}
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (formData.available_beds > formData.total_beds) {
      setError('Le nombre de lits disponibles ne peut pas dépasser le nombre total de lits');
      setLoading(false);
      return;
    }

    if (formData.available_doctors > formData.total_doctors) {
      setError('Le nombre de médecins disponibles ne peut pas dépasser le nombre total de médecins');
      setLoading(false);
      return;
    }

    const { error: updateError } = await hospitalService.updateResources(hospital.id, formData);
    
    if (updateError) {
      setError('Erreur lors de la mise à jour des ressources');
    } else {
      setSuccess('Ressources mises à jour avec succès !');
      await loadCurrentResources();
      setTimeout(() => setSuccess(''), 3000);
    }
    
    setLoading(false);
  };

  const calculateOccupancyRate = (available, total) => {
    if (total === 0) return 0;
    return Math.round(((total - available) / total) * 100);
  };

  return (
    <div className="resources-manager">
      <div className="section-header">
        <h2>Gestion des Ressources</h2>
        <p>Mettez à jour les ressources disponibles dans votre hôpital</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Statistiques actuelles */}
      {currentResources && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🛏️</div>
            <div className="stat-content">
              <div className="stat-label">Taux d'occupation lits</div>
              <div className="stat-value">
                {calculateOccupancyRate(currentResources.available_beds, currentResources.total_beds)}%
              </div>
              <div className="stat-detail">
                {currentResources.available_beds} / {currentResources.total_beds} disponibles
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-content">
              <div className="stat-label">Médecins disponibles</div>
              <div className="stat-value">
                {currentResources.available_doctors}
              </div>
              <div className="stat-detail">
                sur {currentResources.total_doctors} médecins
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-label">Personnel de garde</div>
              <div className="stat-value">
                {currentResources.on_duty_staff || 0}
              </div>
              <div className="stat-detail">en service actuellement</div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de mise à jour */}
      <form onSubmit={handleSubmit} className="resources-form">
        <div className="form-section">
          <h3>🛏️ Ressources - Lits</h3>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Nombre total de lits</label>
              <input
                type="number"
                name="total_beds"
                className="form-input"
                value={formData.total_beds}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lits disponibles</label>
              <input
                type="number"
                name="available_beds"
                className="form-input"
                value={formData.available_beds}
                onChange={handleChange}
                min="0"
                max={formData.total_beds}
                required
              />
              <small className="form-help">
                Taux d'occupation: {calculateOccupancyRate(formData.available_beds, formData.total_beds)}%
              </small>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>👨‍⚕️ Ressources Humaines</h3>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Nombre total de médecins</label>
              <input
                type="number"
                name="total_doctors"
                className="form-input"
                value={formData.total_doctors}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Médecins disponibles</label>
              <input
                type="number"
                name="available_doctors"
                className="form-input"
                value={formData.available_doctors}
                onChange={handleChange}
                min="0"
                max={formData.total_doctors}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Personnel de garde</label>
            <input
              type="number"
              name="on_duty_staff"
              className="form-input"
              value={formData.on_duty_staff}
              onChange={handleChange}
              min="0"
            />
            <small className="form-help">
              Nombre total de personnel actuellement de garde
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Mise à jour...' : 'Mettre à jour les ressources'}
          </button>
        </div>
      </form>

      <div className="info-box">
        <h4>ℹ️ Information importante</h4>
        <p>
          Les données que vous saisissez sont enregistrées avec un horodatage et conservées dans l'historique.
          Aucune donnée n'est écrasée, permettant ainsi une analyse temporelle précise pour le modèle de recommandation PulseAI.
        </p>
      </div>
    </div>
  );
}
