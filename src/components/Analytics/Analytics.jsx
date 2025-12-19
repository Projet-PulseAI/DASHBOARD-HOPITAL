import React, { useState, useEffect } from 'react';
import { hospitalService } from '../../services/hospital.service';
import { serviceService } from '../../services/service.service';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import './Analytics.css';

export default function Analytics({ hospital }) {
  const [loading, setLoading] = useState(true);
  const [resourcesHistory, setResourcesHistory] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('7'); // jours

  useEffect(() => {
    loadAnalytics();
  }, [hospital.id, selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Charger l'historique des ressources
    const { data: resources } = await hospitalService.getResourcesHistory(hospital.id, 100);
    
    if (resources) {
      // Filtrer selon la période
      const days = parseInt(selectedPeriod);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const filtered = resources.filter(r => new Date(r.created_at) >= cutoffDate);
      setResourcesHistory(filtered);
    }
    
    setLoading(false);
  };

  const prepareChartData = () => {
    return resourcesHistory
      .slice()
      .reverse()
      .map(r => ({
        date: format(new Date(r.created_at), 'dd/MM HH:mm'),
        litsDisponibles: r.available_beds,
        litsOccupes: r.total_beds - r.available_beds,
        medecinsDispo: r.available_doctors,
        tauxOccupation: r.total_beds > 0 
          ? Math.round(((r.total_beds - r.available_beds) / r.total_beds) * 100)
          : 0
      }));
  };

  const calculateStats = () => {
    if (resourcesHistory.length === 0) {
      return {
        avgOccupancy: 0,
        maxOccupancy: 0,
        minBeds: 0,
        avgDoctors: 0
      };
    }

    const occupancyRates = resourcesHistory.map(r => 
      r.total_beds > 0 ? ((r.total_beds - r.available_beds) / r.total_beds) * 100 : 0
    );

    return {
      avgOccupancy: Math.round(occupancyRates.reduce((a, b) => a + b, 0) / occupancyRates.length),
      maxOccupancy: Math.round(Math.max(...occupancyRates)),
      minBeds: Math.min(...resourcesHistory.map(r => r.available_beds)),
      avgDoctors: Math.round(
        resourcesHistory.reduce((a, b) => a + b.available_doctors, 0) / resourcesHistory.length
      )
    };
  };

  const chartData = prepareChartData();
  const stats = calculateStats();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="section-header">
        <h2>Analytics et Historique</h2>
        <p>Visualisez l'évolution de vos ressources hospitalières</p>
      </div>

      {/* Période de sélection */}
      <div className="period-selector">
        <label>Période d'analyse :</label>
        <select 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="form-select"
        >
          <option value="1">Dernières 24h</option>
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">90 derniers jours</option>
        </select>
      </div>

      {/* Statistiques globales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Taux d'occupation moyen</div>
            <div className="stat-value">{stats.avgOccupancy}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-label">Taux d'occupation max</div>
            <div className="stat-value">{stats.maxOccupancy}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛏️</div>
          <div className="stat-content">
            <div className="stat-label">Minimum de lits disponibles</div>
            <div className="stat-value">{stats.minBeds}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <div className="stat-label">Médecins dispo. (moyenne)</div>
            <div className="stat-value">{stats.avgDoctors}</div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      {chartData.length > 0 ? (
        <>
          <div className="chart-container card">
            <h3>Évolution du taux d'occupation des lits</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="tauxOccupation" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Taux d'occupation (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container card">
            <h3>Disponibilité des lits</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="litsDisponibles" fill="#10b981" name="Lits disponibles" />
                <Bar dataKey="litsOccupes" fill="#ef4444" name="Lits occupés" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container card">
            <h3>Médecins disponibles</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="medecinsDispo" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Médecins disponibles"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="alert alert-info">
          Aucune donnée disponible pour la période sélectionnée.
          Commencez à enregistrer vos ressources pour voir les graphiques.
        </div>
      )}

      <div className="info-box">
        <h4>📊 À propos des analytics</h4>
        <p>
          Ces graphiques montrent l'évolution de vos ressources hospitalières dans le temps.
          Toutes les mises à jour que vous effectuez sont enregistrées et conservées pour
          permettre une analyse précise et alimenter le modèle de recommandation PulseAI.
        </p>
      </div>
    </div>
  );
}
