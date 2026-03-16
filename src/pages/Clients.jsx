import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClients } from '../api/dashboard';
import './Clients.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await getClients();
        setClients(response.data.data);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const getRiskColor = (score) => {
    if (score < 40) return 'risk-low';
    if (score <= 70) return 'risk-medium';
    return 'risk-high';
  };

  if (loading) return <div className="loading-container">Loading clients...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="clients-page">
      <header className="alerts-header">
        <h1>Client Risk Profiles</h1>
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

      <div className="table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Total Events</th>
              <th>High Risk Events</th>
              <th>Average Risk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.client_id}>
                <td>{client.client_id}</td>
                <td>{client.total_events}</td>
                <td>{client.high_risk_events}</td>
                <td>
                  <span className={`risk-badge ${getRiskColor(client.avg_risk)}`}>
                    {client.avg_risk.toFixed(1)}
                  </span>
                </td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => navigate(`/clients/${client.client_id}`)}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
