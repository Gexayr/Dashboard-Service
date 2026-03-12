import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventsTable.css';

const EventsTable = ({ events, loading, error }) => {
  const navigate = useNavigate();

  if (loading) return <div className="table-status">Loading events...</div>;
  if (error) return <div className="table-status error">{error}</div>;
  if (!events || events.length === 0) return <div className="table-status">No events found.</div>;

  const handleRowClick = (id) => {
    navigate(`/events/${id}`);
  };

  return (
    <div className="table-container">
      <table className="events-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Event Type</th>
            <th>Timestamp</th>
            <th>Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const isHighRisk = event.risk_score >= 70;
            return (
              <tr 
                key={event.id} 
                className={isHighRisk ? 'high-risk-row clickable-row' : 'clickable-row'}
                onClick={() => handleRowClick(event.id)}
              >
                <td>{event.id}</td>
                <td>{event.client_name || event.client_id}</td>
                <td>{event.event_type}</td>
                <td>{new Date(event.timestamp).toLocaleString()}</td>
                <td className="risk-score-cell">
                  {isHighRisk && <span className="risk-icon">🚨</span>}
                  {event.risk_score}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
