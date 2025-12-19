import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/service.service';
import { SERVICE_TYPES } from '../../lib/supabase';
import './ServicesManager.css';

export default function ServicesManager({ hospital }) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    loadServices();
  }, [hospital.id]);

  const loadServices = async () => {
    setLoading(true);
    const { data } = await serviceService.getHospitalServices(hospital.id);
    
    if (data) {
      setServices(data);
    } else {
      // Initialiser avec les services offerts par l'hôpital
      const initialServices = hospital.services_offered?.map(serviceId => ({
        service_type: serviceId,
        is_active: true,
        queue_length: 0,
        avg_wait_time: 0,
        max_wait_time: 0,
        current_capacity: 0,
        availability_status: 'available'
      })) || [];
      setServices(initialServices);
    }
    setLoading(false);
  };

  const getServiceInfo = (serviceType) => {
    return SERVICE_TYPES.find(s => s.id === serviceType) || { name: serviceType, icon: '🏥' };
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: { class: 'badge-success', text: 'Disponible' },
      busy: { class: 'badge-warning', text: 'Occupé' },
      full: { class: 'badge-danger', text: 'Complet' },
      closed: { class: 'badge-secondary', text: 'Fermé' }
    };
    return badges[status] || badges.available;
  };

  const handleEditService = (service) => {
    setEditingService({ ...service });
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  const handleChangeEdit = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingService(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveService = async () => {
    setLoading(true);
    
    const serviceData = {
      service_type: editingService.service_type,
      is_active: editingService.is_active,
      queue_length: parseInt(editingService.queue_length) || 0,
      avg_wait_time: parseInt(editingService.avg_wait_time) || 0,
      max_wait_time: parseInt(editingService.max_wait_time) || 0,
      current_capacity: parseInt(editingService.current_capacity) || 0,
      availability_status: editingService.availability_status
    };

    const { error } = await serviceService.upsertService(hospital.id, serviceData);
    
    if (!error) {
      // Enregistrer dans l'historique
      await serviceService.recordServiceSnapshot(hospital.id, serviceData.service_type, {
        queue_length: serviceData.queue_length,
        wait_time: serviceData.avg_wait_time,
        capacity: serviceData.current_capacity,
        availability_status: serviceData.availability_status
      });
      
      await loadServices();
      setEditingService(null);
    }
    
    setLoading(false);
  };

  const autoCalculateStatus = (queueLength, capacity) => {
    if (!editingService?.is_active) return 'closed';
    if (queueLength === 0) return 'available';
    if (capacity > 0 && queueLength >= capacity) return 'full';
    if (queueLength > 5) return 'busy';
    return 'available';
  };

  if (loading && services.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="services-manager">
      <div className="section-header">
        <h2>Gestion des Services</h2>
        <p>Gérez la disponibilité et les files d'attente de vos services médicaux</p>
      </div>

      <div className="services-grid">
        {hospital.services_offered?.map(serviceType => {
          const serviceInfo = getServiceInfo(serviceType);
          const serviceData = services.find(s => s.service_type === serviceType) || {
            service_type: serviceType,
            is_active: true,
            queue_length: 0,
            avg_wait_time: 0,
            max_wait_time: 0,
            current_capacity: 0,
            availability_status: 'available'
          };
          
          const isEditing = editingService?.service_type === serviceType;
          const statusBadge = getStatusBadge(serviceData.availability_status);

          return (
            <div key={serviceType} className={`service-card ${!serviceData.is_active ? 'inactive' : ''}`}>
              <div className="service-header">
                <div className="service-title">
                  <span className="service-icon">{serviceInfo.icon}</span>
                  <h3>{serviceInfo.name}</h3>
                </div>
                <span className={`badge ${statusBadge.class}`}>
                  {statusBadge.text}
                </span>
              </div>

              {!isEditing ? (
                <>
                  <div className="service-stats">
                    <div className="stat-item">
                      <span className="stat-label">File d'attente</span>
                      <span className="stat-value">{serviceData.queue_length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Temps d'attente moyen</span>
                      <span className="stat-value">{serviceData.avg_wait_time} min</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Temps max</span>
                      <span className="stat-value">{serviceData.max_wait_time} min</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Capacité actuelle</span>
                      <span className="stat-value">{serviceData.current_capacity}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEditService(serviceData)}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    Mettre à jour
                  </button>
                </>
              ) : (
                <div className="service-edit-form">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={editingService.is_active}
                        onChange={handleChangeEdit}
                      />
                      <span>Service actif</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">File d'attente</label>
                    <input
                      type="number"
                      name="queue_length"
                      className="form-input"
                      value={editingService.queue_length}
                      onChange={handleChangeEdit}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Temps d'attente moyen (min)</label>
                    <input
                      type="number"
                      name="avg_wait_time"
                      className="form-input"
                      value={editingService.avg_wait_time}
                      onChange={handleChangeEdit}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Temps max (min)</label>
                    <input
                      type="number"
                      name="max_wait_time"
                      className="form-input"
                      value={editingService.max_wait_time}
                      onChange={handleChangeEdit}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Capacité actuelle</label>
                    <input
                      type="number"
                      name="current_capacity"
                      className="form-input"
                      value={editingService.current_capacity}
                      onChange={handleChangeEdit}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Statut de disponibilité</label>
                    <select
                      name="availability_status"
                      className="form-select"
                      value={editingService.availability_status}
                      onChange={handleChangeEdit}
                    >
                      <option value="available">Disponible</option>
                      <option value="busy">Occupé</option>
                      <option value="full">Complet</option>
                      <option value="closed">Fermé</option>
                    </select>
                  </div>

                  <div className="edit-actions">
                    <button
                      onClick={handleSaveService}
                      className="btn btn-primary btn-sm"
                      disabled={loading}
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-outline btn-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="info-box">
        <h4>💡 Conseil</h4>
        <p>
          Mettez à jour régulièrement vos files d'attente et temps d'attente pour offrir
          des informations précises aux patients via l'application PulseAI.
          Chaque mise à jour est enregistrée dans l'historique pour l'analyse temporelle.
        </p>
      </div>
    </div>
  );
}
