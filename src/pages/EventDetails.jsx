import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventDetails } from '../api/events';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getEventDetails(id);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const getRiskColorClass = (score) => {
    if (score < 40) return 'green';
    if (score <= 70) return 'yellow';
    return 'red';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="event-details-container">
        <div className="back-button" onClick={() => navigate(-1)}>
          &larr; Back to Dashboard
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-container">
        <div className="back-button" onClick={() => navigate(-1)}>
          &larr; Back to Dashboard
        </div>
        <div className="error">Event not found.</div>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        &larr; Back to Dashboard
      </div>
      
      <div className="event-details-card">
        <div className="event-details-header">
          <h2>Event Details</h2>
          <div className={`risk-badge ${getRiskColorClass(event.risk_score)}`}>
            Risk Score: {event.risk_score}
          </div>
        </div>

        <div className="event-info">
          <p><strong>Event ID:</strong> {event.id}</p>
          <p><strong>Client ID:</strong> {event.client_id}</p>
          <p><strong>Event Type:</strong> {event.event_type}</p>
          <p><strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <div className="event-details-card">
        <h3>Metadata</h3>
        <div className="metadata-section">
          <pre>{JSON.stringify(event.metadata, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
