import React, { useState } from 'react';
import { hospitalService } from '../../services/hospital.service';
import { useAuth } from '../../contexts/AuthContext';
import { HOSPITAL_TYPES, HOSPITAL_LEVELS } from '../../lib/supabase';
import './HospitalInfo.css';

export default function HospitalInfo({ hospital }) {
  const { refreshHospitalData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: hospital.name || '',
    phone: hospital.phone || '',
    address: hospital.address || '',
    contact: hospital.contact || '',
    type: hospital.type || 'public',
    level: hospital.level || 'primaire'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: hospital.name || '',
      phone: hospital.phone || '',
      address: hospital.address || '',
      contact: hospital.contact || '',
      type: hospital.type || 'public',
      level: hospital.level || 'primaire'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { error: updateError } = await hospitalService.updateHospital(hospital.id, formData);

    if (updateError) {
      setError('Erreur lors de la mise à jour des informations');
    } else {
      setSuccess('Informations mises à jour avec succès !');
      await refreshHospitalData();
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="hospital-info">
      <div className="section-header">
        <h2>Informations de l'hôpital</h2>
        <p>Gérez les informations générales de votre établissement</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="info-card card">
        {!editing ? (
          <>
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Nom de l'hôpital</label>
                <div className="info-value">{hospital.name}</div>
              </div>

              <div className="info-item">
                <label className="info-label">Email</label>
                <div className="info-value">{hospital.email}</div>
              </div>

              <div className="info-item">
                <label className="info-label">Téléphone</label>
                <div className="info-value">{hospital.phone || 'Non renseigné'}</div>
              </div>

              <div className="info-item">
                <label className="info-label">Type</label>
                <div className="info-value">
                  {HOSPITAL_TYPES.find(t => t.value === hospital.type)?.label || hospital.type}
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">Niveau</label>
                <div className="info-value">
                  {HOSPITAL_LEVELS.find(l => l.value === hospital.level)?.label || hospital.level}
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">Contact responsable</label>
                <div className="info-value">{hospital.contact || 'Non renseigné'}</div>
              </div>

              <div className="info-item full-width">
                <label className="info-label">Adresse</label>
                <div className="info-value">{hospital.address}</div>
              </div>

              <div className="info-item">
                <label className="info-label">Latitude</label>
                <div className="info-value">{hospital.latitude}</div>
              </div>

              <div className="info-item">
                <label className="info-label">Longitude</label>
                <div className="info-value">{hospital.longitude}</div>
              </div>

              <div className="info-item full-width">
                <label className="info-label">Services offerts</label>
                <div className="services-badges">
                  {hospital.services_offered?.map(service => (
                    <span key={service} className="badge badge-info">
                      {service}
                    </span>
                  )) || <span>Aucun service renseigné</span>}
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">Date de création</label>
                <div className="info-value">
                  {new Date(hospital.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            <div className="info-actions">
              <button onClick={handleEdit} className="btn btn-primary">
                Modifier les informations
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nom de l'hôpital</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type</label>
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
                <label className="form-label">Niveau</label>
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

              <div className="form-group full-width">
                <label className="form-label">Adresse complète</label>
                <textarea
                  name="address"
                  className="form-textarea"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Contact responsable</label>
                <input
                  type="text"
                  name="contact"
                  className="form-input"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="info-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-outline">
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="info-box">
        <h4>ℹ️ Note importante</h4>
        <p>
          Les informations de localisation (latitude, longitude) et les services offerts
          ne peuvent pas être modifiés depuis cette interface. Pour les changer, veuillez
          contacter le support PulseAI.
        </p>
      </div>
    </div>
  );
}
