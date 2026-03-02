import React from 'react';
import './Stats.css';

const Stats = ({ stats, loading }) => {
  if (loading) return <div className="stats-loading">Loading stats...</div>;
  if (!stats) return null;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Events</h3>
        <p className="stat-value">{stats.total_events}</p>
      </div>
      <div className="stat-card">
        <h3>High Risk Events</h3>
        <p className="stat-value high-risk">{stats.high_risk_events}</p>
      </div>
      <div className="stat-card">
        <h3>Avg Risk Score</h3>
        <p className="stat-value">{stats.avg_risk_score?.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Stats;
