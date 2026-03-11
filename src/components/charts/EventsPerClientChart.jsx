import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const EventsPerClientChart = ({ data, loading, error }) => {
  if (loading) return <div className="chart-loading">Loading Events per Client...</div>;
  if (error) return <div className="chart-error">{error}</div>;
  if (!Array.isArray(data) || data.length === 0) return <div className="chart-empty">No data available for Events per Client.</div>;

  return (
    <div className="chart-container">
      <h3>Events Per Client</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="client_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="events" fill="#82ca9d" name="Total Events" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventsPerClientChart;
