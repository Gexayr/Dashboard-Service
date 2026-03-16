import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientProfile } from '../api/dashboard';
import './ClientProfile.css';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getClientProfile(id);
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching client profile:', err);
        setError('Failed to load client profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const getRiskColor = (score) => {
    if (score < 40) return 'risk-low';
    if (score <= 70) return 'risk-medium';
    return 'risk-high';
  };

  if (loading) return <div className="loading-container">Loading profile...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!profile) return <div className="error-container">Profile not found.</div>;

  return (
    <div className="profile-page">
      <div className="header">
        <button className="back-btn" onClick={() => navigate('/clients')}>
          ← Back to Clients
        </button>
        <h1>Client Profile</h1>
        <p className="client-id-label">Client ID: {profile.client_id}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p className="stat-value">{profile.total_events}</p>
        </div>
        <div className="stat-card">
          <h3>High Risk Events</h3>
          <p className="stat-value">{profile.high_risk_events}</p>
        </div>
        <div className="stat-card">
          <h3>Average Risk</h3>
          <p className={`stat-value ${getRiskColor(profile.avg_risk)}`}>
            {profile.avg_risk.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="events-section">
        <h2>Recent Events</h2>
        <div className="table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Risk Score</th>
                <th>Timestamp</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {profile.recent_events.map((event, index) => (
                <tr key={index}>
                  <td className="capitalize">{event.event_type}</td>
                  <td>
                    <span className={`risk-badge ${getRiskColor(event.risk_score)}`}>
                      {event.risk_score}
                    </span>
                  </td>
                  <td>{new Date(event.timestamp).toLocaleString()}</td>
                  <td>
                    <pre>{JSON.stringify(event.metadata, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
