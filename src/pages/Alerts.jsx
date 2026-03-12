import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlerts, getAlertStats } from '../api/alerts';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [alertsRes, statsRes] = await Promise.all([
        getAlerts({ limit: 50, sort: 'newest' }),
        getAlertStats()
      ]);
      
      setAlerts(alertsRes.data.data || alertsRes.data || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching alerts data:', err);
      setError('Failed to load alerts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRowClick = (id) => {
    navigate(`/events/${id}`);
  };

  const getRiskScoreClass = (score) => {
    if (score >= 71) return 'score-red';
    if (score >= 41) return 'score-yellow';
    return 'score-green';
  };

  if (loading) {
    return (
      <div className="alerts-page">
        <header className="alerts-header">
          <h1>Alerts</h1>
          <button 
            className="nav-btn" 
            onClick={() => navigate('/')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              float: 'right',
              marginTop: '-35px'
            }}
          >
            Back to Dashboard
          </button>
        </header>
        <div className="alerts-loading-container">
          <div className="spinner"></div>
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-page">
      <header className="alerts-header">
        <h1>Alerts</h1>
        <button 
          className="nav-btn" 
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            float: 'right',
            marginTop: '-35px'
          }}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="alerts-content">
        {error && <div className="error-message">{error}</div>}

        <section className="alerts-stats-section">
          <h2>Alert Statistics</h2>
          <div className="alerts-stats-container">
            <div className="alerts-stat-card">
              <h3>Total Alerts</h3>
              <p className="alerts-stat-value">{stats?.total_alerts || 0}</p>
            </div>
            <div className="alerts-stat-card">
              <h3>Critical Alerts</h3>
              <p className="alerts-stat-value critical">{stats?.critical_alerts || 0}</p>
            </div>
          </div>
        </section>

        <section className="alerts-table-section">
          <h2>Alerts Table</h2>
          <div className="alerts-table-container">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Client ID</th>
                  <th>Event Type</th>
                  <th>Risk Score</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      No alerts found.
                    </td>
                  </tr>
                ) : (
                  alerts.slice(0, 50).map((alert) => (
                    <tr 
                      key={alert.id} 
                      className="alerts-clickable-row"
                      onClick={() => handleRowClick(alert.id)}
                    >
                      <td>{alert.id}</td>
                      <td>{alert.client_id}</td>
                      <td>{alert.event_type}</td>
                      <td>
                        <span className={`score-badge ${getRiskScoreClass(alert.risk_score)}`}>
                          {alert.risk_score}
                        </span>
                      </td>
                      <td>{new Date(alert.timestamp).toLocaleString()}</td>
                      <td>
                        <button 
                          className="details-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(alert.id);
                          }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Alerts;
